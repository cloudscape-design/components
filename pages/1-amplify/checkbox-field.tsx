import React from 'react';
import { Checkbox as CloudscapeCheckbox } from '~components';
import Theme from '~components/theming/component/index';
import { palette } from './theme';

export default function CheckboxField(props: any) {
  return (
    <Theme {...theme}>
      <CloudscapeCheckbox 
        checked={props.checked}
        disabled={props.isDisabled}
        indeterminate={props.isIndeterminate}
        onChange={props.onChange} 
        readOnly={props.readOnly}
      > 
        {props.label}
      </CloudscapeCheckbox>
    </Theme>
  );
};

export const theme = {
  backgroundColor: {
    checked: palette.teal80,
    indeterminate: palette.teal80,
    disabled: palette.neutral20,
  },
  borderColor: {
    default: palette.neutral60,
    checked: palette.teal80,
    indeterminate: palette.teal80,
    disabled: palette.neutral20,
  },
  borderWidth: "2px",
  color: {
    default: palette.neutral100,
    disabled: palette.neutral60,
  },
  fontSize: "16px",
  onDarkMode: {
    backgroundColor: {
      checked: palette.teal40,
      indeterminate: palette.teal40,
      disabled: palette.neutral80,
    },
    borderColor: {
      checked: palette.teal40,
      default: palette.neutral10,
      disabled: palette.neutral80,
      indeterminate: palette.teal40,
    },
    color: {
      default: palette.neutral10,
      disabled: palette.neutral60,
    },
    outline: palette.neutral10,  
  }
};