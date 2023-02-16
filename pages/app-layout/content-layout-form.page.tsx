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

import { Breadcrumbs } from './utils/content-blocks';
import labels from './utils/labels';

export default function () {
  const [appLayoutHeader, toggleAppLayoutHeader] = useState(false);
  const [appLayoutOverlap, toggleAppLayoutOverlap] = useState(true);

  const [contentLayout, toggleContentLayout] = useState(false);
  const [contentLayoutHeader, toggleContentLayoutHeader] = useState(false);
  const [contentLayoutOverlap, toggleContentLayoutOverlap] = useState(true);

  const [formHeader, toggleFormHeader] = useState(true);

  const form = (
    <form>
      <Form header={formHeader && <Header variant="h1">Form header</Header>}>
        <Container header={<Header variant="h2">Form section header</Header>}>
          <FormField label="Form field">
            <Input value="" readOnly={true} />
          </FormField>
        </Container>
      </Form>
    </form>
  );

  return (
    <AppLayout
      ariaLabels={labels}
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
            <Toggle onChange={() => toggleContentLayout(!contentLayout)} checked={contentLayout}>
              Content layout
            </Toggle>
            <Box padding={{ left: 'xxl' }}>
              <Toggle
                onChange={() => toggleContentLayoutHeader(!contentLayoutHeader)}
                disabled={!contentLayout}
                checked={contentLayoutHeader}
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
            <Toggle onChange={() => toggleFormHeader(!formHeader)} checked={formHeader}>
              Form header
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
  );
}
