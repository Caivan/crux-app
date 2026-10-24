import { useState } from 'react';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Input, ModalBackdrop, ModalCard, Row, SectionTitle } from '../../components/ui';

export function InviteDialog({crewName,onClose,onCreateInvite}:{crewName:string;onClose:()=>void;onCreateInvite:()=>Promise<{token:string;expiresAt:string}|null>}){
  const [copied,setCopied]=useState(false);const [inviteUrl,setInviteUrl]=useState('');const [expiresAt,setExpiresAt]=useState('');const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  const create=async()=>{setBusy(true);setMessage('');try{const invite=await onCreateInvite();if(!invite){setMessage('Invitation links need the configured Supabase backend. The local demo cannot issue or validate crew invites.');return}const url=new URL('/',window.location.origin);url.searchParams.set('invite',invite.token);setInviteUrl(url.toString());setExpiresAt(new Date(invite.expiresAt).toLocaleDateString('en-US',{month:'short',day:'numeric'}))}catch(error){setMessage(error instanceof Error?error.message:'Could not create the invitation.')}finally{setBusy(false)}};
  const copy=async()=>{try{await navigator.clipboard.writeText(inviteUrl);setCopied(true)}catch{setMessage('Clipboard access failed. Select the invitation link and copy it manually.')}};
  return <ModalBackdrop onMouseDown={(event)=>{if(event.target===event.currentTarget)onClose()}}><ModalCard role="dialog" aria-modal="true" aria-labelledby="invite-title">
    <Eyebrow>Bring a friend to the wall</Eyebrow><SectionTitle id="invite-title" style={{fontSize:26}}>Invite to {crewName}</SectionTitle><p style={{color:'var(--color-text-muted)'}}>This is a single-use invitation link that expires in seven days. Members sign in with Google before joining the crew.</p>
    {inviteUrl?<><Input aria-label="Invitation link" value={inviteUrl} readOnly onFocus={(event)=>event.currentTarget.select()}/><small style={{display:'block',marginTop:10,color:'var(--color-text-muted)'}}>Expires {expiresAt} · one climber can use it</small></>:<p style={{fontSize:12,color:'var(--color-text-muted)'}}>Each invite is random, single-use, and valid for seven days.</p>}
    {message&&<p role="alert" style={{fontSize:12,color:'#9b4148'}}>{message}</p>}
    <Row style={{justifyContent:'flex-end',marginTop:15}}><Button $variant="secondary" onClick={onClose}>Close</Button>{inviteUrl?<Button onClick={()=>void copy()}><Icon name="link"/>{copied?'Copied link':'Copy invite link'}</Button>:<Button disabled={busy} onClick={()=>void create()}>{busy?'Creating…':'Create invite'}</Button>}</Row>
  </ModalCard></ModalBackdrop>;
}
