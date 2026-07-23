export const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const TOAST_VARIANTS = ['success', 'error', 'warning', 'info'] as const;
export type ToastVariant = (typeof TOAST_VARIANTS)[number];

export const SKELETON_ROUNDED_OPTIONS = ['sm', 'md', 'lg', 'xl', 'pill'] as const;
export type SkeletonRounded = (typeof SKELETON_ROUNDED_OPTIONS)[number];

export const SECTION_TITLE_TAGS = ['h1', 'h2', 'h3'] as const;
export type SectionTitleTag = (typeof SECTION_TITLE_TAGS)[number];

export const INPUT_TYPES = [
  'text',
  'email',
  'password',
  'tel',
  'number',
  'search',
  'url',
  'date',
  'datetime-local',
] as const;
export type InputType = (typeof INPUT_TYPES)[number];
