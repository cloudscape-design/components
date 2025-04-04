import React from 'react';
import Theme from '~components/theming/component/index';
import { Alert as CloudscapeAlert } from '~components';

export default function Alert(props:any) {
  const backgroundColors = {
    error: 'rgb(253, 237, 237)',
    info: 'rgb(229, 246, 253)',
    success: 'rgb(237, 247, 237)',
    warning: 'rgb(255, 244, 229)',
  }

  const colors = {
    error: 'rgb(95, 33, 32)',
    info: 'rgb(1, 67, 97)',
    success: 'rgb(30, 70, 32)',
    warning: 'rgb(102, 60, 0)',
  }

  const fills = {
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)',
  }

  const darkModeBackgroundColors = {
    error: 'rgb(22, 11, 11)',
    info: 'rgb(7, 19, 24)',
    success: 'rgb(12, 19, 13)',
    warning: 'rgb(25, 18, 7)',
  }

  const darkModeColors = {
    error: 'rgb(244, 199, 199)',
    info: 'rgb(184, 231, 251)',
    success: 'rgb(204, 232, 205)',
    warning: 'rgb(255, 226, 183)',
  }

  const darkModeFills = {
    error: 'rgb(244, 67, 54)',
    info: 'rgb(41, 182, 246)',
    success: 'rgb(102, 187, 106)',
    warning: 'rgb(255, 167, 38)',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.severity as keyof typeof backgroundColors]}
      borderRadius="4px"
      borderWidth="0px"
      color={colors[props.severity as keyof typeof colors]}
      fill={fills[props.severity as keyof typeof fills]}
      fontFamily='Roboto, Helvetica, Arial, sans-serif'
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.severity as keyof typeof darkModeBackgroundColors],
        color: darkModeColors[props.severity as keyof typeof darkModeColors],
      }}
    >
      <CloudscapeAlert header={props.heading} type={props.severity}>
        {props.children}
      </CloudscapeAlert>
    </Theme>
  );
}