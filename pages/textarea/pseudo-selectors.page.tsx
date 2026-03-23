// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Textarea from '~components/textarea';

import ScreenshotArea from '../utils/screenshot-area';

export default function TextareaPseudoSelectorsPage() {
  const [value, setValue] = useState('Test value');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [customStyling, setCustomStyling] = useState(false);

  const customStyle = {
    root: {
      borderColor: {
        default: '#3b82f6',
        hover: '#2563eb',
        focus: '#1d4ed8',
        disabled: '#93c5fd',
        readonly: '#60a5fa',
      },
      borderWidth: '2px',
      borderRadius: '8px',
      backgroundColor: {
        default: '#dbeafe',
        hover: '#bfdbfe',
        focus: '#bfdbfe',
        disabled: '#eff6ff',
        readonly: '#f0f9ff',
      },
      color: {
        default: '#1e40af',
        hover: '#1e40af',
        focus: '#1e3a8a',
        disabled: '#93c5fd',
        readonly: '#3b82f6',
      },
      fontSize: '16px',
      fontWeight: '500',
      paddingBlock: '10px',
      paddingInline: '14px',
    },
    placeholder: {
      color: '#60a5fa',
      fontSize: '14px',
      fontStyle: 'italic',
    },
  };

  return (
    <>
      <h1>Textarea Style API - Pseudo Selectors</h1>
      <ScreenshotArea>
        <Textarea
          ariaLabel="Test textarea"
          value={value}
          onChange={event => setValue(event.detail.value)}
          invalid={isInvalid}
          disabled={isDisabled}
          readOnly={isReadOnly}
          warning={isWarning}
          placeholder="Enter text"
          data-testid="test-textarea"
          style={customStyling ? customStyle : undefined}
        />
      </ScreenshotArea>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        <button id="toggle-styling" onClick={() => setCustomStyling(!customStyling)} type="button">
          Toggle Custom Styling ({customStyling ? 'ON' : 'OFF'})
        </button>
        <button id="toggle-invalid" onClick={() => setIsInvalid(!isInvalid)} type="button">
          Toggle Invalid ({isInvalid ? 'ON' : 'OFF'})
        </button>
        <button id="toggle-disabled" onClick={() => setIsDisabled(!isDisabled)} type="button">
          Toggle Disabled ({isDisabled ? 'ON' : 'OFF'})
        </button>
        <button id="toggle-readonly" onClick={() => setIsReadOnly(!isReadOnly)} type="button">
          Toggle ReadOnly ({isReadOnly ? 'ON' : 'OFF'})
        </button>
        <button id="toggle-warning" onClick={() => setIsWarning(!isWarning)} type="button">
          Toggle Warning ({isWarning ? 'ON' : 'OFF'})
        </button>
        <button
          id="reset-all"
          onClick={() => {
            setCustomStyling(false);
            setIsInvalid(false);
            setIsDisabled(false);
            setIsReadOnly(false);
            setIsWarning(false);
          }}
          type="button"
        >
          Reset All
        </button>
      </div>
    </>
  );
}
