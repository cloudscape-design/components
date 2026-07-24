// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import FormField from '~components/form-field';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import { applyTheme } from '~components/theming';
import Tooltip from '~components/tooltip';

import { SimplePage } from '../app/templates';

type DurationOption = 'default' | 'slow' | 'very-slow' | 'none';

const durationValues: Record<DurationOption, string> = {
  default: '115ms',
  slow: '500ms',
  'very-slow': '1500ms',
  none: '0ms',
};

const easingValues: Record<string, string> = {
  default: 'cubic-bezier(0, 0, 0, 1)',
  'ease-out': 'ease-out',
  linear: 'linear',
  'ease-in-out': 'ease-in-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
};

export default function TooltipMotionPage() {
  const [duration, setDuration] = useState<DurationOption>('default');
  const [easing, setEasing] = useState<string>('default');

  useEffect(() => {
    const { reset } = applyTheme({
      theme: {
        tokens: {
          motionDurationTooltipEnter: durationValues[duration],
          motionEasingTooltipEnter: easingValues[easing],
        },
      } as any,
      baseThemeId: 'visual-refresh',
    });
    return reset;
  }, [duration, easing]);

  return (
    <SimplePage
      title="Tooltip Enter Animation Token"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="l">
          <FormField label="Animation duration (motionDurationTooltipEnter)">
            <SegmentedControl
              selectedId={duration}
              onChange={({ detail }) => setDuration(detail.selectedId as DurationOption)}
              options={[
                { id: 'default', text: `Default (${durationValues.default})` },
                { id: 'slow', text: `Slow (${durationValues.slow})` },
                { id: 'very-slow', text: `Very slow (${durationValues['very-slow']})` },
                { id: 'none', text: 'None (0ms)' },
              ]}
            />
          </FormField>
          <FormField label="Animation easing (motionEasingTooltipEnter)">
            <SegmentedControl
              selectedId={easing}
              onChange={({ detail }) => setEasing(detail.selectedId)}
              options={[
                { id: 'default', text: 'Default' },
                { id: 'ease-out', text: 'ease-out' },
                { id: 'linear', text: 'linear' },
                { id: 'ease-in-out', text: 'ease-in-out' },
                { id: 'bounce', text: 'Bounce' },
              ]}
            />
          </FormField>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="xl">
        <Box variant="h2">Hover or focus the buttons to see the tooltip enter animation</Box>

        <SpaceBetween direction="horizontal" size="l">
          <TooltipButton position="top" label="Top" content="Tooltip on top" />
          <TooltipButton position="right" label="Right" content="Tooltip on right" />
          <TooltipButton position="bottom" label="Bottom" content="Tooltip on bottom" />
          <TooltipButton position="left" label="Left" content="Tooltip on left" />
        </SpaceBetween>

        <Box variant="h3">Longer content</Box>
        <SpaceBetween direction="horizontal" size="l">
          <TooltipButton
            position="top"
            label="Multi-line"
            content="This tooltip has longer content to demonstrate the fade-in animation with more visual area."
          />
          <TooltipButton
            position="bottom"
            label="Rich content"
            content={
              <SpaceBetween size="xxs">
                <Box variant="strong">Tooltip title</Box>
                <Box variant="small">Supporting description with multiple lines of text for testing.</Box>
              </SpaceBetween>
            }
          />
        </SpaceBetween>

        <Box variant="h3">Rapid hover (toggle quickly to test animation restart)</Box>
        <SpaceBetween direction="horizontal" size="xs">
          {Array.from({ length: 5 }, (_, i) => (
            <TooltipButton key={i} position="top" label={`Item ${i + 1}`} content={`Tooltip ${i + 1}`} />
          ))}
        </SpaceBetween>

        <Box color="text-body-secondary" variant="small">
          Current settings: duration={durationValues[duration]}, easing={easingValues[easing]}
        </Box>
      </SpaceBetween>
    </SimplePage>
  );
}

function TooltipButton({
  position,
  label,
  content,
}: {
  position: 'top' | 'right' | 'bottom' | 'left';
  label: string;
  content: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  return (
    <div ref={ref} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Button
        nativeButtonAttributes={{
          onFocus: () => setShow(true),
          onBlur: () => setShow(false),
        }}
      >
        {label}
      </Button>
      {show && (
        <Tooltip content={content} getTrack={() => ref.current} position={position} onEscape={() => setShow(false)} />
      )}
    </div>
  );
}
