// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Container from '../../../lib/components/container';
import InternalContainer from '../../../lib/components/container/internal';
import styles from '../../../lib/components/container/styles.css.js';

function renderContainer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findContainer()!;
}

test('renders only children by default', () => {
  const wrapper = renderContainer(<Container>test content</Container>);
  expect(wrapper.findHeader()).toBeNull();
  expect(wrapper.findFooter()).toBeNull();
  expect(wrapper.findContent().getElement()).toHaveTextContent('test content');
});

test('renders header if it is provided', () => {
  const wrapper = renderContainer(<Container header="Bla bla">there is a header above</Container>);
  expect(wrapper.findFooter()).toBeNull();
  expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Bla bla');
  expect(wrapper.findContent().getElement()).toHaveTextContent('there is a header above');
});

test('applies dark header if __darkHeader is true', () => {
  const wrapper = renderContainer(
    <InternalContainer header="Test dark header" __darkHeader={true}>
      test content
    </InternalContainer>
  );
  expect(wrapper.findHeader()!.find(styles['dark-header'])).not.toBeUndefined();
  expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Test dark header');
  expect(wrapper.findContent().getElement()).toHaveTextContent('test content');
});

test('renders media if it is provided', () => {
  const url = '/test.png';
  const wrapper = renderContainer(<Container media={{ content: <img src={url} /> }}>test content</Container>);
  expect(wrapper.findHeader()).toBeNull();
  expect(wrapper.findContent().getElement()).toHaveTextContent('test content');
  expect(wrapper.findMedia().find('img')!.getElement()).toHaveAttribute('src', url);
});

test('renders footer if it is provided', () => {
  const wrapper = renderContainer(<Container footer="Some footer">test content</Container>);
  expect(wrapper.findHeader()).toBeNull();
  expect(wrapper.findFooter()!.getElement()).toHaveTextContent('Some footer');
  expect(wrapper.findContent().getElement()).toHaveTextContent('test content');
});

test('renders everything together', () => {
  const wrapper = renderContainer(
    <Container header="Test header" footer="Test footer">
      test content
    </Container>
  );
  expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Test header');
  expect(wrapper.findFooter()!.getElement()).toHaveTextContent('Test footer');
  expect(wrapper.findContent().getElement()).toHaveTextContent('test content');
});
