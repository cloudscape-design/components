// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Container from '../../../lib/components/container';
import createWrapper from '../../../lib/components/test-utils/dom';

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

describe('Style API', () => {
  test('all style properties', () => {
    const wrapper = renderContainer(
      <Container
        header="Container header"
        footer="Container footer"
        style={{
          root: {
            background: 'rgb(240, 240, 235)',
            borderColor: 'purple',
            borderRadius: '240px',
            borderWidth: '6px',
          },
          content: {
            paddingBlock: '20px',
            paddingInline: '140px',
          },
          header: {
            paddingBlock: '20px 0px',
            paddingInline: '140px',
          },
          footer: {
            root: {
              paddingBlock: '40px',
              paddingInline: '140px',
            },
            divider: {
              borderColor: 'purple',
              borderWidth: '6px',
            },
          },
        }}
      >
        Container content
      </Container>
    );

    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('background')).toBe('rgb(240, 240, 235)');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('border-color')).toBe('purple');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('border-radius')).toBe('240px');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue('border-width')).toBe('6px');
    expect(
      getComputedStyle(wrapper.findByClassName(styles['content-inner'])!.getElement()).getPropertyValue('padding-block')
    ).toBe('20px');
    expect(
      getComputedStyle(wrapper.findByClassName(styles['content-inner'])!.getElement()).getPropertyValue(
        'padding-inline'
      )
    ).toBe('140px');
    expect(getComputedStyle(wrapper.findHeader()!.getElement()).getPropertyValue('padding-block')).toBe('20px 0px');
    expect(getComputedStyle(wrapper.findHeader()!.getElement()).getPropertyValue('padding-inline')).toBe('140px');
    expect(getComputedStyle(wrapper.findFooter()!.getElement()).getPropertyValue('border-color')).toBe('purple');
    expect(getComputedStyle(wrapper.findFooter()!.getElement()).getPropertyValue('border-width')).toBe('6px');
    expect(getComputedStyle(wrapper.findFooter()!.getElement()).getPropertyValue('padding-block')).toBe('40px');
    expect(getComputedStyle(wrapper.findFooter()!.getElement()).getPropertyValue('padding-inline')).toBe('140px');
  });

  test('media top', () => {
    const url = '/test.png';

    const wrapper = renderContainer(
      <Container
        header="Container header"
        footer="Container footer"
        media={{ content: <img src={url} />, position: 'top', height: '100px' }}
        style={{
          root: {
            borderRadius: '20px',
          },
        }}
      >
        Container content
      </Container>
    );

    expect(getComputedStyle(wrapper.findMedia()!.getElement()).getPropertyValue('border-radius')).toBe('20px');
    expect(getComputedStyle(wrapper.findMedia()!.getElement()).getPropertyValue('border-end-start-radius')).toBe('0px');
    expect(getComputedStyle(wrapper.findMedia()!.getElement()).getPropertyValue('border-end-end-radius')).toBe('0px');
  });

  test('media side', () => {
    const url = '/test.png';

    const wrapper = renderContainer(
      <Container
        header="Container header"
        footer="Container footer"
        media={{ content: <img src={url} />, position: 'side', width: '100px' }}
        style={{
          root: {
            borderRadius: '20px',
          },
        }}
      >
        Container content
      </Container>
    );

    expect(getComputedStyle(wrapper.findMedia()!.getElement()).getPropertyValue('border-radius')).toBe('20px');
    expect(getComputedStyle(wrapper.findMedia()!.getElement()).getPropertyValue('border-start-end-radius')).toBe('0px');
    expect(getComputedStyle(wrapper.findMedia()!.getElement()).getPropertyValue('border-end-end-radius')).toBe('0px');
  });
});
