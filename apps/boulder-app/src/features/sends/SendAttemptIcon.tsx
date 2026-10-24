import type { AttemptCategory } from '@crux/shared-types';

export function SendAttemptIcon({kind}:{kind:AttemptCategory}){
  return <svg className="attempt-icon" viewBox="0 0 64 56" aria-hidden="true" focusable="false">
    <path d="M9 45 13 17l18-10 21 11 3 27-20 6Z" fill="#fff4df" stroke="#49364f" strokeWidth="2.4" strokeLinejoin="round"/>
    <path d="m13 18 19 12 20-12M32 30l3 21M32 30l-2-23" fill="none" stroke="#49364f" strokeWidth="1.5" strokeLinejoin="round" opacity=".72"/>
    {kind==='flash'&&<>
      <path d="m18 36 9-7 6 2 6-7 7 4" fill="none" stroke="#477b57" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3"/>
      <path d="m39 5 2.1 4.7L46 12l-4.9 2.2L39 19l-2.1-4.8L32 12l4.9-2.3Z" fill="#f2c84d" stroke="#49364f" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="m17 35 3-2 2 2-2 3-3-1Zm11-8 3-2 2 2-2 3-3-1Zm11-5 3-2 2 2-2 3-3-1Z" fill="#b8d850" stroke="#49364f" strokeWidth="1.3"/>
    </>}
    {kind==='second'&&<>
      <path d="m17 38 8-6 7-1 7-7 8 4" fill="none" stroke="#765187" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3"/>
      <path d="m18 35 4-3 4 2-1 5-5 1Zm11-9 4-3 4 2-1 5-5 1Zm12-5 4-3 4 2-1 5-5 1Z" fill="#e4b8d8" stroke="#49364f" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="48" cy="39" r="8" fill="#f4edcd" stroke="#49364f" strokeWidth="1.8"/><path d="M48 34v5l3 2" fill="none" stroke="#49364f" strokeWidth="1.8" strokeLinecap="round"/>
    </>}
    {kind==='third-plus'&&<>
      <path d="m17 38 8-6 7-1 7-7 8 4" fill="none" stroke="#b27366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3"/>
      <path d="m18 35 4-3 4 2-1 5-5 1Zm11-9 4-3 4 2-1 5-5 1Zm12-5 4-3 4 2-1 5-5 1Z" fill="#e4b8d8" stroke="#49364f" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M48 33q7 3 4 10m0-10-1 4-4-1" fill="none" stroke="#49364f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </>}
    <path d="M15 47q17 5 37-1" fill="none" stroke="#d7e987" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>;
}
