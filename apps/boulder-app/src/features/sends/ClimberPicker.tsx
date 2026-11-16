import { Avatar } from '@crux/design-system';
import type { Member } from '@crux/shared-types';
import styled from 'styled-components';
import { SelectionPickerGrid, SelectionPickerOption } from '../../components/SelectionPicker';

const Option = styled(SelectionPickerOption)`
  .avatar-wrap .avatar {
    width: 38px;
    height: 38px;
  }
  .name {
    font: 700 11px/1.1 var(--font-family-body);
    color: var(--color-text-primary);
    overflow-wrap: anywhere;
  }
`;

export function ClimberPicker({
  members,
  currentMemberId,
  value,
  onChange,
}: {
  members: Member[];
  currentMemberId: string;
  value: string;
  onChange: (id: string) => void;
}) {
  const options = [...members].sort(
    (a, b) => Number(b.id === currentMemberId) - Number(a.id === currentMemberId),
  );
  return (
    <div>
      <div
        style={{
          marginBottom: 7,
          color: 'var(--color-text-muted)',
          font: '500 11px var(--font-family-mono)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
        }}
      >
        Climber
      </div>
      <SelectionPickerGrid role="radiogroup" aria-label="Climber who sent the problem">
        {options.map((member) => (
          <Option
            key={member.id}
            type="button"
            role="radio"
            aria-checked={value === member.id}
            aria-label={member.id === currentMemberId ? 'You' : member.name}
            $selected={value === member.id}
            onClick={() => onChange(member.id)}
          >
            <span className="avatar-wrap">
              <Avatar person={member} />
            </span>
            <span className="name">{member.id === currentMemberId ? 'You' : member.name}</span>
            {value === member.id && (
              <span className="check" aria-hidden="true">
                ✓
              </span>
            )}
          </Option>
        ))}
      </SelectionPickerGrid>
    </div>
  );
}
