import React from 'react';
import clsx from 'clsx';
import { ThemeProps } from './interfaces';
import styles from './styles.css.js';

export default function Theme({
  backgroundColor, 
  borderColor,
  backgroundImage,
  borderRadius,
  borderWidth,
  boxShadow,
  children,
  color,
  fill,
  fontFamily,
  fontSize,
  fontWeight,
  gapBlock,
  gapInline,
  lineHeight,
  paddingBlock,
  paddingInline,
}:ThemeProps) {
  return (
    <div 
      className={clsx(styles.theme)}
      style={{
        ...(backgroundColor && { ['--theme-background-color']: `${backgroundColor}` }),
        ...(backgroundImage && { ['--theme-background-image']: `${backgroundImage}` }),
        ...(borderColor && { ['--theme-border-color']: `${borderColor}` }),
        ...(borderRadius && { ['--theme-border-radius']: `${borderRadius}` }),
        ...(borderWidth && { ['--theme-border-width']: `${borderWidth}` }),
        ...(boxShadow && { ['--theme-box-shadow']: `${boxShadow}` }),
        ...(color && { ['--theme-color']: `${color}` }),
        ...(fill && { ['--theme-fill']: `${fill}` }),
        ...(fontFamily && { ['--theme-font-family']: `${fontFamily}` }),
        ...(fontSize && { ['--theme-font-size']: `${fontSize}` }),
        ...(fontWeight && { ['--theme-font-weight']: `${fontWeight}` }),
        ...(gapBlock && { ['--theme-gap-block']: `${gapBlock}` }),
        ...(gapInline && { ['--theme-gap-inline']: `${gapInline}` }),
        ...(lineHeight && { ['--theme-line-height']: `${lineHeight}` }),
        ...(paddingBlock && { ['--theme-padding-block']: `${paddingBlock}` }),
        ...(paddingInline && { ['--theme-padding-inline']: `${paddingInline}` }),
      }}
    >
      {children}
    </div>
  );
}