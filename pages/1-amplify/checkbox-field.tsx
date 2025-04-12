import React, { useRef } from 'react';
import { Checkbox as CloudscapeCheckbox } from '~components';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { palette } from './theme';

interface AmplifyCheckboxFieldProps {
  checked: boolean;
  isDisabled?: boolean;
  isIndeterminate?: boolean;
  label?: string;
  onChange?: any;
  readOnly?: boolean;
};

export default function CheckboxField({
  checked,
  isDisabled,
  isIndeterminate, 
  label,
  onChange,
  readOnly,
}: AmplifyCheckboxFieldProps) {
  const mode = useCurrentMode(useRef(document.body));
  const backgroundColor = backgroundColors[mode];
  const borderColor = borderColors[mode];
  const boxShadow = boxShadows[mode];

  return (
    <CloudscapeCheckbox 
      checked={checked}
      disabled={isDisabled}
      indeterminate={isIndeterminate}
      onChange={onChange} 
      readOnly={readOnly}
      style={{
        root: {
          backgroundColor,
          borderColor,
        },
        outline: { boxShadow }
      }}
    > 
      <span style={{ fontSize: '16px' }}>
        {label}
      </span>
    </CloudscapeCheckbox>
  );
};

const backgroundColors = {
  light: {
    checked: palette.teal80,
    indeterminate: palette.teal80,
    disabled: palette.neutral20,
  },
  dark: {
    checked: palette.teal40,
    indeterminate: palette.teal40,
    disabled: palette.neutral80,
  }
};

const borderColors = {
  light: {
    default: palette.neutral60,
    checked: palette.teal80,
    indeterminate: palette.teal80,
    disabled: palette.neutral20,
  },
  dark: {
    checked: palette.teal40,
    default: palette.neutral10,
    disabled: palette.neutral80,
    indeterminate: palette.teal40,
  }
};

const boxShadows = {
  light: 'rgb(0, 64, 77) 0px 0px 0px 2px', 
  dark: 'rgb(233, 249, 252) 0px 0px 0px 2px',
};