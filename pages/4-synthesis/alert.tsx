import React from 'react';
import Theme from '~components/theming/component/index';
import { Alert as CloudscapeAlert } from '~components';

export default function Alert(props:any) {
  const backgroundColors = {
    error: 'rgb(255, 143, 143)',
    info: 'rgb(117, 207, 255)',
    success: 'rgb(98, 255, 87)',
    warning: 'rgb(254, 235, 62)',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.severity as keyof typeof backgroundColors]}
      borderRadius="8px"
      borderWidth="0px"
      color="rgba(0, 0, 0, 0.87)"
      fill="rgba(0, 0, 0, 0.87)"
    >
      <CloudscapeAlert header={props.titleText} type={props.severity}>
        {props.children}
      </CloudscapeAlert>
    </Theme>
  );
}