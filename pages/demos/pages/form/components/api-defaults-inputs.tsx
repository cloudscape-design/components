// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import FormField from '@cloudscape-design/components/form-field';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { InfoLink } from '../../commons/common-components';
import { AVAILABILITY_ZONE_OPTIONS, ENCRYPTION_KEY_OPTIONS } from '../form-config';

interface APIDefaultsInputsProps {
  loadHelpPanelContent: (value: number) => void;
}

export default function APIDefaultsInputs({ loadHelpPanelContent }: APIDefaultsInputsProps) {
  const [encryptionKey, setEncryptionKey] = useState<SelectProps.Option>(ENCRYPTION_KEY_OPTIONS[0]);
  const [availabilityZone, setAvailabilityZone] = useState<SelectProps.Option>(AVAILABILITY_ZONE_OPTIONS[0]);

  return (
    <SpaceBetween size="l">
      <FormField
        label="Encryption key"
        description="You can encrypt using the KMS key that Secrets Manager creates or a customer managed key."
      >
        <Select
          options={ENCRYPTION_KEY_OPTIONS}
          selectedOption={encryptionKey}
          onChange={({ detail: { selectedOption } }) => setEncryptionKey(selectedOption)}
          triggerVariant="option"
          data-testid="encryption-key-select"
        />
      </FormField>

      <FormField label="Availability zone" info={<InfoLink onFollow={() => loadHelpPanelContent(12)} />}>
        <Select
          options={AVAILABILITY_ZONE_OPTIONS}
          selectedOption={availabilityZone}
          onChange={({ detail: { selectedOption } }) => setAvailabilityZone(selectedOption)}
          triggerVariant="option"
          data-testid="availability-zone-select"
        />
      </FormField>
    </SpaceBetween>
  );
}
