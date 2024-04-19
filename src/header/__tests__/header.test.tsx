// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Container from '../../../lib/components/container';
import ExpandableSection from '../../../lib/components/expandable-section';
import Header from '../../../lib/components/header';
import styles from '../../../lib/components/header/styles.css.js';
import { DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_SUBSTEP_NAME } from '../../../lib/components/internal/analytics/selectors';

function renderHeader(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return {
    wrapper: createWrapper(container).findHeader()!,
    container,
  };
}

test('renders title even if it is empty', () => {
  const { wrapper } = renderHeader(<Header />);
  expect(wrapper.findHeadingText()).toBeTruthy();
  expect(wrapper.findCounter()).toBeNull();
  expect(wrapper.findInfo()).toBeNull();
  expect(wrapper.findActions()).toBeNull();
  expect(wrapper.findDescription()).toBeNull();
});

test('renders everything provided', () => {
  const { wrapper } = renderHeader(
    <Header info="Info" description="Description" counter="123" actions={<button>Click me</button>}>
      Test title
    </Header>
  );
  expect(wrapper.findHeadingText().getElement()).toHaveTextContent('Test title');
  expect(wrapper.findCounter()!.getElement()).toHaveTextContent('123');
  expect(wrapper.findInfo()!.getElement()).toHaveTextContent('Info');
  expect(wrapper.findDescription()!.getElement()).toHaveTextContent('Description');
  expect(wrapper.findActions()!.find('button')!.getElement()).toHaveTextContent('Click me');
});

test('renders h2 tag and variant by default', () => {
  const { wrapper } = renderHeader(<Header>title</Header>);
  expect(wrapper.find('h2')!.getElement()).toHaveTextContent('title');
  expect(wrapper.find('h1')).toBeNull();
  expect(wrapper.getElement()).toHaveClass(styles['root-variant-h2']);
});

test('supports title tag name override', () => {
  const { wrapper } = renderHeader(<Header headingTagOverride="h1">title</Header>);
  expect(wrapper.find('h2')).toBeNull();
  expect(wrapper.find('h1')!.getElement()).toHaveTextContent('title');
  expect(wrapper.getElement()).toHaveClass(styles['root-variant-h2']);
});

test('renders h1 variant', () => {
  const { wrapper } = renderHeader(<Header variant="h1">title</Header>);
  expect(wrapper.find('h1')!.getElement()).toHaveTextContent('title');
  expect(wrapper.findHeadingText().getElement()).toHaveClass(styles['heading-text-variant-h1']);
});

test('renders h3 variant', () => {
  const { wrapper } = renderHeader(<Header variant="h3">title</Header>);
  expect(wrapper.find('h3')!.getElement()).toHaveTextContent('title');
  expect(wrapper.getElement()).toHaveClass(styles['root-variant-h3']);
});

test('supports title tag name override with non-default variant', () => {
  const { wrapper } = renderHeader(
    <Header headingTagOverride="h2" variant="h3">
      title
    </Header>
  );
  expect(wrapper.find('h1')).toBeNull();
  expect(wrapper.find('h3')).toBeNull();
  expect(wrapper.find('h2')!.getElement()).toHaveTextContent('title');
});

describe('Analytics', () => {
  test(`adds ${DATA_ATTR_FUNNEL_KEY} attribute for headings inside a Container header slot`, () => {
    const { wrapper } = renderHeader(
      <Container
        header={
          <Header headingTagOverride="h2" variant="h3">
            title
          </Header>
        }
      />
    );

    expect(wrapper.findHeadingText().getElement()).toHaveAttribute(DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_SUBSTEP_NAME);
  });

  test(`adds ${DATA_ATTR_FUNNEL_KEY} attribute for headings inside a ExpandableSection header (deprecated) slot`, () => {
    const { wrapper } = renderHeader(
      <ExpandableSection
        variant="container"
        header={
          <Header headingTagOverride="h2" variant="h3">
            title
          </Header>
        }
      />
    );

    expect(wrapper.findHeadingText().getElement()).toHaveAttribute(DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_SUBSTEP_NAME);
  });

  test(`adds ${DATA_ATTR_FUNNEL_KEY} attribute for headings inside a ExpandableSection headerText slot`, () => {
    const { wrapper } = renderHeader(<ExpandableSection variant="container" headerText="Title" />);

    expect(wrapper.findHeadingText().getElement()).toHaveAttribute(DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_SUBSTEP_NAME);
  });

  test(`does not add ${DATA_ATTR_FUNNEL_KEY} attribute for headings inside a ExpandableSection headerText slot that is not a container variant`, () => {
    const { wrapper } = renderHeader(<ExpandableSection variant="container" headerText="Title" />);

    expect(wrapper.findHeadingText().getElement()).toHaveAttribute(DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_SUBSTEP_NAME);
  });

  test(`does not add ${DATA_ATTR_FUNNEL_KEY} attribute for headings of other levels`, () => {
    const { container } = renderHeader(
      <>
        <Header headingTagOverride="h4" variant="h3">
          title
        </Header>
        <Header headingTagOverride="h3" variant="h2">
          title
        </Header>
        <Header variant="h3">title</Header>
      </>
    );
    expect(container.querySelector(`[${DATA_ATTR_FUNNEL_KEY}]`)).toBeNull();
  });
});
