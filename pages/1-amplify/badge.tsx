import React, { useRef } from 'react';
import { Badge as CloudscapeBadge } from '~components';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { palette } from './theme';

interface AmplifyBadgeProps {
  children?: React.ReactNode;
  variation: 'default' | 'error' | 'info' | 'warning' | 'success';
}

export default function Badge({ children, variation }: AmplifyBadgeProps) {
  const mode = useCurrentMode(useRef(document.body));
  const backgroundColor = backgroundColors[mode][variation];
  const color = colors[mode][variation];

  return (
    <CloudscapeBadge
      style={{
        root: {
          backgroundColor,
          borderRadius: '32px',
          borderWidth: '0px',
          paddingBlock: '5px',
          paddingInline: '12px'
        }
      }}>
        <span style={{ color, fontWeight: 600}}>
          {children}
        </span>
    </CloudscapeBadge>
  );
}

const colors = {
  light: {
    default: palette.neutral100,
    error: palette.red100,
    info: palette.blue100,
    success: palette.green100,
    warning: palette.orange100
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