import { type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

import { CARD_CATEGORIES, type CardCategory } from '@/constants';

import styles from './Card.module.css';

const CATEGORY_COLOR: Record<CardCategory, string> = {
  blue: 'var(--color-category-blue)',
  green: 'var(--color-category-green)',
  red: 'var(--color-category-red)',
  yellow: 'var(--color-category-yellow)',
};

export interface CardProps {
  category?: CardCategory;
  title?: ReactNode;
  subtitle?: ReactNode;
  value?: ReactNode;
  caption?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  selected?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
}

export function Card({
  category = 'blue',
  title,
  subtitle,
  value,
  caption,
  footer,
  onClick,
  loading = false,
  disabled = false,
  selected = false,
  ariaLabel,
  className,
  children,
}: CardProps) {
  const isClickable = Boolean(onClick) && !disabled && !loading;

  const composedClassName = [
    styles.card,
    isClickable ? styles.clickable : '',
    disabled ? styles.disabled : '',
    loading ? styles.loading : '',
    selected ? styles.selected : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isClickable) return;
    onClick?.();
    void event;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      aria-pressed={isClickable && selected ? true : undefined}
      className={composedClassName}
      style={{ ['--color-category' as string]: CATEGORY_COLOR[category] }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.body}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {value !== undefined && <p className={styles.value}>{value}</p>}
        {caption && <p className={styles.caption}>{caption}</p>}
        {children}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

export { CARD_CATEGORIES };
export type { CardCategory };
