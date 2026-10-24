import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export interface PersonIllustration { name: string; color: number }
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary'; icon?: ReactNode; className?: string }): React.JSX.Element;
export function Surface(props: HTMLAttributes<HTMLElement> & { as?: 'section' | 'article' | 'div'; className?: string; children?: ReactNode }): React.JSX.Element;
export function Avatar(props: { person: PersonIllustration; className?: string }): React.JSX.Element;
export function HoldIcon(props: { grade: string; small?: boolean }): React.JSX.Element;
export function BoulderIcon(props: { grade: string }): React.JSX.Element;
export function CrewIcon(): React.JSX.Element;
export function ChalkBagIcon(): React.JSX.Element;
export function SvgMarkup(props: { html: string; className?: string }): React.JSX.Element;
export const climberColors: string[];
export function avatar(person: PersonIllustration, extra?: string): string;
export function boulderIcon(grade: string, small?: boolean): string;
export function climberIcon(color: string, name: string): string;
export function crewIcon(): string;
export function gradeBadge(grade: string, className?: string): string;
export function holdIcon(grade: string, small?: boolean): string;
export function shoeIcon(color?: string): string;
