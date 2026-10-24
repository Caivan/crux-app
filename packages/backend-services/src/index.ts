import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AttemptCategory, CruxData, Grade } from '@crux/shared-types';

export interface CruxBackend {
  client: SupabaseClient;
  auth: {
    signInWithGoogle(): Promise<void>;
    signOut(): Promise<void>;
    acceptInvitation(token: string): Promise<void>;
  };
  invitations: {
    create(crewId: string): Promise<{ token: string; expiresAt: string }>;
  };
  problems: {
    list(options: { grade?: Grade; createdAfter?: string; createdBefore?: string; page?: number }): Promise<unknown[]>;
    findByQr(identifier: string): Promise<unknown | null>;
    create(input: { name: string; grade: Grade; qrIdentifier: string; routeUrl: string }): Promise<unknown>;
  };
  sends: {
    create(input: { crewId: string; memberId?: string; problemId?: string | null; grade: Grade; attempt: AttemptCategory; date: string }): Promise<unknown>;
    update(input: { sendId: string; grade: Grade; attempt: AttemptCategory }): Promise<unknown>;
    remove(sendId: string): Promise<void>;
  };
  crew: {
    current(userId: string): Promise<CruxData | null>;
    removeMember(crewId: string, userId: string): Promise<void>;
    leave(crewId: string): Promise<void>;
    deleteAccount(): Promise<void>;
  };
}

export function createCruxBackend(url: string, anonKey: string): CruxBackend {
  const client = createClient(url, anonKey);
  return {
    client,
    auth: {
      async signInWithGoogle() {
        const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
        if (error) throw error;
      },
      async signOut() { const { error } = await client.auth.signOut({ scope: 'local' }); if (error) throw error; },
      async acceptInvitation(token) { const { error } = await client.rpc('accept_crew_invitation', { invitation_token: token }); if (error) throw error; },
    },
    invitations: {
      async create(crewId) {
        const { data, error } = await client.rpc('create_crew_invitation', { target_crew: crewId }).single();
        if (error) throw error;
        const invitation = data as { token: string; expires_at: string };
        return { token: invitation.token, expiresAt: invitation.expires_at };
      },
    },
    problems: {
      async list({ grade, createdAfter, createdBefore, page = 0 }) {
        let query = client.from('problems').select('*').order('created_at', { ascending: false }).range(page * 50, page * 50 + 49);
        if (grade) query = query.eq('grade', grade);
        if (createdAfter) query = query.gte('created_at', createdAfter);
        if (createdBefore) query = query.lte('created_at', `${createdBefore}T23:59:59`);
        const { data, error } = await query; if (error) throw error; return data ?? [];
      },
      async findByQr(identifier) {
        const { data, error } = await client.from('problems').select('*').eq('qr_identifier', identifier).maybeSingle();
        if (error) throw error; return data;
      },
      async create(input) {
        const { data, error } = await client.from('problems').insert({ name: input.name, grade: input.grade, qr_identifier: input.qrIdentifier, route_url: input.routeUrl }).select().single();
        if (error) throw error; return data;
      },
    },
    sends: {
      async create(input) {
        const { data, error } = await client.rpc('log_send', { target_crew: input.crewId, target_problem: input.problemId ?? null, target_grade: input.grade, target_attempt: input.attempt, target_date: input.date, target_member: input.memberId ?? null }).single();
        if (error) throw error; return data;
      },
      async update(input) {
        const { data, error } = await client.rpc('edit_my_send', { target_send: input.sendId, target_grade: input.grade, target_attempt: input.attempt }).single();
        if (error) throw error; return data;
      },
      async remove(sendId) { const { error } = await client.rpc('delete_my_send', { target_send: sendId }); if (error) throw error; },
    },
    crew: {
      async current(userId) {
        const { data: membership, error: membershipError } = await client.from('crew_members').select('crew_id, role, joined_at').eq('user_id', userId).maybeSingle();
        if (membershipError) throw membershipError;
        if (!membership) return null;
        const crewId = String(membership.crew_id);
        const [crewResult, memberResult, problemResult, sendResult] = await Promise.all([
          client.from('crews').select('id, name, home_name').eq('id', crewId).single(),
          client.from('crew_members').select('user_id, role, joined_at, profiles(id, display_name, email, avatar_url)').eq('crew_id', crewId).order('joined_at'),
          client.from('problems').select('*').order('created_at', { ascending: false }),
          client.from('sends').select('*').eq('crew_id', crewId).order('created_at'),
        ]);
        const failure = crewResult.error ?? memberResult.error ?? problemResult.error ?? sendResult.error;
        if (failure) throw failure;
        const memberRows = memberResult.data ?? [];
        const members = memberRows.map((row: any, index: number) => {
          const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
          return { id: String(profile?.id ?? row.user_id), name: String(profile?.display_name ?? 'Climber'), email: profile?.email ?? undefined, avatarUrl: profile?.avatar_url ?? undefined, color: index % 6, role: row.role, joinedAt: String(row.joined_at) };
        });
        const problems = (problemResult.data ?? []).map((row: any) => ({ id: String(row.id), name: String(row.name), grade: row.grade, createdAt: String(row.created_at).slice(0, 10), creatorId: row.creator_id ?? null, creatorDeleted: Boolean(row.creator_deleted), qrIdentifier: row.qr_identifier ?? undefined, routeUrl: row.route_url ?? undefined, explorerIds: row.creator_id ? [String(row.creator_id)] : [] }));
        const sends = (sendResult.data ?? []).map((row: any) => ({ id: String(row.id), memberId: String(row.member_id), loggedBy: String(row.logged_by), crewId: String(row.crew_id), problemId: row.problem_id ?? null, grade: row.grade, attempt: row.attempt, date: String(row.send_date), loggedAt: String(row.created_at), points: Number(row.points), riskTaker: Boolean(row.risk_taker) }));
        const crew = crewResult.data!;
        const adminIds = memberRows.filter((row: any) => row.role === 'admin').map((row: any) => String(Array.isArray(row.profiles) ? row.profiles[0]?.id : row.profiles?.id));
        return { crew: { id: crewId, name: String(crew.name), homeName: String(crew.home_name), adminIds, memberIds: members.map((member) => member.id) }, currentMemberId: userId, members, problems, sends };
      },
      async removeMember(crewId, userId) { const { error } = await client.rpc('remove_crew_member', { target_crew: crewId, target_user: userId }); if (error) throw error; },
      async leave(crewId) { const { error } = await client.rpc('leave_crew', { target_crew: crewId }); if (error) throw error; },
      async deleteAccount() { const { error } = await client.rpc('delete_my_account'); if (error) throw error; },
    },
  };
}
