// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SpaceBetween from '~components/space-between';
import Header from '~components/header';
import Button from '~components/button';
import FormField from '~components/form-field';
import Input from '~components/input';
import Form from '~components/form';
import Container from '~components/container';
import ContentLayout, { ContentLayoutProps } from '~components/content-layout';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

/* eslint-disable react/jsx-key */
const formPermutations = createPermutations<ContentLayoutProps>([
  {
    header: [<Header variant="h1">Content Layout header</Header>, undefined],
    children: [
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link">Cancel</Button>
            <Button variant="primary">Submit</Button>
          </SpaceBetween>
        }
      >
        <Container header={<Header variant="h2">Form section header</Header>}>
          <FormField label="First field">
            <Input value="" readOnly={true} />
          </FormField>
        </Container>
      </Form>,
      <Form
        header={<Header variant="h1">Form header</Header>}
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link">Cancel</Button>
            <Button variant="primary">Submit</Button>
          </SpaceBetween>
        }
      >
        <Container header={<Header variant="h2">Form section header</Header>}>
          <FormField label="First field">
            <Input value="" readOnly={true} />
          </FormField>
        </Container>
      </Form>,
    ],
    disableOverlap: [false, true],
  },
]);

export default function ContentLayoutPermutations() {
  return (
    <>
      <h1>Content Layout permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={[...formPermutations]}
          render={permutation => <ContentLayout {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
