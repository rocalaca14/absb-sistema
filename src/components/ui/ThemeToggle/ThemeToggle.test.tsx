import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders three buttons', () => {
    render(
      <ThemeToggle theme="system" resolved="light" onThemeChange={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'Tema Claro' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tema Escuro' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tema Sistema/ })).toBeInTheDocument();
  });

  it('calls onThemeChange when button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ThemeToggle theme="system" resolved="light" onThemeChange={handleChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Tema Escuro' }));
    expect(handleChange).toHaveBeenCalledWith('dark');
  });

  it('marks current theme with aria-pressed', () => {
    render(
      <ThemeToggle theme="dark" resolved="dark" onThemeChange={() => {}} />,
    );
    const darkButton = screen.getByRole('button', { name: 'Tema Escuro' });
    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
  });
});
