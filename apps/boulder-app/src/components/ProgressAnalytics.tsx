import { HoldIcon } from '@crux/design-system';
import type { Grade, GradeDisplay, Member, Send, TimeRange } from '@crux/shared-types';
import { useMemo } from 'react';
import styled from 'styled-components';
import { chartPoints, sendMatchesChartPoint } from '../domain/analytics';
import { GRADE_COLORS, GRADES, MEMBER_COLORS, gradeLabel } from '../domain/catalog';
import { GradePill } from './GradePill';
import { Pill, Row, SectionTitle, Surface } from './ui';

const Segmented = styled.div`display:flex;flex-wrap:wrap;gap:3px;padding:4px;border-radius:11px;background:var(--color-surface-subtle);`;
const Segment = styled.button<{ $active:boolean }>`padding:7px 11px;border:0;border-radius:8px;background:${({$active})=>$active?'var(--color-surface)':'transparent'};color:${({$active})=>$active?'var(--color-text-primary)':'var(--color-text-muted)'};font-size:12px;font-weight:600;box-shadow:${({$active})=>$active?'0 1px 3px #2b22301a':'none'};cursor:pointer;`;
const Filters = styled.div`display:flex;gap:6px;overflow:auto;padding:2px 1px 5px;`;
const Filter = styled.button<{ $active:boolean; $grade?:Grade }>`display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:4px 8px;white-space:nowrap;border:1px solid ${({$active})=>$active?'var(--color-outline)':'var(--color-border)'};border-radius:10px;background:${({$active})=>$active?'var(--color-highlight-soft)':'var(--color-surface)'};font-size:11px;cursor:pointer;.hold-icon{width:22px;height:20px}`;
const Chart = styled.div`position:relative;margin-top:19px;padding:12px 8px 0 34px;`;
const Plot = styled.div`position:relative;height:172px;display:flex;align-items:flex-end;justify-content:space-around;gap:7px;border-bottom:1px solid var(--color-border);background:repeating-linear-gradient(to bottom,transparent 0,transparent 41px,var(--color-border) 42px);`;
const BarGroup = styled.div`height:100%;display:flex;flex:1;align-items:flex-end;justify-content:center;gap:3px;position:relative;`;
const Bar = styled.div<{ $value:number; $max:number; $color:string }>`width:min(24px,36%);height:${({$value,$max})=>Math.max($value?5:0,$value/$max*100)}%;min-height:${({$value})=>$value?4:0}px;border-radius:5px 5px 1px 1px;background:${({$color})=>$color};opacity:.86;`;
const Axis = styled.div`display:flex;justify-content:space-around;margin-top:8px;color:var(--color-text-muted);font:10px var(--font-family-mono);`;
const Key = styled.div`display:flex;gap:13px;flex-wrap:wrap;margin-top:15px;`;
const KeyItem = styled.span`display:inline-flex;align-items:center;gap:6px;color:var(--color-text-secondary);font-size:12px;.dot{width:9px;height:9px;border-radius:50%}`;
const ChartDescription = styled.p`margin:14px 0 0;padding-top:12px;border-top:1px solid var(--color-border);color:var(--color-text-muted);font-size:11px;`;
const FilterRow = styled.div`display:flex;flex-direction:column;gap:6px;align-items:flex-start;margin:14px 0 8px;`;

