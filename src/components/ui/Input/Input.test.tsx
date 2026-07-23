import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Nome" />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Digite..." />);
    expect(screen.getByPlaceholderText('Digite...')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('shows error message', () => {
    render(<Input errorMessage="Campo obrigatório" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatório');
  });

  it('marks field as invalid when error is present', () => {
    render(<Input errorMessage="Erro" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders required indicator', () => {
    render(<Input label="Nome" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('can be disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} disabled />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(handleChange).not.toHaveBeenCalled();
  });
});
