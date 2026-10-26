import type { AttemptCategory, CruxData, Grade, GradeDisplay, Problem, Send } from '@crux/shared-types';
import { useMemo, useState } from 'react';
import { gradeLabel } from '../../domain/catalog';
import { localDateString } from '../../domain/date';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Field, ModalBackdrop, ModalCard, Row, SectionTitle, Select, Stack } from '../../components/ui';
import { GradePicker } from './GradePicker';
import { DialogFooter, LockedProblemCard, SendFormFields } from './SendFormFields';

export interface SendDraft { memberId:string; problemId:string|null; grade:Grade; attempt:AttemptCategory; date:string; }

export function SendDialog({ data, sends, edit, problem, gradeDisplay, lockProblem=false, onClose, onSave }:{
  data:CruxData;sends:Send[];edit:Send|null;problem:Problem|null;gradeDisplay:GradeDisplay;lockProblem?:boolean;onClose:()=>void;onSave:(draft:SendDraft,editId?:string)=>void;
}){
  const locked=Boolean(lockProblem&&(problem||edit?.problemId));
  const lockedProblem=problem??(edit?.problemId?data.problems.find((item)=>item.id===edit.problemId)??null:null);
  const [mode,setMode]=useState<'problem'|'standalone'>(edit?.problemId||problem||locked?'problem':'standalone');
  const [memberId,setMemberId]=useState(edit?.memberId??data.currentMemberId);
  const [problemId,setProblemId]=useState(edit?.problemId??problem?.id??'');
  const [grade,setGrade]=useState<Grade>(edit?.grade??problem?.grade??'Green');
  const [attempt,setAttempt]=useState<AttemptCategory>(edit?.attempt??'second');
  const [date,setDate]=useState(edit?.date??localDateString());
  const selected=useMemo(()=>data.problems.find((item)=>item.id===problemId)??lockedProblem,[data.problems,problemId,lockedProblem]);
  const firstSend=Boolean(mode==='problem'&&selected&&!sends.some((send)=>send.problemId===selected.id&&send.id!==edit?.id));
  const effectiveGrade=mode==='problem'&&selected?selected.grade:grade;
  const submit=(event:React.FormEvent<HTMLFormElement>)=>{event.preventDefault();onSave({memberId,problemId:mode==='problem'?problemId||selected?.id||null:null,grade:effectiveGrade,attempt,date},edit?.id)};
  return <ModalBackdrop onMouseDown={(event)=>{if(event.target===event.currentTarget)onClose()}}><ModalCard as="form" role="dialog" aria-modal="true" aria-labelledby="send-dialog-title" onSubmit={submit}>
    <Row style={{justifyContent:'space-between',alignItems:'flex-start'}}><div><Eyebrow>{edit?'Update your log':'Every send counts'}</Eyebrow><SectionTitle id="send-dialog-title" style={{fontSize:26}}>{edit?'Edit send':'Log a send'}</SectionTitle><p style={{margin:'7px 0 0',color:'var(--color-text-muted)'}}>Record the send, the grade, and how you got there.</p></div><Button type="button" $variant="quiet" aria-label="Close" onClick={onClose}><Icon name="close"/></Button></Row>
    {!edit&&!locked&&<Stack $gap="14px" style={{margin:'18px 0'}}><div role="tablist" aria-label="Send type" style={{display:'flex',gap:6}}>{(['problem','standalone'] as const).map((item)=><Button key={item} type="button" role="tab" aria-selected={mode===item} $variant={mode===item?'primary':'secondary'} onClick={()=>setMode(item)}>{item==='problem'?'Catalog problem':'Standalone send'}</Button>)}</div></Stack>}
    <Stack $gap="14px" style={{marginTop:edit||locked?18:0}}>
      {mode==='problem'?(locked&&selected?<Field as="div">Catalog problem<LockedProblemCard problem={selected} gradeDisplay={gradeDisplay}/></Field>:<Field>Problem from the catalog
        <Select required value={problemId} onChange={(event)=>{setProblemId(event.target.value);const next=data.problems.find((item)=>item.id===event.target.value);if(next)setGrade(next.grade)}}><option value="" disabled>Select a problem</option>{[...data.problems].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map((item)=><option key={item.id} value={item.id}>{item.name} · {gradeLabel(item.grade,gradeDisplay)} · {new Date(`${item.createdAt}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</option>)}</Select>
        {selected&&<LockedProblemCard problem={selected} gradeDisplay={gradeDisplay}/>}
      </Field>):<Field as="div">Level completed<GradePicker value={grade} onChange={setGrade}/></Field>}
      <SendFormFields members={data.members} currentMemberId={data.currentMemberId} memberId={memberId} onMemberId={setMemberId} showClimber={!edit} attempt={attempt} onAttempt={setAttempt} date={date} onDate={setDate} dateReadOnly={Boolean(edit)} grade={effectiveGrade} firstSend={firstSend}/>
    </Stack>
    <DialogFooter><Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={mode==='problem'&&!(problemId||selected?.id)}>{edit?'Save changes':'Log send'}<Icon name="send" size={16}/></Button></DialogFooter>
  </ModalCard></ModalBackdrop>;
}
