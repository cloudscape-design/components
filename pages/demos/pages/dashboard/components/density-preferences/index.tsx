// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tiles from '@cloudscape-design/components/tiles';
import { Density } from '@cloudscape-design/global-styles';

import { currentDensity, updateDensity } from '../../../../common/apply-mode';
import { comfortableModeImage, compactModeImage } from './images';

interface DensityPreferencesDialogProps {
  onDismiss: () => void;
}

export function DensityPreferencesDialog({ onDismiss }: DensityPreferencesDialogProps) {
  const [value, setValue] = useState<Density>(currentDensity ?? 'comfortable');

  const handleSubmit = () => {
    updateDensity(value);
    onDismiss();
  };

  return (
    <Modal
      onDismiss={() => onDismiss()}
      visible={true}
      size="medium"
      closeAriaLabel="Close modal"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => onDismiss()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Confirm
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Density settings"
    >
      <FormField label="Content density" description="Choose the preferred level of content density for this console.">
        <Tiles
          onChange={({ detail }) => setValue(detail.value as Density)}
          value={value}
          items={[
            {
              value: 'comfortable',
              label: 'Comfortable',
              description: 'Default spacing that optimizes information consumption.',
              image: comfortableModeImage,
            },
            {
              value: 'compact',
              label: 'Compact',
              description: 'Reduced spacing that provides more visibility over content.',
              image: compactModeImage,
            },
          ]}
        />
      </FormField>
    </Modal>
  );
}
