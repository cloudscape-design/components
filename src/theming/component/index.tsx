import React from 'react';
import clsx from 'clsx';
import { ThemeProps, ResetProps } from './interfaces';
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
  fontStyle,
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
        ...(fontStyle && getValues('font-style', fontStyle)),
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
      {onDarkMode ? 
        (
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
        ) : (
          <>{children}</>
        )
      }
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
        ...((all || backgroundColor) && getValues('background-color', null, false, true)),
        ...((all || backgroundImage) && getValues('background-image', null, false, true)),
        ...((all || borderColor) && getValues('border-color', null, false, true)),
        ...((all || borderRadius) && getValues('border-radius', null, false, true)),
        ...((all || borderWidth) && getValues('border-width', null, false, true)),
        ...((all || boxShadow) && getValues('box-shadow', null, false, true)),
        ...((all || color) && getValues('color', null, false, true)),
        ...((all || fill) && getValues('fill', null, false, true)),
        ...((all || fontFamily) && getValues('font-family', null, false, true)),
        ...((all || fontSize) && getValues('font-size', null, false, true)),
        ...((all || fontWeight) && getValues('font-weight', null, false, true)),
        ...((all || gapBlock) && getValues('gap-block', null, false, true)),
        ...((all || gapInline) && getValues('gap-inline', null, false, true)),
        ...((all || height) && getValues('height', null, false, true)),
        ...((all || lineHeight) && getValues('line-height', null, false, true)),
        ...((all || outline) && getValues('outline', null, false, true)),
        ...((all || paddingBlock) && getValues('padding-block', null, false, true)),
        ...((all || paddingInline) && getValues('padding-inline', null, false, true)),
        ...((all || width) && getValues('width', null, false, true)),
      }}
    >
      {children}
    </div>
  );
}

function getValues(name: string, property: any, darkMode?: boolean, reset?: boolean) {
  const propertiesWithStatesOrSemantics = [
    'background-color',
    'background-image',
    'border-color',
    'box-shadow',
    'color',
    'fill',
    'font-style',
    'outline',
  ];

  const mode = darkMode ? '-dark-mode' : '';
  const hasStateOrSemantics = propertiesWithStatesOrSemantics.indexOf(name) >= 0;

  if (reset) {
    return ({
      [`--theme-${name}${mode}`]: 'initial',
      ...(hasStateOrSemantics && { [`--theme-${name}-active`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-checked`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-disabled`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-empty`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-error`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-focus`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-hover`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-indeterminate`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-info`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-read-only`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-success`]: 'initial' }),
      ...(hasStateOrSemantics && { [`--theme-${name}${mode}-warning`]: 'initial' }),
    });
  } else {
    return({
      [`--theme-${name}${mode}`]: typeof property === 'string' ? property : property?.default,
      ...(property?.active && { [`--theme-${name}${mode}-active`]: property.active }),
      ...(property?.checked && { [`--theme-${name}${mode}-checked`]: property.checked }),
      ...(property?.disabled && { [`--theme-${name}${mode}-disabled`]: property.disabled }),
      ...(property?.empty && { [`--theme-${name}${mode}-empty`]: property.empty }),
      ...(property?.error && { [`--theme-${name}${mode}-error`]: property.error }),
      ...(property?.focus && { [`--theme-${name}${mode}-focus`]: property.focus }),
      ...(property?.hover && { [`--theme-${name}${mode}-hover`]: property.hover }),
      ...(property?.indeterminate && { [`--theme-${name}${mode}-indeterminate`]: property.indeterminate }),
      ...(property?.info && { [`--theme-${name}${mode}-info`]: property.info}),
      ...(property?.readOnly && { [`--theme-${name}${mode}-read-only`]: property.readOnly }),
      ...(property?.success && { [`--theme-${name}${mode}-success`]: property.success }),
      ...(property?.warning && { [`--theme-${name}${mode}-warning`]: property.warning }),
    })
  };
}

Theme.Reset = Reset;