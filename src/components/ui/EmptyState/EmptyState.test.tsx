import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="Sem dados"
        description="Nenhum item encontrado"
      />,
    );
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    render(
      <EmptyState
        title="Vazio"
        description="Nada aqui"
        action={{ label: 'Criar', onClick: () => {} }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument();
  });

  it('does not render action button when not provided', () => {
    render(<EmptyState title="Vazio" description="Nada" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has role status', () => {
    render(<EmptyState title="Teste" description="Desc" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
