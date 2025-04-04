import React from 'react';
import Theme from '~components/theming/component/index';
import { Badge as CloudscapeBadge } from '~components';

export default function Badge(props: any) {
  const backgroundColors = {
    default: 'rgba(0, 0, 0, 0.08)',
    primary: 'rgb(25, 118, 210)',
    secondary: 'rgb(156, 39, 176)',
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)',
  };

  const colors = {
    default: 'rgba(0, 0, 0, 0.87)',
    primary: '#ffffff',
    secondary: '#ffffff',
    error: '#ffffff',
    info: '#ffffff',
    success: '#ffffff',
    warning: '#ffffff',
  };

  const outlinedColors = {
    default: 'rgba(0, 0, 0, 0.87)',
    primary: 'rgb(25, 118, 210)',
    secondary: 'rgb(156, 39, 176)',
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)',
  };

  const darkModeBackgroundColors = {
    default: 'rgba(255, 255, 255, 0.16)',
    primary: 'rgb(144, 202, 249)',
    secondary: 'rgb(206, 147, 216)',
    error: 'rgb(244, 67, 54)',
    info: 'rgb(41, 182, 246)',
    success: 'rgb(102, 187, 106)',
    warning: 'rgb(255, 167, 38)',
  };

  const darkModeOutlinedColors = {
    default: 'rgb(97, 97, 97)',
    primary: 'rgba(144, 202, 249, 0.7)',
    secondary: 'rgba(206, 147, 216, 0.7)',
    error: 'rgba(244, 67, 54, 0.7)',
    info: 'rgba(41, 182, 246, 0.7)',
    success: 'rgba(102, 187, 106, 0.7)',
    warning: 'rgba(255, 167, 38, 0.7)',
  };

  const darkModeColors = {
    default: '#fff',
    primary: 'rgba(144, 202, 249, 0.7)',
    secondary: 'rgba(206, 147, 216, 0.7)',
    error: 'rgba(244, 67, 54, 0.7)',
    info: 'rgba(41, 182, 246, 0.7)',
    success: 'rgba(102, 187, 106, 0.7)',
    warning: 'rgba(255, 167, 38, 0.7)',
  };

  return (
    <Theme
      backgroundColor={
        props.variant === 'outlined' ? '#ffffff' : backgroundColors[props.color as keyof typeof backgroundColors]
      }
      borderColor={props.variant === 'outlined' ? outlinedColors[props.color as keyof typeof colors] : 'transparent'}
      borderRadius="16px"
      borderWidth="1px"
      color={
        props.variant === 'outlined'
          ? outlinedColors[props.color as keyof typeof outlinedColors]
          : colors[props.color as keyof typeof colors]
      }
      fontFamily="Roboto, Helvetica, Arial, sans-serif"
      fontWeight="400"
      onDarkMode={{
        backgroundColor:
          props.variant === 'outlined'
            ? 'rgb(15, 18, 20)'
            : darkModeBackgroundColors[props.color as keyof typeof darkModeBackgroundColors],
        borderColor:
          props.variant === 'outlined'
            ? darkModeOutlinedColors[props.color as keyof typeof darkModeOutlinedColors]
            : 'transparent',
        color:
          props.variant === 'outlined'
            ? darkModeColors[props.color as keyof typeof darkModeColors]
            : 'rgba(0, 0, 0, 0.87)',
      }}
      paddingBlock="6px"
      paddingInline="12px"
    >
      <CloudscapeBadge>{props.children}</CloudscapeBadge>
    </Theme>
  );
}