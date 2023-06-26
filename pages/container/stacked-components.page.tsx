// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Container from '~components/container';
import Header from '~components/header';
import ExpandableSection from '~components/expandable-section';
import SpaceBetween from '~components/space-between';
import Tabs from '~components/tabs';
import ScreenshotArea from '../utils/screenshot-area';

function StackedContainer() {
  return (
    <Container header={<Header>Container header</Header>} variant="stacked">
      Container content
    </Container>
  );
}

function StackedExpandableSection({ defaultExpanded }: { defaultExpanded?: boolean }) {
  return (
    <ExpandableSection headerText="Expandable section" variant="stacked" defaultExpanded={defaultExpanded}>
      Container content
    </ExpandableSection>
  );
}

function StackedTabs() {
  return (
    <Tabs
      variant="stacked"
      tabs={[
        { label: 'First tab', id: 'first', content: 'First tab content', href: '#first' },
        { label: 'Second tab', id: 'second', href: '#second' },
        { label: 'Third tab', id: 'third', href: '#third' },
      ]}
    />
  );
}

function StackedComponent({ component }: { component: number }) {
  switch (component) {
    case 1:
      return <StackedContainer />;
    case 2:
      return <StackedExpandableSection />;
    case 3:
      return <StackedExpandableSection defaultExpanded={true} />;
    default:
      return <StackedTabs />;
  }
}

function StackedPermutation({ order }: { order: Array<number> }) {
  return (
    <div>
      <StackedComponent component={order[0]} />
      <StackedComponent component={order[1]} />
      <StackedComponent component={order[2]} />
      <StackedComponent component={order[3]} />
    </div>
  );
}

export default function StackedComponents() {
  return (
    <article>
      <h1>Stacked container-like components</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <StackedPermutation order={[1, 2, 3, 4]} />
          <StackedPermutation order={[2, 3, 4, 1]} />
          <StackedPermutation order={[3, 4, 1, 2]} />
          <StackedPermutation order={[4, 1, 2, 3]} />
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
