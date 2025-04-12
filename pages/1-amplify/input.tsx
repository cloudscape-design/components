import React, { useRef } from 'react';
import { Input as CloudscapeInput } from '~components';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { palette } from './theme';

interface AmplifyInputProps {
  isDisabled?: boolean;
  placeholder?: string;
  value?: any;
}

export default function AmplifyInputProps({
  isDisabled,
  placeholder,
  value,
}: AmplifyInputProps) {
  const mode = useCurrentMode(useRef(document.body));
  const backgroundColor = backgroundColors[mode];
  const borderColor = borderColors[mode];
  const boxShadow = boxShadows[mode];
  const color = colors[mode];

  return (
    <CloudscapeInput 
      disabled={isDisabled}
      placeholder={placeholder}
      value={value}
      style={{
        root: {
          backgroundColor,
          borderColor,
          borderRadius: '4px',
          borderWidth: '1px',
          color,
          fontSize: '16px',
          paddingBlock: '8px',
          paddingInline: '16px',
        },
        outline: { boxShadow }
      }}
    />
  );
};

const backgroundColors = {
  light: {
    default: 'transparent',
    disabled: palette.neutral20,
  },
  dark: {
    default: 'transparent',
    disabled: palette.neutral80,
  }
}; 

const borderColors = {
  light: {
    default: palette.neutral60,
    focus: palette.teal90,
  },
  dark: {
    default: palette.neutral80,
    focus: palette.white,
  }
};

const colors = {
  light: {
    default: palette.neutral100,
    disabled: palette.neutral60,
  },
  dark: {
    disabled: palette.neutral60,
    default: palette.white,
  }
};

const boxShadows = {
  light: `${palette.teal90} 0px 0px 0px 2px`, 
  dark: 'rgb(233, 249, 252) 0px 0px 0px 2px',
};