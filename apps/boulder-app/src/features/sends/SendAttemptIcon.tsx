import type { AttemptCategory } from '@crux/shared-types';

export function SendAttemptIcon({kind}:{kind:AttemptCategory}){
  return <svg className="attempt-icon" viewBox="0 0 64 56" aria-hidden="true" focusable="false">
    <path d="M9 45 13 17l18-10 21 11 3 27-20 6Z" fill="#fff4df" stroke="#49364f" strokeWidth="2.4" strokeLinejoin="round"/>
    <path d="m13 18 19 12 20-12M32 30l3 21M32 30l-2-23" fill="none" stroke="#49364f" strokeWidth="1.5" strokeLinejoin="round" opacity=".72"/>
    {kind==='flash'&&<>
      <path d="m18 36 9-7 6 2 6-7 7 4" fill="none" stroke="#477b57" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3"/>
      <path d="m43 4-8 11h6l-4 10 13-15h-7l4-6Z" fill="#f2c84d" stroke="#49364f" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="m32 9 1.2 2.7 2.8 1.3-2.8 1.2L32 17l-1.2-2.8-2.8-1.2 2.8-1.3Z" fill="#fff4df" stroke="#49364f" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="m17 35 3-2 2 2-2 3-3-1Zm11-8 3-2 2 2-2 3-3-1Zm11-5 3-2 2 2-2 3-3-1Z" fill="#b8d850" stroke="#49364f" strokeWidth="1.3"/>
    </>}
    {kind==='second'&&<>
      <path d="m17 38 8-6 7-1 7-7 8 4" fill="none" stroke="#765187" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3"/>
      <path d="m18 35 4-3 4 2-1 5-5 1Zm11-9 4-3 4 2-1 5-5 1Zm12-5 4-3 4 2-1 5-5 1Z" fill="#e4b8d8" stroke="#49364f" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="m43 20 1-6h8l1 6-5 4Z" fill="#d9e0e8" stroke="#49364f" strokeWidth="1.5" strokeLinejoin="round"/><path d="m44 19-3 3 4 1m6-4 3 3-4 1" fill="#bec7d1" stroke="#49364f" strokeWidth="1.3" strokeLinejoin="round"/>
      <circle cx="48" cy="13" r="8" fill="#dce2e9" stroke="#49364f" strokeWidth="1.7"/>
      <path d="M42 14q0-3 3-4l3 1 2-2 3 2-1 3-2 2-3 0-2 2-3-1Z" fill="#a78daf" stroke="#49364f" strokeWidth="1.2" strokeLinejoin="round"/>
    </>}
    {kind==='third-plus'&&<>
      <path d="m17 38 8-6 7-1 7-7 8 4" fill="none" stroke="#b27366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3"/>
      <path d="m18 35 4-3 4 2-1 5-5 1Zm11-9 4-3 4 2-1 5-5 1Zm12-5 4-3 4 2-1 5-5 1Z" fill="#e4b8d8" stroke="#49364f" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M41 39q0-7 7-7t7 7v4H41Z" fill="#9fc77a" stroke="#49364f" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M43 36q5-5 10 0m-8 2h.1m5 0h.1M43 43l-2 2m5-2v2m4-2v2m3-2 2 2m-15-5-3 1" fill="none" stroke="#49364f" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="56" cy="35" r="2.4" fill="#9fc77a" stroke="#49364f" strokeWidth="1.4"/>
    </>}
    <path d="M15 47q17 5 37-1" fill="none" stroke="#d7e987" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>;
}
