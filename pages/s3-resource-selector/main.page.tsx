// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { AppLayout, BreadcrumbGroup, Button, Modal } from '~components';
import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';

export default function S3PickerExample() {
  const [visible, setVisible] = useState(false);

  return (
    <AppLayout
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Cloudscape', href: '#' },
            { text: 'S3', href: '#' },
          ]}
        />
      }
      content={
        <Box padding="l">
          <Container header={<Header headingTagOverride="h1">S3 Resource Selector Example</Header>}>
            <Button onClick={() => setVisible(true)}>Open Modal</Button>

            {visible && (
              <Modal visible={true} onDismiss={() => setVisible(false)}>
                <BreadcrumbGroup
                  items={[
                    { text: 'inside', href: '#' },
                    { text: 'modal', href: '#' },
                  ]}
                />
              </Modal>
            )}
          </Container>
        </Box>
      }
    />
  );
}
