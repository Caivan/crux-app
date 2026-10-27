import { Avatar, BoulderIcon, ChalkBagIcon, CrewIcon } from '@crux/design-system';
import { mediaQueries } from '@crux/design-system/breakpoints';
import type { AppSection, CruxData } from '@crux/shared-types';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Icon } from './Icons';
import { Button, IconButton, Pill } from './ui';

const Shell = styled.div`min-height: 100vh; display: grid; grid-template-columns: minmax(0,1fr); @media ${mediaQueries.lg}{grid-template-columns:242px minmax(0,1fr);}`;
const Sidebar = styled.aside`
  display: none; position: sticky; top: 0; height: 100vh; flex-direction: column; gap: 22px; padding: 23px 17px 18px;
  background: var(--primitive-color-blush-100); border-right: 1px solid var(--color-border);
  @media ${mediaQueries.lg} { display: flex; }
`;
const Brand = styled.div`display: flex; align-items: center; gap: 10px; padding: 3px 7px; font: 700 22px var(--font-family-display); letter-spacing: -.06em;`;
const BrandMark = styled.span`display: grid; width: 34px; height: 34px; place-items: center; border-radius: 11px; color: var(--primitive-color-plum-800); background: var(--primitive-color-lime-400); transform: rotate(-7deg); font-size: 17px;`;
const HomeCard = styled.div`display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--color-outline); border-radius: 15px; background: var(--color-surface); box-shadow: var(--shadow-card);`;
const HomeIcon = styled.span`display: grid; width: 39px; height: 39px; place-items: center; border-radius: 12px; background: #e7eee2; color: var(--primitive-color-green-700);`;
const Nav = styled.nav`display: grid; gap: 5px;`;
const NavItem = styled.button<{ $active: boolean }>`
  display: flex; width: 100%; align-items: center; gap: 12px; padding: 11px 12px; border: 0; border-radius: 12px; text-align: left;
  color: ${({ $active }) => $active ? 'var(--color-action-primary)' : 'var(--color-text-secondary)'};
  background: ${({ $active }) => $active ? 'var(--color-highlight-soft)' : 'transparent'}; font-weight: ${({ $active }) => $active ? 700 : 600}; cursor: pointer;
  &:hover { background: var(--color-highlight-soft); }
  .nav-icon { display:grid; width:20px; height:20px; flex:none; place-items:center; }
  .nav-icon svg { display:block; width:100%; height:100%; }
  .nav-icon .svg-markup { display:grid; width:100%; height:100%; place-items:center; }
  .nav-icon .boulder-icon { width:20px; height:22px; }
  .nav-icon .crew-icon { width:25px; height:22px; }
  .nav-icon .avatar { width:20px; height:20px; font-size:7px; }
`;
const SidebarSpacer = styled.div`flex: 1;`;
const MemberChip = styled.div`display: flex; align-items: center; gap: 10px; padding: 10px 7px; border-top: 1px solid var(--color-border);`;
const Main = styled.main`min-width: 0; padding: 0 16px 96px; @media ${mediaQueries.md}{padding:0 24px 96px;} @media ${mediaQueries.lg}{padding:0 36px 38px;}`;
const Topbar = styled.header`position: sticky; z-index: 5; top: 0; display: flex; min-width: 0; min-height: 64px; align-items: center; justify-content: space-between; gap: 8px; margin: 0 -16px 20px; padding: 0 16px; border-bottom: 1px solid var(--color-border); background: color-mix(in srgb, var(--color-canvas) 92%, transparent); backdrop-filter: blur(14px); @media ${mediaQueries.md}{margin:0 -24px 23px;padding:0 24px;gap:12px;} @media ${mediaQueries.lg}{margin:0 -36px 28px;padding:0 36px;}`;
const Breadcrumb = styled.div`min-width:0;overflow:hidden;color: var(--color-text-muted);font: 500 11px var(--font-family-mono);letter-spacing: .12em;text-transform: uppercase;white-space:nowrap;text-overflow:ellipsis;span{margin:0 12px;color:var(--primitive-color-plum-300)} b{color:var(--color-text-primary);font-weight:600}`;
const Actions = styled.div`display:flex;flex:none;align-items:center;gap:5px;.invite-label{display:none}@media ${mediaQueries.md}{gap:10px;.invite-label{display:inline}}`;
const DateLabel = styled.span`display:none;color:var(--color-text-muted);font-size:12px;@media ${mediaQueries.md}{display:inline}`;
const MobileNav = styled.nav`position:fixed;z-index:10;left:10px;right:10px;bottom:9px;display:grid;grid-template-columns:repeat(4,1fr);padding:6px;border:1px solid var(--color-border);border-radius:18px;background:var(--color-surface);box-shadow:0 8px 28px #2b223026;@media ${mediaQueries.lg}{display:none;}`;
const MobileItem = styled.button<{ $active:boolean }>`display:grid;gap:2px;justify-items:center;padding:7px 2px;border:0;border-radius:12px;color:${({$active})=>$active?'var(--color-action-primary)':'var(--color-text-muted)'};background:${({$active})=>$active?'var(--color-highlight-soft)':'transparent'};font-size:9px;font-weight:700;.nav-icon{display:grid;width:22px;height:22px;place-items:center}.nav-icon>svg{display:block;width:100%;height:100%}.nav-icon .svg-markup{display:grid;width:100%;height:100%;place-items:center}.nav-icon .boulder-icon{width:19px;height:21px}.nav-icon .crew-icon{width:23px;height:19px}.nav-icon .avatar{width:20px;height:20px;font-size:7px}`;
const navItems: { id: AppSection; label: string }[] = [
  { id: 'home', label: 'Crux Halle' }, { id: 'problems', label: 'Problems' }, { id: 'crew', label: 'Your Crew' }, { id: 'profile', label: 'Profile' },
];