export function ProgressAnalytics({ sends, members, range, onRange, selectedGrade, onGrade, memberFilter, onMemberFilter, variant='crew', gradeDisplay='color' }: {
  sends:Send[]; members:Member[]; range:TimeRange; onRange:(range:TimeRange)=>void; selectedGrade:Grade|'all'; onGrade:(grade:Grade|'all')=>void;
  memberFilter:string; onMemberFilter:(id:string)=>void; variant?:'crew'|'personal'; gradeDisplay?:GradeDisplay;
}) {
  const visibleSends = useMemo(()=>sends.filter((send)=>(memberFilter==='all'||send.memberId===memberFilter)&&(selectedGrade==='all'||send.grade===selectedGrade)),[sends,memberFilter,selectedGrade]);
  const points = useMemo(()=>chartPoints(visibleSends,range),[visibleSends,range]);
  const series = variant==='personal' ? members.filter((member)=>visibleSends.some((send)=>send.memberId===member.id)).map((member)=>({member,sends:visibleSends.filter((send)=>send.memberId===member.id)})) : members.map((member)=>({member,sends:visibleSends.filter((send)=>send.memberId===member.id)})).filter((item)=>item.sends.length>0);
  const max = Math.max(1,...points.map((point)=>point.sends));
  return <Surface>
    <Row $wrap $align="flex-start" style={{justifyContent:'space-between'}}><div><p style={{margin:'0 0 6px',font:'500 10px var(--font-family-mono)',letterSpacing:'.12em',color:'var(--color-text-muted)',textTransform:'uppercase'}}>THE CLIMB, OVER TIME</p><SectionTitle>{variant==='personal'?'Your progress':'Crew progress'}</SectionTitle></div>
      <Segmented aria-label="Chart time range">{(['week','month','year'] as const).map((item)=><Segment key={item} type="button" $active={range===item} aria-pressed={range===item} onClick={()=>onRange(item)}>{item==='week'?'Week':item==='month'?'Month':'Year'}</Segment>)}</Segmented></Row>
    {variant==='crew'&&<FilterRow><span style={{fontSize:11,color:'var(--color-text-muted)'}}>CLIMBER</span><Segmented><Segment type="button" $active={memberFilter==='all'} onClick={()=>onMemberFilter('all')}>Everyone</Segment>{members.map((member)=><Segment key={member.id} type="button" $active={memberFilter===member.id} onClick={()=>onMemberFilter(member.id)}>{member.name==='You'?'You':member.name.split(' ')[0]}</Segment>)}</Segmented></FilterRow>}
    <Filters aria-label="Filter chart by grade"><Filter type="button" $active={selectedGrade==='all'} onClick={()=>onGrade('all')}>All grades</Filter>{GRADES.map(({grade})=><Filter type="button" key={grade} $grade={grade} $active={selectedGrade===grade} onClick={()=>onGrade(grade)} aria-pressed={selectedGrade===grade}><HoldIcon grade={grade}/>{gradeLabel(grade,gradeDisplay)}</Filter>)}</Filters>
    <Chart role="img" aria-label={`Sends by level over time, ${range} view`}><Plot>{points.map((point,index)=><BarGroup key={`${point.date}-${index}`} title={`${point.label}: ${point.sends} sends${point.hardest?`, hardest ${point.hardest}`:''}`}>
      {series.map(({member,sends:memberSends})=>{const value=memberSends.filter((send)=>sendMatchesChartPoint(send.date,point,range)).length;return <Bar key={member.id} $value={value} $max={max} $color={member.name==='You'?'var(--color-action-primary)':MEMBER_COLORS[member.color%MEMBER_COLORS.length]}/>;})}
    </BarGroup>)}</Plot><Axis>{points.map((point,index)=><span key={`${point.label}-${index}`}>{point.label}</span>)}</Axis></Chart>
    <Key>{series.map(({member})=><KeyItem key={member.id}><span className="dot" style={{background:member.name==='You'?'var(--color-action-primary)':MEMBER_COLORS[member.color%MEMBER_COLORS.length]}}/>{member.name==='You'?'You':member.name.split(' ')[0]}</KeyItem>)}</Key>
    <ChartDescription>Sends by date logged · bars show volume · use grade and climber filters to narrow the view</ChartDescription>
  </Surface>;
}

export function HighestLevelChart({ sends, range, gradeDisplay='color' }: { sends:Send[]; range:TimeRange; gradeDisplay?:GradeDisplay }) {
  const points=chartPoints(sends,range);const max=GRADES.length-1;
  const maxGradeIndex=(grade:Grade|null)=>grade?GRADES.findIndex((item)=>item.grade===grade):-1;
  return <Surface>
    <Row $align="flex-start" style={{justifyContent:'space-between'}}><div><p style={{margin:'0 0 6px',font:'500 10px var(--font-family-mono)',letterSpacing:'.12em',color:'var(--color-text-muted)',textTransform:'uppercase'}}>REACHING HIGHER</p><SectionTitle>Highest level over time</SectionTitle></div><Pill>Peak grade</Pill></Row>
    <div style={{display:'grid',gridTemplateColumns:`repeat(${points.length},minmax(36px,1fr))`,gap:8,alignItems:'end',height:120,marginTop:20,padding:'0 6px',borderBottom:'1px solid var(--color-border)'}}>{points.map((point)=>{const rank=maxGradeIndex(point.hardest);return <div key={point.date} title={`${point.label}: ${point.hardest??'No sends'}`} style={{height:rank<0?8:`${26+rank/max*68}%`,minHeight:8,borderRadius:'8px 8px 2px 2px',background:point.hardest?GRADE_COLORS[point.hardest]:'var(--color-surface-subtle)',opacity:.88,alignSelf:'end'}}/>})}</div>
    <Row style={{justifyContent:'space-around',marginTop:8,color:'var(--color-text-muted)',font:'10px var(--font-family-mono)'}}>{points.map((point)=><span key={point.date}>{point.label}</span>)}</Row>
    <Row $wrap style={{marginTop:14}}>{points.filter((point)=>point.hardest).map((point,index)=><GradePill key={`${point.date}-${index}`} grade={point.hardest!} display={gradeDisplay} compact/>)}{points.every((point)=>!point.hardest)&&<span style={{color:'var(--color-text-muted)',fontSize:12}}>Log your first send to start a grade history.</span>}</Row>
  </Surface>;
}
