import { Button } from '@/components/ui/Button';

import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  theme: Theme;
  resolved: 'light' | 'dark';
  onThemeChange: (theme: Theme) => void;
}

const THEME_LABELS: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};

/**
 * ThemeToggle — seletor de tema com 3 opções (Claro/Escuro/Sistema).
 *
 * Acessibilidade:
 * - aria-label descritivo
 * - groups de radio buttons estilizados como botões
 * - estado atual comunicado via aria-pressed
 */
export function ThemeToggle({ theme, resolved, onThemeChange }: ThemeToggleProps) {
  return (
    <div className={styles.container} role="group" aria-label="Selecionar tema">
      {(['light', 'dark', 'system'] as const).map((option) => (
        <Button
          key={option}
          variant={theme === option ? 'primary' : 'secondary'}
          onClick={() => onThemeChange(option)}
          aria-pressed={theme === option}
          aria-label={`Tema ${THEME_LABELS[option]}${option === 'system' ? ` (atual: ${resolved === 'dark' ? 'escuro' : 'claro'})` : ''}`}
        >
          {option === 'light' && '☀️'}
          {option === 'dark' && '🌙'}
          {option === 'system' && '💻'}
          {' '}
          {THEME_LABELS[option]}
        </Button>
      ))}
    </div>
  );
}
