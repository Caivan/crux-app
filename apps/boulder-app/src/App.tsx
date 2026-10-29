import { useEffect, useMemo, useRef, useState } from 'react';
import { createCruxBackend } from '@crux/backend-services';
import { mediaQueries } from '@crux/design-system/breakpoints';
import type { AppSection, CruxData, GradeDisplay, Problem, Send } from '@crux/shared-types';
import { AppShell } from './components/AppShell';
import { Button } from './components/ui';
import { DEMO_DATA, DEMO_STORAGE_KEY } from './data/demoData';
import { withAwards } from './domain/analytics';
import { pointsForSend } from './domain/catalog';
import { HomePage } from './features/home/HomePage';
import { ProblemsPage } from './features/problems/ProblemsPage';
import { CrewPage } from './features/crew/CrewPage';
import { InviteDialog } from './features/crew/InviteDialog';
import { ProfilePage } from './features/profile/ProfilePage';
import { RouteScanDialog } from './features/problems/RouteScanDialog';
import { AuthScreen } from './features/auth/AuthScreen';
import { SendDialog, type SendDraft } from './features/sends/SendDialog';
import { GlobalStyle } from './styles/GlobalStyle';
import { cruxTheme } from './styles/theme';
import styled, { ThemeProvider } from 'styled-components';

type Dialog = { type:'send'; problem:Problem|null; edit:Send|null; lockProblem?:boolean } | { type:'scan' } | { type:'invite' } | null;
const DemoBanner=styled.div`display:flex;justify-content:space-between;align-items:flex-start;flex-direction:column;gap:12px;margin:-14px 0 20px;padding:9px 12px;border-radius:12px;background:#f4edcd;color:#6a5625;font-size:11px;.copy{color:#776d55}@media ${mediaQueries.md}{align-items:center;flex-direction:row}`;
const Toast=styled.div`position:fixed;z-index:40;bottom:88px;left:50%;transform:translateX(-50%);padding:11px 17px;border-radius:12px;background:var(--color-action-primary);color:white;box-shadow:var(--shadow-dialog);font-weight:700;`;

function loadData():CruxData{
  try{const saved=localStorage.getItem(DEMO_STORAGE_KEY);if(saved){const parsed=JSON.parse(saved) as CruxData;if(parsed?.crew&&Array.isArray(parsed.members)&&Array.isArray(parsed.problems)&&Array.isArray(parsed.sends))return parsed}}catch{/* Use the seeded local demo if storage is unavailable. */}
  return structuredClone(DEMO_DATA);
}

function invitationToken(value:string){
  const trimmed=value.trim();
  if(!trimmed)return '';
  try{if(trimmed.startsWith('http://')||trimmed.startsWith('https://'))return new URL(trimmed).searchParams.get('invite')??trimmed;}catch{/* Treat malformed pasted values as invite tokens; Supabase will report invalid tokens. */}
  if(trimmed.startsWith('invite='))return new URLSearchParams(trimmed).get('invite')??trimmed;
  return trimmed;
}

