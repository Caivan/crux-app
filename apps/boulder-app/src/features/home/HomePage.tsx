import { mediaQueries } from '@crux/design-system/breakpoints';
import type { AppSection, CruxData, Grade, Member, Send, TimeRange } from '@crux/shared-types';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { currentMonthSends, monthlyLeaderboard } from '../../domain/analytics';
import { GRADE_COLORS, GRADES } from '../../domain/catalog';
import { dateLabel } from '../../domain/date';
import { GradePill } from '../../components/GradePill';
import { ProgressAnalytics, HighestLevelChart } from '../../components/ProgressAnalytics';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Grid, PageDescription, PageTitle, Pill, SectionTitle, StatLabel, StatValue, Surface } from '../../components/ui';
import { MonthlyPodium } from './MonthlyPodium';

const Hero = styled.div`display:flex;justify-content:space-between;align-items:flex-start;flex-direction:column;gap:20px;margin:10px 0 27px;@media ${mediaQueries.md}{align-items:flex-end;flex-direction:row}`;
const ActionRow = styled.div`display:flex;gap:8px;flex-wrap:wrap;`;
const StatCard = styled(Surface)`position:relative;min-height:100px;padding:14px 16px;display:grid;align-content:space-between;gap:10px;overflow:hidden;&:after{content:'✳';position:absolute;right:12px;top:3px;color:var(--color-highlight-strong);opacity:.2;font-size:30px} ${StatValue}{font-size:24px}`;
const StatsGrid = styled.div`
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:${({theme})=>theme.space.md};
  @media ${mediaQueries.md}{grid-template-columns:repeat(4,minmax(0,1fr));}
`;
const StatFooter = styled.div`display:flex;align-items:center;gap:9px;color:var(--color-highlight);font-size:12px;font-weight:600;`;
const ContentGrid = styled.div`display:grid;grid-template-columns:minmax(0,1fr);gap:18px;margin-top:18px;@media ${mediaQueries.lg}{grid-template-columns:minmax(0,1.55fr) minmax(280px,.85fr)}`;
const Stack = styled.div`display:grid;gap:18px;min-width:0;`;
const ActivityRow = styled.div`display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid var(--color-border);&:last-child{border-bottom:0}.name{font-weight:700}.detail{display:block;color:var(--color-text-muted);font-size:11px}.score{font-weight:700;color:var(--color-green,#557d4a)}`;
const SectionHeader = styled.div`display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px;`;
const TextLink = styled.button`padding:5px 0;border:0;color:var(--color-action-secondary);background:transparent;font-weight:700;cursor:pointer;`;
const GradeLegend = styled.div`display:flex;gap:7px;flex-wrap:wrap;margin-top:12px;`;

