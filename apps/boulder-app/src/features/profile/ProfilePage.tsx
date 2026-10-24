import { Avatar } from '@crux/design-system';
import type { Grade, GradeDisplay, Member, Problem, Send, TimeRange } from '@crux/shared-types';
import styled from 'styled-components';
import { gradeBreakdown } from '../../domain/analytics';
import { GRADE_COLORS, GRADES, gradeLabel } from '../../domain/catalog';
import { dateLabel } from '../../domain/date';
import { GradePill } from '../../components/GradePill';
import { ProgressAnalytics, HighestLevelChart } from '../../components/ProgressAnalytics';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Grid, PageDescription, PageTitle, Pill, Row, SectionTitle, StatLabel, StatValue, Surface } from '../../components/ui';

const Hero=styled(Surface)`display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:17px;background:linear-gradient(120deg,var(--color-surface) 62%,#eadcf088);@media(max-width:570px){align-items:flex-start;flex-direction:column}`;
const ProfileIdentity=styled.div`display:flex;align-items:center;gap:17px;.avatar{width:74px!important;height:74px!important}.avatar-face{width:100%;height:100%}`;
const Stats=styled(Grid)`margin-bottom:17px;`;
const GradeCard=styled(Surface)`padding:14px;display:grid;gap:8px;min-width:0;.bar{height:4px;border-radius:4px}`;
const SendRow=styled.div`display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid var(--color-border);&:last-child{border:0}.title{font-weight:700}.meta{color:var(--color-text-muted);font-size:11px}`;
const IconActions=styled.div`display:flex;gap:4px;`;

