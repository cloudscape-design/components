// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Header from '~components/header';
import FormField from '~components/form-field';
import Input from '~components/input';
import Form from '~components/form';
import Container from '~components/container';
import ContentLayout, { ContentLayoutProps } from '~components/content-layout';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import AppLayout from '~components/app-layout';
import { BreadcrumbGroup } from '~components';

/* eslint-disable react/jsx-key */
const formPermutations = createPermutations<ContentLayoutProps>([
  {
    header: [<Header variant="h1">Content Layout header</Header>, undefined],
    children: [
      <Form>
        <Container header={<Header variant="h2">Form section header</Header>}>
          <FormField label="First field">
            <Input value="" readOnly={true} />
          </FormField>
        </Container>
      </Form>,
      <form>
        <Form header={<Header variant="h1">Form header</Header>}>
          <Container header={<Header variant="h2">Form section header</Header>}>
            <FormField label="First field">
              <Input value="" readOnly={true} />
            </FormField>
          </Container>
        </Form>
      </form>,
    ],
    disableOverlap: [false, true],
  },
]);

export default function ContentLayoutPermutations() {
  return (
    <>
      <h1>Content Layout + Form + App Layout permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={[...formPermutations]}
          render={permutation => (
            <AppLayout
              contentType="form"
              breadcrumbs={
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
                />
              }
              content={<ContentLayout {...permutation} />}
            ></AppLayout>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
