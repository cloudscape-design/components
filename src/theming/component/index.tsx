import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';

interface ThemeProps {
  backgroundColor?: string;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  borderWidth?: 'none' | 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  /*
  backgroundColor
  borderColor
  borderRadius
  borderWidth
  color
  fontFamily
  fontSize
  fontWeight
  lineHeight
  */
}

export default function Theme({
  backgroundColor, 
  borderRadius,
  borderWidth,
  children
}:ThemeProps) {
  return (
    <div 
      className={clsx(
        styles.theme,
        backgroundColor && styles[`theme-background-color`],
        borderRadius && styles[`theme-border-radius-${borderRadius}`],
        borderWidth && styles[`theme-border-width-${borderWidth}`]
      )}
      style={{
        ['--theme-background-color-alert']: `${backgroundColor}`,
      }}
    >
      {children}
    </div>
  );
}