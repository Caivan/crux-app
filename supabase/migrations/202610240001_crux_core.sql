create extension if not exists pgcrypto;

create type public.crew_role as enum ('admin', 'member');
create type public.crux_grade as enum ('Green', 'Yellow', 'Blue', 'Red', 'Gray', 'Black', 'Purple');
create type public.send_attempt as enum ('flash', 'second', 'third-plus');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Climber',
  avatar_url text,
  email text,
  created_at timestamptz not null default now()
);

create table public.crews (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  home_name text not null,
  created_at timestamptz not null default now()
);
insert into public.crews (name, home_name) values ('Amurados', 'Crux Halle') on conflict (name) do nothing;

create table public.crew_members (
  crew_id uuid not null references public.crews(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.crew_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (crew_id, user_id),
  unique (user_id)
);

create table public.crew_invitations (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null default now() + interval '7 days',
  used_at timestamptz,
  used_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grade public.crux_grade not null,
  qr_identifier text unique,
  route_url text,
  creator_id uuid default auth.uid() references public.profiles(id) on delete set null,
  creator_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  constraint qr_fields_together check ((qr_identifier is null) = (route_url is null))
);

create table public.sends (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  logged_by uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  problem_id uuid references public.problems(id) on delete set null,
  grade public.crux_grade not null,
  attempt public.send_attempt not null,
  send_date date not null default current_date,
  points integer not null default 0 check (points >= 0),
  risk_taker boolean not null default false,
  created_at timestamptz not null default now()
);
create index sends_crew_date_idx on public.sends (crew_id, send_date desc);
create index sends_problem_idx on public.sends (problem_id, created_at);
create index problems_created_idx on public.problems (created_at desc);

create or replace function public.is_crew_member(target_crew uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.crew_members cm where cm.crew_id = target_crew and cm.user_id = auth.uid()) $$;

create or replace function public.is_crew_admin(target_crew uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.crew_members cm where cm.crew_id = target_crew and cm.user_id = auth.uid() and cm.role = 'admin') $$;

create or replace function public.points_for(target_grade public.crux_grade, target_attempt public.send_attempt, add_risk_taker boolean default false)
returns integer language sql immutable
as $$
  select round((case target_grade when 'Green' then 10 when 'Yellow' then 20 when 'Blue' then 30 when 'Red' then 50 when 'Gray' then 80 when 'Black' then 130 when 'Purple' then 210 end)::numeric *
    (case target_attempt when 'flash' then 1.3 when 'second' then 1.0 when 'third-plus' then 0.8 end))::integer + case when add_risk_taker then 5 else 0 end
$$;

create or replace function public.create_crew_invitation(target_crew uuid)
returns table(token text, expires_at timestamptz) language plpgsql security definer set search_path = public, extensions
as $$
declare raw_token text := encode(gen_random_bytes(32), 'hex'); expiry timestamptz := now() + interval '7 days';
begin
  if auth.uid() is null or not public.is_crew_admin(target_crew) then raise exception 'Only crew admins can invite members'; end if;
  insert into public.crew_invitations(crew_id, created_by, token_hash, expires_at) values(target_crew, auth.uid(), encode(digest(raw_token, 'sha256'), 'hex'), expiry);
  return query select raw_token, expiry;
end $$;

create or replace function public.accept_crew_invitation(invitation_token text)
returns uuid language plpgsql security definer set search_path = public, extensions
as $$
declare invite public.crew_invitations%rowtype;
begin
  if auth.uid() is null then raise exception 'Sign in before accepting an invitation'; end if;
  select * into invite from public.crew_invitations where token_hash = encode(digest(invitation_token, 'sha256'), 'hex') for update;
  if invite.id is null or invite.used_at is not null or invite.expires_at <= now() then raise exception 'Invitation is invalid, expired, or already used'; end if;
  if exists(select 1 from public.crew_members where user_id = auth.uid()) then raise exception 'This account already belongs to a crew'; end if;
  insert into public.crew_members(crew_id, user_id, role) values(invite.crew_id, auth.uid(), 'member');
  update public.crew_invitations set used_at = now(), used_by = auth.uid() where id = invite.id;
  return invite.crew_id;
end $$;

create or replace function public.log_send(target_crew uuid, target_problem uuid, target_grade public.crux_grade, target_attempt public.send_attempt, target_date date, target_member uuid default null)
returns public.sends language plpgsql security definer set search_path = public
as $$
declare new_send public.sends%rowtype; awarded boolean := false; actual_grade public.crux_grade := target_grade; sender uuid := coalesce(target_member, auth.uid());
begin
  if auth.uid() is null or not public.is_crew_member(target_crew) then raise exception 'Active crew membership is required'; end if;
  if not exists(select 1 from public.crew_members where crew_id=target_crew and user_id=sender) then raise exception 'The selected climber is not a member of this crew'; end if;
  if target_problem is not null then
    select grade into actual_grade from public.problems where id = target_problem for update;
    if actual_grade is null then raise exception 'Problem not found'; end if;
    if actual_grade <> target_grade then raise exception 'Send grade must match the catalog problem'; end if;
    awarded := not exists(select 1 from public.sends where problem_id = target_problem);
  end if;
  insert into public.sends(crew_id, member_id, logged_by, problem_id, grade, attempt, send_date, risk_taker, points)
  values(target_crew, sender, auth.uid(), target_problem, actual_grade, target_attempt, target_date, awarded, public.points_for(actual_grade, target_attempt, awarded)) returning * into new_send;
  return new_send;
end $$;

create or replace function public.recalculate_problem_award(target_problem uuid)
returns void language plpgsql security definer set search_path = public
as $$
declare first_send uuid;
begin
  if target_problem is null then return; end if;
  select id into first_send from public.sends where problem_id = target_problem order by created_at, id limit 1;
  update public.sends set risk_taker = (id = first_send), points = public.points_for(grade, attempt, id = first_send) where problem_id = target_problem;
end $$;

create or replace function public.on_send_removed()
returns trigger language plpgsql security definer set search_path = public
as $$ begin perform public.recalculate_problem_award(old.problem_id); return old; end $$;
create trigger sends_recalculate_after_delete after delete on public.sends for each row execute function public.on_send_removed();

create or replace function public.edit_my_send(target_send uuid, target_grade public.crux_grade, target_attempt public.send_attempt)
returns public.sends language plpgsql security definer set search_path = public
as $$
declare updated public.sends%rowtype; actual_grade public.crux_grade := target_grade;
begin
  select * into updated from public.sends where id = target_send and logged_by = auth.uid() for update;
  if updated.id is null then raise exception 'Send not found or not owned by this account'; end if;
  if updated.problem_id is not null then select grade into actual_grade from public.problems where id=updated.problem_id; end if;
  update public.sends set grade=actual_grade, attempt=target_attempt, points=public.points_for(actual_grade,target_attempt,risk_taker) where id=target_send returning * into updated;
  return updated;
end $$;

create or replace function public.delete_my_send(target_send uuid)
returns void language plpgsql security definer set search_path = public
as $$ begin delete from public.sends where id=target_send and logged_by=auth.uid(); if not found then raise exception 'Send not found or not owned by this account'; end if; end $$;

create or replace function public.leave_crew(target_crew uuid)
returns void language plpgsql security definer set search_path = public
as $$ declare leaving_role public.crew_role; successor uuid;
begin
  select role into leaving_role from public.crew_members where crew_id=target_crew and user_id=auth.uid() for update;
  if leaving_role is null then raise exception 'Crew membership not found'; end if;
  if leaving_role='admin' then
    select user_id into successor from public.crew_members where crew_id=target_crew and user_id<>auth.uid() order by joined_at, user_id limit 1;
    if successor is not null then update public.crew_members set role='admin' where crew_id=target_crew and user_id=successor; end if;
  end if;
  delete from public.crew_members where crew_id=target_crew and user_id=auth.uid();
end $$;

create or replace function public.remove_crew_member(target_crew uuid, target_user uuid)
returns void language plpgsql security definer set search_path = public
as $$ begin
  if not public.is_crew_admin(target_crew) then raise exception 'Only crew admins can remove members'; end if;
  delete from public.crew_members where crew_id=target_crew and user_id=target_user and role <> 'admin';
  if not found then raise exception 'Member not found or cannot be removed'; end if;
end $$;

create or replace function public.keep_problems_anonymous()
returns trigger language plpgsql security definer set search_path = public
as $$ begin update public.problems set creator_id=null, creator_deleted=true where creator_id=old.id; return old; end $$;
create trigger profile_delete_anonymizes_problems before delete on public.profiles for each row execute function public.keep_problems_anonymous();

create or replace function public.prevent_problem_identity_changes()
returns trigger language plpgsql set search_path = public
as $$ begin
  if current_user in ('postgres', 'service_role') then return new; end if;
  if new.grade is distinct from old.grade or new.qr_identifier is distinct from old.qr_identifier or new.route_url is distinct from old.route_url or new.creator_id is distinct from old.creator_id or new.creator_deleted is distinct from old.creator_deleted then
    raise exception 'Problem grade, QR identity, and creator are immutable';
  end if;
  return new;
end $$;
create trigger problems_identity_immutable before update on public.problems for each row execute function public.prevent_problem_identity_changes();

create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public
as $$ declare member_row public.crew_members%rowtype; successor uuid;
begin
  if auth.uid() is null then raise exception 'Sign in before deleting your account'; end if;
  select * into member_row from public.crew_members where user_id=auth.uid();
  if member_row.role='admin' then
    select user_id into successor from public.crew_members where crew_id=member_row.crew_id and user_id<>auth.uid() order by joined_at, user_id limit 1;
    if successor is not null then update public.crew_members set role='admin' where crew_id=member_row.crew_id and user_id=successor; end if;
  end if;
  delete from auth.users where id = auth.uid();
end $$;

create or replace function public.create_profile_for_auth_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles(id, display_name, email, avatar_url)
  values(new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Climber'), new.email, new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update set display_name=excluded.display_name, email=excluded.email, avatar_url=excluded.avatar_url;
  return new;
end $$;
create trigger auth_user_profile after insert or update on auth.users for each row execute function public.create_profile_for_auth_user();

alter table public.profiles enable row level security;
alter table public.crews enable row level security;
alter table public.crew_members enable row level security;
alter table public.crew_invitations enable row level security;
alter table public.problems enable row level security;
alter table public.sends enable row level security;

create policy profiles_read_crew on public.profiles for select to authenticated using (exists(select 1 from public.crew_members mine join public.crew_members theirs on theirs.crew_id=mine.crew_id where mine.user_id=auth.uid() and theirs.user_id=profiles.id));
create policy profiles_update_self on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy crews_read_members on public.crews for select to authenticated using (public.is_crew_member(id));
create policy crew_members_read_crew on public.crew_members for select to authenticated using (public.is_crew_member(crew_id));
create policy crew_members_admin_remove on public.crew_members for delete to authenticated using (public.is_crew_admin(crew_id) and role <> 'admin');
create policy invitations_admin_read on public.crew_invitations for select to authenticated using (public.is_crew_admin(crew_id));
create policy problems_global_catalog_read on public.problems for select to authenticated using (exists(select 1 from public.crew_members where user_id=auth.uid()));
create policy problems_create_for_crew_member on public.problems for insert to authenticated with check (creator_id=auth.uid() and exists(select 1 from public.crew_members where user_id=auth.uid()));
create policy problems_creator_rename on public.problems for update to authenticated using (creator_id=auth.uid()) with check (creator_id=auth.uid());
create policy sends_read_own_crews on public.sends for select to authenticated using (public.is_crew_member(crew_id));

grant select on public.profiles, public.crews, public.crew_members, public.problems, public.sends to authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;
grant insert (name, grade, qr_identifier, route_url) on public.problems to authenticated;
grant update (name) on public.problems to authenticated;
revoke insert, update, delete on public.sends from anon, authenticated;

grant execute on function public.create_crew_invitation(uuid) to authenticated;
grant execute on function public.accept_crew_invitation(text) to authenticated;
grant execute on function public.log_send(uuid,uuid,public.crux_grade,public.send_attempt,date,uuid) to authenticated;
grant execute on function public.edit_my_send(uuid,public.crux_grade,public.send_attempt) to authenticated;
grant execute on function public.delete_my_send(uuid) to authenticated;
grant execute on function public.leave_crew(uuid) to authenticated;
grant execute on function public.remove_crew_member(uuid,uuid) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
