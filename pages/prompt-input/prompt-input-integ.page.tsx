// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PromptInput from '~components/prompt-input';

export default function Page() {
  const [value, setValue] = useState('');
  const [submitStatus, setSubmitStatus] = useState(false);
  const [isKeyboardSubmittingDisabled, setDisableKeyboardSubmitting] = useState(false);

  return (
    <div id="test">
      <h1>Prompt input submit check</h1>
      {submitStatus ? <div id="submit-success">Submitted</div> : null}
      <form
        onSubmit={event => {
          console.log('submitted');
          event.preventDefault();
          setSubmitStatus(true);
        }}
      >
        <PromptInput
          ariaLabel="test prompt input"
          actionButtonIconName="send"
          actionButtonAriaLabel="Send"
          value={value}
          onChange={event => setValue(event.detail.value)}
          onAction={() => window.alert('Sent message!')}
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
