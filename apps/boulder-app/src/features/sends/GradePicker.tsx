import { HoldIcon } from '@crux/design-system';
import type { Grade } from '@crux/shared-types';
import styled from 'styled-components';
import { GRADE_COLORS, GRADES } from '../../domain/catalog';

const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px;`;
const Option = styled.button<{ $selected:boolean; $grade:Grade }>`
  display:grid;min-width:0;min-height:78px;align-content:center;justify-items:center;gap:3px;padding:7px 4px;
  border:1px solid ${({$selected,$grade})=>$selected?GRADE_COLORS[$grade]:'var(--color-border)'};
  border-radius:13px;background:${({$selected})=>$selected?'var(--color-highlight-soft)':'var(--color-surface)'};
  cursor:pointer;transition:background .15s,border-color .15s,transform .15s;
  &:hover{transform:translateY(-1px)}
  &:focus-visible{outline:3px solid var(--color-outline);outline-offset:2px}
  .hold-icon{width:34px;height:31px}
  .name{color:${({$grade})=>GRADE_COLORS[$grade]};font-size:11px;font-weight:700;line-height:1.1}
  .points{color:var(--color-text-muted);font:10px var(--font-family-mono)}
`;

export function GradePicker({value,onChange}:{value:Grade;onChange:(grade:Grade)=>void}){
  return <Grid role="radiogroup" aria-label="Level completed">
    {GRADES.map(({grade,points})=><Option key={grade} type="button" role="radio" aria-checked={value===grade} aria-label={`${grade}, ${points} points`} $selected={value===grade} $grade={grade} onClick={()=>onChange(grade)}>
      <HoldIcon grade={grade}/><span className="name">{grade}</span><span className="points">{points} pts</span>
    </Option>)}
  </Grid>;
}