export function ProfilePage({member,sends,problems,currentMemberId,gradeDisplay,onEditSend,onDeleteSend,onLogSend,onRange,range,selectedGrade,onGrade,canManageAccount,onLeaveCrew,onDeleteAccount}:{
  member:Member;sends:Send[];problems:Problem[];currentMemberId:string;gradeDisplay:GradeDisplay;
  onEditSend:(send:Send)=>void;onDeleteSend:(send:Send)=>void;onLogSend:()=>void;
  onRange:(range:TimeRange)=>void;range:TimeRange;selectedGrade:Grade|'all';onGrade:(grade:Grade|'all')=>void;
  canManageAccount:boolean;onLeaveCrew:()=>void;onDeleteAccount:()=>void;
}){
  const ownSends=sends.filter((send)=>send.memberId===member.id).sort((a,b)=>b.date.localeCompare(a.date));
  const breakdown=gradeBreakdown(ownSends);const totalPoints=ownSends.reduce((sum,send)=>sum+send.points,0);
  const explorers=problems.filter((problem)=>problem.explorerIds.includes(member.id));
  const problemFor=(id:string|null)=>problems.find((problem)=>problem.id===id);
  const hardest=ownSends.reduce<Grade|null>((current,send)=>!current||GRADES.findIndex((item)=>item.grade===send.grade)>GRADES.findIndex((item)=>item.grade===current)?send.grade:current,null);
  const maxCount=Math.max(1,...breakdown.map((item)=>item.count));
  return <>
    <Hero><ProfileIdentity><span className="avatar-wrap"><Avatar person={member}/></span><div><Eyebrow>{member.id===currentMemberId?'Your climbing profile':'Crew member profile'}</Eyebrow><PageTitle>{member.name}</PageTitle><PageDescription>{member.role==='admin'?'Amurados admin':'Amurados crew member'} · climbing since {new Date(`${member.joinedAt}T12:00:00`).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</PageDescription></div></ProfileIdentity><Button onClick={onLogSend}><Icon name="add"/>Log a send</Button></Hero>
    <Stats $min="135px"><Surface><StatLabel>ALL-TIME POINTS</StatLabel><StatValue style={{marginTop:12}}>{totalPoints}</StatValue><small style={{color:'var(--color-text-muted)'}}>earned from {ownSends.length} sends</small></Surface><Surface><StatLabel>PROBLEMS SENT</StatLabel><StatValue style={{marginTop:12}}>{new Set(ownSends.map((send)=>send.problemId).filter(Boolean)).size}</StatValue><small style={{color:'var(--color-text-muted)'}}>shared routes completed</small></Surface><Surface><StatLabel>HARDEST SEND</StatLabel><StatValue style={{marginTop:12}}>{hardest??'—'}</StatValue><small style={{color:'var(--color-text-muted)'}}>{hardest?gradeLabel(hardest,gradeDisplay):'A new project awaits'}</small></Surface><Surface><StatLabel>EXPLORER INSIGNIAS</StatLabel><StatValue style={{marginTop:12}}>{explorers.length}</StatValue><small style={{color:'var(--color-text-muted)'}}>new routes discovered</small></Surface></Stats>
    <Grid $min="320px" $gap="15px" style={{marginBottom:16}}><ProgressAnalytics sends={ownSends} members={[member]} range={range} onRange={onRange} selectedGrade={selectedGrade} onGrade={onGrade} memberFilter={member.id} onMemberFilter={()=>{}} variant="personal" gradeDisplay={gradeDisplay}/><HighestLevelChart sends={ownSends.filter((send)=>selectedGrade==='all'||send.grade===selectedGrade)} range={range} gradeDisplay={gradeDisplay}/></Grid>
    <Grid $min="330px" $gap="16px"><Surface><Eyebrow>Grade breakdown</Eyebrow><SectionTitle style={{marginBottom:14}}>Sends by level</SectionTitle><Grid $min="120px" $gap="9px">{breakdown.map(({grade:level,count,points})=><GradeCard key={level}><GradePill grade={level} display={gradeDisplay} compact/><b style={{font:'700 20px var(--font-family-display)'}}>{count}<small style={{marginLeft:5,font:'11px var(--font-family-mono)',color:'var(--color-text-muted)'}}>sends</small></b><div className="bar" style={{background:count?GRADE_COLORS[level]:'var(--color-border)',width:`${count?Math.max(8,count/maxCount*100):0}%`}}/><small style={{color:'var(--color-text-muted)'}}>{points} points</small></GradeCard>)}</Grid></Surface>
      <Surface><Row style={{justifyContent:'space-between',marginBottom:10}}><div><Eyebrow>Recent sends</Eyebrow><SectionTitle>From the wall log</SectionTitle></div><Pill>{ownSends.length} total</Pill></Row>
        {ownSends.slice(0,10).map((send)=>{const problem=problemFor(send.problemId);return <SendRow key={send.id}><div><span className="title">{problem?.name??'Standalone manual send'}</span><div className="meta"><GradePill grade={send.grade} display={gradeDisplay} compact/> <span style={{marginLeft:6}}>{dateLabel(send.date)} · {send.attempt==='third-plus'?'3+ attempts':send.attempt==='second'?'2 attempts':'Flash'} · {send.points} pts {send.riskTaker?'· Risk Taker':''}</span></div></div>
          {(send.loggedBy??send.memberId)===currentMemberId&&<IconActions><Button aria-label={`Edit ${problem?.name??'send'}`} title="Edit send" $variant="quiet" onClick={()=>onEditSend(send)}><Icon name="edit" size={16}/></Button><Button aria-label={`Delete ${problem?.name??'send'}`} title="Delete send" $variant="quiet" onClick={()=>onDeleteSend(send)}><Icon name="trash" size={16}/></Button></IconActions>}</SendRow>})}
        {!ownSends.length&&<p style={{color:'var(--color-text-muted)'}}>No sends yet. Your next climbing day starts here.</p>}
      </Surface>
    </Grid>
    {explorers.length>0&&<Surface style={{marginTop:16}}><Eyebrow>Found and named</Eyebrow><SectionTitle>Explorer insignias</SectionTitle><Row $wrap style={{marginTop:13}}>{explorers.map((problem)=><Pill key={problem.id} $tone="orange"><Icon name="spark" size={14}/>{problem.name}</Pill>)}</Row></Surface>}
    {canManageAccount&&member.id===currentMemberId&&<Surface style={{marginTop:16}}><Eyebrow>Account & crew</Eyebrow><SectionTitle>Manage your membership</SectionTitle><p style={{color:'var(--color-text-muted)',fontSize:12}}>Leaving removes your crew access. Deleting your account removes your sends; problems you discovered remain in the global catalog anonymously.</p><Row $wrap><Button $variant="secondary" onClick={onLeaveCrew}>Leave Amurados</Button><Button $variant="danger" onClick={onDeleteAccount}>Delete account</Button></Row></Surface>}
  </>;
}
