import { avatar, boulderIcon, crewIcon, holdIcon } from '../illustrations/index.js';

export function SvgMarkup({ html, className = '' }) {
  return <span className={`svg-markup ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function HoldIcon({ grade, small = false }) {
  return <SvgMarkup html={holdIcon(grade, small)} />;
}

export function BoulderIcon({ grade }) {
  return <SvgMarkup html={boulderIcon(grade)} />;
}

export function Avatar({ person, className = '' }) {
  return <SvgMarkup html={avatar(person, className)} />;
}

export function CrewIcon() {
  return <SvgMarkup html={crewIcon()} />;
}

export function ChalkBagIcon() {
  return <svg viewBox="0 0 32 28" role="presentation"><path d="M9 7q1-4 6-4h3q5 0 6 4l-1 3H10Z" fill="#b8d850" stroke="#49364f" strokeWidth="1.7" strokeLinejoin="round"/><path d="M11 6h10q1 0 1 2H10q0-2 1-2Z" fill="#fff4df" stroke="#49364f" strokeWidth="1.3"/><path d="M9 8q2 2 7 2t7-2l3 3-2 12q-1 4-8 4t-8-4L6 11Z" fill="#e4b8d8" stroke="#49364f" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 11q8 3 16 0M10 13q-3 2-4 6l3 1m13-7q4 2 5 6l-3 1" fill="none" stroke="#49364f" strokeWidth="1.4" strokeLinecap="round"/><path d="M12 17q1-2 2 0l-1 2-1-2Zm5 3q1-2 2 0l-1 2-1-2Z" fill="#f2c84d" stroke="#49364f" strokeWidth="1"/><path d="M12 24q4 1 8 0" fill="none" stroke="#fff4df" strokeWidth="1.2" strokeLinecap="round"/><circle cx="24" cy="16" r="1.2" fill="#ed875b" stroke="#49364f" strokeWidth=".8"/></svg>;
}
