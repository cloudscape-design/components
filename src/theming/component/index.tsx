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
  onDarkMode,
  outline,
  paddingBlock,
  paddingInline,
  width,
}:ThemeProps) {
  return (
    <div 
      className={clsx(styles.theme)}
      style={{
        ...(backgroundColor && getValues('background-color', backgroundColor)),
        ...(backgroundImage && getValues('background-image', backgroundImage)),
        ...(borderColor && getValues('border-color', borderColor)),
        ...(borderRadius && getValues('border-radius', borderRadius)),
        ...(borderWidth && getValues('border-width', borderWidth)),
        ...(boxShadow && getValues('box-shadow', boxShadow)),
        ...(color && getValues('color', color)),
        ...(fill && getValues('fill', fill)),
        ...(fontFamily && getValues('font-family', fontFamily)),
        ...(fontSize && getValues('font-size', fontSize)),
        ...(fontWeight && getValues('font-weight', fontWeight)),
        ...(gapBlock && getValues('gap-block', gapBlock)),
        ...(gapInline && getValues('gap-inline', gapInline)),
        ...(height && getValues('height', height)),
        ...(lineHeight && getValues('line-height', lineHeight)),
        ...(outline && getValues('outline', outline)),
        ...(paddingBlock && getValues('padding-block', paddingBlock)),
        ...(paddingInline && getValues('padding-inline', paddingInline)),
        ...(width && getValues('width', width)),
      }}
    >
      <div className={clsx(styles['theme-dark-mode'])}
        style={{
          ...(onDarkMode?.backgroundColor && getValues('background-color', onDarkMode.backgroundColor, true)),
          ...(onDarkMode?.backgroundImage && getValues('background-image', onDarkMode.backgroundImage, true)),
          ...(onDarkMode?.borderColor && getValues('border-color', onDarkMode.borderColor, true)),
          ...(onDarkMode?.boxShadow && getValues('box-shadow', onDarkMode.boxShadow, true)),
          ...(onDarkMode?.color && getValues('color', onDarkMode.color, true)),
          ...(onDarkMode?.fill && getValues('fill', onDarkMode.fill, true)),
          ...(onDarkMode?.outline && getValues('outline', onDarkMode.outline, true)),
        }}
      >
        {children}
      </div>
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

function getValues(name: string, property: any, darkMode?: boolean) {
  const valuesWithState = [
    'background-color',
    'background-image',
    'border-color',
    'box-shadow',
    'color',
    'fill',
    'outline'
  ];

  const mode = darkMode ? '-dark-mode' : '';
  const hasState = valuesWithState.indexOf(name) >= 0;

  return {
    [`--theme-${name}${mode}`]: typeof property === 'string' ? property : property?.default,
    ...(hasState && { [`--theme-${name}${mode}-active`]: property?.active ?? property?.default ?? property }),
    ...(hasState && { [`--theme-${name}${mode}-checked`]: property?.checked ?? property?.default ?? property }),
    ...(hasState && { [`--theme-${name}${mode}-disabled`]: property?.disabled ?? property?.default ?? property }),
    ...(hasState && { [`--theme-${name}${mode}-hover`]: property?.hover ?? property?.default ?? property }),
    ...(hasState && { [`--theme-${name}${mode}-indeterminate`]: property?.indeterminate ?? property?.default ?? property }),
    ...(hasState && { [`--theme-${name}${mode}-read-only`]: property?.readOnly ?? property?.default ?? property }),
  };
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

