import React from 'react';
import Theme from '~components/theming/component/index';
import { Alert as CloudscapeAlert } from '~components';

export default function Alert(props:any) {
  const fills = {
    error: 'rgb(209, 70, 0)',
    info: 'rgb(0, 108, 224)',
    success: 'rgb(0, 138, 46)',
    warn: 'rgb(209, 70, 0)',
  };

  const darkModeFills = {
    error: '#ff6161',
    info: '#42b4ff',
    success: '#00e500',
    warn: '#ff9900',
  };

  return (
    <Theme 
      backgroundColor="#ffffff"
      borderColor="#161d26"
      borderRadius="8px"
      borderWidth="1px"
      fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
      fill={fills[props.variant as keyof typeof fills]}
      onDarkMode={{
        backgroundColor: "#161d26",
        borderColor: "#fff",
        fill: darkModeFills[props.variant as keyof typeof darkModeFills],
      }}
    >
      <CloudscapeAlert header={props.title} type={props.variant === 'warn' ? 'warning' : props.variant}>
        {props.message}
      </CloudscapeAlert>
    </Theme>
  );
}