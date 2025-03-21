import React from 'react';
import { Select as CloudscapeSelect } from '~components';
import { Dropdown } from './dropdown';
import Theme from '~components/theming/component/index';
import { palette } from './theme';

export default function Selection(props: any) {
  return (
    <Theme
      borderColor={borderColors}
      borderRadius="4px"
      borderWidth="1px"
      boxShadow={boxShadows}
      height="42px"
      fill={fills}
      fontSize="16px"
      onDarkMode={{
        fill: darkModeFills
      }}
      paddingInline="16px"
      width="300px"
    >
      <CloudscapeSelect
        onChange={props.onChange}
        options={props.options}
        selectedOption={props.selectedOption}
        theme={{
          dropdown: Dropdown
        }}
      />
    </Theme>
  );
};

const borderColors = {
  default: palette.neutral60,
  focus: palette.teal90,
};

const boxShadows = {
  default: 'none',
  focus: `0px 0px 0px 2px ${palette.teal90}`
};

const fills = {
  default: palette.teal80,
  disabled: palette.neutral40,
  hover: palette.teal90,
};

const darkModeFills = {  
  default: palette.teal30,
  disabled: palette.neutral80,
  hover: palette.teal30
};