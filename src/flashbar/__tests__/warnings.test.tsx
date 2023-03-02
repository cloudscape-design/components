// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as reactRender } from '@testing-library/react';
import Flashbar from '../../../lib/components/flashbar';
import createWrapper from '../../../lib/components/test-utils/dom';

function render(element: React.ReactElement) {
  return createWrapper(reactRender(element).container).findFlashbar()!;
}

let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

/**
 * This test suite is in a separate file, because it needs a clean messageCache (inside `warnOnce()`).
 * Otherwise, warnings would not appear at the expected time in the test, because they have been issued before.
 */
describe('Flashbar component', () => {
  test('warns when action button callback is missing', () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    reactRender(
      <Flashbar
        items={[
          {
            content: 'The content',
          },
        ]}
      />
    );
    expect(console.warn).not.toHaveBeenCalled();

    reactRender(
      <Flashbar
        items={[
          {
            content: 'The content',
            buttonText: 'Action button',
            onButtonClick: () => void 0,
          },
        ]}
      />
    );

    expect(console.warn).not.toHaveBeenCalled();

    reactRender(
      <Flashbar
        items={[
          {
            content: 'The content',
            buttonText: 'Action button',
          },
        ]}
      />
    );

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [Flashbar] You provided a `buttonText` prop without an `onButtonClick` handler. This will render a non-interactive action button.'
    );
  });

  test('warns when dismiss callback is missing', () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    render(
      <Flashbar
        items={[
          {
            content: 'The content',
          },
        ]}
      />
    );
    expect(console.warn).not.toHaveBeenCalled();

    render(
      <Flashbar
        items={[
          {
            content: 'The content',
            dismissible: true,
            dismissLabel: 'Dismiss',
            onDismiss: () => void 0,
          },
        ]}
      />
    );

    expect(console.warn).not.toHaveBeenCalled();

    render(
      <Flashbar
        items={[
          {
            content: 'The content',
            dismissible: true,
            dismissLabel: 'Dismiss',
          },
        ]}
      />
    );

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [Flashbar] You have set the `dismissible` prop without an `onDismiss` handler. This will render a non-interactive dismiss button.'
    );
  });

  test('warns when ariaRole="alert" is used without id', () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    render(<Flashbar items={[{ content: 'The content' }]} />);
    expect(console.warn).not.toHaveBeenCalled();

    render(<Flashbar items={[{ content: 'The content', ariaRole: 'alert', id: '1' }]} />);
    expect(console.warn).not.toHaveBeenCalled();

    render(<Flashbar items={[{ content: 'The content', ariaRole: 'alert' }]} />);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [Flashbar] You provided `ariaRole="alert"` for a flashbar item without providing an `id`. Focus will not be moved to the newly added flash message.'
    );
  });
});
