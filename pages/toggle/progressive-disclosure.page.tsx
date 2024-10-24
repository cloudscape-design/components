// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, FormField, Select, SelectProps, Toggle } from '~components';

const langOptions: Array<SelectProps.Option> = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'de-CH', label: 'Deutsch (Schweiz)' },
];

export default function TogglePage() {
  const [applyAutomatic, setApplyAutomatic] = useState<boolean>(true);
  const [lang, setLang] = useState<SelectProps.Option>(langOptions[0]);

  return (
    <Box padding="l">
      <h1>Toggle progressive disclosure demo</h1>
      <FormField
        label="Language settings"
        description="You can select a specific language or have this service automatically identify the language in your media."
      >
        <Toggle checked={applyAutomatic} onChange={({ detail: { checked } }) => setApplyAutomatic(checked)}>
          Use Automatic Language
        </Toggle>
      </FormField>
      <Box id="language-settings" display={applyAutomatic ? 'none' : 'block'}>
        <FormField label="Language" description="Select the language you want to use.">
          <Select
            ariaRequired={!applyAutomatic}
            selectedOption={lang}
            onChange={event => setLang(event.detail.selectedOption)}
            options={langOptions}
          />
        </FormField>
      </Box>
    </Box>
  );
}
