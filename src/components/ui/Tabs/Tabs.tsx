import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/constants';

import styles from './Tabs.module.css';

export interface TabItem<TKey extends string = string> {
  key: TKey;
  label: string;
  icon?: IconName;
  badge?: string | number;
}

export interface TabsProps<TKey extends string = string> {
  items: ReadonlyArray<TabItem<TKey>>;
  value: TKey;
  onChange: (key: TKey) => void;
  className?: string | undefined;
  'aria-label'?: string;
}

/**
 * Tabs — navegação por abas com estado gerenciado.
 *
 * Implementa padrão ARIA Tabs (role="tablist" / role="tab" / aria-selected).
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={[
 *     { key: 'pessoal', label: 'Pessoal' },
 *     { key: 'veiculo', label: 'Veículo', icon: 'Settings' },
 *     { key: 'mensalidades', label: 'Mensalidades', badge: 3 },
 *   ]}
 *   value={activeTab}
 *   onChange={setActiveTab}
 *   aria-label="Detalhes do associado"
 * />
 * ```
 */
export function Tabs<TKey extends string = string>({
  items,
  value,
  onChange,
  className,
  'aria-label': ariaLabel,
}: TabsProps<TKey>) {
  const composedClassName = [styles.list, className ?? ''].filter(Boolean).join(' ');

  return (
    <div role="tablist" aria-label={ariaLabel} className={composedClassName}>
      {items.map((item) => {
        const isActive = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${item.key}`}
            tabIndex={isActive ? 0 : -1}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.icon && <Icon name={item.icon} ariaLabel="" />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className={styles.badge} aria-label={`${item.badge} itens`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
