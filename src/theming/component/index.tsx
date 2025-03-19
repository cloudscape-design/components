import React from 'react';
import clsx from 'clsx';
import { ThemeProps, ResetProps, DarkModeProps } from './interfaces';
import { allProperties } from './constants';
import { getPropertyVariables, getResetPropertyVariables, getVariableName } from './utils';
import styles from './styles.css.js';

/**
 * Generate all Theme variables and apply them to the DOM 
 * element. Light mode is implicit. Dark mode will only be 
 * mounted if the properties exist.
 */
export default function Theme(props:ThemeProps) {
  const { children, onDarkMode, ...properties } = props;
  let allVariables: Record<string, string> = {};

  Object.entries(properties).forEach(([name, value]) => {
    Object.assign(allVariables, getPropertyVariables(name, value));
  });

  return (
    <div className={clsx(styles.theme)} style={allVariables}>
      {onDarkMode ? 
        <DarkMode properties={onDarkMode}>{children}</DarkMode> : 
        <>{children}</>
      } 
    </div>
  );
}

/**
 * Generate all Dark mode Theme variables and apply them to the 
 * DOM element. Apply individual classes for each property to 
 * selectively apply light mode override values in CSS.
 */
function DarkMode({ children, properties }:{ children: React.ReactNode, properties: DarkModeProps}) {
  let darkModeVariables: Record<string, string> = {};
  
  Object.entries(properties).forEach(([name, value]) => {
    Object.assign(darkModeVariables, getPropertyVariables(name, value, true));
  });

  return (
    <div 
      className={clsx(
        styles['theme-dark-mode'], 
        {
          [styles['has-background-color']]: properties.backgroundColor,
          [styles['has-background-image']]: properties.backgroundImage,
          [styles['has-border-color']]: properties.borderColor,
          [styles['has-box-shadow']]: properties.boxShadow,
          [styles['has-color']]: properties.color,
          [styles['has-fill']]: properties.fill,
          [styles['has-outline']]: properties.outline,
        },
      )}
      style={darkModeVariables}
    >
      {children}
    </div>
  );
}

/**
 * Reset some or all Theme variables. If "all" is true then every 
 * variable will be reset and individual properties that are true will 
 * be ignored. Individual properties that are false will remove all 
 * variable state permutations.
 */
function Reset(props:ResetProps) {
  const { children, ...properties } = props;
  let resetVariables: Record<string, string> = {};

  if (properties?.all) {
    allProperties.map((property) => {
      Object.assign(resetVariables, getResetPropertyVariables(property));
    });
  }

  Object.entries(properties).forEach(([name, reset]) => {
    if (!properties?.all && reset) {
      Object.assign(resetVariables, getResetPropertyVariables(name));
    }
    
    if (!reset) {
      for (const variable in resetVariables) {
        if (variable.includes(getVariableName(name))) {
          delete resetVariables[variable];
        }
      }
    }
  });

  return (
    <div className={clsx(styles['theme-reset'])} style={resetVariables}>
      {children}
    </div>
  );
}

Theme.Reset = Reset;