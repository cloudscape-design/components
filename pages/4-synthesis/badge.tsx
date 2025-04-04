import React from 'react';
import Theme from '~components/theming/component/index';
import { Badge as CloudscapeBadge } from '~components';

export default function Badge(props: any) {
  const outlined = props.variant === 'outlined';

  const colors = {
    default: 'rgb(51, 56, 67)',
    primary: 'rgb(143, 255, 206)',
    secondary: 'rgb(225, 227, 229)',
    error: 'rgb(255, 143, 143)',
    info: 'rgb(117, 207, 255)',
    success: 'rgb(98, 255, 87)',
    warning: 'rgb(254, 235, 62)',
  };

  return (
    <Theme
      backgroundColor={outlined ? 'rgb(27, 35, 45)' : colors[props.color as keyof typeof colors]}
      borderColor={outlined ? colors[props.color as keyof typeof colors] : 'transparent'}
      borderRadius="4px"
      borderWidth="1px"
      color={
        props.color === 'default' ? '#fff' : outlined ? colors[props.color as keyof typeof colors] : 'rgb(19, 29, 38)'
      }
      paddingBlock="5px"
      paddingInline="10px"
    >
      <CloudscapeBadge>{props.children}</CloudscapeBadge>
    </Theme>
  );
}