// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Input from '~components/input';

export default function Page() {
  const [value, setValue] = useState('');
  const [submitStatus, setSubmitStatus] = useState(false);
  const [isKeyboardSubmittingDisabled, setDisableKeyboardSubmitting] = useState(false);

  // State for styleable input
  const [styleableValue, setStyleableValue] = useState('Test value');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  return (
    <>
      <div id="test">
        <h1>Input submit check</h1>
        {submitStatus ? <div id="submit-success">Submitted</div> : null}
        <form
          onSubmit={event => {
            console.log('submitted');
            event.preventDefault();
            setSubmitStatus(true);
          }}
        >
          <Input
            ariaLabel="test input"
            type="number"
            step={0.2}
            value={value}
            onChange={event => setValue(event.detail.value)}
            onKeyDown={event => {
              if (isKeyboardSubmittingDisabled) {
                console.log('prevent!');
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          />
          <button id="disable-form-submitting" onClick={() => setDisableKeyboardSubmitting(true)} type="button">
            Disable keyboard form submitting
          </button>
        </form>
      </div>

      <div id="styleable-input-test">
        <h1>Input Style API with State Toggles</h1>
        <div style={{ marginBottom: '20px' }}>
          <Input
            ariaLabel="Styleable test input"
            value={styleableValue}
            onChange={event => setStyleableValue(event.detail.value)}
            invalid={isInvalid}
            disabled={isDisabled}
            readOnly={isReadOnly}
            warning={isWarning}
            placeholder="Enter text"
            data-testid="styleable-input"
            style={{
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
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
        </div>
      </div>
    </>
  );
}
