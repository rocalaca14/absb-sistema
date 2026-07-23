import { type ReactNode } from 'react';

import styles from './PageContainer.module.css';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  const composedClassName = className ? `${styles.container} ${className}` : styles.container;

  return <div className={composedClassName}>{children}</div>;
}
