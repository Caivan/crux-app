import type { AttemptCategory, Grade, Member, Problem } from '@crux/shared-types';
import { useEffect, useRef, useState } from 'react';
import { localDateString } from '../../domain/date';
import { Icon } from '../../components/Icons';
import { Button, Eyebrow, Field, Input, ModalBackdrop, ModalCard, Pill, Row, SectionTitle, Stack } from '../../components/ui';
import type { SendDraft } from '../sends/SendDialog';
import { DialogFooter, SendFormFields } from '../sends/SendFormFields';
import { GradePicker } from '../sends/GradePicker';

const DEFAULT_NAMES=['Gravity snacks','Mushroom kingdom','Tiny victories','Chalk and awe','Good noodles','Purple haze','Side quest'];
export function routeIdentifier(raw:string):string|null{
  try{const url=new URL(raw.trim());if(url.protocol!=='https:'&&url.protocol!=='http:')return null;const segment=url.pathname.replace(/\/+$/,'').split('/').filter(Boolean).at(-1);return segment||null}catch{return null}
}

interface BarcodeResult { rawValue:string }
interface BarcodeScanner { detect(video:HTMLVideoElement):Promise<BarcodeResult[]> }
interface BarcodeScannerConstructor { new(options?:{formats:string[]}):BarcodeScanner }
declare global { interface Window { BarcodeDetector?:BarcodeScannerConstructor } }

export function RouteScanDialog({problems,members,currentMemberId,onClose,onExisting,onCreate}:{problems:Problem[];members:Member[];currentMemberId:string;onClose:()=>void;onExisting:(problem:Problem)=>void;onCreate:(problem:Problem,send:SendDraft|null)=>void}){
  const [url,setUrl]=useState('');const [identifier,setIdentifier]=useState('');const [grade,setGrade]=useState<Grade>('Green');const [name,setName]=useState('');const [logSend,setLogSend]=useState(true);const [memberId,setMemberId]=useState(currentMemberId);const [attempt,setAttempt]=useState<AttemptCategory>('flash');const [date,setDate]=useState(localDateString());const [error,setError]=useState('');const [camera,setCamera]=useState(false);const [cameraMessage,setCameraMessage]=useState('');
  const videoRef=useRef<HTMLVideoElement>(null);
  const checkUrl=(value:string)=>{const routeId=routeIdentifier(value);if(!routeId){setError('That URL does not contain a route identifier.');setIdentifier('');return}setError('');setUrl(value.trim());setIdentifier(routeId);const existing=problems.find((problem)=>problem.qrIdentifier===routeId);if(existing){onExisting(existing);return}setName(`${DEFAULT_NAMES[Math.floor(Math.random()*DEFAULT_NAMES.length)]}`)};
  useEffect(()=>{
    if(!camera)return;let stream:MediaStream|null=null;let timer:number|undefined;let cancelled=false;
    const start=async()=>{if(!window.BarcodeDetector){setCameraMessage('QR camera scanning is not supported in this browser. Paste the route link below.');return}if(!navigator.mediaDevices?.getUserMedia){setCameraMessage('Camera access is unavailable. Paste the route link below.');return}
      try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});if(cancelled)return;const video=videoRef.current;if(!video)return;video.srcObject=stream;await video.play();const detector=new window.BarcodeDetector({formats:['qr_code']});setCameraMessage('Hold the route QR code inside the frame.');timer=window.setInterval(async()=>{if(!video||video.readyState<2)return;try{const found=await detector.detect(video);if(found[0]?.rawValue){checkUrl(found[0].rawValue);setCamera(false)}}catch{/* Camera frame not ready; keep scanning. */}},350)}catch{setCameraMessage('Camera permission was not granted. Paste the route link below.')}
    };void start();return()=>{cancelled=true;if(timer)window.clearInterval(timer);stream?.getTracks().forEach((track)=>track.stop())};
  },[camera]);
  const submit=(event:React.FormEvent<HTMLFormElement>)=>{event.preventDefault();const routeId=routeIdentifier(url);if(!routeId){setError('Enter a valid route QR URL first.');return}const problem:Problem={id:`problem-${crypto.randomUUID()}`,name:name.trim()||'New route',grade,createdAt:date,creatorId:currentMemberId,qrIdentifier:routeId,routeUrl:url,explorerIds:[currentMemberId]};onCreate(problem,logSend?{memberId,problemId:problem.id,grade,attempt,date}:null)};
  return <ModalBackdrop onMouseDown={(event)=>{if(event.target===event.currentTarget)onClose()}}><ModalCard as="form" role="dialog" aria-modal="true" aria-labelledby="scan-title" onSubmit={submit}>
    <Row style={{justifyContent:'space-between',alignItems:'flex-start'}}><div><Eyebrow>Find or add a route</Eyebrow><SectionTitle id="scan-title" style={{fontSize:26}}>Scan a wall QR</SectionTitle><p style={{margin:'7px 0 0',color:'var(--color-text-muted)'}}>Crux Club checks the global catalog before creating a problem.</p></div><Button type="button" $variant="quiet" aria-label="Close" onClick={onClose}><Icon name="close"/></Button></Row>
    <Stack $gap="13px" style={{marginTop:18}}>
      {camera&&<div style={{position:'relative',overflow:'hidden',borderRadius:15,background:'#211d24'}}><video ref={videoRef} muted playsInline style={{width:'100%',maxHeight:220,objectFit:'cover'}}/><div style={{position:'absolute',inset:'15% 18%',border:'2px solid #e6f1e8',borderRadius:14,boxShadow:'0 0 0 999px #0005'}}/><p style={{position:'absolute',bottom:4,left:12,right:12,color:'white',fontSize:12,textShadow:'0 1px 4px #000'}}>{cameraMessage}</p></div>}
      <Row $wrap><Button type="button" $variant={camera?'secondary':'quiet'} onClick={()=>setCamera((value)=>!value)}><Icon name="scan"/>{camera?'Stop camera':'Open camera'}</Button><small style={{color:'var(--color-text-muted)'}}>Camera use stays in this browser.</small></Row>
      <Field>Route QR URL<Input type="url" value={url} onChange={(event)=>{setUrl(event.target.value);setError('');setIdentifier('')}} onBlur={(event)=>{if(event.target.value.trim())checkUrl(event.target.value)}} placeholder="https://beta7.app/route/…" required/></Field>
      {error&&<p role="alert" style={{margin:0,color:'#a84f54',fontSize:12}}>{error}</p>}
      {identifier&&<Pill $tone="green">Route code · {identifier}</Pill>}
      {identifier&&<>
        <Field>Problem name<Input value={name} maxLength={50} onChange={(event)=>setName(event.target.value)} required/></Field>
        <Field as="div">Hold color / level<GradePicker value={grade} onChange={setGrade}/></Field>
        <Pill $tone="orange"><Icon name="spark" size={14}/>Explorer · adds an insignia, not points</Pill>
        <label style={{display:'flex',alignItems:'center',gap:9,fontSize:13}}><input type="checkbox" checked={logSend} onChange={(event)=>setLogSend(event.target.checked)}/> Log a send while creating the problem</label>
        {logSend&&<SendFormFields members={members} currentMemberId={currentMemberId} memberId={memberId} onMemberId={setMemberId} attempt={attempt} onAttempt={setAttempt} date={date} onDate={setDate} grade={grade} firstSend/>}
      </>}
    </Stack>
    <DialogFooter><Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={!identifier}>{logSend?'Create problem + send':'Create problem'}</Button></DialogFooter>
  </ModalCard></ModalBackdrop>;
}
