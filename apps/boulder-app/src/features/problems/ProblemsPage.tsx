import { Avatar, BoulderIcon } from '@crux/design-system';
import type { CruxData, Grade, GradeDisplay, Member, Problem, Send } from '@crux/shared-types';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { GRADE_TINTS, GRADES, gradeLabel } from '../../domain/catalog';
import { dateLabel } from '../../domain/date';
import { GradePill } from '../../components/GradePill';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Field, Grid, Input, PageDescription, PageTitle, Pill, Row, SectionTitle, Select, Surface } from '../../components/ui';

const Header=styled.div`display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:12px 0 23px;@media(max-width:560px){align-items:flex-start;flex-direction:column}`;
const Filters=styled(Surface)`display:grid;grid-template-columns:minmax(180px,1.4fr) repeat(3,minmax(130px,1fr));gap:12px;align-items:end;margin-bottom:16px;@media(max-width:880px){grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:500px){grid-template-columns:1fr}`;
const ProblemCard=styled(Surface)`display:grid;grid-template-columns:70px minmax(0,1fr);gap:13px;align-items:center;padding:15px;cursor:pointer;transition:transform .16s ease,box-shadow .16s ease;&:hover{transform:translateY(-2px);box-shadow:0 7px 0 #49374418}`;
const Boulder=styled.div<{ $grade:Grade }>`display:grid;place-items:center;width:68px;height:68px;border-radius:17px;background:${({$grade})=>GRADE_TINTS[$grade]};.boulder-icon{width:48px;height:52px}`;
const CardTitle=styled.h3`margin:7px 0 3px;font:700 16px var(--font-family-display);letter-spacing:-.02em;`;
const CardMeta=styled.div`display:flex;gap:9px;align-items:center;flex-wrap:wrap;color:var(--color-text-muted);font-size:11px;`;
const CardFooter=styled.div`grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:2px;padding-top:10px;border-top:1px solid var(--color-border);color:var(--color-text-muted);font-size:11px;`;
const PageControl=styled.div`display:flex;justify-content:space-between;align-items:center;margin-top:19px;color:var(--color-text-muted);font-size:12px;`;
const SendLine=styled.div`display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--color-border);&:last-child{border:0}`;
const ModalHead=styled.div`display:flex;justify-content:space-between;align-items:flex-start;gap:12px;`;

