import { type CSSProperties, type ElementType, type ReactNode } from 'react';

import styles from './Container.module.css';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const MAX_WIDTH_MAP: Record<ContainerMaxWidth, string> = {
  sm: '480px',
  md: '600px',
  lg: '720px',
  xl: '960px',
  full: '100%',
};

export interface ContainerProps {
  children: ReactNode;
  maxWidth?: ContainerMaxWidth;
  centered?: boolean;
  className?: string | undefined;
  as?: ElementType;
}

/**
 * Container — primitive de layout com largura máxima e centralização.
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg" centered>
 *   <h1>Conteúdo centralizado</h1>
 * </Container>
 * ```
 */
export function Container({
  children,
  maxWidth = 'lg',
  centered = true,
  className,
  as: Component = 'div',
}: ContainerProps) {
  const composedClassName = [
    styles.container,
    centered ? styles.centered : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const style: CSSProperties = {
    ['--container-max-width' as string]: MAX_WIDTH_MAP[maxWidth],
  };

  return (
    <Component className={composedClassName} style={style}>
      {children}
    </Component>
  );
}
