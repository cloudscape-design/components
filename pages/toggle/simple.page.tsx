// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Toggle from '~components/toggle';

export default function ToggleSimpleScenario() {
  const [checked, setChecked] = useState(false);
  const [loadingChecked, setLoadingChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SIMULATED_ASYNC_DELAY_MS = 2000;

  function handleLoadingChange(event: { detail: { checked: boolean } }) {
    if (isLoading) {
      return;
    }
    const newChecked = event.detail.checked;
    setIsLoading(true);
    setTimeout(() => {
      setLoadingChecked(newChecked);
      setIsLoading(false);
    }, SIMULATED_ASYNC_DELAY_MS);
  }

  return (
    <>
      <h1>Toggle demo</h1>
      <FormField description="This is a description." label="Form field label" id="formfield-with-toggle">
        <Toggle
          checked={checked}
          onChange={event => {
            setChecked(event.detail.checked);
          }}
        >
          Toggle within Formfield
        </Toggle>
      </FormField>
      <h2>Loading state</h2>
      <Toggle
        checked={loadingChecked}
        loading={isLoading}
        i18nStrings={{ loadingText: 'Saving preference' }}
        onChange={handleLoadingChange}
      >
        Toggle with async loading (2s delay)
      </Toggle>
      <h2>Loading states (static)</h2>
      <Toggle checked={false} loading={true} i18nStrings={{ loadingText: 'Saving preference' }} onChange={() => {}}>
        Loading, unchecked
      </Toggle>
      <Toggle checked={true} loading={true} i18nStrings={{ loadingText: 'Saving preference' }} onChange={() => {}}>
        Loading, checked
      </Toggle>
      <Toggle
        checked={false}
        loading={true}
        disabled={true}
        i18nStrings={{ loadingText: 'Saving preference' }}
        onChange={() => {}}
      >
        Loading + disabled (loading takes precedence)
      </Toggle>
    </>
  );
}