export function ProblemsPage({data,sends,members,currentMemberId,gradeDisplay,onScan,onManualSend,onLogProblemSend}:{
  data:CruxData;sends:Send[];members:Member[];currentMemberId:string;gradeDisplay:GradeDisplay;
  onScan:()=>void;onManualSend:()=>void;onLogProblemSend:(problem:Problem)=>void;
}){
  const [grade,setGrade]=useState<Grade|'all'>('all');const [createdAfter,setCreatedAfter]=useState('');const [createdBefore,setCreatedBefore]=useState('');const [page,setPage]=useState(0);const [selected,setSelected]=useState<Problem|null>(null);const [search,setSearch]=useState('');
  const pageSize=50;
  const filtered=useMemo(()=>data.problems.filter((problem)=>(grade==='all'||problem.grade===grade)&&(!createdAfter||problem.createdAt>=createdAfter)&&(!createdBefore||problem.createdAt<=createdBefore)&&(`${problem.name} ${problem.qrIdentifier??''}`.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),[data.problems,grade,createdAfter,createdBefore,search]);
  const pageItems=filtered.slice(page*pageSize,(page+1)*pageSize);const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const sendsFor=(problemId:string)=>sends.filter((send)=>send.problemId===problemId).sort((a,b)=>b.date.localeCompare(a.date));
  const memberFor=(memberId:string)=>members.find((member)=>member.id===memberId);
  return <>
    <Header><div><Eyebrow>The global wall</Eyebrow><PageTitle>Problems <span>catalog</span></PageTitle><PageDescription>Every route has a story. Add one by scanning its wall QR code.</PageDescription></div><Row $wrap><Button $variant="secondary" onClick={onManualSend}><Icon name="send"/> Manual send</Button><Button onClick={onScan}><Icon name="scan"/> Scan a route</Button></Row></Header>
    <Filters><Field>Find a problem<Input value={search} onChange={(event)=>{setSearch(event.target.value);setPage(0)}} placeholder="Name or route code"/></Field><Field>Difficulty<Select value={grade} onChange={(event)=>{setGrade(event.target.value as Grade|'all');setPage(0)}}><option value="all">All levels</option>{GRADES.map(({grade:level})=><option key={level} value={level}>{gradeLabel(level,gradeDisplay)}</option>)}</Select></Field><Field>Created after<Input type="date" value={createdAfter} onChange={(event)=>{setCreatedAfter(event.target.value);setPage(0)}}/></Field><Field>Created before<Input type="date" value={createdBefore} onChange={(event)=>{setCreatedBefore(event.target.value);setPage(0)}}/></Field></Filters>
    <Row style={{justifyContent:'space-between',margin:'8px 0 13px'}}><span style={{color:'var(--color-text-muted)',fontSize:12}}>{filtered.length} global problems · newest first</span><Pill $tone="green">50 per page</Pill></Row>
    <Grid $min="270px" $gap="12px">{pageItems.map((problem)=>{const problemSends=sendsFor(problem.id);const senders=new Set(problemSends.map((send)=>send.memberId));const explorer=problem.explorerIds.includes(currentMemberId);return <ProblemCard key={problem.id} role="button" tabIndex={0} onClick={()=>setSelected(problem)} onKeyDown={(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(problem)}}} aria-label={`Open ${problem.name}, ${problem.grade}`}>
      <Boulder $grade={problem.grade}><BoulderIcon grade={problem.grade}/></Boulder><div><GradePill grade={problem.grade} display={gradeDisplay} compact/><CardTitle>{problem.name}</CardTitle><CardMeta>Added {dateLabel(problem.createdAt)}{problem.creatorDeleted?' · by deleted climber':` · by ${memberFor(problem.creatorId??'')?.name??'crew climber'}`}</CardMeta></div>
      <CardFooter><span>{problemSends.length} sends · {senders.size} climbers</span>{explorer&&<Pill $tone="orange"><Icon name="spark" size={13}/>Explorer</Pill>}</CardFooter>
    </ProblemCard>})}</Grid>
    {!pageItems.length&&<Surface style={{textAlign:'center',padding:38}}><Eyebrow>No matching routes</Eyebrow><SectionTitle>Try another grade or date</SectionTitle></Surface>}
    <PageControl><span>Page {page+1} of {totalPages}</span><Row><Button $variant="secondary" disabled={page===0} onClick={()=>setPage((value)=>Math.max(0,value-1))}>Previous</Button><Button $variant="secondary" disabled={page+1>=totalPages} onClick={()=>setPage((value)=>Math.min(totalPages-1,value+1))}>Next</Button></Row></PageControl>
    {selected&&<div role="presentation" style={{position:'fixed',zIndex:20,inset:0,display:'grid',placeItems:'center',padding:16,background:'#28212d99'}} onMouseDown={(event)=>{if(event.target===event.currentTarget)setSelected(null)}}><Surface role="dialog" aria-modal="true" aria-labelledby="problem-detail-title" style={{width:'min(100%,600px)',maxHeight:'90vh',overflow:'auto',padding:24}}>
      <ModalHead><div><Eyebrow>Problem detail</Eyebrow><SectionTitle id="problem-detail-title">{selected.name}</SectionTitle></div><Button aria-label="Close" $variant="quiet" onClick={()=>setSelected(null)}><Icon name="close"/></Button></ModalHead>
      <Row $wrap style={{margin:'16px 0'}}><GradePill grade={selected.grade} display={gradeDisplay}/>{selected.explorerIds.length>0&&<Pill $tone="orange"><Icon name="spark" size={14}/>Explorer insignia</Pill>}</Row>
      <p style={{color:'var(--color-text-muted)',fontSize:12}}>Added {dateLabel(selected.createdAt)}{selected.creatorDeleted?' · creator deleted':` · by ${memberFor(selected.creatorId??'')?.name??'a crew member'}`}</p>
      {selected.routeUrl&&<a href={selected.routeUrl} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:7,color:'var(--color-action-secondary)',fontSize:12}}><Icon name="link" size={16}/>Open original route page<Icon name="external" size={15}/></a>}
      <div style={{margin:'22px 0 12px'}}><SectionTitle>Amurados sends</SectionTitle></div>
      {sendsFor(selected.id).slice(0,8).map((send)=><SendLine key={send.id}><span className="avatar-wrap"><Avatar person={memberFor(send.memberId)!}/></span><span><b>{memberFor(send.memberId)?.name}</b><small style={{display:'block',color:'var(--color-text-muted)'}}>{dateLabel(send.date)} · {send.attempt}</small></span><b>{send.points} pts</b></SendLine>)}
      {!sendsFor(selected.id).length&&<p style={{color:'var(--color-text-muted)',fontSize:13}}>No sends in this crew yet. Be first to send it.</p>}
      <Row $wrap style={{justifyContent:'flex-end',marginTop:20}}>{selected.routeUrl&&<Button $variant="secondary" as="a" href={selected.routeUrl} target="_blank" rel="noreferrer">Route page <Icon name="external" size={15}/></Button>}<Button onClick={()=>{onLogProblemSend(selected);setSelected(null)}}><Icon name="send"/>Log send</Button></Row>
    </Surface></div>}
  </>;
}
