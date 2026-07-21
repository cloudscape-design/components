// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Header from '~components/header';
import Icon from '~components/icon';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import TextContent from '~components/text-content';
import Toggle from '~components/toggle';

export default function Typography() {
  const [longText, setLongText] = useState(false);
  return (
    <>
      <Box padding={{ bottom: 's' }}>
        <Header
          variant="h2"
          actions={
            <Toggle onChange={({ detail }) => setLongText(detail.checked)} checked={longText}>
              Long text
            </Toggle>
          }
        >
          Typography & Iconography
        </Header>
      </Box>
      <Container>
        <TextContent>
          <SpaceBetween size="xs">
            {longText ? (
              <>
                <h1>Heading 1: The instance type you specify determines the hardware of the host computer.</h1>
                <h2>Heading 2: The instance type you specify determines the hardware of the host computer.</h2>
                <h3>Heading 3: The instance type you specify determines the hardware of the host computer.</h3>
                <h4>Heading 4: The instance type you specify determines the hardware of the host computer.</h4>
                <h5>Heading 5: The instance type you specify determines the hardware of the host computer.</h5>
              </>
            ) : (
              <>
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <h4>Heading 4</h4>
                <h5>Heading 5</h5>
              </>
            )}
          </SpaceBetween>
        </TextContent>
        <Box variant="p" padding={{ top: 'm' }}>
          {longText ? (
            <>
              Paragraph - The instance type you specify determines the hardware of the host computer used for your
              instance. Each instance type offers different compute, memory, and storage capabilities.{' '}
              <Link variant="primary" href="#">
                Amazon EC2
              </Link>{' '}
              provides each instance with a consistent and predictable amount of CPU capacity, regardless of its{' '}
              <Link variant="primary" href="#">
                underlying hardware
              </Link>
              .
            </>
          ) : (
            <>
              Paragraph -{' '}
              <Link variant="primary" href="#">
                Amazon EC2
              </Link>{' '}
              provides each instance with a consistent and predictable amount of CPU capacity, regardless of its{' '}
              <Link variant="primary" href="#">
                underlying hardware
              </Link>
              .
            </>
          )}
        </Box>
        <Box variant="small" color="text-body-secondary" padding={{ top: 's' }}>
          {longText ? (
            <>Small - Daily instance hours by instance type, aggregated across all regions and availability zones.</>
          ) : (
            <>Small - Requirements and constraints for the field.</>
          )}
        </Box>
        <Box padding={{ bottom: 'xxs', top: 'm' }}>
          <Box padding={{ vertical: 'xs' }}>Icon - Normal size</Box>
          <ColumnLayout columns={8}>
            <Icon name="add-plus" />
            <Icon name="thumbs-up" />
            <Icon name="settings" />
            <Icon name="close" />
            <Icon name="check" />
            <Icon name="star" />
            <Icon name="send" />
            <Icon name="refresh" />
            <Icon name="edit" />
            <Icon name="remove" />
            <Icon name="copy" />
            <Icon name="share" />
            <Icon name="lock-private" />
            <Icon name="anchor-link" />
            <Icon name="folder" />
            <Icon name="file" />
            <Icon name="user-profile" />
            <Icon name="status-info" />
          </ColumnLayout>
        </Box>
      </Container>
    </>
  );
}
