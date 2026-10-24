import { Avatar, HoldIcon } from '@crux/design-system';
import { mediaQueries } from '@crux/design-system/breakpoints';
import type { CruxData, Member, Send } from '@crux/shared-types';
import styled from 'styled-components';
import { monthlyLeaderboard } from '../../domain/analytics';
import { GRADE_COLORS, GRADES } from '../../domain/catalog';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, PageDescription, PageTitle, Pill, Row, Surface } from '../../components/ui';

const Header=styled.div`display:flex;justify-content:space-between;align-items:flex-start;flex-direction:column;gap:16px;margin:10px 0 24px;@media ${mediaQueries.md}{align-items:flex-end;flex-direction:row}`;
const TableWrap=styled(Surface)`padding:0;overflow:hidden;`;
const Scroll=styled.div`overflow:auto;`;
const Table=styled.table`width:100%;min-width:760px;border-collapse:collapse;text-align:left;thead{background:var(--color-surface-subtle)}th{padding:13px 12px;color:var(--color-text-muted);font:500 10px var(--font-family-mono);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}td{padding:13px 12px;border-top:1px solid var(--color-border);font-size:12px}.grade-head{text-align:center}.grade-head span{display:grid;justify-items:center;gap:3px}.grade-head .hold-icon{width:32px;height:29px}.num{text-align:center;font:600 13px var(--font-family-mono)}.member-button{display:flex;align-items:center;gap:10px;border:0;background:transparent;text-align:left;cursor:pointer}.member-name{display:block;font-weight:700}.member-role{display:block;color:var(--color-text-muted);font-size:11px}.points{font:700 16px var(--font-family-display)}`;
const Legend=styled.div`display:flex;gap:9px;flex-wrap:wrap;margin:15px 0;color:var(--color-text-muted);font-size:12px;`;
const LeaderCard=styled(Surface)`display:flex;align-items:center;gap:12px;`;

export function CrewPage({data,members,sends,onInvite,onViewProfile,onRemoveMember,gradeDisplay}:{data:CruxData;members:Member[];sends:Send[];onInvite:()=>void;onViewProfile:(id:string)=>void;onRemoveMember:(id:string)=>void;gradeDisplay:'color'|'fontainebleau'|'vscale'}){
  const sorted=monthlyLeaderboard(members,sends);const sendCount=sends.length;
  const isAdmin=data.crew.adminIds.includes(data.currentMemberId);
  const monthName=new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'});
  return <>
    <Header><div><Eyebrow>Same wall, different ways up</Eyebrow><PageTitle>Your <span>crew</span></PageTitle><PageDescription>{data.crew.name} has sent {sendCount} problems together. Celebrate the progress, one hold at a time.</PageDescription></div>
      {data.members.find((member)=>member.id===data.currentMemberId)?.role==='admin'&&<Button onClick={onInvite}><Icon name="add"/>Invite a friend</Button>}</Header>
    <Row $wrap style={{marginBottom:18}}><Pill $tone="green">{members.length} climbers</Pill><Pill $tone="orange"><Icon name="trophy" size={14}/>{monthName} standings</Pill><Pill>{sendCount} total sends</Pill></Row>
    <TableWrap><Scroll><Table><thead><tr><th>Climber</th><th>Monthly points</th><th>Sends</th>{GRADES.map(({grade})=><th key={grade} className="grade-head"><span><HoldIcon grade={grade}/>{gradeDisplay==='color'?grade:gradeDisplay==='fontainebleau'?GRADES.find((item)=>item.grade===grade)?.fontainebleau:GRADES.find((item)=>item.grade===grade)?.vscale}</span></th>)}{isAdmin&&<th>Admin</th>}</tr></thead>
      <tbody>{sorted.map(({member,points,sends:count},index)=>{const memberSends=sends.filter((send)=>send.memberId===member.id);return <tr key={member.id}><td><button className="member-button" onClick={()=>onViewProfile(member.id)}><span className="avatar-wrap"><Avatar person={member}/></span><span><span className="member-name">{member.name}{member.id===data.currentMemberId?' · You':''}</span><span className="member-role">{member.role==='admin'?'Crew admin':`Crew member · #${index+1}`}</span></span></button></td><td className="points">{points} pts</td><td className="num">{count}</td>{GRADES.map(({grade})=><td className="num" key={grade} style={{color:memberSends.some((send)=>send.grade===grade)?GRADE_COLORS[grade]:'var(--color-text-muted)'}}>{memberSends.filter((send)=>send.grade===grade).length}</td>)}{isAdmin&&<td>{member.id!==data.currentMemberId&&member.role!=='admin'&&<Button $variant="quiet" onClick={()=>onRemoveMember(member.id)}>Remove</Button>}</td>}</tr>})}</tbody>
    </Table></Scroll></TableWrap>
    <Legend><span>Monthly points use sends dated in the current calendar month.</span><span>·</span><span>Grade counts show all recorded crew sends.</span></Legend>
    <div style={{marginTop:24}}><Row style={{justifyContent:'space-between',marginBottom:11}}><div><Eyebrow>On the wall this month</Eyebrow><h2 style={{margin:0,font:'700 18px var(--font-family-display)'}}>Top senders</h2></div><Pill $tone="green">A fresh board each month</Pill></Row>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10}}>{sorted.slice(0,5).map(({member,points,sends:count},index)=><LeaderCard key={member.id}><Pill $tone={index===0?'orange':'plum'}>#{index+1}</Pill><span className="avatar-wrap"><Avatar person={member}/></span><div style={{flex:1,minWidth:0}}><b>{member.name}</b><div style={{fontSize:11,color:'var(--color-text-muted)'}}>{count} sends</div></div><b>{points}<small style={{display:'block',font:'10px var(--font-family-mono)',color:'var(--color-text-muted)'}}>pts</small></b></LeaderCard>)}</div>
    </div>
  </>;
}
