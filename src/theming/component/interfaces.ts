export interface ThemeProps {
  backgroundColor?: string | States | Semantics;
  backgroundImage?: string | States | Semantics;
  borderColor?: string | States | Semantics;
  borderRadius?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  borderWidth?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  boxShadow?: string | States | Semantics;
  children?: React.ReactNode;
  color?: string | States | Semantics;
  fill?: string | States | Semantics;
  fontFamily?: string;
  fontSize?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  fontStyle?: string | States | Semantics;
  fontWeight?: string;
  gapBlock?: string;
  gapInline?: string;
  height?: string;
  lineHeight?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  onDarkMode?: DarkModeProps;
  outline?: string | States | Semantics;
  paddingBlock?: string;
  paddingInline? : string;
  width?: string;
};

export interface ResetProps {
  all?: boolean;
  backgroundColor?: boolean;
  backgroundImage?: boolean;
  borderColor?: boolean;
  borderRadius?: boolean;
  borderWidth?:boolean;
  boxShadow?: boolean;
  children?: React.ReactNode;
  color?: boolean;
  fill?: boolean;
  fontFamily?: boolean;
  fontSize?: boolean;
  fontWeight?: boolean;
  fontStyle?: boolean;
  gapBlock?: boolean;
  gapInline?: boolean;
  height?: boolean;
  lineHeight?: boolean;
  outline?: boolean;
  paddingBlock?: boolean;
  paddingInline? : boolean;
  width?: boolean;
};

export interface DarkModeProps {
  backgroundColor?: string | States | Semantics;
  backgroundImage?: string | States | Semantics;
  borderColor?: string | States | Semantics;
  boxShadow?: string | States | Semantics;
  color?: string | States | Semantics;
  fill?: string | States | Semantics;
  outline?: string | States | Semantics;
}

interface States {
  active?: string;
  default?: string;
  checked?: string;
  disabled?: string;
  empty?: string;
  focus?: string;
  hover?: string;
  indeterminate?: string;
  invalid?: string;
  loading?: string;
  readOnly?: string;
  selected?: string;
  valid?: string;
  visited?: string;
};

interface Semantics {
  critical?: string;
  error?: string;
  high?: string;
  info?: string;
  low?: string;
  normal?: string;
  medium?: string;
  neutral?: string;
  success?: string;
  warning?: string;
};

const Sizes = ['none', 'small', 'medium', 'large'] as const;

type LiteralUnion<LiteralType, BaseType extends string> = LiteralType | (BaseType & { _?: never });
type SizeKey = typeof Sizes[number];

export function isCustomValue(sizeKey: string): sizeKey is SizeKey {
  return !Sizes.includes(sizeKey as SizeKey);
}