export function HomePage({ data, sends, members, onLogSend, onScan, onNavigate, onViewProfile }: {
  data:CruxData; sends:Send[]; members:Member[]; onLogSend:()=>void; onScan:()=>void; onNavigate:(section:AppSection)=>void; onViewProfile:(id:string)=>void;
}) {
  const [range,setRange]=useState<TimeRange>('week');const [grade,setGrade]=useState<Grade|'all'>('all');const [memberFilter,setMemberFilter]=useState('all');
  const monthSends=useMemo(()=>currentMonthSends(sends),[sends]);
  const leaderboard=useMemo(()=>monthlyLeaderboard(members,sends).slice(0,5),[members,sends]);
  const hardest=monthSends.reduce<Grade|null>((hardest,send)=>!hardest||GRADES.findIndex((item)=>item.grade===send.grade)>GRADES.findIndex((item)=>item.grade===hardest)?send.grade:hardest,null);
  const latest=useMemo(()=>[...sends].sort((a,b)=>b.loggedAt.localeCompare(a.loggedAt)).slice(0,5),[sends]);
  const monthName=new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const memberById=(id:string)=>members.find((member)=>member.id===id);
  const problemById=(id:string|null)=>data.problems.find((problem)=>problem.id===id);
  return <>
    <Hero><div><Eyebrow>Same wall, different ways up</Eyebrow><PageTitle>Welcome to <span>{data.crew.name}</span></PageTitle><PageDescription>A little progress is still progress. Let’s celebrate it together.</PageDescription></div>
      <ActionRow><Button $variant="secondary" onClick={onScan}><Icon name="scan"/> Scan route</Button><Button onClick={onLogSend}><Icon name="add"/> Log a send</Button></ActionRow></Hero>
    <MonthlyPodium standings={leaderboard.slice(0,3)} monthName={monthName} onViewProfile={onViewProfile}/>
    <StatsGrid>
      <StatCard><StatLabel>TOTAL CREW SENDS</StatLabel><StatValue>{sends.length}</StatValue><StatFooter><Icon name="send" size={15}/>{monthSends.length} this month</StatFooter></StatCard>
      <StatCard><StatLabel>MEMBERS IN THE CREW</StatLabel><StatValue>{data.crew.memberIds.length}</StatValue><StatFooter><Icon name="crew" size={15}/>One wall, lots of beta</StatFooter></StatCard>
      <StatCard><StatLabel>HARDEST SEND · {monthName.toUpperCase()}</StatLabel><StatValue>{hardest??'—'}</StatValue><StatFooter>{hardest?<GradePill grade={hardest} compact/>:'Your next send could set it'}</StatFooter></StatCard>
    </StatsGrid>
    <ContentGrid><Stack>
      <ProgressAnalytics sends={sends} members={members} range={range} onRange={setRange} selectedGrade={grade} onGrade={setGrade} memberFilter={memberFilter} onMemberFilter={setMemberFilter}/>
      <HighestLevelChart sends={memberFilter==='all'?sends:sends.filter((send)=>send.memberId===memberFilter)} range={range}/>
      <Surface><SectionHeader><div><Eyebrow>Fresh Sends</Eyebrow><SectionTitle>Just off the wall</SectionTitle></div><TextLink onClick={()=>onNavigate('problems')}>All problems ↗</TextLink></SectionHeader>
        {latest.map((send)=>{const member=memberById(send.memberId),problem=problemById(send.problemId);return <ActivityRow key={send.id}><GradePill grade={send.grade} compact iconOnly/><div><span className="name">{member?.name} sent {problem?.name??'a manual send'}</span><span className="detail">{dateLabel(send.date)} · {send.attempt==='flash'?'Flash':send.attempt==='second'?'Second attempt':'Third or later'}{send.riskTaker?' · Risk Taker':''}</span></div><span className="score">{send.points} pts</span></ActivityRow>})}
        {!latest.length&&<span>No sends yet. Log the crew’s first!</span>}
      </Surface>
    </Stack><Stack>
      <Surface><SectionHeader><div><Eyebrow>Grade mix</Eyebrow><SectionTitle>Where the sends land</SectionTitle></div></SectionHeader>
        <Grid $min="95px" $gap="9px">{GRADES.map(({grade:level})=>{const count=monthSends.filter((send)=>send.grade===level).length;return <div key={level} style={{padding:10,borderRadius:12,background:'var(--color-surface-subtle)'}}><GradePill grade={level} compact/><div style={{marginTop:8,font:'700 21px var(--font-family-display)'}}>{count}<small style={{font:'11px var(--font-family-mono)',color:'var(--color-text-muted)'}}> sends</small></div><div style={{height:3,marginTop:5,borderRadius:3,background:count?GRADE_COLORS[level]:'var(--color-border)',width:`${Math.max(count?12:0,Math.min(100,count*20))}%`}}/></div>})}</Grid>
        <GradeLegend><Pill $tone="green">Explorer · {data.problems.filter((problem)=>problem.explorerIds.includes(data.currentMemberId)).length} insignias</Pill></GradeLegend>
      </Surface>
    </Stack></ContentGrid>
  </>;
}
