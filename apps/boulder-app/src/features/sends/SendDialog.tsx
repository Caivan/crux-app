import { HoldIcon } from '@crux/design-system';
import type { AttemptCategory, CruxData, Grade, GradeDisplay, Problem, Send } from '@crux/shared-types';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { GRADE_COLORS, gradeLabel, pointsForSend } from '../../domain/catalog';
import { localDateString } from '../../domain/date';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Field, Input, ModalBackdrop, ModalCard, Row, SectionTitle, Select, Stack } from '../../components/ui';
import { ClimberPicker } from './ClimberPicker';
import { GradePicker } from './GradePicker';
import { AttemptPicker } from './AttemptPicker';

const DialogFooter=styled(Row)`
  position:sticky;bottom:calc(-1 * clamp(20px,4vw,34px));z-index:2;justify-content:flex-end;
  margin:18px calc(-1 * clamp(20px,4vw,34px)) calc(-1 * clamp(20px,4vw,34px));
  padding:12px clamp(20px,4vw,34px) clamp(20px,4vw,34px);
  border-top:1px solid var(--color-border);background:var(--color-surface);
`;

export interface SendDraft { memberId:string; problemId:string|null; grade:Grade; attempt:AttemptCategory; date:string; }

export function SendDialog({ data, sends, edit, problem, gradeDisplay, onClose, onSave }:{
  data:CruxData;sends:Send[];edit:Send|null;problem:Problem|null;gradeDisplay:GradeDisplay;onClose:()=>void;onSave:(draft:SendDraft,editId?:string)=>void;
}){
  const [mode,setMode]=useState<'problem'|'standalone'>(edit?.problemId||problem?'problem':'standalone');
  const [memberId,setMemberId]=useState(edit?.memberId??data.currentMemberId);
  const [problemId,setProblemId]=useState(edit?.problemId??problem?.id??'');
  const [grade,setGrade]=useState<Grade>(edit?.grade??problem?.grade??'Green');
  const [attempt,setAttempt]=useState<AttemptCategory>(edit?.attempt??'second');
  const [date,setDate]=useState(edit?.date??localDateString());
  const selected=useMemo(()=>data.problems.find((item)=>item.id===problemId)??null,[data.problems,problemId]);
  const firstSend=Boolean(selected&&!sends.some((send)=>send.problemId===selected.id&&send.id!==edit?.id));
  const points=pointsForSend(mode==='problem'&&selected?selected.grade:grade,attempt,mode==='problem'&&firstSend);
  const submit=(event:React.FormEvent<HTMLFormElement>)=>{event.preventDefault();onSave({memberId,problemId:mode==='problem'?problemId||null:null,grade:mode==='problem'&&selected?selected.grade:grade,attempt,date},edit?.id)};
  return <ModalBackdrop onMouseDown={(event)=>{if(event.target===event.currentTarget)onClose()}}><ModalCard as="form" role="dialog" aria-modal="true" aria-labelledby="send-dialog-title" onSubmit={submit}>
    <Row style={{justifyContent:'space-between',alignItems:'flex-start'}}><div><Eyebrow>{edit?'Update your log':'Every send counts'}</Eyebrow><SectionTitle id="send-dialog-title" style={{fontSize:26}}>{edit?'Edit send':'Log a send'}</SectionTitle><p style={{margin:'7px 0 0',color:'var(--color-text-muted)'}}>Record the send, the grade, and how you got there.</p></div><Button type="button" $variant="quiet" aria-label="Close" onClick={onClose}><Icon name="close"/></Button></Row>
    {!edit&&<Stack $gap="14px" style={{margin:'18px 0'}}><ClimberPicker members={data.members} currentMemberId={data.currentMemberId} value={memberId} onChange={setMemberId}/><div role="tablist" aria-label="Send type" style={{display:'flex',gap:6}}>{(['problem','standalone'] as const).map((item)=><Button key={item} type="button" role="tab" aria-selected={mode===item} $variant={mode===item?'primary':'secondary'} onClick={()=>setMode(item)}>{item==='problem'?'Catalog problem':'Standalone send'}</Button>)}</div></Stack>}
    <Stack $gap="14px">
      {mode==='problem'?<Field>Problem from the catalog
        <Select required value={problemId} onChange={(event)=>{setProblemId(event.target.value);const next=data.problems.find((item)=>item.id===event.target.value);if(next)setGrade(next.grade)}}><option value="" disabled>Select a problem</option>{[...data.problems].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map((item)=><option key={item.id} value={item.id}>{item.name} · {gradeLabel(item.grade,gradeDisplay)} · {new Date(`${item.createdAt}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</option>)}</Select>
        {selected&&<div style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:10,background:'var(--color-surface-subtle)'}}><HoldIcon grade={selected.grade}/><b>{selected.name}</b><span style={{color:GRADE_COLORS[selected.grade],marginLeft:'auto'}}>{gradeLabel(selected.grade,gradeDisplay)}</span></div>}
      </Field>:<Field as="div">Level completed<GradePicker value={grade} onChange={setGrade}/></Field>}
      <Field as="div">How many tries?<AttemptPicker value={attempt} onChange={setAttempt}/></Field>
      <Field>Send date{edit?<Input value={date} readOnly aria-readonly="true"/>:<Input required type="date" max={localDateString()} value={date} onChange={(event)=>setDate(event.target.value)}/>}</Field>
    </Stack>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'13px 14px',marginTop:16,borderRadius:13,background:'var(--color-highlight-soft)'}}><span><b style={{display:'block'}}>Points earned</b><small style={{color:'var(--color-text-muted)'}}>{pointsForSend(mode==='problem'&&selected?selected.grade:grade,attempt)} base{mode==='problem'&&firstSend?' + 5 Risk Taker':''}</small></span><strong style={{font:'700 24px var(--font-family-display)'}}>{points} pts</strong></div>
    {mode==='problem'&&firstSend&&selected&&<p style={{margin:'8px 0',color:'var(--color-text-muted)',fontSize:11}}>Be first on this shared problem to earn Risk Taker. The bonus moves to the next earliest send if this one is removed.</p>}
    <DialogFooter><Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={mode==='problem'&&!problemId}>{edit?'Save changes':'Log send'}<Icon name="send" size={16}/></Button></DialogFooter>
  </ModalCard></ModalBackdrop>;
}
