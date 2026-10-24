import { useMemo, useState } from 'react';
import { CrewPage } from './pages/CrewPage.jsx';
import { MemberProfilePage } from './pages/MemberProfilePage.jsx';
import { OverviewPage } from './pages/OverviewPage.jsx';
import { ProblemsPage } from './pages/ProblemsPage.jsx';
import { GradeFilters } from './components/GradeFilters.jsx';
import { SendDialog } from './components/SendDialog.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { CLIMBER_COLORS, GRADES } from './config/design.js';

const STORAGE_KEY = 'crux-club-v1';
const today = () => new Date().toISOString().slice(0, 10);
const offsetDate = (days) => { const date = new Date(); date.setDate(date.getDate() - days); return date.toISOString().slice(0, 10); };
const formatDate = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
const initialData = {
  gym: 'Bloc Haus · Mitte',
  members: [{ id: 'you', name: 'You', color: 0 }, { id: 'leo', name: 'Leo', color: 1 }, { id: 'maya', name: 'Maya', color: 2 }, { id: 'jonas', name: 'Jonas', color: 3 }],
  routes: [
    { id: 'r1', name: 'Soft landing', grade: 'Green', setDate: offsetDate(26), zone: 'Slab wall', setter: 'Bloc Haus' }, { id: 'r2', name: 'Pocket change', grade: 'Yellow', setDate: offsetDate(20), zone: 'Cave', setter: 'Bloc Haus' }, { id: 'r3', name: 'Easy does it', grade: 'Yellow', setDate: offsetDate(13), zone: 'Slab wall', setter: 'Bloc Haus' }, { id: 'r4', name: 'Blue hour', grade: 'Blue', setDate: offsetDate(11), zone: 'Overhang', setter: 'Bloc Haus' }, { id: 'r5', name: 'Side quest', grade: 'Blue', setDate: offsetDate(8), zone: 'Cave', setter: 'Bloc Haus' }, { id: 'r6', name: 'The long way', grade: 'Red', setDate: offsetDate(6), zone: 'Comp wall', setter: 'Bloc Haus' }, { id: 'r7', name: 'Static electricity', grade: 'Gray', setDate: offsetDate(3), zone: 'Overhang', setter: 'Bloc Haus' }, { id: 'r8', name: 'One more move', grade: 'Green', setDate: offsetDate(1), zone: 'Slab wall', setter: 'Bloc Haus' }, { id: 'r9', name: 'Hold my chalk', grade: 'Black', setDate: offsetDate(0), zone: 'Comp wall', setter: 'Bloc Haus' },
  ],
  sends: [
    { id: 's1', memberId: 'maya', routeId: 'r2', date: offsetDate(20) }, { id: 's2', memberId: 'leo', routeId: 'r1', date: offsetDate(19) }, { id: 's3', memberId: 'you', routeId: 'r1', date: offsetDate(18) }, { id: 's4', memberId: 'jonas', routeId: 'r3', date: offsetDate(12) }, { id: 's5', memberId: 'maya', routeId: 'r4', date: offsetDate(10) }, { id: 's6', memberId: 'you', routeId: 'r3', date: offsetDate(8) }, { id: 's7', memberId: 'leo', routeId: 'r4', date: offsetDate(7) }, { id: 's8', memberId: 'maya', routeId: 'r5', date: offsetDate(6) }, { id: 's9', memberId: 'jonas', routeId: 'r5', date: offsetDate(5) }, { id: 's10', memberId: 'you', routeId: 'r4', date: offsetDate(4) }, { id: 's11', memberId: 'leo', routeId: 'r6', date: offsetDate(3) }, { id: 's12', memberId: 'maya', routeId: 'r6', date: offsetDate(2) }, { id: 's13', memberId: 'you', routeId: 'r8', date: offsetDate(1) }, { id: 's14', memberId: 'jonas', routeId: 'r7', date: offsetDate(0) },
  ],
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.members && saved?.routes && saved?.sends ? saved : initialData;
  } catch {
    return initialData;
  }
}

