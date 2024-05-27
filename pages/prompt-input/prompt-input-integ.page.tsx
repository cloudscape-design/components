// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Input from '~components/input';

export default function Page() {
  const [value, setValue] = useState('');
  const [submitStatus, setSubmitStatus] = useState(false);
  const [isKeyboardSubmittingDisabled, setDisableKeyboardSubmitting] = useState(false);

  return (
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
  );
}
