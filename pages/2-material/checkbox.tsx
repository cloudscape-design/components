import React from 'react';
import Theme from '~components/theming/component/index';
import { Checkbox as CloudscapeCheckbox } from '~components';

export default function Checkbox(props: any) {
  let backgroundColors = {
    checked: '#1976d2',
    indeterminate: '#1976d2',
    disabled: '#bdbdbd',
    secondary: '#9c27b0',
    success: '#2e7d32',
    pink: '#d81b60'
  };

  backgroundColors.checked = props.color && backgroundColors[props.color as keyof typeof backgroundColors];

  const borderColors = {
    ...backgroundColors,
    default: '#666666',
  };

  const sizes = {
    large: '20px',
    xlarge: '24px',
  }

  return (
    <Theme
      backgroundColor={backgroundColors}
      borderColor={borderColors}
      color="rgb(26, 30, 35)"
      fontFamily="Roboto, Helvetica, Arial, sans-serif"
      fontSize="16px"
      gapInline="16px"
      height={props.size && sizes[props.size as keyof typeof sizes]}
      outline={backgroundColors.checked}
      width={props.size && sizes[props.size as keyof typeof sizes]}
    >
      <CloudscapeCheckbox 
        checked={props.defaultChecked}
        disabled={props.disabled}
        indeterminate={props.indeterminate}
        onChange={props.onChange} 
        readOnly={props.readOnly}
      >
        {props.label}
      </CloudscapeCheckbox>
    </Theme>
  );
}