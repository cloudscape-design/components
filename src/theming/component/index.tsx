import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';

interface ThemeProps {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  borderWidth?: 'none' | 'small' | 'medium' | 'large';
  boxShadow?: string;
  children?: React.ReactNode;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
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
  padding,
}:ThemeProps) {
  return (
    <div 
      className={clsx(
        styles.theme,
        backgroundColor && styles[`theme-background-color`],
        borderColor && styles[`theme-border-color`],
        borderRadius && styles[`theme-border-radius-${borderRadius}`],
        borderWidth && styles[`theme-border-width-${borderWidth}`],
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
        ...(boxShadow && { ['--theme-box-shadow']: `${boxShadow}` }),
        ...(color && { ['--theme-color']: `${color}` }),
        ...(fontFamily && { ['--theme-font-family']: `${fontFamily}` }),
        ...(fontSize && { ['--theme-font-size']: `${fontSize}` }),
        ...(fontWeight && { ['--theme-font-weight']: `${fontWeight}` }),
        ...(lineHeight && { ['--theme-line-height']: `${lineHeight}` }),
        ...(padding && { ['--theme-padding']: `${padding}` }),
      }}
    >
      {children}
    </div>
  );
}