// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import SpaceBetween from '../../../lib/components/space-between';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/space-between/styles.css.js';

describe('SpaceBetween', () => {
  test('Renders the direction correctly', function () {
    const { container: verticalContainer } = render(
      <SpaceBetween direction="vertical" size="s">
        <button />
        <button />
      </SpaceBetween>
    );
    expect(verticalContainer.firstChild).toHaveClass(styles.vertical);

    const { container: horizontalContainer } = render(
      <SpaceBetween direction="horizontal" size="s">
        <button />
        <button />
      </SpaceBetween>
    );
    expect(horizontalContainer.firstChild).toHaveClass(styles.horizontal);
  });

  test('Renders the default direction correctly', function () {
    const { container } = render(
      <SpaceBetween size="s">
        <button />
        <button />
      </SpaceBetween>
    );
    expect(container.firstChild).toHaveClass(styles.vertical);
  });

  it('Renders the spacing correctly', function () {
    {
      const { container } = render(
        <SpaceBetween direction="vertical" size="s">
          <button />
          <button />
        </SpaceBetween>
      );

      expect(container.firstChild).toHaveClass(styles['vertical-s']);
    }
    {
      const { container } = render(
        <SpaceBetween direction="vertical" size="m">
          <button />
          <button />
        </SpaceBetween>
      );

      expect(container.firstChild).toHaveClass(styles['vertical-m']);
    }
    {
      const { container } = render(
        <SpaceBetween direction="vertical" size="xxl">
          <button />
          <button />
        </SpaceBetween>
      );

      expect(container.firstChild).toHaveClass(styles['vertical-xxl']);
    }
  });

  it('Renders its content correctly', function () {
    const { container } = render(
      <SpaceBetween direction="vertical" size="s">
        <button id="button-one" />
        <button id="button-two" />
      </SpaceBetween>
    );
    const wrapper = createWrapper(container).findSpaceBetween()!;

    const content = wrapper.findAll('button');

    expect(content).toHaveLength(2);
    expect(content[0].getElement()).toHaveAttribute('id', 'button-one');
    expect(content[1].getElement()).toHaveAttribute('id', 'button-two');
  });
});

describe('native attributes', () => {
  it('adds native attributes', () => {
    const { container } = render(
      <SpaceBetween direction="vertical" size="s" nativeAttributes={{ 'data-testid': 'my-test-id' }}>
        <button id="button-one" />
      </SpaceBetween>
    );
    expect(container.querySelector('[data-testid="my-test-id"]')).not.toBeNull();
  });
  it('concatenates class names', () => {
    const { container } = render(
      <SpaceBetween direction="vertical" size="s" nativeAttributes={{ className: 'additional-class' }}>
        <button id="button-one" />
      </SpaceBetween>
    );
    expect(container.firstChild).toHaveClass(styles.vertical);
    expect(container.firstChild).toHaveClass('additional-class');
  });
});

describe('divider', () => {
  it('does not render dividers when divider prop is not set', () => {
    const { container } = render(
      <SpaceBetween size="m">
        <button id="one" />
        <button id="two" />
        <button id="three" />
      </SpaceBetween>
    );
    expect(container.querySelectorAll(`.${styles.divider}`)).toHaveLength(0);
  });

  it('does not render dividers when divider={false}', () => {
    const { container } = render(
      <SpaceBetween size="m" divider={false}>
        <button id="one" />
        <button id="two" />
        <button id="three" />
      </SpaceBetween>
    );
    expect(container.querySelectorAll(`.${styles.divider}`)).toHaveLength(0);
  });

  it('renders N-1 dividers for N children in vertical direction', () => {
    const { container } = render(
      <SpaceBetween size="m" direction="vertical" divider={true}>
        <button id="one" />
        <button id="two" />
        <button id="three" />
      </SpaceBetween>
    );
    const dividers = container.querySelectorAll(`.${styles.divider}`);
    expect(dividers).toHaveLength(2);
  });

  it('renders N-1 dividers for N children in horizontal direction', () => {
    const { container } = render(
      <SpaceBetween size="m" direction="horizontal" divider={true}>
        <button id="one" />
        <button id="two" />
        <button id="three" />
      </SpaceBetween>
    );
    const dividers = container.querySelectorAll(`.${styles.divider}`);
    expect(dividers).toHaveLength(2);
  });

  it('renders no dividers for a single child', () => {
    const { container } = render(
      <SpaceBetween size="m" divider={true}>
        <button id="only" />
      </SpaceBetween>
    );
    expect(container.querySelectorAll(`.${styles.divider}`)).toHaveLength(0);
  });

  it('renders no dividers when there are no children', () => {
    const { container } = render(<SpaceBetween size="m" divider={true} />);
    expect(container.querySelectorAll(`.${styles.divider}`)).toHaveLength(0);
  });

  it('applies divider-vertical class in vertical direction', () => {
    const { container } = render(
      <SpaceBetween size="m" direction="vertical" divider={true}>
        <button />
        <button />
      </SpaceBetween>
    );
    const dividers = container.querySelectorAll(`.${styles.divider}`);
    expect(dividers).toHaveLength(1);
    expect(dividers[0]).toHaveClass(styles['divider-vertical']);
    expect(dividers[0]).not.toHaveClass(styles['divider-horizontal']);
  });

  it('applies divider-horizontal class in horizontal direction', () => {
    const { container } = render(
      <SpaceBetween size="m" direction="horizontal" divider={true}>
        <button />
        <button />
      </SpaceBetween>
    );
    const dividers = container.querySelectorAll(`.${styles.divider}`);
    expect(dividers).toHaveLength(1);
    expect(dividers[0]).toHaveClass(styles['divider-horizontal']);
    expect(dividers[0]).not.toHaveClass(styles['divider-vertical']);
  });

  it('places dividers between children, not before the first or after the last', () => {
    const { container } = render(
      <SpaceBetween size="m" divider={true}>
        <button id="one" />
        <button id="two" />
        <button id="three" />
      </SpaceBetween>
    );
    const root = container.firstChild as HTMLElement;
    const directChildren = Array.from(root.children);

    // Expected order: child, divider, child, divider, child
    // Each "child" is wrapped in a div.child; each divider is a div.divider
    expect(directChildren).toHaveLength(5);
    expect(directChildren[0]).toHaveClass(styles.child);
    expect(directChildren[1]).toHaveClass(styles.divider);
    expect(directChildren[2]).toHaveClass(styles.child);
    expect(directChildren[3]).toHaveClass(styles.divider);
    expect(directChildren[4]).toHaveClass(styles.child);
  });

  it('still renders children content correctly when divider is enabled', () => {
    const { container } = render(
      <SpaceBetween size="m" divider={true}>
        <button id="button-one" />
        <button id="button-two" />
      </SpaceBetween>
    );
    const wrapper = createWrapper(container).findSpaceBetween()!;
    const content = wrapper.findAll('button');
    expect(content).toHaveLength(2);
    expect(content[0].getElement()).toHaveAttribute('id', 'button-one');
    expect(content[1].getElement()).toHaveAttribute('id', 'button-two');
  });

  it('uses default vertical direction when direction is not specified', () => {
    const { container } = render(
      <SpaceBetween size="m" divider={true}>
        <button />
        <button />
      </SpaceBetween>
    );
    const dividers = container.querySelectorAll(`.${styles.divider}`);
    expect(dividers).toHaveLength(1);
    expect(dividers[0]).toHaveClass(styles['divider-vertical']);
  });
});
