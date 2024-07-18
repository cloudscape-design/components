// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  Container,
  FormField,
  Header,
  Hotspot,
  Input,
  Select,
  SelectProps,
  SpaceBetween,
} from '~components';
import { CancelableEventHandler } from '~components/internal/events';
import Link from '~components/link';

const availableRegions = [
  { label: 'US East (N. Virginia) us-east-1', value: '1' },
  { label: 'US East (Ohio) us-east-2', value: '2' },
  { label: 'US West (N. California) us-west-1', value: '3' },
  { label: 'US West (Oregon) us-west-2', value: '4' },
] as Array<SelectProps.Option>;

export function PageOne({
  onCreate,
  showToolsPanel,
}: {
  onCreate: () => void;
  showToolsPanel: CancelableEventHandler;
}) {
  // State for the actual form content
  const [blockPublicAccess, setBlockPublicAccess] = useState(true);
  const [bucketName, setBucketName] = useState('');
  const [region, setRegion] = useState(availableRegions[0]);

  // Used to simulate delay when pressing the "create" button
  const [createEnabled, setCreateEnabled] = useState(true);

  const actionBar = (
    <SpaceBetween size="xs" direction="horizontal">
      <Hotspot side="left" hotspotId="bucket-name-adsfasdf">
        <Button>First</Button>
      </Hotspot>
      <Button>Second</Button>
    </SpaceBetween>
  );

  return (
    <SpaceBetween size="l">
      <Header variant="h1">Create a bucket</Header>

      <Container
        header={
          <Header variant="h2" actions={actionBar}>
            General configuration
          </Header>
        }
      >
        <SpaceBetween size="l">
          <FormField
            label="Bucket name"
            constraintText="Bucket name must not contain spaces, periods, uppercase letters, or hyphens."
            info={
              <Link variant="info" onFollow={showToolsPanel}>
                Info
              </Link>
            }
          >
            <Hotspot hotspotId="bucket-name">
              <Input value={bucketName} onChange={event => setBucketName(event.detail.value)} />
            </Hotspot>
          </FormField>

          <FormField
            label="Region"
            info={
              <Link variant="info" onFollow={showToolsPanel}>
                Info
              </Link>
            }
          >
            <Hotspot hotspotId="region-selector">
              <Select
                selectedOption={region}
                onChange={event => setRegion(event.detail.selectedOption)}
                options={availableRegions}
              />
            </Hotspot>
          </FormField>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            info={
              <Link variant="info" onFollow={showToolsPanel}>
                Info
              </Link>
            }
          >
            Bucket settings for Block Public Access
          </Header>
        }
      >
        <Checkbox checked={blockPublicAccess} onChange={event => setBlockPublicAccess(event.detail.checked)}>
          Block <em>all</em> public access<Hotspot hotspotId="block-public-access-checkbox" direction="right"></Hotspot>
        </Checkbox>
      </Container>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SpaceBetween size="xs" direction="horizontal">
          <Button>Cancel</Button>
          <Hotspot hotspotId="create-bucket-button">
            <Button
              variant="primary"
              loading={!createEnabled}
              onClick={() => {
                setCreateEnabled(false);
                setTimeout(() => {
                  setCreateEnabled(true);
                  onCreate();
                }, 800);
              }}
            >
              Create bucket
            </Button>
          </Hotspot>
        </SpaceBetween>
      </div>
    </SpaceBetween>
  );
}
