import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Ativo</Badge>);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Badge variant="success">OK</Badge>);
    const badge = screen.getByText('OK');
    expect(badge.className).toContain('success');
  });

  it('shows dot when showDot is true', () => {
    render(<Badge showDot>Com dot</Badge>);
    const badge = screen.getByText('Com dot');
    expect(badge.querySelector('span')).toBeInTheDocument();
  });

  it('applies default neutral variant', () => {
    render(<Badge>Neutral</Badge>);
    const badge = screen.getByText('Neutral');
    expect(badge.className).toContain('neutral');
  });
});
