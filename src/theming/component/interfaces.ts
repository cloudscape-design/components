const Sizes = ['none', 'small', 'medium', 'large'] as const;

type LiteralUnion<LiteralType, BaseType extends string> = LiteralType | (BaseType & { _?: never });
type SizeKey = typeof Sizes[number];

export function isCustomValue(sizeKey: string): sizeKey is SizeKey {
  return !Sizes.includes(sizeKey as SizeKey);
}

export interface ThemeProps {
  backgroundColor?: string;
  backgroundImage?: string;
  borderColor?: string;
  borderRadius?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  borderWidth?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  boxShadow?: string;
  children?: React.ReactNode;
  color?: string;
  fill?: string;
  fontFamily?: string;
  fontSize?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  fontWeight?: string;
  gapBlock?: string;
  gapInline?: string;
  lineHeight?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  paddingBlock?: string;
  paddingInline? : string;
}