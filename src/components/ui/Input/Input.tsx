import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { INPUT_TYPES, type InputType } from '@/constants';

import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  label?: string | undefined;
  helperText?: string | undefined;
  errorMessage?: string | undefined;
  type?: InputType | undefined;
  leftIcon?: ReactNode | undefined;
  rightIcon?: ReactNode | undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    errorMessage,
    type = 'text',
    leftIcon,
    rightIcon,
    disabled = false,
    required = false,
    id,
    className,
    'aria-describedby': ariaDescribedByProp,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = helperText || errorMessage ? `${inputId}-helper` : undefined;
  const hasError = Boolean(errorMessage);

  const wrapperClassName = [
    styles.wrapper,
    hasError ? styles.error : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const describedBy = [ariaDescribedByProp, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: 'var(--color-danger)' }}>
              {' *'}
            </span>
          )}
        </label>
      )}

      <div className={wrapperClassName}>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`${styles.input}${className ? ` ${className}` : ''}`}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </div>

      {errorMessage ? (
        <span id={helperId} className={styles.errorMessage} role="alert" aria-live="polite">
          {errorMessage}
        </span>
      ) : helperText ? (
        <span id={helperId} className={styles.helper}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

export { INPUT_TYPES };
export type { InputType };
