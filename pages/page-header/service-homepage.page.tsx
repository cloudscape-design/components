// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import PageHeader from '~components/page-header';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import Container from '~components/container';
import SpaceBetween from '~components/space-between';
import FormField from '~components/form-field';
import Select from '~components/select';
import Button from '~components/button';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        navigation={<Navigation />}
        toolsHide={true}
        disableContentPaddings={true}
        maxContentWidth={Number.MAX_VALUE}
        content={
          <div>
            <PageHeader
              colorMode="dark"
              subHeading="Fast and reliable delivery of your static content"
              metadata={<span>Networking &amp; Content Delivery</span>}
              maxWidth="66vw"
              secondaryContent={
                <Container>
                  <SpaceBetween size="xl">
                    <Box variant="h2" padding="n">
                      Create distribution
                    </Box>
                    <FormField stretch={true} label="Delivery method">
                      <Select
                        selectedAriaLabel="Selected"
                        placeholder="Select delivery method"
                        options={[]}
                        ariaRequired={true}
                        selectedOption={null}
                      />
                    </FormField>
                    <Button href="#" variant="primary">
                      Next step
                    </Button>
                  </SpaceBetween>
                </Container>
              }
              gridDefinition={[
                { colspan: { xl: 8, l: 7, xs: 7, default: 12 } },
                { colspan: { xl: 4, l: 5, xs: 5, default: 12 } },
              ]}
            >
              Amazon CloudFront
            </PageHeader>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '66vw' }}>
                <Containers />
              </div>
            </div>
          </div>
        }
      />
    </ScreenshotArea>
  );
}
