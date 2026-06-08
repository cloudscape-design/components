// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import {
  Box,
  ColumnLayout,
  Container,
  Header,
  Icon,
  Link,
  SpaceBetween,
  TextContent,
  Toggle,
} from '@cloudscape-design/components';

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
                <h1>
                  Heading 1: The instance type you specify determines the hardware of the host computer used for your
                  instance. Each instance type offers different compute, memory, and storage capabilities.
                </h1>
                <h2>
                  Heading 2: The instance type you specify determines the hardware of the host computer used for your
                  instance. Each instance type offers different compute, memory, and storage capabilities.
                </h2>
                <h3>
                  Heading 3: The instance type you specify determines the hardware of the host computer used for your
                  instance. Each instance type offers different compute, memory, and storage capabilities.
                </h3>
                <h4>
                  Heading 4: The instance type you specify determines the hardware of the host computer used for your
                  instance. Each instance type offers different compute, memory, and storage capabilities.
                </h4>
                <h5>
                  Heading 5: The instance type you specify determines the hardware of the host computer used for your
                  instance. Each instance type offers different compute, memory, and storage capabilities.
                </h5>
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
              instance. Each instance type offers different compute, memory, and storage capabilities, and is grouped in
              an instance family based on these capabilities. Select an instance type based on the requirements of the
              application or software that you plan to run on your instance.{' '}
              <Link variant="primary" href="#">
                Amazon EC2
              </Link>{' '}
              provides each instance with a consistent and predictable amount of CPU capacity, regardless of its{' '}
              <Link variant="primary" href="#">
                underlying hardwares
              </Link>
              . The order of buttons is important when action is required on a data set. It follows the order of major
              actions that can be performed on items.
            </>
          ) : (
            <>
              Paragraph -{' '}
              <Link variant="primary" href="#">
                Amazon EC2
              </Link>{' '}
              provides each instance with a consistent and predictable amount of CPU capacity, regardless of its{' '}
              <Link variant="primary" href="#">
                underlying hardwares
              </Link>
              . The order of buttons is important when action is required on a data set. It follows the order of major
              actions that can be performed on items.
            </>
          )}
        </Box>
        <Box variant="small" color="text-body-secondary" padding={{ top: 's' }}>
          {longText ? (
            <>
              Small - Daily instance hours by instance type, aggregated across all regions and availability zones in
              your account. By default the form field will take up 66% of its container width. Enabling the stretch
              property will set the width of the form field to 100%. This can be done for fields where a full-width
              layout is more appropriate, such as when using multi column layout.
            </>
          ) : (
            <>Small - Requirements and constraints for the field.</>
          )}
        </Box>
        {/* <Box padding={{ bottom: 'xxs', top: 'm' }}>
          <Box padding={{ vertical: 'xs' }}>Icon - Small size</Box>
          <ColumnLayout columns={8}>
            <Icon name="add-plus" size="small" />
            <Icon name="thumbs-up" size="small" />
            <Icon name="settings" size="small" />
            <Icon name="close" size="small" />
            <Icon name="check" size="small" />
            <Icon name="star" size="small" />
            <Icon name="send" size="small" />
            <Icon name="refresh" size="small" />
            <Icon name="edit" size="small" />
            <Icon name="remove" size="small" />
            <Icon name="copy" size="small" />
            <Icon name="share" size="small" />
            <Icon name="lock-private" size="small" />
            <Icon name="anchor-link" size="small" />
            <Icon name="edit-gen-ai" size="small" />
            <Icon name="folder" size="small" />
            <Icon name="file" size="small" />
            <Icon name="user-profile" size="small" />
            <Icon name="status-info" size="small" />
          </ColumnLayout>
        </Box> */}
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
            <Icon name="edit-gen-ai" />
            <Icon name="folder" />
            <Icon name="file" />
            <Icon name="user-profile" />
            <Icon name="status-info" />
          </ColumnLayout>
        </Box>
        {/* <Box padding={{ bottom: 'xxs' }}>
          <Box padding={{ vertical: 'xs' }}>Icon - Medium size</Box>
          <ColumnLayout columns={8}>
            <Icon name="add-plus" size="medium" />
            <Icon name="thumbs-up" size="medium" />
            <Icon name="settings" size="medium" />
            <Icon name="close" size="medium" />
            <Icon name="check" size="medium" />
            <Icon name="star" size="medium" />
            <Icon name="send" size="medium" />
            <Icon name="refresh" size="medium" />
            <Icon name="edit" size="medium" />
            <Icon name="remove" size="medium" />
            <Icon name="copy" size="medium" />
            <Icon name="share" size="medium" />
            <Icon name="lock-private" size="medium" />
            <Icon name="anchor-link" size="medium" />
            <Icon name="edit-gen-ai" size="medium" />
            <Icon name="folder" size="medium" />
            <Icon name="file" size="medium" />
            <Icon name="user-profile" size="medium" />
            <Icon name="status-info" size="medium" />
          </ColumnLayout>
        </Box>
        <Box padding={{ bottom: 'xxs' }}>
          <Box padding={{ vertical: 'xs' }}>Icon - Big size</Box>
          <ColumnLayout columns={8}>
            <Icon name="add-plus" size="big" />
            <Icon name="thumbs-up" size="big" />
            <Icon name="settings" size="big" />
            <Icon name="close" size="big" />
            <Icon name="check" size="big" />
            <Icon name="star" size="big" />
            <Icon name="send" size="big" />
            <Icon name="refresh" size="big" />
            <Icon name="edit" size="big" />
            <Icon name="remove" size="big" />
            <Icon name="copy" size="big" />
            <Icon name="share" size="big" />
            <Icon name="lock-private" size="big" />
            <Icon name="anchor-link" size="big" />
            <Icon name="edit-gen-ai" size="big" />
            <Icon name="folder" size="big" />
            <Icon name="file" size="big" />
            <Icon name="user-profile" size="big" />
            <Icon name="status-info" size="big" />
          </ColumnLayout>
        </Box>
        <Box padding={{ bottom: 'xxs' }}>
          <Box padding={{ vertical: 'xs' }}>Icon - Large size</Box>
          <ColumnLayout columns={8}>
            <Icon name="add-plus" size="large" />
            <Icon name="thumbs-up" size="large" />
            <Icon name="settings" size="large" />
            <Icon name="close" size="large" />
            <Icon name="check" size="large" />
            <Icon name="download" size="large" />
            <Icon name="upload" size="large" />
            <Icon name="refresh" size="large" />
            <Icon name="edit" size="large" />
            <Icon name="remove" size="large" />
            <Icon name="copy" size="large" />
            <Icon name="share" size="large" />
            <Icon name="lock-private" size="large" />
            <Icon name="anchor-link" size="large" />
            <Icon name="edit-gen-ai" size="large" />
            <Icon name="folder" size="large" />
            <Icon name="file" size="large" />
            <Icon name="user-profile" size="large" />
            <Icon name="status-info" size="large" />
          </ColumnLayout>
        </Box> */}
      </Container>
    </>
  );
}
