import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Filter,
  Home,
  Info,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';

import type { IconName } from '@/constants/icons';

import styles from './Icon.module.css';

const ICON_MAP: Record<IconName, LucideIcon> = {
  Home,
  Wallet,
  Users,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  ChevronDown,
};

export interface IconProps {
  name: IconName;
  className?: string;
  ariaLabel?: string;
}

export function Icon({ name, className, ariaLabel }: IconProps) {
  const LucideIcon = ICON_MAP[name];
  const composedClassName = className ? `${styles.icon} ${className}` : styles.icon;

  return (
    <LucideIcon
      size={24}
      strokeWidth={2}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      role={ariaLabel ? 'img' : 'presentation'}
      className={composedClassName}
    />
  );
}
