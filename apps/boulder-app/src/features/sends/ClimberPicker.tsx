import { Avatar } from '@crux/design-system';
import type { Member } from '@crux/shared-types';
import styled from 'styled-components';

const Group = styled.div`display:flex;gap:8px;overflow-x:auto;padding:3px 1px 5px;scrollbar-width:thin;`;
const Option = styled.button<{ $selected:boolean }>`
  position:relative;display:grid;flex:1 0 64px;max-width:88px;min-width:64px;min-height:78px;align-content:center;justify-items:center;gap:5px;padding:7px 4px;
  border:1px solid ${({$selected})=>$selected?'var(--color-outline)':'var(--color-border)'};border-radius:14px;
  background:${({$selected})=>$selected?'var(--color-highlight-soft)':'var(--color-surface)'};cursor:pointer;text-align:center;
  transition:background .15s,border-color .15s,transform .15s;&:hover{transform:translateY(-1px)}
  &:focus-visible{outline:3px solid var(--color-outline);outline-offset:2px}
  .avatar-wrap .avatar{width:38px;height:38px}
  .name{font:700 11px/1.1 var(--font-family-body);color:var(--color-text-primary);overflow-wrap:anywhere}
  .check{position:absolute;top:4px;right:4px;display:grid;width:16px;height:16px;place-items:center;border-radius:50%;background:var(--color-action-primary);color:white;font-size:10px;line-height:1}
`;

export function ClimberPicker({ members, currentMemberId, value, onChange }:{members:Member[];currentMemberId:string;value:string;onChange:(id:string)=>void}){
  const options=[...members].sort((a,b)=>Number(b.id===currentMemberId)-Number(a.id===currentMemberId));
  return <div><div style={{marginBottom:7,color:'var(--color-text-muted)',font:'500 11px var(--font-family-mono)',letterSpacing:'.08em',textTransform:'uppercase'}}>Climber</div><Group role="radiogroup" aria-label="Climber who sent the problem">{options.map((member)=><Option key={member.id} type="button" role="radio" aria-checked={value===member.id} aria-label={member.id===currentMemberId?'You':member.name} $selected={value===member.id} onClick={()=>onChange(member.id)}><span className="avatar-wrap"><Avatar person={member}/></span><span className="name">{member.id===currentMemberId?'You':member.name}</span>{value===member.id&&<span className="check" aria-hidden="true">✓</span>}</Option>)}</Group></div>;
}
