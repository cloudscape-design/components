import React from 'react';
import { Input as CloudscapeInput } from '~components';
import Theme from '~components/theming/component/index';
import { palette } from './theme';

export default function Input(props: any) {
  return (
    <Theme
      backgroundColor={backgroundColors}
      borderColor={borderColors}
      borderRadius="4px"
      borderWidth="1px"
      boxShadow={boxShadows}
      color={colors}
      fontSize="16px"
      fontStyle="normal"
      height="42px"
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors,
        borderColor: darkModeBorderColors,
        color: darkModeColors,
      }}
      paddingInline="16px"
      width="300px"
    >
      <CloudscapeInput 
        disabled={props.isDisabled}
        placeholder={props.placeholder}
        value={props.value} 
      />
    </Theme>
  );
};

const backgroundColors = {
  default: 'transparent',
  disabled: palette.neutral20,
}; 

const borderColors = {
  default: palette.neutral60,
  focus: palette.teal90,
};

const boxShadows = {
  default: 'none',
  focus: `0px 0px 0px 2px ${palette.teal90}`,
};

const colors = {
  default: palette.neutral100,
  disabled: palette.neutral60,
  empty: palette.neutral60,
};

const darkModeBackgroundColors = {
  default: 'transparent',
  disabled: palette.neutral80,
}; 

const darkModeBorderColors = {
  default: palette.neutral80,
  focus: palette.white,
};

const darkModeColors = {
  default: palette.white,
  disabled: palette.neutral60,
  empty: palette.neutral80,
}
