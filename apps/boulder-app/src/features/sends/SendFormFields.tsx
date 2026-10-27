import { HoldIcon } from '@crux/design-system';
import type { AttemptCategory, Grade, GradeDisplay, Member, Problem } from '@crux/shared-types';
import styled from 'styled-components';
import { GRADE_COLORS, gradeLabel, pointsForSend } from '../../domain/catalog';
import { localDateString } from '../../domain/date';
import { Field, Input, Row } from '../../components/ui';
import { AttemptPicker } from './AttemptPicker';
import { ClimberPicker } from './ClimberPicker';

export const DialogFooter=styled(Row)`
  position:sticky;bottom:calc(-1 * clamp(20px,4vw,34px));z-index:2;justify-content:flex-end;
  margin:18px calc(-1 * clamp(20px,4vw,34px)) calc(-1 * clamp(20px,4vw,34px));
  padding:12px clamp(20px,4vw,34px) clamp(20px,4vw,34px);
  border-top:1px solid var(--color-border);background:var(--color-surface);
`;

export function LockedProblemCard({problem,gradeDisplay}:{problem:Pick<Problem,'name'|'grade'>;gradeDisplay:GradeDisplay}){
  return <div style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:10,background:'var(--color-surface-subtle)'}}>
    <HoldIcon grade={problem.grade}/><b>{problem.name}</b>
    <span style={{color:GRADE_COLORS[problem.grade],marginLeft:'auto'}}>{gradeLabel(problem.grade,gradeDisplay)}</span>
  </div>;
}

export function SendPointsPreview({grade,attempt,firstSend=false}:{grade:Grade;attempt:AttemptCategory;firstSend?:boolean}){
  const points=pointsForSend(grade,attempt,firstSend);
  return <>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'13px 14px',marginTop:16,borderRadius:13,background:'var(--color-highlight-soft)'}}>
      <span><b style={{display:'block'}}>Points earned</b><small style={{color:'var(--color-text-muted)'}}>{pointsForSend(grade,attempt)} base{firstSend?' + 5 Risk Taker':''}</small></span>
      <strong style={{font:'700 24px var(--font-family-display)'}}>{points} pts</strong>
    </div>
    {firstSend&&<p style={{margin:'8px 0',color:'var(--color-text-muted)',fontSize:11}}>Be first on this shared problem to earn Risk Taker. The bonus moves to the next earliest send if this one is removed.</p>}
  </>;
}

export function SendFormFields({
  members,currentMemberId,memberId,onMemberId,showClimber=true,
  attempt,onAttempt,date,onDate,dateReadOnly=false,
  grade,firstSend=false,
}:{
  members:Member[];currentMemberId:string;memberId:string;onMemberId:(id:string)=>void;showClimber?:boolean;
  attempt:AttemptCategory;onAttempt:(attempt:AttemptCategory)=>void;
  date:string;onDate:(date:string)=>void;dateReadOnly?:boolean;
  grade:Grade;firstSend?:boolean;
}){
  return <>
    {showClimber&&<ClimberPicker members={members} currentMemberId={currentMemberId} value={memberId} onChange={onMemberId}/>}
    <Field as="div">How many tries?<AttemptPicker value={attempt} onChange={onAttempt}/></Field>
    <Field>Send date{dateReadOnly?<Input value={date} readOnly aria-readonly="true"/>:<Input required type="date" max={localDateString()} value={date} onChange={(event)=>onDate(event.target.value)}/>}</Field>
    <SendPointsPreview grade={grade} attempt={attempt} firstSend={firstSend}/>
  </>;
}
