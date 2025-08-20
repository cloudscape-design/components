// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { describeEachAppLayout } from '../../app-layout/__tests__/utils';
import { renderSplitPanel } from './common';

describe('Split panel: Header slots', () => {
  test('warns when neither header nor headerBefore are provided', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    try {
      renderSplitPanel({ props: { header: undefined } });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[AwsUi] [SplitPanel] You must provide either `header` or `headerBefore`.'
      );
    } finally {
      consoleWarnSpy.mockRestore();
    }
  });

  describeEachAppLayout({ sizes: ['desktop', 'mobile'] }, () => {
    describe('with the panel open', () => {
      test('renders headerBefore', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerBefore: <span>Before</span> },
        });
        expect(wrapper!.findHeaderBefore()).not.toBeNull();
        expect(wrapper!.findHeaderBefore()!.getElement()).toHaveTextContent('Before');
      });

      test('renders headerInfo', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerInfo: <span>Info</span> },
        });
        expect(wrapper!.findHeaderInfo()).not.toBeNull();
        expect(wrapper!.findHeaderInfo()!.getElement()).toHaveTextContent('Info');
      });

      test('renders headerActions', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerActions: <button>Action</button> },
        });
        expect(wrapper!.findHeaderActions()).not.toBeNull();
        expect(wrapper!.findHeaderActions()!.getElement()).toHaveTextContent('Action');
      });

      test('renders headerDescription', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerDescription: 'Header description' },
        });
        expect(wrapper!.findHeaderDescription()).not.toBeNull();
        expect(wrapper!.findHeaderDescription()!.getElement()).toHaveTextContent('Header description');
      });
    });

    describe('with the panel closed', () => {
      test('renders headerBefore', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerBefore: <span>Before</span> },
          contextProps: { isOpen: false },
        });
        expect(wrapper!.findHeaderBefore()).not.toBeNull();
        expect(wrapper!.findHeaderBefore()!.getElement()).toHaveTextContent('Before');
      });

      test('renders headerInfo', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerInfo: <span>Info</span> },
          contextProps: { isOpen: false },
        });
        expect(wrapper!.findHeaderInfo()).not.toBeNull();
        expect(wrapper!.findHeaderInfo()!.getElement()).toHaveTextContent('Info');
      });

      test('does not render headerActions', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerActions: <button>Action</button> },
          contextProps: { isOpen: false },
        });
        expect(wrapper!.findHeaderActions()).toBeNull();
      });

      test('does not render headerDescription', () => {
        const { wrapper } = renderSplitPanel({
          props: { headerDescription: 'Header description' },
          contextProps: { isOpen: false },
        });
        expect(wrapper!.findHeaderDescription()).toBeNull();
      });
    });

    test('does not render header properties when not provided', () => {
      const { wrapper } = renderSplitPanel();
      expect(wrapper!.findHeaderActions()).toBeNull();
      expect(wrapper!.findHeaderBefore()).toBeNull();
      expect(wrapper!.findHeaderDescription()).toBeNull();
      expect(wrapper!.findHeaderInfo()).toBeNull();
    });
  });
});
