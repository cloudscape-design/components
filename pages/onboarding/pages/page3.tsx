// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Container, Header, Hotspot, SpaceBetween, StatusIndicator } from '~components';

export function PageThree({ onProceed }: { onProceed: () => void }) {
  const [fileState, setFileState] = useState('not set');

  const uploadFile = () => {
    setFileState('uploading');
    setTimeout(() => setFileState('finished'), 1000);
  };

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Bucket &quot;MyDemoBucket101&quot;</Header>}>
        <SpaceBetween size="l">
          <SpaceBetween size="xs" direction="horizontal">
            <Button onClick={uploadFile} disabled={fileState === 'uploading'}>
              Upload file
            </Button>
            <Hotspot hotspotId="upload-file-button"></Hotspot>
          </SpaceBetween>

          {fileState !== 'not set' && (
            <StatusIndicator type={fileState === 'uploading' ? 'loading' : 'success'}>
              {fileState === 'uploading' ? 'Uploading...' : 'File "my-example-document.pdf" was successfully uploaded'}
            </StatusIndicator>
          )}
        </SpaceBetween>
      </Container>
      <Button variant="primary" disabled={fileState !== 'finished'} onClick={() => onProceed()}>
        Proceed
      </Button>
    </SpaceBetween>
  );
}