const uniqueSends = (sends, memberId) => new Set(sends.filter((send) => send.memberId === memberId).map((send) => send.routeId)).size;
const makeId = () => Math.random().toString(36).slice(2, 9);

export default function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState('overview');
  const [modal, setModal] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [range, setRange] = useState('week');
  const [chartGrade, setChartGrade] = useState('all');
  const [problemGrade, setProblemGrade] = useState('all');
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [sendMemberId, setSendMemberId] = useState('you');
  const [sendRouteId, setSendRouteId] = useState('');
  const getMember = (id) => data.members.find((person) => person.id === id);
  const getRoute = (id) => data.routes.find((route) => route.id === id);
  const orderedMembers = useMemo(() => [...data.members].sort((a, b) => uniqueSends(data.sends, b.id) - uniqueSends(data.sends, a.id)), [data]);
  const persist = (update) => setData((current) => {
    const next = typeof update === 'function' ? update(current) : update;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  });
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2500); };
  const completed = (memberId, grade) => new Set(data.sends.filter((send) => send.memberId === memberId && getRoute(send.routeId)?.grade === grade).map((send) => send.routeId)).size;
  const graphSeries = (people, selectedGrade) => people.map((person) => ({
    id: person.id,
    name: person.name,
    color: CLIMBER_COLORS[person.color % CLIMBER_COLORS.length],
    values: Array.from({ length: range === 'week' ? 7 : 4 }, (_, index) => {
      const fromDays = range === 'week' ? 6 - index : (3 - index) * 7 + 6;
      const toDays = range === 'week' ? fromDays : fromDays - 6;
      return data.sends.filter((send) => {
        const route = getRoute(send.routeId);
        if (!route || send.memberId !== person.id || (selectedGrade !== 'all' && route.grade !== selectedGrade)) return false;
        const setDay = Math.floor((new Date(`${today()}T12:00:00`) - new Date(`${route.setDate}T12:00:00`)) / 86400000);
        return setDay <= fromDays && setDay >= toDays;
      }).length;
    }),
  }));
  const crewSeries = graphSeries(orderedMembers.slice(0, 4), chartGrade);
  const profilePerson = profileId ? getMember(profileId) : page === 'profile' ? getMember('you') : null;
  const profileSeries = profilePerson ? graphSeries([profilePerson], chartGrade) : [];
  const selectedRoutes = data.routes.filter((route) => problemGrade === 'all' || route.grade === problemGrade).sort((a, b) => b.setDate.localeCompare(a.setDate));
  const recent = [...data.sends].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const profileSends = profilePerson ? [...new Map(data.sends.filter((send) => send.memberId === profilePerson.id).map((send) => [send.routeId, { problem: getRoute(send.routeId), sentDate: send.date }])).values()].filter((send) => send.problem).sort((a, b) => b.sentDate.localeCompare(a.sentDate)).slice(0, 5) : [];
  const modalRoutes = [...data.routes].sort((a, b) => {
    const latestSend = (id) => data.sends.filter((send) => send.routeId === id).reduce((latest, send) => send.date > latest ? send.date : latest, '');
    return latestSend(b.id).localeCompare(latestSend(a.id)) || b.setDate.localeCompare(a.setDate);
  }).filter((route) => `${route.name} ${route.grade} ${route.zone}`.toLowerCase().includes(query.toLowerCase()));
  const hardestGrade = GRADES[Math.max(-1, ...data.sends.map((send) => GRADES.indexOf(getRoute(send.routeId)?.grade)))] || '—';

  const go = (section) => { setPage(section); setProfileId(null); };
  const showProfile = (id) => { setProfileId(id); setRange('week'); };
  const openSend = (routeId = '') => {
    const latestCrewSend = [...data.sends].sort((a, b) => b.date.localeCompare(a.date))[0];
    setSendMemberId('you');
    setSendRouteId(routeId || latestCrewSend?.routeId || [...data.routes].sort((a, b) => b.setDate.localeCompare(a.setDate))[0]?.id || '');
    setQuery('');
    setModal({ type: 'send' });
  };
  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (modal.type === 'route') {
      const problem = { id: `r${makeId()}`, name: form.get('name').trim(), grade: form.get('grade'), setDate: form.get('setDate'), zone: form.get('zone').trim() || 'Wall', setter: form.get('setter').trim() || data.gym };
      persist((current) => ({ ...current, routes: [...current.routes, problem] }));
      notify('Problem added to the wall.');
    } else if (modal.type === 'friend') {
      const name = form.get('name').trim();
      if (data.members.some((person) => person.name.toLowerCase() === name.toLowerCase())) { notify('That climber is already in your crew.'); return; }
      persist((current) => ({ ...current, members: [...current.members, { id: `m${makeId()}`, name, color: current.members.length % CLIMBER_COLORS.length }] }));
      notify(`${name} joined your crew.`);
    } else {
      const memberId = form.get('memberId'), routeId = form.get('routeId');
      if (data.sends.some((send) => send.memberId === memberId && send.routeId === routeId)) { notify('That climber has already logged this problem.'); return; }
      persist((current) => ({ ...current, sends: [...current.sends, { id: `s${makeId()}`, memberId, routeId, date: form.get('date') }] }));
      notify(`Send logged for ${getMember(memberId)?.name || 'your crew'}!`);
    }
    setModal(null);
    setQuery('');
  };

  const gradeFilters = <GradeFilters value={chartGrade} onChange={setChartGrade}/>;
  const activeProfile = profilePerson && <MemberProfilePage person={profilePerson} data={data} getRoute={getRoute} sends={profileSends} series={profileSeries} range={range} setRange={setRange} gradeFilters={gradeFilters}/>;

  return <div className="app-shell">
    <Sidebar page={page} go={go} data={data} getMember={getMember}/>
    <main className="main-content"><header className="topbar"><div className="breadcrumb">YOUR CREW <span>/</span> <b>{page.toUpperCase()}</b></div><div className="top-actions"><span className="today-label">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span><button className="icon-button" aria-label="Notifications">♧<i/></button></div></header>
      {page === 'overview' && <OverviewPage data={data} range={range} setRange={setRange} gradeFilters={gradeFilters} grade={chartGrade} crewSeries={crewSeries} sorted={orderedMembers} recent={recent} getRoute={getRoute} getMember={getMember} dateLabel={formatDate} dateToday={today()} hardestGrade={hardestGrade} onLogSend={() => openSend()} onNavigate={go} onProfile={showProfile} uniqueSends={uniqueSends}/>}
      {page === 'problems' && <ProblemsPage routes={selectedRoutes} sends={data.sends} getMember={getMember} dateLabel={formatDate} grade={problemGrade} setGrade={setProblemGrade} onAdd={() => setModal({ type: 'route' })} onLogSend={openSend}/>}
      {page === 'crew' && <CrewPage members={orderedMembers} sends={data.sends} getRoute={getRoute} onAddFriend={() => setModal({ type: 'friend' })} onProfile={showProfile} completed={completed} uniqueSends={uniqueSends}/>}
      {page === 'profile' && <section className="page active-page">{activeProfile}</section>}
      <footer className="footer">MADE FOR THE DAYS YOU SHOW UP <span>✳</span> CRUX CLUB</footer>
    </main>
    {profileId && profilePerson && <div className="member-profile-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfileId(null); }}><section className="member-profile-panel"><button type="button" className="member-profile-close" onClick={() => setProfileId(null)}>×</button>{activeProfile}</section></div>}
    <SendDialog modal={modal} data={data} routes={modalRoutes} query={query} setQuery={setQuery} memberId={sendMemberId} setMemberId={setSendMemberId} routeId={sendRouteId} setRouteId={setSendRouteId} today={today()} onSubmit={submit} onClose={() => setModal(null)}/>
    {toast && <div className="toast visible" role="status">{toast}</div>}
  </div>;
}
