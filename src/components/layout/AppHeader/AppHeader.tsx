import styles from './AppHeader.module.css';

/**
 * AppHeader — cabeçalho fixo global.
 *
 * - Altura fixa: 224px (múltiplo de 8).
 * - Background: gradiente teal (start #008F8E → end #00BAB9).
 * - Logo centralizada, com safe area iOS no topo.
 * - Placeholder de logo: cartão branco com texto "ABSB" (será substituído
 *   pela logo oficial).
 *
 * @see UI_SPECIFICATION.md seção 4
 */
export function AppHeader() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.logoWrapper}>
        <div className={styles.logoCard} aria-label="Logo ABSB — Associação dos Bugueiros de São Bento">
          <span className={styles.logoText}>ABSB</span>
        </div>
      </div>
    </header>
  );
}
