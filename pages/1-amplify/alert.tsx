import React from 'react';
import Theme from '~components/theming/component/index';
import { Alert as CloudscapeAlert } from '~components';
import { palette } from './palette';

export default function Alert(props:any) {
  return (
    <Theme 
      backgroundColor={backgroundColors[props.variation as keyof typeof backgroundColors]}
      borderRadius="0px"
      borderWidth="0px"
      color={colors[props.variation as keyof typeof colors]}
      fill={colors[props.variation as keyof typeof colors]}
    >
      <Theme.DarkMode
        backgroundColor={darkModeBackgroundColors[props.variation as keyof typeof darkModeBackgroundColors]}
        color={darkModeColors[props.variation as keyof typeof darkModeColors]}
        fill={darkModeColors[props.variation as keyof typeof darkModeColors]}   
      >
        <CloudscapeAlert 
          action={props.action}
          header={props.heading} 
          type={props.variation === 'default' ? 'info' : props.variation}
        >
          {props.children}
        </CloudscapeAlert>
      </Theme.DarkMode>
    </Theme>
  );
};

const backgroundColors = {
  default: palette.neutral20, 
  error: palette.red10,
  info: palette.blue10,
  success: palette.green10,
  warning: palette.orange10,
};

const colors = {
  default: palette.neutral100,
  error: palette.red100,
  info: palette.blue100,
  success: palette.green100,
  warning: palette.orange100,
}

const darkModeBackgroundColors = {
  ...colors,
  default: palette.neutral80,
};

const darkModeColors = {
  default: palette.neutral40,
  error: palette.red20,
  info: palette.blue20,
  success: palette.green20,
  warning: palette.orange20,
};
