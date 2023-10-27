// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ContentLayout from '~components/content-layout';
import Box from '~components/box';
import Grid from '~components/grid';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation } from './utils/content-blocks';
import labels from './utils/labels';
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
        disableContentPaddings={false}
        content={
          <ContentLayout
            header={
              <Grid
                gridDefinition={[
                  { offset: { l: 2, xxs: 1 }, colspan: { l: 8, xxs: 10 } },
                  { colspan: { xl: 6, l: 5, s: 6, xxs: 10 }, offset: { l: 2, xxs: 1 } },
                  { colspan: { xl: 2, l: 3, s: 4, xxs: 10 }, offset: { s: 0, xxs: 1 } },
                ]}
              >
                <Box fontWeight="light" padding={{ top: 'xs' }}>
                  <span>Networking &amp; Content Delivery</span>
                </Box>
                <Header
                  variant="h1"
                  description={
                    <>
                      <Box fontWeight="light" padding={{ bottom: 's' }} fontSize="display-l" color="text-heading">
                        Fast and reliable delivery of your static content
                      </Box>
                      <Box variant="p">
                        Amazon CloudFront is a global content delivery network service (CDN) that accelerates delivery
                        of your websites, APIs, video content or other web assets through CDN caching.
                      </Box>
                    </>
                  }
                >
                  <Box fontWeight="heavy" padding="n" fontSize="display-l" color="inherit">
                    Amazon CloudFront
                  </Box>
                </Header>
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
              </Grid>
            }
          >
            <Containers />
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
