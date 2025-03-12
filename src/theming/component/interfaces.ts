const Sizes = ['none', 'small', 'medium', 'large'] as const;

type LiteralUnion<LiteralType, BaseType extends string> = LiteralType | (BaseType & { _?: never });
type SizeKey = typeof Sizes[number];

interface States {
  default?: string;
  checked?: string;
  indeterminate?: string;
  disabled?: string;
  readOnly?: string;
}

export function isCustomValue(sizeKey: string): sizeKey is SizeKey {
  return !Sizes.includes(sizeKey as SizeKey);
}

export interface ThemeProps {
  backgroundColor?: string | States;
  backgroundImage?: string | States;
  borderColor?: string | States;
  borderRadius?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  borderWidth?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  boxShadow?: string | States;
  children?: React.ReactNode;
  color?: string | States;
  fill?: string | States;
  fontFamily?: string;
  fontSize?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  fontWeight?: string;
  gapBlock?: string;
  gapInline?: string;
  height?: string;
  lineHeight?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  outline?: string | States;
  paddingBlock?: string;
  paddingInline? : string;
  width?: string;
}

export interface DarkModeProps {
    backgroundColor?: string | States;
    backgroundImage?: string | States;
    borderColor?: string | States;
    boxShadow?: string | States;
    children?: React.ReactNode;
    color?: string | States;
    fill?: string | States;
    outline?: string | States;
  }