// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import {
  SplitPanelContextProps,
  SplitPanelContextProvider,
} from '../../../lib/components/internal/context/split-panel-context';
import SplitPanel, { SplitPanelProps } from '../../../lib/components/split-panel';
import createWrapper from '../../../lib/components/test-utils/dom';
import { defaultSplitPanelContextProps } from './helpers';

const i18nStrings = {
  closeButtonAriaLabel: 'closeButtonAriaLabel',
  openButtonAriaLabel: 'openButtonAriaLabel',
  preferencesTitle: 'preferencesTitle',
  preferencesPositionLabel: 'preferencesPositionLabel',
  preferencesPositionDescription: 'preferencesPositionDescription',
  preferencesPositionSide: 'preferencesPositionSide',
  preferencesPositionBottom: 'preferencesPositionBottom',
  preferencesConfirm: 'preferencesConfirm',
  preferencesCancel: 'preferencesCancel',
  resizeHandleAriaLabel: 'resizeHandleAriaLabel',
};

export const defaultProps: SplitPanelProps = {
  header: 'Split panel header',
  children: <p>Split panel content</p>,
  hidePreferencesButton: undefined,
  i18nStrings,
};

export function renderSplitPanel({
  props,
  contextProps,
  messages = {},
  modalMessages = {},
}: {
  props?: Partial<SplitPanelProps>;
  contextProps?: Partial<SplitPanelContextProps>;
  messages?: Record<string, string>;
  modalMessages?: Record<string, string>;
} = {}) {
  const { container } = render(
    <TestI18nProvider messages={{ 'split-panel': messages, modal: modalMessages }}>
      <SplitPanelContextProvider value={{ ...defaultSplitPanelContextProps, ...contextProps }}>
        <SplitPanel {...defaultProps} {...props} />
      </SplitPanelContextProvider>
    </TestI18nProvider>
  );
  const wrapper = createWrapper(container).findSplitPanel();
  return { wrapper };
}
