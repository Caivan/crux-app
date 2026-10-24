import type { AttemptCategory } from '@crux/shared-types';
import styled from 'styled-components';
import { ATTEMPTS } from '../../domain/catalog';
import { SendAttemptIcon } from './SendAttemptIcon';

const Grid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;`;
const Option = styled.button<{ $selected:boolean }>`
  display:grid;min-width:0;min-height:106px;align-content:center;justify-items:center;gap:5px;padding:9px 5px;
  border:1px solid ${({$selected})=>$selected?'var(--color-action-primary)':'var(--color-border)'};
  border-radius:14px;background:${({$selected})=>$selected?'var(--color-highlight-soft)':'var(--color-surface)'};
  color:var(--color-text-primary);cursor:pointer;transition:background .15s,border-color .15s,transform .15s;
  &:hover{transform:translateY(-1px)}
  &:focus-visible{outline:3px solid var(--color-outline);outline-offset:2px}
  .attempt-icon{width:48px;height:42px}
  .name{font-size:11px;font-weight:700;line-height:1.1;text-align:center}
  .multiplier{color:var(--color-text-muted);font:10px var(--font-family-mono)}
`;

const shortNames:Record<AttemptCategory,string>={flash:'Flash',second:'Second try','third-plus':'3+ tries'};

export function AttemptPicker({value,onChange}:{value:AttemptCategory;onChange:(attempt:AttemptCategory)=>void}){
  return <Grid role="radiogroup" aria-label="How many tries">
    {ATTEMPTS.map((attempt)=><Option key={attempt.id} type="button" role="radio" aria-checked={value===attempt.id} aria-label={`${attempt.label}, ${attempt.detail}, ${attempt.multiplier} times points`} $selected={value===attempt.id} onClick={()=>onChange(attempt.id)}>
      <SendAttemptIcon kind={attempt.id}/><span className="name">{shortNames[attempt.id]}</span><span className="multiplier">{attempt.multiplier}× points</span>
    </Option>)}
  </Grid>;
}
