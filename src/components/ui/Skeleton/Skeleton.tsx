import { type CSSProperties } from 'react';

import { SKELETON_ROUNDED_OPTIONS, type SkeletonRounded } from '@/constants';

import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  rounded?: SkeletonRounded;
  count?: number;
  className?: string;
}

const RADIUS_MAP: Record<SkeletonRounded, string> = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  pill: 'var(--radius-pill)',
};

function resolveSize(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  return typeof value === 'number' ? `${value}px` : value;
}

interface SkeletonItemProps {
  width: SkeletonProps['width'];
  height: SkeletonProps['height'];
  rounded: SkeletonRounded;
  className?: string | undefined;
}

function SkeletonItem({ width, height, rounded, className }: SkeletonItemProps) {
  const style: CSSProperties = {
    width: resolveSize(width, '100%'),
    height: resolveSize(height, '16px'),
    borderRadius: RADIUS_MAP[rounded],
  };

  const composedClassName = className ? `${styles.skeleton} ${className}` : styles.skeleton;

  return <div className={composedClassName} style={style} aria-hidden="true" />;
}

SkeletonItem.displayName = 'SkeletonItem';

export function Skeleton({ width, height = 16, rounded = 'md', count = 1, className }: SkeletonProps) {
  if (count > 1) {
    return (
      <div className={styles.group} role="status" aria-busy="true" aria-live="polite">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonItem key={index} width={width} height={height} rounded={rounded} className={className} />
        ))}
      </div>
    );
  }

  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <SkeletonItem width={width} height={height} rounded={rounded} className={className} />
    </div>
  );
}

Skeleton.displayName = 'Skeleton';

export { SKELETON_ROUNDED_OPTIONS, type SkeletonRounded };
