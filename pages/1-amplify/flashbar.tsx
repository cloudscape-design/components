import React, { useRef } from 'react';
import { Flashbar as CloudscapeFlashbar, FlashbarProps } from '~components';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { palette } from './theme';

export default function Flashbar({ items, stackItems }: FlashbarProps) {
  const mode = useCurrentMode(useRef(document.body));
  const backgroundColor = backgroundColors[mode];
  const color = colors[mode];
  return (
    <CloudscapeFlashbar
      items={items}
      stackItems={stackItems}
      style={{
        root: {
          backgroundColor,
          borderRadius: '4px',
          color,
        },
        notificationBar: {
          backgroundColor: {
            active: palette.neutral100,
            default: palette.neutral90,
            hover: palette.neutral90,
          },
          borderRadius: '4px',
        }
      }}
    />
  );
};

const backgroundColors = {
  light: {
    error: palette.red20,
    info: palette.blue20,
    success: palette.green20,
    warning: palette.orange20,
  },
  dark: {
    error: palette.red60,
    info: palette.blue60,
    success: palette.green60,
    warning: palette.orange60,
  },
};

const colors = {
  light: {
    error: palette.red100,
    info: palette.blue100,
    success: palette.green100,
    warning: palette.orange100,
  },
  dark: {
    error: palette.red10,
    info: palette.blue10,
    success: palette.green10,
    warning: palette.orange10,
  },
};