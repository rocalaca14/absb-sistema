import { SECTION_TITLE_TAGS, type SectionTitleTag } from '@/constants';

import styles from './SectionTitle.module.css';

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  as?: SectionTitleTag;
  className?: string;
}

export function SectionTitle({ title, subtitle, as = 'h2', className }: SectionTitleProps) {
  const TitleTag = as;
  const containerClassName = className ? `${styles.container} ${className}` : styles.container;

  return (
    <div className={containerClassName}>
      <TitleTag className={styles.title}>{title}</TitleTag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

export { SECTION_TITLE_TAGS };
export type { SectionTitleTag };
