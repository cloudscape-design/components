// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import ContentLayout from '~components/content-layout';
import Form from '~components/form';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import appLayoutLabels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [appLayoutHeader, toggleAppLayoutHeader] = useState(false);
  const [appLayoutOverlap, toggleAppLayoutOverlap] = useState(true);

  const [contentLayout, toggleContentLayout] = useState(false);
  const [contentLayoutHeader, toggleContentLayoutHeader] = useState(true);
  const [contentLayoutOverlap, toggleContentLayoutOverlap] = useState(true);

  const [formHeader, toggleFormHeader] = useState(true);
  const [formContent, toggleFormContent] = useState(true);

  const form = (
    <form>
      <Form header={formHeader && <Header variant="h1">Form header</Header>}>
        {formContent && (
          <Container header={<Header variant="h2">Form section header</Header>}>
            <FormField label="Form field">
              <Input value="" readOnly={true} />
            </FormField>
          </Container>
        )}
      </Form>
    </form>
  );

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        navigationOpen={false}
        notifications={
          <ColumnLayout columns={3}>
            <SpaceBetween size="xxs">
              <Toggle onChange={() => toggleAppLayoutHeader(!appLayoutHeader)} checked={appLayoutHeader}>
                App layout header
              </Toggle>
              <Toggle onChange={() => toggleAppLayoutOverlap(!appLayoutOverlap)} checked={appLayoutOverlap}>
                App layout overlap
              </Toggle>
            </SpaceBetween>
            <SpaceBetween size="xxs">
              <Toggle
                data-testid="toggle-content-layout"
                onChange={() => toggleContentLayout(!contentLayout)}
                checked={contentLayout}
              >
                Content layout
              </Toggle>
              <Box padding={{ left: 'xxl' }}>
                <Toggle
                  onChange={() => toggleContentLayoutHeader(!contentLayoutHeader)}
                  disabled={!contentLayout}
                  checked={contentLayoutHeader}
                  data-testid="toggle-content-layout-header"
                >
                  Content layout header
                </Toggle>
                <Toggle
                  onChange={() => toggleContentLayoutOverlap(!contentLayoutOverlap)}
                  disabled={!contentLayout}
                  checked={contentLayoutOverlap}
                >
                  Content layout overlap
                </Toggle>
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xxs">
              <Toggle
                onChange={() => toggleFormHeader(!formHeader)}
                checked={formHeader}
                data-testid="toggle-form-header"
              >
                Form header
              </Toggle>
              <Toggle onChange={() => toggleFormContent(!formContent)} checked={formContent}>
                Form content
              </Toggle>
            </SpaceBetween>
          </ColumnLayout>
        }
        breadcrumbs={<Breadcrumbs />}
        contentHeader={appLayoutHeader && <Header variant="h1">App layout header</Header>}
        disableContentHeaderOverlap={!appLayoutOverlap}
        content={
          contentLayout ? (
            <ContentLayout
              header={contentLayoutHeader && <Header variant="h1">Content layout header</Header>}
              disableOverlap={!contentLayoutOverlap}
            >
              {form}
            </ContentLayout>
          ) : (
            form
          )
        }
      />
    </ScreenshotArea>
  );
}
