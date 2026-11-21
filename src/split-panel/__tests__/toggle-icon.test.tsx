// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import { renderSplitPanel } from './common';

const CustomOpenIcon = () => <svg data-testid="custom-open-icon" />;
const CustomCloseIcon = () => <svg data-testid="custom-close-icon" />;

describe('SplitPanel toggleIconOpen / toggleIconClosed', () => {
  describe('bottom position, panel open', () => {
    it('renders close button with built-in icon by default', () => {
      const { wrapper } = renderSplitPanel({ contextProps: { isOpen: true, position: 'bottom' } });
      const closeBtn = wrapper!.findCloseButton();
      expect(closeBtn).not.toBeNull();
      // no custom icon present
      expect(closeBtn!.getElement().querySelector('[data-testid="custom-close-icon"]')).toBeNull();
    });

    it('renders custom toggleIconOpen on close button when panel is open', () => {
      const { wrapper } = renderSplitPanel({
        props: { toggleIconOpen: <CustomCloseIcon /> },
        contextProps: { isOpen: true, position: 'bottom' },
      });
      const closeBtn = wrapper!.findCloseButton();
      expect(closeBtn).not.toBeNull();
      expect(closeBtn!.getElement().querySelector('[data-testid="custom-close-icon"]')).not.toBeNull();
    });
  });

  describe('bottom position, panel closed (collapse behavior)', () => {
    it('renders open button with built-in icon by default', () => {
      const { wrapper } = renderSplitPanel({
        props: { closeBehavior: 'collapse' },
        contextProps: { isOpen: false, position: 'bottom' },
      });
      const openBtn = wrapper!.findOpenButton();
      expect(openBtn).not.toBeNull();
      expect(openBtn!.getElement().querySelector('[data-testid="custom-open-icon"]')).toBeNull();
    });

    it('renders custom toggleIconClosed on open button when panel is closed', () => {
      const { wrapper } = renderSplitPanel({
        props: { closeBehavior: 'collapse', toggleIconClosed: <CustomOpenIcon /> },
        contextProps: { isOpen: false, position: 'bottom' },
      });
      const openBtn = wrapper!.findOpenButton();
      expect(openBtn).not.toBeNull();
      expect(openBtn!.getElement().querySelector('[data-testid="custom-open-icon"]')).not.toBeNull();
    });
  });

  describe('side position, panel closed (collapse behavior)', () => {
    it('renders open button with built-in icon by default', () => {
      const { wrapper } = renderSplitPanel({
        props: { closeBehavior: 'collapse' },
        contextProps: { isOpen: false, position: 'side' },
      });
      const openBtn = wrapper!.findOpenButton();
      expect(openBtn).not.toBeNull();
      expect(openBtn!.getElement().querySelector('[data-testid="custom-open-icon"]')).toBeNull();
    });

    it('renders custom toggleIconClosed on side open button when panel is closed', () => {
      const { wrapper } = renderSplitPanel({
        props: { closeBehavior: 'collapse', toggleIconClosed: <CustomOpenIcon /> },
        contextProps: { isOpen: false, position: 'side' },
      });
      const openBtn = wrapper!.findOpenButton();
      expect(openBtn).not.toBeNull();
      expect(openBtn!.getElement().querySelector('[data-testid="custom-open-icon"]')).not.toBeNull();
    });
  });
});
