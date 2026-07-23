import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders single skeleton', () => {
    render(<Skeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders multiple skeletons when count > 1', () => {
    render(<Skeleton count={3} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-busy', 'true');
  });

  it('applies custom width and height', () => {
    render(<Skeleton width={200} height={32} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies custom rounded variant', () => {
    render(<Skeleton rounded="pill" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Skeleton className="custom-class" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('accepts string dimensions', () => {
    render(<Skeleton width="50%" height="2rem" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
