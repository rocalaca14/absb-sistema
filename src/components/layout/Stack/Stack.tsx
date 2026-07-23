import { type CSSProperties, type ElementType, type ReactNode } from 'react';

import styles from './Stack.module.css';

export type StackSpaceToken =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | 'screen-x'
  | 'screen-top'
  | 'screen-bottom'
  | 'section'
  | 'card'
  | 'icon-text'
  | 'title-subtitle';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type StackDirection = 'row' | 'column';

export interface StackProps {
  children: ReactNode;
  direction?: StackDirection;
  gap?: StackSpaceToken;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  className?: string | undefined;
  as?: ElementType;
}

const ALIGN_MAP: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const JUSTIFY_MAP: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

/**
 * Stack — primitive de layout para empilhamento vertical ou horizontal.
 *
 * Usa Design Tokens para espaçamento. Substitui o uso de `style={{ display: 'grid', rowGap: ... }}`
 * e CSS inline em páginas.
 *
 * @example
 * ```tsx
 * <Stack gap="4">
 *   <SectionTitle title="..." />
 *   <Card ... />
 * </Stack>
 * ```
 */
export function Stack({
  children,
  direction = 'column',
  gap = '4',
  align,
  justify,
  wrap = false,
  className,
  as: Component = 'div',
}: StackProps) {
  const composedClassName = [
    styles.stack,
    direction === 'row' ? styles.horizontal : styles.vertical,
    wrap ? styles.wrap : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const style: CSSProperties = {
    gap: `var(--space-${gap})`,
    alignItems: align ? ALIGN_MAP[align] : undefined,
    justifyContent: justify ? JUSTIFY_MAP[justify] : undefined,
  };

  return (
    <Component className={composedClassName} style={style}>
      {children}
    </Component>
  );
}
