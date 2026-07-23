import { NavLink } from 'react-router-dom';

import { Icon } from '@/components/ui/Icon';
import { ROUTES } from '@/constants';
import type { IconName } from '@/constants/icons';

import styles from './BottomNav.module.css';

interface NavItem {
  path: string;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { path: ROUTES.HOME, label: 'Início', icon: 'Home' },
  { path: ROUTES.MENSALIDADES, label: 'Mensalidades', icon: 'Wallet' },
  { path: ROUTES.ASSOCIADOS, label: 'Associados', icon: 'Users' },
  { path: ROUTES.CONFIGURACOES, label: 'Configurações', icon: 'Settings' },
];

/**
 * BottomNav — menu de navegação inferior.
 *
 * - Altura total: 80px (8px padding + 64px conteúdo + 8px padding).
 * - + safe-area-inset-bottom para iOS.
 * - 4 itens, cada um com área de toque mínima de 48x48px garantida
 *   por min-width/min-height + grid 1fr.
 * - aria-current="page" automático via NavLink.
 * - :focus-visible com --shadow-focus.
 * - Sem rolagem horizontal.
 *
 * @see UI_SPECIFICATION.md seção 5
 * @see PLANO_IMPLEMENTACAO_FASE_1.md decisão D2
 */
export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === ROUTES.HOME}
          className={({ isActive }) => `${styles.item}${isActive ? ` ${styles.active}` : ''}`}
        >
          {({ isActive }) => (
            <>
              <Icon name={item.icon} ariaLabel={isActive ? `${item.label} (página atual)` : item.label} />
              <span className={styles.label}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
