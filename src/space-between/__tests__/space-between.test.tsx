// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import SpaceBetween from '../../../lib/components/space-between';
import styles from '../../../lib/components/space-between/styles.css.js';
import createWrapper from '../../../lib/components/test-utils/dom';

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
