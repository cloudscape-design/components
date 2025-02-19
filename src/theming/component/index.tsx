import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';

const Sizes = ['none', 'small', 'medium', 'large'] as const;

type LiteralUnion<LiteralType, BaseType extends string> = LiteralType | (BaseType & { _?: never });
type SizeKey = typeof Sizes[number];

function isCustomValue(sizeKey: string): sizeKey is SizeKey {
  return !Sizes.includes(sizeKey as SizeKey);
}
interface ThemeProps {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  borderWidth?: LiteralUnion<'none' | 'small' | 'medium' | 'large', string>;
  boxShadow?: string;
  children?: React.ReactNode;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  onDarkMode?: {
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
  };
  padding?: string;
}

export default function Theme({
  backgroundColor, 
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  children,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  onDarkMode,
  padding,
}:ThemeProps) {
  return (
    <div 
      className={clsx(
        styles.theme,
        backgroundColor && styles[`theme-background-color`],
        borderColor && styles[`theme-border-color`],
        borderRadius && styles[`theme-border-radius-${isCustomValue(borderRadius) ? 'custom' : borderRadius}`],
        borderWidth && styles[`theme-border-width-${isCustomValue(borderWidth) ? 'custom' : borderWidth}`],
        boxShadow && styles[`theme-box-shadow`],
        color && styles[`theme-color`],
        fontFamily && styles[`theme-font-family`],
        fontSize && styles['theme-font-size'],
        fontWeight && styles['theme-font-weight'],
        lineHeight && styles['theme-line-height'],
        padding && styles['theme-padding'],
      )}
      style={{
        ...(backgroundColor && { ['--theme-background-color']: `${backgroundColor}` }),
        ...(borderColor && { ['--theme-border-color']: `${borderColor}` }),
        ...(borderRadius && isCustomValue(borderRadius) && { ['--theme-border-radius']: `${borderRadius}` }),
        ...(borderWidth && isCustomValue(borderWidth) && { ['--theme-border-width']: `${borderWidth}` }),
        ...(boxShadow && { ['--theme-box-shadow']: `${boxShadow}` }),
        ...(color && { ['--theme-color']: `${color}` }),
        ...(fontFamily && { ['--theme-font-family']: `${fontFamily}` }),
        ...(fontSize && { ['--theme-font-size']: `${fontSize}` }),
        ...(fontWeight && { ['--theme-font-weight']: `${fontWeight}` }),
        ...(lineHeight && { ['--theme-line-height']: `${lineHeight}` }),
        ...(onDarkMode?.backgroundColor && { ['--theme-background-color-dark-mode']: `${onDarkMode?.backgroundColor}` }),
        ...(onDarkMode?.borderColor && { ['--theme-border-color-dark-mode']: `${onDarkMode?.borderColor}` }),
        ...(onDarkMode?.color && { ['--theme-color-dark-mode']: `${onDarkMode?.color}` }),
        ...(padding && { ['--theme-padding']: `${padding}` }),
      }}
    >
      {children}
    </div>
  );
}