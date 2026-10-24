import { Avatar } from '@crux/design-system';
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
  .climber .avatar{width:64px!important;height:64px!important;border:3px solid ${({$color})=>$color};border-radius:50%;box-shadow:0 3px 0 ${({$color})=>$color}55;}
  .climber .svg-markup{display:block;width:64px;height:64px;}
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

export function MonthlyPodium({ standings, monthName, onViewProfile }:{standings:Standing[];monthName:string;onViewProfile:(id:string)=>void}){
  return <Surface>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
      <div><Eyebrow>Friendly competition</Eyebrow><SectionTitle>{monthName} podium</SectionTitle></div>
      <Pill $tone="orange"><Icon name="trophy" size={14}/>Resets monthly</Pill>
    </div>
    {standings.length?<Stage>{places.map(({place,color,tint,label})=>{
      const standing=standings[place-1];
      return standing?<PodiumEntry as="button" type="button" $place={place} $color={color} $tint={tint} key={place} onClick={()=>onViewProfile(standing.member.id)} aria-label={`${label} place: ${standing.member.name}, ${standing.points} points`}>
        <span className="climber"><Avatar person={standing.member}/></span>
        <span className="name">{standing.member.name}</span>
        <span className="points">{standing.points} <small>pts</small></span>
        <Pedestal $place={place} $color={color} $tint={tint}>{place}</Pedestal>
      </PodiumEntry>:<div key={place} aria-hidden="true"/>;
    })}</Stage>:<p style={{margin:'20px 0 2px',color:'var(--color-text-muted)'}}>Log a send to claim the first spot this month.</p>}
  </Surface>;
}
