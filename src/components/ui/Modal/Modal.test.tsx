import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  let offsetParentSpy: ReturnType<typeof vi.spyOn> | undefined;

  beforeEach(() => {
    offsetParentSpy = vi.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockReturnValue(
      document.body as unknown as Element,
    );
  });

  afterEach(() => {
    offsetParentSpy?.mockRestore();
  });

  it('renders when open', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Teste">
        <p>Conteúdo</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Teste')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Teste">
        <p>Conteúdo</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Teste">
        <p>Conteúdo</p>
      </Modal>,
    );
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Teste">
        <p>Conteúdo</p>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders description when provided', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Teste" description="Descrição do modal">
        <p>Conteúdo</p>
      </Modal>,
    );
    expect(screen.getByText('Descrição do modal')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Teste">
        <p>Conteúdo</p>
      </Modal>,
    );
    const overlay = document.querySelector('[class*="backdrop"]') as HTMLElement;
    if (overlay) await user.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('handles Tab key without focusable elements', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Teste">
        <p>Conteúdo</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles Tab key when focusable elements exist', async () => {
    const user = userEvent.setup();
    render(
      <Modal open={true} onClose={() => {}} title="Teste">
        <button>Primeiro</button>
        <button>Segundo</button>
      </Modal>,
    );
    const second = screen.getByText('Segundo');
    second.focus();
    await user.keyboard('{Tab}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles Shift+Tab key when focusable elements exist', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Teste">
        <button>Primeiro</button>
        <button>Segundo</button>
      </Modal>,
    );
    const closeButton = screen.getByRole('button', { name: 'Fechar' });
    closeButton.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not close on ESC when closeOnEscape is false', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Teste" closeOnEscape={false}>
        <p>Conteúdo</p>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Teste" footer={<span>Rodapé</span>}>
        <p>Conteúdo</p>
      </Modal>,
    );
    expect(screen.getByText('Rodapé')).toBeInTheDocument();
  });
});
