// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render, screen } from '@testing-library/react';

import DragHandleButton from '../../../../../lib/components/internal/components/drag-handle/button.js';

import styles from '../../../../../lib/components/internal/components/drag-handle/styles.css.js';

const allVariants = ['drag-indicator', 'resize-area', 'resize-horizontal', 'resize-vertical'] as const;
const allSizes = ['small', 'normal'] as const;

test('renders default variant and size', () => {
  render(<DragHandleButton ariaLabel="drag handle" />);

  expect(document.querySelector(`.${styles.handle}`)).toBeInTheDocument();
  expect(document.querySelector(`.${styles['handle-drag-indicator']}`)).toBeInTheDocument();
  expect(document.querySelector(`.${styles['handle-size-normal']}`)).toBeInTheDocument();
});

test('renders all variants and sizes', () => {
  for (const variant of allVariants) {
    for (const size of allSizes) {
      render(<DragHandleButton ariaLabel="drag handle" variant={variant} size={size} />);

      expect(document.querySelector(`.${styles.handle}`)).toBeInTheDocument();
      expect(document.querySelector(`.${styles[`handle-${variant}`]}`)).toBeInTheDocument();
      expect(document.querySelector(`.${styles[`handle-size-${size}`]}`)).toBeInTheDocument();
    }
  }
});

test('assigns aria label and aria description', () => {
  render(
    <div>
      <DragHandleButton ariaLabel="drag" ariaDescribedby="description" />
      <div id="description">handle</div>
    </div>
  );
  expect(document.querySelector(`.${styles.handle}`)).toHaveAccessibleName('drag');
  expect(document.querySelector(`.${styles.handle}`)).toHaveAccessibleDescription('handle');
});

test('assigns aria-labelledby attribute', () => {
  render(
    <div>
      <div id="label-element">custom label</div>
      <DragHandleButton ariaLabelledBy="label-element" />
    </div>
  );
  expect(document.querySelector(`.${styles.handle}`)).toHaveAttribute('aria-labelledby', 'label-element');
  expect(document.querySelector(`.${styles.handle}`)).toHaveAccessibleName('custom label');
});

test('has role="button" by default', () => {
  render(<DragHandleButton ariaLabel="drag handle" />);

  expect(screen.getByRole('button')).toHaveAccessibleName('drag handle');
});

test('has role="slider" and aria-value attributes when ariaValue is set', () => {
  render(<DragHandleButton ariaLabel="drag handle" ariaValue={{ valueMin: -1, valueMax: 1, valueNow: 0 }} />);

  const handle = screen.getByRole('slider');
  expect(handle).toHaveAccessibleName('drag handle');
  expect(handle).toHaveAttribute('aria-valuemin', '-1');
  expect(handle).toHaveAttribute('aria-valuemax', '1');
  expect(handle).toHaveAttribute('aria-valuenow', '0');
});

test('sets aria-disabled when disabled', () => {
  const { rerender } = render(<DragHandleButton ariaLabel="drag handle" disabled={false} />);

  expect(document.querySelector(`.${styles.handle}`)).toHaveAttribute('aria-disabled', 'false');
  expect(document.querySelector(`.${styles['handle-disabled']}`)).not.toBeInTheDocument();

  rerender(<DragHandleButton ariaLabel="drag handle" disabled={true} />);

  expect(document.querySelector(`.${styles.handle}`)).toHaveAttribute('aria-disabled');
  expect(document.querySelector(`.${styles['handle-disabled']}`)).toBeInTheDocument();
});