function NavigationIcon({ section, member }: { section: AppSection; member: CruxData['members'][number] }) {
  switch (section) {
    case 'home': return <ChalkBagIcon />;
    case 'problems': return <BoulderIcon grade="Blue" />;
    case 'crew': return <CrewIcon />;
    case 'profile': return <Avatar person={member} className="nav-profile-avatar" />;
  }
}

export function AppShell({ data, section, onNavigate, onInvite, onLogSend, onSignOut, gradeDisplay, onGradeDisplay, children }: { data: CruxData; section: AppSection; onNavigate: (section: AppSection) => void; onInvite: () => void; onLogSend: () => void; onSignOut?:()=>void; gradeDisplay:'color'|'fontainebleau'|'vscale'; onGradeDisplay:(value:'color'|'fontainebleau'|'vscale')=>void; children: ReactNode }) {
  const me = data.members.find((member) => member.id === data.currentMemberId)!;
  const date = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return <Shell>
    <Sidebar><Brand><BrandMark>C</BrandMark> crux<span style={{color:'var(--color-highlight-strong)'}}>.</span></Brand>
      <HomeCard><HomeIcon><ChalkBagIcon/></HomeIcon><div><small style={{display:'block',font:'10px var(--font-family-mono)',color:'var(--color-text-muted)',letterSpacing:'.08em'}}>YOUR HOME GYM</small><strong>{data.crew.homeName}</strong><div><Pill $tone="green">{data.crew.name}</Pill></div></div></HomeCard>
      <Nav aria-label="Main navigation">{navItems.map((item)=><NavItem key={item.id} type="button" $active={section===item.id} onClick={()=>onNavigate(item.id)} aria-current={section===item.id?'page':undefined}><span className="nav-icon"><NavigationIcon section={item.id} member={me}/></span>{item.label}</NavItem>)}</Nav>
      <SidebarSpacer/><MemberChip><span className="avatar-wrap"><Avatar person={me}/></span><span><b style={{display:'block'}}>{me.name}</b><small style={{color:'var(--color-text-muted)'}}>{me.role==='admin'?'Crew admin':'Crew member'}</small></span></MemberChip>
    </Sidebar>
    <Main><Topbar><Breadcrumb>CRUX HALLE <span>/</span><b>{navItems.find((item)=>item.id===section)?.label}</b></Breadcrumb><Actions><DateLabel>{date}</DateLabel><select aria-label="Grade display system" value={gradeDisplay} onChange={(event)=>onGradeDisplay(event.target.value as 'color'|'fontainebleau'|'vscale')} style={{maxWidth:116,padding:'6px 8px',border:'1px solid var(--color-border)',borderRadius:9,background:'var(--color-surface)',color:'var(--color-text-secondary)',fontSize:10}}><option value="color">Crux colors</option><option value="fontainebleau">Font.</option><option value="vscale">V-scale</option></select>{me.role==='admin'&&<Button $variant="secondary" onClick={onInvite}><Icon name="add" size={17}/><span className="invite-label">Invite a friend</span></Button>}{onSignOut&&<Button $variant="quiet" className="sign-out" onClick={onSignOut}>Sign out</Button>}<IconButton aria-label="Log a send" onClick={onLogSend}><Icon name="send" size={18}/></IconButton></Actions></Topbar>{children}</Main>
    <MobileNav aria-label="Main navigation">{navItems.map((item)=><MobileItem key={item.id} type="button" $active={section===item.id} onClick={()=>onNavigate(item.id)} aria-current={section===item.id?'page':undefined}><span className="nav-icon"><NavigationIcon section={item.id} member={me}/></span><span>{item.label}</span></MobileItem>)}</MobileNav>
  </Shell>;
}
