import React from 'react';
import clsx from 'clsx';
import { ThemeProps, DarkModeProps, ResetProps } from './interfaces';
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
  outline,
}:DarkModeProps) {
  console.log(backgroundColor);
  return (
    <div className={clsx(styles['theme-dark-mode'])}
      style={{
        ...(backgroundColor && getValues('--theme-background-color-dark-mode', backgroundColor)),
        ...(backgroundImage && getValues('--theme-background-image-dark-mode', backgroundImage)),
        ...(borderColor && getValues('--theme-border-color-dark-mode', borderColor)),
        ...(boxShadow && getValues('--theme-box-shadow-dark-mode', boxShadow)),
        ...(color && getValues('--theme-color-dark-mode', color)),
        ...(fill && getValues('--theme-fill-dark-mode', fill)),
        ...(outline && getValues('--theme-outline-dark-mode', outline)),
      }}
    >
      {children}
    </div>
  );
}

function Reset({
  all,
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
}:ResetProps) {
  return (
    <div 
      className={clsx(styles['theme-reset'])}
      style={{
        ...((all || backgroundColor) && getResetValues('--theme-background-color')),
        ...((all || backgroundImage) && getResetValues('--theme-background-image')),
        ...((all || borderColor) && getResetValues('--theme-border-color')),
        ...((all || borderRadius) && { ['--theme-border-radius']: 'initial' }),
        ...((all || borderWidth) && { ['--theme-border-width']: 'initial' }),
        ...((all || boxShadow) && getResetValues('--theme-box-shadow')),
        ...((all || color) && getResetValues('--theme-color')),
        ...((all || fill) && getResetValues('--theme-fill')),
        ...((all || fontFamily) && { ['--theme-font-family']: 'initial' }),
        ...((all || fontSize) && { ['--theme-font-size']: 'initial' }),
        ...((all || fontWeight) && { ['--theme-font-weight']: 'initial' }),
        ...((all || gapBlock) && { ['--theme-gap-block']: 'initial' }),
        ...((all || gapInline) && { ['--theme-gap-inline']: 'initial' }),
        ...((all || height) && { ['--theme-height']: 'initial' }),
        ...((all || lineHeight) && { ['--theme-line-height']: 'initial' }),
        ...((all || outline) && { ['--theme-outline']: 'initial' }),
        ...((all || paddingBlock) && { ['--theme-padding-block']: 'initial' }),
        ...((all || paddingInline) && { ['--theme-padding-inline']: 'initial' }),
        ...((all || width) && { ['--theme-width']: 'initial' }),
      }}
    >
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
      [`${name}`]: property?.default,
      [`${name}-active`]: property?.active,
      [`${name}-checked`]: property?.checked,
      [`${name}-disabled`]: property?.disabled,
      [`${name}-hover`]: property?.hover,
      [`${name}-indeterminate`]: property?.indeterminate,
      [`${name}-read-only`]: property?.readOnly,
    }
  }

  return values;
}

function getResetValues(name: string) {
  const values = {
    [name]: 'initial',
    [`${name}-active`]: 'initial',
    [`${name}-checked`]: 'initial',
    [`${name}-disabled`]: 'initial',
    [`${name}-indeterminate`]: 'initial',
    [`${name}-read-only`]: 'initial',
  }

  return values;
}

Theme.DarkMode = DarkMode;
Theme.Reset = Reset;

