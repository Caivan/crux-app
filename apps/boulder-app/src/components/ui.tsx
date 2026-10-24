import styled, { css } from 'styled-components';

export const Surface = styled.section`
  min-width: 0; padding: clamp(16px, 2vw, 24px); border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.card}; background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};
`;
export const Eyebrow = styled.p`
  margin: 0 0 7px; color: ${({ theme }) => theme.color.muted}; font: 500 11px/1.4 ${({ theme }) => theme.type.mono};
  letter-spacing: .12em; text-transform: uppercase;
`;
export const PageTitle = styled.h1`
  margin: 0; font: 700 clamp(28px, 4vw, 42px)/1.08 ${({ theme }) => theme.type.display}; letter-spacing: -.045em;
  span { color: ${({ theme }) => theme.color.green}; }
`;
export const PageDescription = styled.p`
  margin: 9px 0 0; color: ${({ theme }) => theme.color.muted}; font-size: 15px;
`;
export const SectionTitle = styled.h2`
  margin: 0; font: 700 19px/1.2 ${({ theme }) => theme.type.display}; letter-spacing: -.025em;
`;
export const Muted = styled.span`color: ${({ theme }) => theme.color.muted};`;
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; $wide?: boolean }>`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px;
  padding: 9px 14px; border: 1px solid transparent; border-radius: ${({ theme }) => theme.radius.control};
  color: ${({ theme }) => theme.color.surface}; background: ${({ theme }) => theme.color.primary};
  font-weight: 700; cursor: pointer; transition: background .18s ease, transform .18s ease;
  width: ${({ $wide }) => ($wide ? '100%' : 'auto')};
  &:hover { background: ${({ theme }) => theme.color.primaryHover}; transform: translateY(-1px); }
  &:disabled { opacity: .55; cursor: not-allowed; transform: none; }
  ${({ $variant, theme }) => $variant === 'secondary' && css`color: ${theme.color.text}; background: ${theme.color.surface}; border-color: ${theme.color.border}; &:hover { background: ${theme.color.surfaceSubtle}; }`}
  ${({ $variant, theme }) => $variant === 'quiet' && css`color: ${theme.color.muted}; background: transparent; &:hover { background: ${theme.color.surfaceSubtle}; }`}
  ${({ $variant }) => $variant === 'danger' && css`color: #fff; background: #a84f54;`}
`;
export const IconButton = styled.button`
  display: inline-grid; width: 40px; height: 40px; place-items: center; border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 12px; background: ${({ theme }) => theme.color.surface}; cursor: pointer;
`;
export const Pill = styled.span<{ $tone?: 'green' | 'orange' | 'plum' }>`
  display: inline-flex; align-items: center; gap: 6px; padding: 5px 9px; border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ $tone, theme }) => $tone === 'green' ? theme.color.green : $tone === 'orange' ? theme.color.highlight : theme.color.primary};
  background: ${({ $tone }) => $tone === 'green' ? '#e7f0e5' : $tone === 'orange' ? '#fff0e8' : '#f1e8f3'};
  font: 500 11px ${({ theme }) => theme.type.mono};
`;
export const Input = styled.input`
  width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.control}; background: ${({ theme }) => theme.color.surface}; color: ${({ theme }) => theme.color.text};
`;
export const Select = styled.select`
  width: 100%; min-height: 44px; padding: 10px 35px 10px 12px; border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.control}; background: ${({ theme }) => theme.color.surface}; color: ${({ theme }) => theme.color.text};
`;
export const Field = styled.label`
  display: grid; gap: 7px; color: ${({ theme }) => theme.color.muted}; font: 500 11px ${({ theme }) => theme.type.mono}; letter-spacing: .08em; text-transform: uppercase;
`;
export const ModalBackdrop = styled.div`
  position: fixed; z-index: 20; inset: 0; display: grid; place-items: center; padding: 18px; background: rgb(39 34 41 / 58%);
`;
export const ModalCard = styled(Surface)`
  width: min(100%, 560px); max-height: min(90vh, 780px); overflow: auto; padding: clamp(20px, 4vw, 34px); border-radius: ${({ theme }) => theme.radius.dialog}; box-shadow: ${({ theme }) => theme.shadow.dialog};
`;
export const Stack = styled.div<{ $gap?: string }>`display: grid; gap: ${({ $gap, theme }) => $gap ?? theme.space.md};`;
export const Row = styled.div<{ $gap?: string; $align?: string; $wrap?: boolean }>`display: flex; gap: ${({ $gap, theme }) => $gap ?? theme.space.md}; align-items: ${({ $align }) => $align ?? 'center'}; flex-wrap: ${({ $wrap }) => $wrap ? 'wrap' : 'nowrap'};`;
export const Grid = styled.div<{ $min?: string; $gap?: string }>`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, ${({ $min }) => $min ?? '210px'}), 1fr)); gap: ${({ $gap, theme }) => $gap ?? theme.space.md};`;
export const Divider = styled.div`height: 1px; background: ${({ theme }) => theme.color.border};`;
export const StatValue = styled.div`font: 700 28px/.95 ${({ theme }) => theme.type.display}; letter-spacing: -.04em;`;
export const StatLabel = styled.div`color: ${({ theme }) => theme.color.muted}; font: 500 10px ${({ theme }) => theme.type.mono}; letter-spacing: .1em; text-transform: uppercase;`;
