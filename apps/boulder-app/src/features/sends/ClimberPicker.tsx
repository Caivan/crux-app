import { Avatar } from '@crux/design-system';
import type { Member } from '@crux/shared-types';
import styled from 'styled-components';

const Group = styled.div`display:flex;gap:8px;overflow-x:auto;padding:3px 1px 5px;`;
const Option = styled.button<{ $selected:boolean }>`display:flex;flex:0 0 auto;align-items:center;gap:8px;min-height:48px;padding:6px 11px 6px 6px;border:1px solid ${({$selected})=>$selected?'var(--color-outline)':'var(--color-border)'};border-radius:14px;background:${({$selected})=>$selected?'var(--color-highlight-soft)':'var(--color-surface)'};cursor:pointer;text-align:left;.avatar-wrap .avatar{width:34px;height:34px}.name{font:600 12px var(--font-family-body);color:var(--color-text-primary)}.tag{display:block;color:var(--color-text-muted);font:10px var(--font-family-mono)}`;

export function ClimberPicker({ members, currentMemberId, value, onChange }:{members:Member[];currentMemberId:string;value:string;onChange:(id:string)=>void}){
  const options=[...members].sort((a,b)=>Number(b.id===currentMemberId)-Number(a.id===currentMemberId));
  return <div><div style={{marginBottom:7,color:'var(--color-text-muted)',font:'500 11px var(--font-family-mono)',letterSpacing:'.08em',textTransform:'uppercase'}}>Climber</div><Group role="radiogroup" aria-label="Climber who sent the problem">{options.map((member)=><Option key={member.id} type="button" role="radio" aria-checked={value===member.id} $selected={value===member.id} onClick={()=>onChange(member.id)}><span className="avatar-wrap"><Avatar person={member}/></span><span className="name">{member.id===currentMemberId?'You':member.name}<span className="tag">{member.id===currentMemberId?'Your profile':'Crew member'}</span></span></Option>)}</Group></div>;
}
