import { HoldIcon } from '@crux/design-system';
import type { Grade } from '@crux/shared-types';
import styled from 'styled-components';
import { SelectionPickerGrid, SelectionPickerOption } from '../../components/SelectionPicker';
import { GRADE_COLORS, GRADES } from '../../domain/catalog';

const Option = styled(SelectionPickerOption)<{ $grade: Grade }>`
  .hold-icon {
    width: 34px;
    height: 31px;
  }
  .name {
    color: ${({ $grade }) => GRADE_COLORS[$grade]};
    font-size: 11px;
    font-weight: 700;
    line-height: 1.1;
  }
  .points {
    color: var(--color-text-muted);
    font: 10px var(--font-family-mono);
  }
`;

export function GradePicker({
  value,
  onChange,
}: {
  value: Grade | null;
  onChange: (grade: Grade) => void;
}) {
  return (
    <SelectionPickerGrid role="radiogroup" aria-label="Level completed">
      {GRADES.map(({ grade, points }) => (
        <Option
          key={grade}
          type="button"
          role="radio"
          aria-checked={value === grade}
          aria-label={`${grade}, ${points} points`}
          $selected={value === grade}
          $selectedBorderColor={GRADE_COLORS[grade]}
          $grade={grade}
          onClick={() => onChange(grade)}
        >
          <HoldIcon grade={grade} />
          <span className="name">{grade}</span>
          <span className="points">{points} pts</span>
        </Option>
      ))}
    </SelectionPickerGrid>
  );
}
