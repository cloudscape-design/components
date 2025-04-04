import React from 'react';
import Theme from '~components/theming/component/index';
import { Alert as CloudscapeAlert } from '~components';

export default function Alert(props:any) {
  const backgroundColors = {
    danger: '#ffe5df',
    info: '#ebf7ff',
    success: '#f2f6e1',
    warning: '#fdf4d8',
  }

  const fills = {
    danger: '#cf2900',
    info: '#0a6fc2',
    success: '#387000',
    warning: '#ebac00',
  };

  const darkModeBackgroundColors = {
    danger: '#801a00',
    info: '#063b73',
    success: '#1f3d00',
    warning: '#a36a00',
  };

  const darkModeFills = {
    danger: '#ff6038',
    info: '#fff',
    success: '#7ea949',
    warning: '#fdd34a',
  };

  return (
    <Theme 
      backgroundColor={backgroundColors[props.variant as keyof typeof backgroundColors]}
      borderRadius="0px"
      borderWidth="0px"
      color="rgb(35, 47, 62)"
      fill={fills[props.variant as keyof typeof fills]}
      paddingBlock='12px'
      paddingInline="20px"
      gapBlock='4px'
      gapInline="14px"
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.variant as keyof typeof darkModeBackgroundColors],
        color: "#fff",
        fill: darkModeFills[props.variant as keyof typeof darkModeFills],
      }}
    >
      <div style={{ borderLeft: `4px solid ${fills[props.variant as keyof typeof fills]}`}}>
        <CloudscapeAlert header={props.header} type={props.variant === 'danger' ? 'error' : props.variant}>
          {props.description}
        </CloudscapeAlert>
      </div>
    </Theme>
  );
}