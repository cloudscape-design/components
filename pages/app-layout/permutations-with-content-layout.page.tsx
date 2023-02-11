// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BreadcrumbGroup } from '~components';
import Header from '~components/header';
import FormField from '~components/form-field';
import Input from '~components/input';
import Form from '~components/form';
import Container from '~components/container';
import ContentLayout from '~components/content-layout';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import appLayoutLabels from './utils/labels';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<AppLayoutProps>([
  {
    contentHeader: [<Header variant="h1">App layout header</Header>, undefined],
    disableContentHeaderOverlap: [false, true],
    content: [
      <ContentLayout>
        <form>
          <Form>
            <Container header={<Header variant="h2">Form section header</Header>}>
              <FormField label="First field">
                <Input value="" />
              </FormField>
            </Container>
          </Form>
        </form>
      </ContentLayout>,
      <ContentLayout header={<Header variant="h1">Content layout header</Header>}>
        <Form>
          <Container header={<Header variant="h2">Form section header</Header>}>
            <FormField label="First field">
              <Input value="" readOnly={true} />
            </FormField>
          </Container>
        </Form>
      </ContentLayout>,
      <Form header={<Header variant="h1">Form header</Header>}>
        <Container header={<Header variant="h2">Form section header</Header>}>
          <FormField label="First field">
            <Input value="" readOnly={true} />
          </FormField>
        </Container>
      </Form>,
    ],
    breadcrumbs: [
      <BreadcrumbGroup
        items={[
          { text: 'System', href: '#' },
          { text: 'Components', href: '#components' },
          {
            text: 'Breadcrumb group',
            href: '#components/breadcrumb-group',
          },
        ]}
        ariaLabel="Breadcrumbs"
      />,
    ],
    navigationOpen: [false],
  },
]);

export default function ContentLayoutPermutations() {
  return (
    <>
      <h1>Form + Content Layout permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <AppLayout toolsHide={true} navigationHide={true} ariaLabels={appLayoutLabels} {...permutation} />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
