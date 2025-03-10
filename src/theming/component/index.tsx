import React from 'react';
import clsx from 'clsx';
import { ThemeProps, DarkModeProps } from './interfaces';
import styles from './styles.css.js';

export default function Theme({
  backgroundColor, 
  backgroundImage,
  borderColor,
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

function DarkMode({
  backgroundColor,
  backgroundImage, 
  borderColor,
  boxShadow,
  children,
  color,
  fill,
}:DarkModeProps) {
  return (
    <div className={clsx(styles['theme-dark-mode'])}
      style={{
        ...(backgroundColor && { ['--theme-background-color-dark-mode']: `${backgroundColor}` }),
        ...(backgroundImage && { ['--theme-background-image-dark-mode']: `${backgroundImage}` }),
        ...(borderColor && { ['--theme-border-color-dark-mode']: `${borderColor}` }),
        ...(boxShadow && { ['--theme-box-shadow-dark-mode']: `${boxShadow}` }),
        ...(color && { ['--theme-color-dark-mode']: `${color}` }),
        ...(fill && { ['--theme-fill-dark-mode']: `${fill}` }),
      }}
    >
      {children}
    </div>
  );
}

function Reset({children}:any) {
  return (
    <div className={clsx(styles['theme-reset'])}>
      {children}
    </div>
  );
}

Theme.DarkMode = DarkMode;
Theme.Reset = Reset;