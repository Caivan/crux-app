import { HoldIcon, SvgMarkup, climberIcon } from '@crux/design-system';
import { ProgressChart } from '../components/ProgressChart.jsx';
import { CLIMBER_COLORS, GRADE_TINT, GRADES } from '../config/design.js';

const formatDate = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
const countUniqueSends = (sends, memberId) => new Set(sends.filter((send) => send.memberId === memberId).map((send) => send.routeId)).size;

export function MemberProfilePage({ person, data, getRoute, sends, series, range, setRange, gradeFilters }) {
  const total = countUniqueSends(data.sends, person.id);
  const hardestIndex = Math.max(-1, ...data.sends.filter((send) => send.memberId === person.id).map((send) => GRADES.indexOf(getRoute(send.routeId)?.grade)));

  return <div className="profile-page-content">
    <header className="member-profile-hero"><SvgMarkup className="profile-art" html={climberIcon(CLIMBER_COLORS[person.color % CLIMBER_COLORS.length], person.name)}/><div><p className="eyebrow">CLIMBER PROFILE</p><h2>{person.name}</h2><p>{person.id === 'you' ? 'Your climbing story' : 'Crew member'} · {data.gym}</p></div></header>
    <div className="profile-stats"><article><span>TOTAL BOULDERS</span><strong>{total}</strong></article><article><span>HARDEST SEND</span><strong>{GRADES[hardestIndex] || '—'}</strong></article><article><span>LAST 30 DAYS</span><strong>{new Set(data.sends.filter((send) => send.memberId === person.id && send.date >= dateOffset(29)).map((send) => send.routeId)).size}</strong></article></div>
    <section className="profile-section profile-progress"><div className="profile-section-heading"><div><p className="eyebrow">CLIMBING, OVER TIME</p><h3>{person.name}’s progress</h3></div><div className="segmented"><button className={range === 'week' ? 'selected' : ''} onClick={() => setRange('week')}>Week</button><button className={range === 'month' ? 'selected' : ''} onClick={() => setRange('month')}>Month</button></div></div>{gradeFilters}<div className="member-chart"><ProgressChart series={series} range={range} individual name={person.name}/></div><p className="profile-chart-note">Completed problems grouped by the date they were set.</p></section>
    <section className="profile-section"><div className="profile-section-heading"><div><p className="eyebrow">EVERY COLOR TELLS A STORY</p><h3>Grade breakdown</h3></div><span>Completed</span></div><div className="profile-grade-grid">{GRADES.map((grade) => <div className="profile-grade" data-profile-grade={grade} key={grade}><HoldIcon grade={grade} small/><span>{grade}</span><strong>{new Set(data.sends.filter((send) => send.memberId === person.id && getRoute(send.routeId)?.grade === grade).map((send) => send.routeId)).size}</strong></div>)}</div></section>
    <section className="profile-section"><div className="profile-section-heading"><div><p className="eyebrow">RECENT SENDS</p><h3>Latest problems</h3></div></div><div className="profile-recent">{sends.length ? sends.map(({ problem, sentDate }) => <div className="profile-recent-row" key={problem.id}><span className="grade-pill" style={{ background: GRADE_TINT[problem.grade] }}><HoldIcon grade={problem.grade} small/>{problem.grade}</span><span><strong>{problem.name}</strong><small>{problem.zone} · set {formatDate(problem.setDate)}</small></span><time>{formatDate(sentDate)}</time></div>) : <p className="profile-empty">No sends logged yet. Their next send starts the story.</p>}</div></section>
  </div>;
}

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}
