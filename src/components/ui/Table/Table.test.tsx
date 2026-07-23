import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Table } from './Table';

interface TestRow {
  id: string;
  name: string;
}

const columns = [
  { key: 'name', label: 'Nome', render: (row: TestRow) => row.name },
];

const rows: TestRow[] = [
  { id: '1', name: 'João' },
  { id: '2', name: 'Maria' },
];

describe('Table', () => {
  it('renders table with rows', () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
      />,
    );
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <Table
        columns={columns}
        rows={[]}
        loading
        getRowKey={(row) => row.id}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <Table
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        empty={<div>Nenhum item</div>}
      />,
    );
    expect(screen.getByText('Nenhum item')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Table
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowClick={handleClick}
      />,
    );
    await user.click(screen.getByText('João'));
    expect(handleClick).toHaveBeenCalledWith(rows[0]);
  });

  it('calls onRowClick on Enter key press', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Table
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowClick={handleClick}
      />,
    );
    const row = screen.getByText('João').closest('tr')!;
    row.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledWith(rows[0]);
  });

  it('sets tabIndex when onRowClick is provided', () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowClick={() => {}}
      />,
    );
    const row = screen.getByText('João').closest('tr')!;
    expect(row).toHaveAttribute('tabindex', '0');
  });

  it('renders column with align', () => {
    const cols = [{ key: 'name', label: 'Nome', align: 'right' as const, render: (row: TestRow) => row.name }];
    render(
      <Table columns={cols} rows={rows} getRowKey={(r) => r.id} />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
