import styled from 'styled-components';

export const SelectionPickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(64px, 100%), 1fr));
  gap: 8px;
  max-height: 180px;
  overflow-y: auto;
  overscroll-behavior-y: auto;
  scrollbar-width: thin;
  padding: 3px 5px 5px 1px;
`;

export const SelectionPickerOption = styled.button<{
  $selected: boolean;
  $selectedBorderColor?: string;
}>`
  position: relative;
  display: grid;
  width: 100%;
  min-width: 0;
  min-height: 78px;
  align-content: center;
  justify-items: center;
  gap: 5px;
  padding: 7px 4px;
  border: 1px solid ${({ $selected, $selectedBorderColor }) =>
    $selected ? ($selectedBorderColor ?? 'var(--color-outline)') : 'var(--color-border)'};
  border-radius: 14px;
  background: ${({ $selected }) => ($selected ? 'var(--color-highlight-soft)' : 'var(--color-surface)')};
  cursor: pointer;
  text-align: center;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.15s;
  &:hover {
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: 3px solid var(--color-outline);
    outline-offset: 2px;
  }
  .check {
    position: absolute;
    top: 4px;
    right: 4px;
    display: grid;
    width: 16px;
    height: 16px;
    place-items: center;
    border-radius: 50%;
    background: var(--color-action-primary);
    color: white;
    font-size: 10px;
    line-height: 1;
  }
`;
