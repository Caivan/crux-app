import type { Member } from '@crux/shared-types';
import styled from 'styled-components';
import { Eyebrow, Pill, SectionTitle, Surface } from '../../components/ui';
import { Icon } from '../../components/Icons';

type Standing = { member: Member; points: number; sends: number };

const PodiumCard = styled(Surface)<{ $place: number }>`
  min-width:0;display:grid;justify-items:center;align-content:end;gap:7px;padding:12px 6px 13px;text-align:center;
  min-height:${({$place})=>$place===1?'160px':'140px'};
  border-color:${({$place})=>$place===1?'#e4b847':$place===2?'#bec7d1':'#c9875b'};
  background:linear-gradient(180deg,${({$place})=>$place===1?'#fff8df':$place===2?'#f4f5f7':'#fff0e5'} 0%,var(--color-surface) 100%);
  cursor:pointer;.rank{font:700 10px var(--font-family-mono);letter-spacing:.08em;color:var(--color-text-muted)}
  .shoe{width:62px;height:42px}
  .name{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:700;color:var(--color-text-primary)}
  .points{font:700 14px var(--font-family-display);color:var(--color-text-primary)}
  .points small{font:10px var(--font-family-mono);color:var(--color-text-muted)}
  &:focus-visible{outline:3px solid var(--color-outline);outline-offset:2px}
`;
const Cards = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:end;gap:8px;margin-top:14px;`;
const Shoe = styled.svg`width:62px;height:42px;`;

function ClimbingShoe({color}:{color:string}){
  return <Shoe viewBox="0 0 80 52" aria-hidden="true" focusable="false">
    <ellipse cx="41" cy="47" rx="30" ry="2.5" fill="#493744" opacity=".15"/>
    <path d="M13 17q2-9 10-10l10 2 8 10q8 7 17 7l10 2q7 2 8 10l-4 5q-10 3-20 0l-11-3-23-1q-9-1-11-8l2-7Z" fill={color} stroke="#493744" strokeWidth="2.6" strokeLinejoin="round"/>
    <path d="M8 35q10 3 22 3l19 3q14 2 26-2l-2 5q-12 4-27 1l-20-2q-14-1-18-7Z" fill="#51405e" stroke="#493744" strokeWidth="2" strokeLinejoin="round"/>
    <path d="m25 12 8 5 9 4 8-1-3 7q-10 2-18-5l-7-5Zm15 9 8 2 5 5-8 3-7-5Zm12 5 8 1 5 5-9 3-6-5Z" fill="#fff4df" stroke="#493744" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M13 17q4-6 11-6m30 20q8-2 14 1M18 37q15 2 29 4" fill="none" stroke="#fff4df" strokeWidth="1.4" strokeLinecap="round" opacity=".8"/>
  </Shoe>;
}

const medals = [
  {place:2,color:'#bec7d1',label:'Silver'},
  {place:1,color:'#e4b847',label:'Gold'},
  {place:3,color:'#c9875b',label:'Bronze'},
];

export function MonthlyPodium({ standings, monthName, onViewProfile }:{standings:Standing[];monthName:string;onViewProfile:(id:string)=>void}){
  return <Surface>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
      <div><Eyebrow>Friendly competition</Eyebrow><SectionTitle>{monthName} podium</SectionTitle></div>
      <Pill $tone="orange"><Icon name="trophy" size={14}/>Resets monthly</Pill>
    </div>
    {standings.length?<Cards>{medals.map(({place,color,label})=>{
      const standing=standings[place-1];
      return standing?<PodiumCard as="button" type="button" $place={place} key={place} onClick={()=>onViewProfile(standing.member.id)} aria-label={`${label} place: ${standing.member.name}, ${standing.points} points`}>
        <span className="rank">{label.toUpperCase()}</span><ClimbingShoe color={color}/><span className="name">{standing.member.name}</span><span className="points">{standing.points} <small>pts</small></span>
      </PodiumCard>:<div key={place} aria-hidden="true"/>;
    })}</Cards>:<p style={{margin:'20px 0 2px',color:'var(--color-text-muted)'}}>Log a send to claim the first spot this month.</p>}
  </Surface>;
}
