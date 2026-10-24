import { Avatar, ChalkBagIcon } from '@crux/design-system';
import type { AppSection, CruxData } from '@crux/shared-types';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Icon, type IconName } from './Icons';
import { Button, IconButton, Pill } from './ui';

const Shell = styled.div`min-height: 100vh; display: grid; grid-template-columns: 242px minmax(0,1fr);`;
const Sidebar = styled.aside`
  position: sticky; top: 0; display: flex; height: 100vh; flex-direction: column; gap: 22px; padding: 23px 17px 18px;
  background: var(--primitive-color-blush-100); border-right: 1px solid var(--color-border);
  @media (max-width: 760px) { display: none; }
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
`;
const SidebarSpacer = styled.div`flex: 1;`;
const MemberChip = styled.div`display: flex; align-items: center; gap: 10px; padding: 10px 7px; border-top: 1px solid var(--color-border);`;
const Main = styled.main`min-width: 0; padding: 0 36px 38px; @media(max-width:900px){padding:0 24px 32px;} @media(max-width:760px){padding:0 16px 96px;}`;
const Topbar = styled.header`position: sticky; z-index: 5; top: 0; display: flex; min-height: 64px; align-items: center; justify-content: space-between; margin: 0 -36px 28px; padding: 0 36px; border-bottom: 1px solid var(--color-border); background: color-mix(in srgb, var(--color-canvas) 92%, transparent); backdrop-filter: blur(14px); @media(max-width:900px){margin:0 -24px 23px;padding:0 24px;} @media(max-width:760px){margin:0 -16px 20px;padding:0 16px;}`;
const Breadcrumb = styled.div`color: var(--color-text-muted); font: 500 11px var(--font-family-mono); letter-spacing: .12em; text-transform: uppercase; span{margin:0 12px;color:var(--primitive-color-plum-300)} b{color:var(--color-text-primary);font-weight:600}`;
const Actions = styled.div`display:flex; align-items:center; gap:10px; @media(max-width:500px){gap:5px;.invite-label{display:none}}`;
const DateLabel = styled.span`color:var(--color-text-muted);font-size:12px;@media(max-width:560px){display:none}`;
const MobileNav = styled.nav`display:none; @media(max-width:760px){position:fixed;z-index:10;left:10px;right:10px;bottom:9px;display:grid;grid-template-columns:repeat(4,1fr);padding:6px;border:1px solid var(--color-border);border-radius:18px;background:var(--color-surface);box-shadow:0 8px 28px #2b223026;}`;
const MobileItem = styled.button<{ $active:boolean }>`display:grid;gap:2px;justify-items:center;padding:7px 2px;border:0;border-radius:12px;color:${({$active})=>$active?'var(--color-action-primary)':'var(--color-text-muted)'};background:${({$active})=>$active?'var(--color-highlight-soft)':'transparent'};font-size:9px;font-weight:700;`;
const navItems: { id: AppSection; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Crux Halle', icon: 'home' }, { id: 'problems', label: 'Problems', icon: 'problems' }, { id: 'crew', label: 'Your Crew', icon: 'crew' }, { id: 'profile', label: 'Profile', icon: 'profile' },
];

export function AppShell({ data, section, onNavigate, onInvite, onLogSend, onSignOut, gradeDisplay, onGradeDisplay, children }: { data: CruxData; section: AppSection; onNavigate: (section: AppSection) => void; onInvite: () => void; onLogSend: () => void; onSignOut?:()=>void; gradeDisplay:'color'|'fontainebleau'|'vscale'; onGradeDisplay:(value:'color'|'fontainebleau'|'vscale')=>void; children: ReactNode }) {
  const me = data.members.find((member) => member.id === data.currentMemberId)!;
  const date = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return <Shell>
    <Sidebar><Brand><BrandMark>C</BrandMark> crux<span style={{color:'var(--color-highlight-strong)'}}>.</span></Brand>
      <HomeCard><HomeIcon><ChalkBagIcon/></HomeIcon><div><small style={{display:'block',font:'10px var(--font-family-mono)',color:'var(--color-text-muted)',letterSpacing:'.08em'}}>YOUR HOME GYM</small><strong>{data.crew.homeName}</strong><div><Pill $tone="green">{data.crew.name}</Pill></div></div></HomeCard>
      <Nav aria-label="Main navigation">{navItems.map((item)=><NavItem key={item.id} type="button" $active={section===item.id} onClick={()=>onNavigate(item.id)} aria-current={section===item.id?'page':undefined}><Icon name={item.icon}/>{item.label}</NavItem>)}</Nav>
      <SidebarSpacer/><MemberChip><span className="avatar-wrap"><Avatar person={me}/></span><span><b style={{display:'block'}}>{me.name}</b><small style={{color:'var(--color-text-muted)'}}>{me.role==='admin'?'Crew admin':'Crew member'}</small></span></MemberChip>
    </Sidebar>
    <Main><Topbar><Breadcrumb>CRUX HALLE <span>/</span><b>{navItems.find((item)=>item.id===section)?.label}</b></Breadcrumb><Actions><DateLabel>{date}</DateLabel><select aria-label="Grade display system" value={gradeDisplay} onChange={(event)=>onGradeDisplay(event.target.value as 'color'|'fontainebleau'|'vscale')} style={{maxWidth:116,padding:'6px 8px',border:'1px solid var(--color-border)',borderRadius:9,background:'var(--color-surface)',color:'var(--color-text-secondary)',fontSize:10}}><option value="color">Crux colors</option><option value="fontainebleau">Font.</option><option value="vscale">V-scale</option></select>{me.role==='admin'&&<Button $variant="secondary" onClick={onInvite}><Icon name="add" size={17}/><span className="invite-label">Invite a friend</span></Button>}{onSignOut&&<Button $variant="quiet" className="sign-out" onClick={onSignOut}>Sign out</Button>}<IconButton aria-label="Log a send" onClick={onLogSend}><Icon name="send" size={18}/></IconButton></Actions></Topbar>{children}</Main>
    <MobileNav aria-label="Main navigation">{navItems.map((item)=><MobileItem key={item.id} type="button" $active={section===item.id} onClick={()=>onNavigate(item.id)} aria-current={section===item.id?'page':undefined}><Icon name={item.icon} size={20}/><span>{item.label}</span></MobileItem>)}</MobileNav>
  </Shell>;
}
