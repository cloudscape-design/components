import React from 'react';
import { Checkbox as CloudscapeCheckbox } from '~components';
import Theme from '~components/theming/component/index';
import { palette } from './palette';

export default function CheckboxField(props: any) {
  return (
    <Theme
      backgroundColor={backgroundColors}
      borderColor={backgroundColors}
      color={colors}
      fontSize="16px"
      outline={palette.neutral80}
    >
      <Theme.DarkMode
        backgroundColor={darkModeBackgroundColors}
        borderColor={darkModeBackgroundColors}
        color={darkModeColors}
        outline={palette.neutral10}
      >
        <CloudscapeCheckbox 
          checked={props.checked}
          disabled={props.isDisabled}
          indeterminate={props.isIndeterminate}
          onChange={props.onChange} 
          readOnly={props.readOnly}
        >
          {props.label}
        </CloudscapeCheckbox>
      </Theme.DarkMode>
    </Theme>
  );
};

const backgroundColors = {
  checked: palette.teal80,
  indeterminate: palette.teal80,
  disabled: palette.neutral20,
};

const colors = {
  default: palette.neutral100,
  disabled: palette.neutral60,
};

const darkModeBackgroundColors = {
  checked: palette.teal40,
  indeterminate: palette.teal40,
  disabled: palette.neutral80,
};

const darkModeColors = {
  default: palette.neutral10,
  disabled: palette.neutral60,
};
