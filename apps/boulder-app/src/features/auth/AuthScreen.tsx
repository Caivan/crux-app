import { useState } from 'react';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Field, Input, PageTitle, Pill, Surface } from '../../components/ui';
import styled from 'styled-components';

const Screen=styled.main`min-height:100vh;display:grid;place-items:center;padding:20px;background:radial-gradient(ellipse at top left,#f3e8f4 0%,transparent 54%),var(--color-canvas);`;
const Panel=styled(Surface)`width:min(100%,470px);padding:clamp(24px,5vw,40px);`;
const Logo=styled.div`display:flex;align-items:center;gap:9px;margin-bottom:26px;font:700 21px var(--font-family-display);letter-spacing:-.06em;`;
const Mark=styled.span`display:grid;width:34px;height:34px;place-items:center;border-radius:11px;background:var(--primitive-color-lime-400);transform:rotate(-7deg);`;

export function AuthScreen({status,error,onGoogleSignIn,onAcceptInvite}:{status:'loading'|'signed-out'|'invite-required'|'error';error:string;onGoogleSignIn:(token?:string)=>void;onAcceptInvite:(token:string)=>void}){
  const [token,setToken]=useState(()=>new URLSearchParams(window.location.search).get('invite')??'');
  return <Screen><Panel><Logo><Mark>C</Mark>crux<span style={{color:'var(--color-highlight-strong)'}}>.</span><Pill $tone="green">CRUX HALLE</Pill></Logo>
    <Eyebrow>Climb together</Eyebrow><PageTitle>Find your <span>crew.</span></PageTitle>
    <p style={{color:'var(--color-text-muted)',lineHeight:1.65}}>A private home for your sends, the problems you discover, and the friends you climb with.</p>
    {status==='loading'?<p role="status">Checking your crew membership…</p>:<>
      {status==='invite-required'&&<p style={{padding:12,borderRadius:11,background:'var(--color-surface-subtle)',fontSize:13}}>You’re signed in, but haven’t joined a crew yet. Ask an Amurados admin for an invitation link.</p>}
      {status==='error'&&<p role="alert" style={{padding:12,borderRadius:11,background:'#fff0eb',color:'#8b3737',fontSize:13}}>{error||'We could not validate your invitation.'}</p>}
      {status==='signed-out'&&<><Field>Invitation code (if you have one)<Input value={token} onChange={(event)=>setToken(event.target.value)} placeholder="Paste your crew invite link or code"/></Field><Button $wide style={{marginTop:15}} onClick={()=>onGoogleSignIn(token)}><span style={{fontWeight:800}}>G</span>Continue with Google</Button></>}
      {status==='invite-required'&&<Field>Invitation code<Input value={token} onChange={(event)=>setToken(event.target.value)} placeholder="Paste your crew invite link or code"/></Field>}
      {status==='invite-required'&&<Button $wide style={{marginTop:14}} disabled={!token.trim()} onClick={()=>onAcceptInvite(token.trim())}>Join crew<Icon name="arrow"/></Button>}
      {status==='error'&&<><Field>Invitation code<Input value={token} onChange={(event)=>setToken(event.target.value)} placeholder="Paste your crew invite link or code"/></Field><Button $wide style={{marginTop:12}} disabled={!token.trim()} onClick={()=>onAcceptInvite(token.trim())}>Try invitation again<Icon name="arrow"/></Button><Button $wide $variant="secondary" style={{marginTop:9}} onClick={()=>onGoogleSignIn(token)}><span style={{fontWeight:800}}>G</span>Continue with Google</Button></>}
    </>}
    <small style={{display:'block',marginTop:20,color:'var(--color-text-muted)'}}>Private by invitation · Google sign-in · made for the days you show up</small>
  </Panel></Screen>;
}
