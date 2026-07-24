// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Select, { SelectProps } from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';

// SelectProps.CustomTriggerProps is added by the implementation agent in parallel.
// Until the interfaces file is updated, we declare a local alias to avoid implicit-any
// on the renderCustomTrigger callback parameters.
type CustomTriggerProps = SelectProps.CustomTriggerProps;

const options: SelectProps.Options = [
  {
    value: 'direct',
    label: 'Create a case',
    description: 'Submit a support case directly to AWS Support.',
  },
  {
    value: 'ai-assist',
    label: 'AI assist, then create a case',
    iconName: 'gen-ai',
    description: 'Let AI help draft your case details before submitting.',
  },
];

export default function RenderCustomTriggerPage() {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(options[0]);

  return (
    <ScreenshotArea>
      <Box variant="h1">Select — renderCustomTrigger</Box>
      <Box padding="l">
        <Box variant="p" color="text-body-secondary">
          Demonstrates a flat, borderless link-style trigger (replicating the AWS Support Console pattern from
          CR-273907463). Test: click trigger to open dropdown; selecting an option updates the trigger label and icon;
          keyboard — Enter/Space opens, Escape closes, focus returns to trigger.
        </Box>
        <Box margin={{ top: 'm' }}>
          <Select
            selectedOption={selectedOption}
            onChange={({ detail }: { detail: SelectProps.ChangeDetail }) => setSelectedOption(detail.selectedOption)}
            options={options}
            renderCustomTrigger={({ triggerRef, isOpen, onClick, ariaProps }: CustomTriggerProps) => (
              <button
                ref={triggerRef as React.Ref<HTMLButtonElement>}
                onClick={onClick}
                aria-haspopup="listbox"
                {...ariaProps}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  background: 'transparent',
                  color: '#0972d3',
                  cursor: 'pointer',
                  padding: '0',
                  font: 'inherit',
                  fontWeight: isOpen ? 'bold' : 'normal',
                  textDecoration: 'underline',
                }}
              >
                {selectedOption?.iconName && (
                  <span aria-hidden="true" style={{ fontSize: '1em' }}>
                    ✦
                  </span>
                )}
                {selectedOption?.label ?? 'Choose mode'}
              </button>
            )}
          />
        </Box>
      </Box>
    </ScreenshotArea>
  );
}
