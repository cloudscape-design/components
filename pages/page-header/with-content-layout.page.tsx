// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ContentLayout from '~components/content-layout';
import Box from '~components/box';
import PageHeader from '~components/page-header';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers } from '../app-layout/utils/content-blocks';
import Container from '~components/container';
import SpaceBetween from '~components/space-between';
import FormField from '~components/form-field';
import Select from '~components/select';
import Button from '~components/button';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <ContentLayout
        maxWidth="800px"
        headerBackgroundCss="linear-gradient(135deg, #ECEDDC 25%, transparent 25%) -50px 0/100px 100px,
                  linear-gradient(225deg, #ECEDDC 25%, transparent 25%) -50px 0/100px 100px,
                  linear-gradient(315deg, #ECEDDC 25%, transparent 25%) 0 0/100px 100px,
                  linear-gradient(45deg, #ECEDDC 25%, transparent 25%) 0 0/100px 100px"
        header={
          <PageHeader
            subHeading="Fast and reliable delivery of your static content"
            metadata={<span>Networking &amp; Content Delivery</span>}
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
        }
      >
        <Containers />
      </ContentLayout>
    </ScreenshotArea>
  );
}