export default function App(){
  const backend=useMemo(()=>{const url=import.meta.env.VITE_SUPABASE_URL;const key=import.meta.env.VITE_SUPABASE_ANON_KEY;return url&&key?createCruxBackend(url,key):null},[]);
  const [authState,setAuthState]=useState<'demo'|'loading'|'signed-out'|'invite-required'|'live'|'error'>(backend?'loading':'demo');
  const [authUserId,setAuthUserId]=useState('');const [authError,setAuthError]=useState('');const inviteHandled=useRef<string|null>(null);
  const [data,setData]=useState<CruxData>(loadData);const [section,setSection]=useState<AppSection>('home');const [profileId,setProfileId]=useState<string|null>(null);
  const [dialog,setDialog]=useState<Dialog>(null);const [toast,setToast]=useState('');const [range,setRange]=useState<'week'|'month'|'year'>('week');
  const [profileGrade,setProfileGrade]=useState<import('@crux/shared-types').Grade|'all'>('all');
  const [gradeDisplay,setGradeDisplay]=useState<GradeDisplay>(()=>(localStorage.getItem('crux-grade-display') as GradeDisplay)||'color');
  const sends=useMemo(()=>withAwards(data.sends),[data.sends]);
  const currentMember=data.members.find((member)=>member.id===data.currentMemberId)!;
  const profileMember=data.members.find((member)=>member.id===(profileId??data.currentMemberId))??currentMember;
  useEffect(()=>{
    if(!backend)return;let active=true;
    const resolveSession=async(userId:string|null)=>{
      if(!active)return;
      if(!userId){setAuthUserId('');setAuthState('signed-out');setData(structuredClone(DEMO_DATA));return}
      setAuthUserId(userId);setAuthState('loading');setAuthError('');
      try{
        const invitation=new URLSearchParams(window.location.search).get('invite');
        if(invitation&&inviteHandled.current!==invitation){inviteHandled.current=invitation;await backend.auth.acceptInvitation(invitation);const url=new URL(window.location.href);url.searchParams.delete('invite');window.history.replaceState({},'',url)}
        const snapshot=await backend.crew.current(userId);
        if(!active)return;
        if(!snapshot){setAuthState('invite-required');return}
        setData(snapshot);setAuthState('live');
      }catch(error){if(active){setAuthError(error instanceof Error?error.message:'Could not load your crew.');setAuthState('error')}}
    };
    const {data:{subscription}}=backend.client.auth.onAuthStateChange((_event,session)=>{void resolveSession(session?.user.id??null)});
    void backend.client.auth.getSession().then(({data:{session},error})=>{if(error)throw error;return resolveSession(session?.user.id??null)}).catch((error:unknown)=>{if(active){setAuthError(error instanceof Error?error.message:'Could not connect to Supabase.');setAuthState('error')}});
    return()=>{active=false;subscription.unsubscribe()};
  },[backend]);
  useEffect(()=>{if(authState!=='demo')return;try{localStorage.setItem(DEMO_STORAGE_KEY,JSON.stringify(data))}catch{/* Local demo persistence is best effort. */}},[data,authState]);
  useEffect(()=>{try{localStorage.setItem('crux-grade-display',gradeDisplay)}catch{/* Preference can be reset on reload if storage is blocked. */}},[gradeDisplay]);
  const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(''),2600)};
  const navigate=(next:AppSection)=>{setSection(next);if(next!=='profile')setProfileId(null);else setProfileId(data.currentMemberId)};
  const showProfile=(memberId:string)=>{setProfileId(memberId);setSection('profile');setRange('week')};
  const logSend=()=>setDialog({type:'send',problem:null,edit:null});
  const reloadLiveData=async()=>{if(!backend||!authUserId)return;const snapshot=await backend.crew.current(authUserId);if(!snapshot)throw new Error('You are no longer a member of this crew.');setData(snapshot)};
  const createSend=async(draft:SendDraft,editId?:string)=>{
    try{
      if(backend&&authState==='live'){
        if(editId)await backend.sends.update({sendId:editId,grade:draft.grade,attempt:draft.attempt});
        else await backend.sends.create({crewId:data.crew.id,memberId:draft.memberId,problemId:draft.problemId,grade:draft.grade,attempt:draft.attempt,date:draft.date});
        await reloadLiveData();notify(editId?'Your send was updated. Points recalculated.':'Send logged. Nice work!');
      }else if(editId){setData((current)=>({...current,sends:current.sends.map((send)=>send.id===editId?{...send,grade:send.problemId?current.problems.find((problem)=>problem.id===send.problemId)?.grade??draft.grade:draft.grade,attempt:draft.attempt,points:pointsForSend(draft.grade,draft.attempt),date:send.date}:send)}));notify('Your send was updated. Points recalculated.');}
      else{const send:Send={id:crypto.randomUUID(),memberId:draft.memberId,loggedBy:data.currentMemberId,crewId:data.crew.id,problemId:draft.problemId,grade:draft.grade,attempt:draft.attempt,date:draft.date,loggedAt:new Date().toISOString(),points:pointsForSend(draft.grade,draft.attempt),riskTaker:false};setData((current)=>({...current,sends:[...current.sends,send]}));notify('Send logged. Nice work!');}
      setDialog(null);
    }catch(error){notify(error instanceof Error?error.message:'Could not save the send.')}
  };
  const saveScannedProblem=async(problem:Problem,draft:SendDraft|null)=>{
    const created={...problem,creatorId:data.currentMemberId,explorerIds:[data.currentMemberId]};
    try{
      if(backend&&authState==='live'){
        const saved=await backend.problems.create({name:created.name,grade:created.grade,qrIdentifier:created.qrIdentifier!,routeUrl:created.routeUrl!}) as {id:string};
        if(draft)await backend.sends.create({crewId:data.crew.id,memberId:draft.memberId,problemId:saved.id,grade:created.grade,attempt:draft.attempt,date:draft.date});
        await reloadLiveData();
      }else setData((current)=>{const newSend=draft?{id:crypto.randomUUID(),memberId:draft.memberId,loggedBy:current.currentMemberId,crewId:current.crew.id,problemId:created.id,grade:created.grade,attempt:draft.attempt,date:draft.date,loggedAt:new Date().toISOString(),points:pointsForSend(created.grade,draft.attempt),riskTaker:false}:null;return {...current,problems:[created,...current.problems],sends:newSend?[...current.sends,newSend]:current.sends}});
      setDialog(null);notify(draft?'Problem added and send logged. Explorer unlocked!':'Problem added. Explorer unlocked!');
    }catch(error){notify(error instanceof Error?error.message:'Could not add the problem.')}
  };
  const deleteSend=async(send:Send)=>{
    if(!window.confirm('Delete this send? Points and awards will be recalculated.'))return;
    try{if(backend&&authState==='live'){await backend.sends.remove(send.id);await reloadLiveData()}else setData((current)=>({...current,sends:current.sends.filter((item)=>item.id!==send.id)}));notify('Send removed.')}catch(error){notify(error instanceof Error?error.message:'Could not delete the send.')}
  };
  const beginEdit=(send:Send)=>setDialog({type:'send',problem:null,edit:send});
  const openExisting=(problem:Problem)=>{setDialog({type:'send',problem,edit:null,lockProblem:true});notify(`${problem.name} is already in the catalog.`)};
  const signIn=async(token='')=>{if(!backend)return;try{if(token){const url=new URL(window.location.href);url.searchParams.set('invite',invitationToken(token));window.history.replaceState({},'',url)}await backend.auth.signInWithGoogle()}catch(error){setAuthError(error instanceof Error?error.message:'Google sign-in could not start.');setAuthState('error')}};
  const acceptInvite=async(token:string)=>{if(!backend||!authUserId)return;try{const inviteToken=invitationToken(token);await backend.auth.acceptInvitation(inviteToken);const url=new URL(window.location.href);url.searchParams.delete('invite');window.history.replaceState({},'',url);const snapshot=await backend.crew.current(authUserId);if(!snapshot)throw new Error('Invitation accepted, but the crew could not be loaded.');setData(snapshot);setAuthState('live')}catch(error){setAuthError(error instanceof Error?error.message:'Could not accept the invitation.');setAuthState('error')}};
  const signOut=async()=>{if(!backend)return;await backend.auth.signOut();setData(structuredClone(DEMO_DATA));setSection('home');setProfileId(null)};
  const createInvite=async()=>backend&&authState==='live'?backend.invitations.create(data.crew.id):null;
  const removeMember=async(memberId:string)=>{if(!window.confirm('Remove this climber from Amurados?'))return;try{if(backend&&authState==='live'){await backend.crew.removeMember(data.crew.id,memberId);await reloadLiveData()}else setData((current)=>({...current,members:current.members.filter((member)=>member.id!==memberId),crew:{...current.crew,memberIds:current.crew.memberIds.filter((id)=>id!==memberId)}}));notify('Crew membership updated.')}catch(error){notify(error instanceof Error?error.message:'Could not remove the member.')}};
  const leaveCrew=async()=>{if(!window.confirm('Leave Amurados? You will lose access to crew activity.'))return;try{if(backend&&authState==='live'){await backend.crew.leave(data.crew.id);await signOut()}else{notify('Leaving a shared crew requires the Supabase backend.');return}}catch(error){notify(error instanceof Error?error.message:'Could not leave the crew.')}};
  const deleteAccount=async()=>{if(!window.confirm('Delete your account and all of your sends? Problems you created will stay in the global catalog anonymously. This cannot be undone.'))return;try{if(backend&&authState==='live'){await backend.crew.deleteAccount();await signOut()}else notify('Account deletion requires the Supabase backend.')}catch(error){notify(error instanceof Error?error.message:'Could not delete the account.')}};
  if(backend&&authState!=='live')return <ThemeProvider theme={cruxTheme}><GlobalStyle/><AuthScreen status={authState==='demo'?'signed-out':authState} error={authError} onGoogleSignIn={(token)=>void signIn(token)} onAcceptInvite={(token)=>void acceptInvite(token)}/></ThemeProvider>;
  
  return <ThemeProvider theme={cruxTheme}><GlobalStyle/><AppShell data={data} section={section} onNavigate={navigate} onInvite={()=>setDialog({type:'invite'})} onLogSend={logSend} onSignOut={authState==='live'?()=>void signOut():undefined} gradeDisplay={gradeDisplay} onGradeDisplay={setGradeDisplay}>
    {authState!=='live'&&<DemoBanner>
      <b>{'DEMO MODE · saved on this device'}</b>
      <span className="copy">
        {'Connect Supabase to use Google sign-in and share Amurados data across devices.'}
      </span>
    </DemoBanner>}
    
    {section==='home'&&<HomePage data={data} sends={sends} members={data.members} onLogSend={logSend} onScan={()=>setDialog({type:'scan'})} onNavigate={navigate} onViewProfile={showProfile}/>}
    {section==='problems'&&<ProblemsPage data={data} sends={sends} members={data.members} currentMemberId={data.currentMemberId} gradeDisplay={gradeDisplay} onScan={()=>setDialog({type:'scan'})} onManualSend={logSend} onLogProblemSend={(problem)=>setDialog({type:'send',problem,edit:null,lockProblem:true})}/>}
    {section==='crew'&&<CrewPage data={data} members={data.members} sends={sends} onInvite={()=>setDialog({type:'invite'})} onViewProfile={showProfile} onRemoveMember={(id)=>void removeMember(id)} gradeDisplay={gradeDisplay}/>}
    {section==='profile'&&<ProfilePage member={profileMember} sends={sends} problems={data.problems} currentMemberId={data.currentMemberId} gradeDisplay={gradeDisplay} onEditSend={beginEdit} onDeleteSend={(send)=>void deleteSend(send)} onLogSend={logSend} onRange={setRange} range={range} selectedGrade={profileGrade} onGrade={setProfileGrade} canManageAccount={authState==='live'} onLeaveCrew={()=>void leaveCrew()} onDeleteAccount={()=>void deleteAccount()}/>}
    {dialog?.type==='send'&&<SendDialog data={data} sends={sends} edit={dialog.edit} problem={dialog.problem} gradeDisplay={gradeDisplay} lockProblem={dialog.lockProblem} onClose={()=>setDialog(null)} onSave={createSend}/>}
    {dialog?.type==='scan'&&<RouteScanDialog problems={data.problems} members={data.members} currentMemberId={data.currentMemberId} onClose={()=>setDialog(null)} onExisting={openExisting} onCreate={saveScannedProblem}/>}
    {dialog?.type==='invite'&&<InviteDialog crewName={data.crew.name} onClose={()=>setDialog(null)} onCreateInvite={createInvite}/>}
    {toast&&<Toast role="status">{toast}<Button $variant="quiet" aria-label="Dismiss" onClick={()=>setToast('')} style={{marginLeft:8,color:'white'}}>×</Button></Toast>}
  </AppShell></ThemeProvider>;
}
