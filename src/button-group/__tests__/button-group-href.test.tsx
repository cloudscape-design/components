// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { renderButtonGroup } from './common';

let mockButtonProps: Record<string, any> | undefined;

// Replace the underlying button with a spy so we can assert which props ButtonGroup forwards.
// The button's own link behavior (target/rel defaults, external icon, etc.) is covered by the button tests.
jest.mock('../../../lib/components/button/internal', () => {
  const actual = jest.requireActual('../../../lib/components/button/internal');
  return {
    ...actual,
    InternalButton: (props: Record<string, any>) => {
      mockButtonProps = props;
      return null;
    },
  };
});

// Suppressing console errors to mute React warning on ref forwarding.
let errorSpy: jest.SpyInstance;
beforeAll(() => (errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})));
afterAll(() => errorSpy.mockRestore());

test('forwards link properties to the underlying button', () => {
  renderButtonGroup({
    items: [
      {
        type: 'icon-button',
        id: 'open',
        text: 'Open in a new tab',
        iconName: 'external',
        href: 'https://example.com/',
        target: '_blank',
        rel: 'nofollow',
        download: 'report.pdf',
      },
    ],
  });

  expect(mockButtonProps).toEqual(
    expect.objectContaining({
      href: 'https://example.com/',
      target: '_blank',
      rel: 'nofollow',
      download: 'report.pdf',
    })
  );
});
