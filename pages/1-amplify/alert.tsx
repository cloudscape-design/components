import React, { useRef } from 'react';
import { Alert as CloudscapeAlert } from '~components';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { palette } from './theme';

interface AmplifyAlertProps {
  children?: React.ReactNode;
  heading?: string;
  variation: 'default' | 'error' | 'info' | 'warning' | 'success';
}

export default function Alert({ children, heading, variation }: AmplifyAlertProps) {
  const mode = useCurrentMode(useRef(document.body));
  const backgroundColor = backgroundColors[mode][variation];
  const color = colors[mode][variation];

  return (
    <CloudscapeAlert 
      header={heading} 
      type={variation === 'default' ? 'info' : variation}
      style={{
        root: {
          backgroundColor,
          borderRadius: '0px',
          borderWidth: '0px',
        },
        header: { color },
        icon: { color }
      }}
    >
      <span style={{ color }}>
        {children}
      </span>
    </CloudscapeAlert>
  );
};

const colors = {
  light: {
    default: palette.neutral100,
    error: palette.red100,
    info: palette.blue100,
    success: palette.green100,
    warning: palette.orange100,
  },
  dark: {
    default: palette.neutral40,
    error: palette.red20,
    info: palette.blue20,
    success: palette.green20,
    warning: palette.orange20,
  }
};

const backgroundColors = {
  light: {
    default: palette.neutral20, 
    error: palette.red10,
    info: palette.blue10,
    success: palette.green10,
    warning: palette.orange10,
  },
  dark: {
    ...colors.light,
    default: palette.neutral80,
  }
};