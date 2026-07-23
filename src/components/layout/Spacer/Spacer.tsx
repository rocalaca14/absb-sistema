import { type CSSProperties } from 'react';

import type { StackSpaceToken } from '@/components/layout/Stack';

import styles from './Spacer.module.css';

export type SpacerAxis = 'horizontal' | 'vertical';

export interface SpacerProps {
  size?: StackSpaceToken;
  axis?: SpacerAxis;
  flex?: number;
  className?: string | undefined;
}

/**
 * Spacer — primitive de espaçamento fixo ou flexível.
 *
 * - `size`: espaçamento fixo usando Design Token.
 * - `flex`: ocupa espaço flexível (flex-grow).
 *
 * @example
 * ```tsx
 * <Stack direction="row">
 *   <span>Esquerda</span>
 *   <Spacer flex={1} />
 *   <span>Direita</span>
 * </Stack>
 * ```
 */
export function Spacer({ size = '4', axis = 'vertical', flex, className }: SpacerProps) {
  const isFixed = flex === undefined;

  const composedClassName = [
    styles.spacer,
    axis === 'horizontal' ? styles.horizontal : styles.vertical,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const style: CSSProperties = {
    ['--spacer-size' as string]: `var(--space-${size})`,
    flex: !isFixed ? `${flex} ${flex} 0` : undefined,
  };

  return <div className={composedClassName} style={style} aria-hidden="true" />;
}
