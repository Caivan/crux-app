import { HoldIcon } from '@crux/design-system';
import type { Grade, GradeDisplay } from '@crux/shared-types';
import styled from 'styled-components';
import { gradeLabel, GRADE_COLORS, GRADE_TINTS } from '../domain/catalog';

const GradeTag = styled.span<{ $grade: Grade; $compact?: boolean }>`
  display: inline-flex; align-items: center; gap: 7px; width: fit-content; padding: ${({ $compact }) => $compact ? '4px 8px' : '6px 10px'};
  border-radius: 10px; color: var(--color-text-primary); background: ${({ $grade }) => GRADE_TINTS[$grade]};
  font: 600 11px var(--font-family-mono); white-space: nowrap;
  .hold-icon { width: ${({ $compact }) => $compact ? 23 : 27}px; height: ${({ $compact }) => $compact ? 21 : 25}px; }
`;

export function GradePill({ grade, display = 'color', compact = false }: { grade: Grade; display?: GradeDisplay; compact?: boolean }) {
  return <GradeTag $grade={grade} $compact={compact} title={`${grade} · ${gradeLabel(grade, 'fontainebleau')} · ${gradeLabel(grade, 'vscale')}`}><HoldIcon grade={grade}/><span style={{ color: GRADE_COLORS[grade] }}>{gradeLabel(grade, display)}</span></GradeTag>;
}
