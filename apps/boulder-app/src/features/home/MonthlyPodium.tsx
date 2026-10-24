import type { Member } from '@crux/shared-types';
import styled from 'styled-components';
import { Eyebrow, Pill, SectionTitle, Surface } from '../../components/ui';
import { Icon } from '../../components/Icons';

type Standing = { member: Member; points: number; sends: number };
type Place = { place: number; color: string; tint: string; label: string };

const Stage = styled.div`
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:end;gap:8px;margin-top:14px;
`;
const PodiumEntry = styled.button<{ $place:number; $color:string; $tint:string }>`
  min-width:0;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;
  padding:0 4px;border:0;background:transparent;text-align:center;cursor:pointer;
  .climber{display:grid;place-items:center;width:100%;height:88px;}
  .climber-icon{width:min(100%,100px);height:88px;overflow:visible;}
  .name{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:700;color:var(--color-text-primary)}
  .points{font:700 14px var(--font-family-display);color:var(--color-text-primary)}
  .points small{font:10px var(--font-family-mono);color:var(--color-text-muted)}
  &:focus-visible{outline:3px solid var(--color-outline);outline-offset:2px;border-radius:12px}
`;
const Pedestal = styled.span<{ $place:number; $color:string; $tint:string }>`
  position:relative;isolation:isolate;display:grid;place-items:center;width:100%;height:${({$place})=>$place===1?'92px':$place===2?'70px':'55px'};
  margin-top:4px;border:2px solid ${({$color})=>$color};border-bottom-width:5px;border-radius:10px 10px 3px 3px;
  background:linear-gradient(180deg,${({$tint})=>$tint} 0%,${({$color})=>$color} 100%);
  box-shadow:0 5px 0 #4937441a,inset 0 -8px 0 #49374412;
  &::before{content:'';position:absolute;z-index:-1;inset:0 0 auto;height:11px;border-bottom:1px solid ${({$color})=>$color};border-radius:7px 7px 0 0;background:#fff8ef99;}
  &::after{content:'';position:absolute;right:8px;bottom:9px;width:7px;height:7px;border:1px solid #49374455;border-radius:50%;background:#fff8ef99;}
  color:#493744;font:700 25px var(--font-family-display);text-shadow:0 1px #fff8ef88;
`;
const places:Place[]=[
  {place:2,color:'#bec7d1',tint:'#f0f2f5',label:'Silver'},
  {place:1,color:'#e4b847',tint:'#fff5d6',label:'Gold'},
  {place:3,color:'#c9875b',tint:'#f9e5d7',label:'Bronze'},
];

function PodiumClimber({color}:{color:string}){
  return <svg className="climber-icon" viewBox="0 0 112 92" role="img" aria-label="Climber reaching for a hold" focusable="false">
    <path d="m55 15 38 9 2 49-34 8-11-25Z" fill="#83b8ca" stroke="#49364f" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="m55 15 21 18 17-9M76 33 61 56l32 17M76 33l17 42" fill="none" stroke="#49364f" strokeWidth="1.6" strokeLinejoin="round" opacity=".8"/>
    <path d="m70 28 5-3 4 3-2 5-5 1Zm12 20 5-3 4 3-2 5-5 1Zm-17 5 4-3 4 3-2 4-5 1Z" fill={color} stroke="#49364f" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M32 57 22 75 11 80m33-17 13 7 12-9 8 3" fill="none" stroke="#49364f" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 57 22 75 11 80m33-17 13 7 12-9 8 3" fill="none" stroke="#d59a77" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m72 56 4-18 11-15 8-8" fill="none" stroke="#49364f" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m72 56 4-18 11-15 8-8" fill="none" stroke="#d59a77" strokeWidth="7.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m85 25 7-10q4-3 7 1l-2 5-7 7" fill="#d59a77" stroke="#49364f" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M34 43q10-6 20 1l16 13-5 14q-15 5-30-3L25 57Z" fill="#51405e" stroke="#49364f" strokeWidth="2.4" strokeLinejoin="round"/>
    <path d="m42 67 14 8 4 10-9 2-13-11m25-8 12-6 7 4-6 10-15 7" fill="#493744" stroke="#49364f" strokeWidth="2.4" strokeLinejoin="round"/>
    <path d="m41 77 10 8-1 4-11-2-5-5Zm31-3 7-9 7 2-3 8-7 5Z" fill={color} stroke="#49364f" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M24 39q-3-11 5-17 9-7 18 0 6 7 2 17l-6 7-12-1Z" fill="#d59a77" stroke="#49364f" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M22 35q-5-13 6-19 11-7 21 1 5 5 2 14l-5-2-3-7q-9 5-19 2Z" fill="#302a35" stroke="#49364f" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="35" cy="34" r="1.5" fill="#302a35"/><path d="M39 41q3 2 6 0" fill="none" stroke="#49364f" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>;
}

export function MonthlyPodium({ standings, monthName, onViewProfile }:{standings:Standing[];monthName:string;onViewProfile:(id:string)=>void}){
  return <Surface>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
      <div><Eyebrow>Friendly competition</Eyebrow><SectionTitle>{monthName} podium</SectionTitle></div>
      <Pill $tone="orange"><Icon name="trophy" size={14}/>Resets monthly</Pill>
    </div>
    {standings.length?<Stage>{places.map(({place,color,tint,label})=>{
      const standing=standings[place-1];
      return standing?<PodiumEntry as="button" type="button" $place={place} $color={color} $tint={tint} key={place} onClick={()=>onViewProfile(standing.member.id)} aria-label={`${label} place: ${standing.member.name}, ${standing.points} points`}>
        <span className="climber"><PodiumClimber color={color}/></span>
        <span className="name">{standing.member.name}</span>
        <span className="points">{standing.points} <small>pts</small></span>
        <Pedestal $place={place} $color={color} $tint={tint}>{place}</Pedestal>
      </PodiumEntry>:<div key={place} aria-hidden="true"/>;
    })}</Stage>:<p style={{margin:'20px 0 2px',color:'var(--color-text-muted)'}}>Log a send to claim the first spot this month.</p>}
  </Surface>;
}
