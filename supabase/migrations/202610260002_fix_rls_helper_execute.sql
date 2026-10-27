grant execute on function public.is_crew_member(uuid) to authenticated;
grant execute on function public.is_crew_admin(uuid) to authenticated;

drop policy if exists crew_members_read_self on public.crew_members;
create policy crew_members_read_self on public.crew_members for select to authenticated using (user_id = auth.uid());
