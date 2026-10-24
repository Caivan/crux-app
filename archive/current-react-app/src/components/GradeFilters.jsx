import { HoldIcon } from '@crux/design-system';
import { GRADES } from '../config/design.js';

export function GradeFilters({ value, onChange, label = 'Filter graph by grade' }) {
  return <div className="chart-grade-filters" role="group" aria-label={label}>
    <button type="button" className={`chart-grade-filter ${value === 'all' ? 'selected' : ''}`} aria-pressed={value === 'all'} onClick={() => onChange('all')}>All levels</button>
    {GRADES.map((grade) => <button type="button" key={grade} className={`chart-grade-filter ${value === grade ? 'selected' : ''}`} aria-label={grade} aria-pressed={value === grade} onClick={() => onChange(grade)}><HoldIcon grade={grade} small/><span>{grade}</span></button>)}
  </div>;
}
