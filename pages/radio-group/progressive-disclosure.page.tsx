// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';

const langOptions: Array<SelectProps.Option> = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'de-CH', label: 'Deutsch (Schweiz)' },
];

export default function RadiosPage() {
  const [radioSelection, setRadioSelection] = useState<string>('');
  const [lang, setLang] = useState<SelectProps.Option>(langOptions[0]);

  return (
    <Box padding="l">
      <h1>Radio group progressive disclosure demo</h1>
      <FormField
        label="Language settings"
        description="You can select a specific language or have this service automatically identify the language in your media."
      >
        <RadioGroup
          value={radioSelection}
          onChange={event => setRadioSelection(event.detail.value)}
          ariaControls="language-settings"
          items={[
            {
              label: 'Specific language',
              value: 'specific',
              description:
                'If you know the language spoken in the source media, choose this option for optimal results.',
            },
            {
              label: 'Automatic language detection',
              value: 'automatic',
              description: 'If you do not know the language spoken in the source media, choose this option.',
            },
          ]}
        />
      </FormField>
      <Box id="language-settings" display={radioSelection !== 'specific' ? 'none' : 'block'}>
        <FormField label="Language" description="Select the language you want to use.">
          <Select
            selectedOption={lang}
            onChange={event => setLang(event.detail.selectedOption)}
            options={langOptions}
          />
        </FormField>
      </Box>
    </Box>
  );
}
