import type { ReactNode, SVGProps } from 'react';

export type IconName = 'home' | 'problems' | 'crew' | 'profile' | 'add' | 'arrow' | 'calendar' | 'search' | 'scan' | 'spark' | 'close' | 'external' | 'menu' | 'trophy' | 'send' | 'trash' | 'edit' | 'link';

const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/><path d="M8 21h8"/></>,
  problems: <><path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3.5 7.5 8.5 5 8.5-5M12 12.5V22"/></>,
  crew: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m0-5a5 5 0 0 1 8 4v1"/></>,
  profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  add: <><path d="M12 5v14M5 12h14"/></>,
  arrow: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3M7 12h10"/></>,
  spark: <><path d="m12 2 1.7 7.3L21 12l-7.3 1.7L12 21l-1.7-7.3L3 12l7.3-2.7z"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  external: <><path d="M13 5h6v6M19 5l-9 9"/><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  trophy: <><path d="M8 21h8m-4-4v4m-5-18h10v5a5 5 0 0 1-10 0zM7 5H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/></>,
  send: <><path d="m3 11 18-8-8 18-2-8z"/><path d="m11 13 10-10"/></>,
  trash: <><path d="M4 7h16m-10 4v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></>,
  edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4z"/><path d="m13.5 6.5 4 4"/></>,
  link: <><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></>,
};

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>;
}
