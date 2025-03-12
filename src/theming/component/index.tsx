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
  height,
  lineHeight,
  outline,
  paddingBlock,
  paddingInline,
  width,
}:ThemeProps) {
  return (
    <div 
      className={clsx(styles.theme)}
      style={{
        ...(backgroundColor && getValues('--theme-background-color', backgroundColor)),
        ...(backgroundImage && getValues('--theme-background-image', backgroundImage)),
        ...(borderColor && getValues('--theme-border-color', borderColor)),
        ...(borderRadius && { ['--theme-border-radius']: `${borderRadius}` }),
        ...(borderWidth && { ['--theme-border-width']: `${borderWidth}` }),
        ...(boxShadow && getValues('--theme-box-shadow', boxShadow)),
        ...(color && getValues('--theme-color', color)),
        ...(fill && getValues('--theme-fill', fill)),
        ...(fontFamily && { ['--theme-font-family']: `${fontFamily}` }),
        ...(fontSize && { ['--theme-font-size']: `${fontSize}` }),
        ...(fontWeight && { ['--theme-font-weight']: `${fontWeight}` }),
        ...(gapBlock && { ['--theme-gap-block']: `${gapBlock}` }),
        ...(gapInline && { ['--theme-gap-inline']: `${gapInline}` }),
        ...(height && { ['--theme-height']: `${height}` }),
        ...(lineHeight && { ['--theme-line-height']: `${lineHeight}` }),
        ...(outline && getValues('--theme-outline', outline)),
        ...(paddingBlock && { ['--theme-padding-block']: `${paddingBlock}` }),
        ...(paddingInline && { ['--theme-padding-inline']: `${paddingInline}` }),
        ...(width && { ['--theme-width']: `${width}` }),
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

function getValues(name: string, property: any) {
  let values;

  if (typeof property === 'string') {
    values = { [name]: `${property}` }
  } else {
    values = {
      [`${name}-checked`]: property?.checked,
      [`${name}-default`]: property?.default,
      [`${name}-disabled`]: property?.disabled,
      [`${name}-indeterminate`]: property?.indeterminate,
      [`${name}-read-only`]: property?.readOnly,
    }
  }

  return values;
}

Theme.DarkMode = DarkMode;
Theme.Reset = Reset;

