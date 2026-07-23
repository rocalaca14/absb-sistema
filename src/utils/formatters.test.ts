import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime } from './formatters';

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });

  it('formats positive value', () => {
    const result = formatCurrency(50);
    expect(result).toContain('50');
    expect(result).toContain('R$');
  });

  it('formats decimal value', () => {
    const result = formatCurrency(99.9);
    expect(result).toContain('99');
  });

  it('formats large value', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1.000');
  });
});

describe('formatDate', () => {
  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('formats valid date', () => {
    const result = formatDate('2024-01-15');
    expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
  });
});

describe('formatDateTime', () => {
  it('returns — for null', () => {
    expect(formatDateTime(null)).toBe('—');
  });

  it('formats valid datetime', () => {
    const result = formatDateTime('2024-01-15T10:30:00');
    expect(result).toContain('15');
    expect(result).toContain('01');
    expect(result).toContain('2024');
  });
});
