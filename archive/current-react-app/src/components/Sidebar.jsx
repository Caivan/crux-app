import { Avatar, BoulderIcon, ChalkBagIcon, CrewIcon } from '@crux/design-system';

export function Sidebar({ page, go, data, getMember }) {
  return <aside className="sidebar"><a className="brand" href="#" onClick={(event) => { event.preventDefault(); go('overview'); }} aria-label="Crux home"><span className="brand-mark">C</span><span>crux<span className="brand-period">.</span></span></a><div className="gym-switch"><span className="gym-icon">↗</span><span><small>YOUR HOME GYM</small><strong>{data.gym}</strong></span><span className="chevron">⌄</span></div>
    <nav className="main-nav" aria-label="Main navigation"><NavItem name="overview" page={page} go={go} icon={<ChalkBagIcon/>}>Overview</NavItem><NavItem name="problems" page={page} go={go} icon={<BoulderIcon grade="Blue"/>}>Problems <i>{data.routes.length}</i></NavItem><NavItem name="crew" page={page} go={go} icon={<CrewIcon/>}>Your crew</NavItem><NavItem name="profile" page={page} go={go} icon={<Avatar person={getMember('you')} className="nav-profile-avatar"/>}>My profile</NavItem></nav>
    <div className="sidebar-bottom"><div className="side-note"><span className="note-star">✳</span><p>Small sends add up.<br/>Keep showing up.</p><span className="note-label">THE CRUX CLUB</span></div><div className="profile"><Avatar person={getMember('you')}/><span><strong>You</strong><small>Climber</small></span></div></div>
  </aside>;
}

function NavItem({ name, page, go, icon, children }) {
  const iconClass = name === 'overview' ? 'overview-gym-icon overview-chalkbag-icon' : '';
  return <button data-page={name} className={`nav-link ${page === name ? 'active' : ''}`} onClick={() => go(name)}><span className={iconClass}>{icon}</span>{children}</button>;
}
