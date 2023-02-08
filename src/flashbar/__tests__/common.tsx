// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper, { FlashbarWrapper } from '../../../lib/components/test-utils/dom';
import { render } from '@testing-library/react';
import { CollapsibleFlashbarProps, FlashbarProps, FlashType } from '../interfaces';
import Flashbar from '../../../lib/components/flashbar';
import React from 'react';

export const sampleItems: Record<FlashType, FlashbarProps.MessageDefinition> = {
  error: { type: 'error', header: 'Error', content: 'There was an error' },
  success: { type: 'success', header: 'Success', content: 'Everything went fine' },
  warning: { type: 'warning', header: 'Warning' },
  info: { type: 'info', header: 'Information' },
  progress: { type: 'info', loading: true, header: 'Operation in progress' },
};

export const defaultStrings = {
  ariaLabel: 'Notifications',
  notificationBarText: 'Notifications',
  notificationBarAriaLabel: 'View all notifications',
  errorIconAriaLabel: 'Error',
  warningIconAriaLabel: 'Warning',
  successIconAriaLabel: 'Success',
  infoIconAriaLabel: 'Information',
  inProgressIconAriaLabel: 'In progress',
};

export const defaultItems = [sampleItems.error, sampleItems.success];

const defaultProps = {
  stackItems: true,
  i18nStrings: defaultStrings,
};

export function createFlashbarWrapper(element: React.ReactElement) {
  return createWrapper(render(element).container).findFlashbar()!;
}

export function findList(flashbar: FlashbarWrapper) {
  return flashbar.find('ul');
}

// Entire interactive element including the counter and the actual <button/> element
export function findNotificationBar(flashbar: FlashbarWrapper): HTMLElement | undefined {
  const element = Array.from(flashbar.getElement().children).find(
    element => element instanceof HTMLElement && element.tagName !== 'UL'
  );
  if (element) {
    return element as HTMLElement;
  }
}

export function renderFlashbar(
  customProps: Partial<
    Omit<CollapsibleFlashbarProps, 'i18nStrings' | 'stackItems'> & {
      i18nStrings?: Partial<CollapsibleFlashbarProps.I18nStrings>;
    }
  > = {
    items: defaultItems,
  }
) {
  const { items, ...restProps } = customProps;
  const props = { ...defaultProps, ...restProps, i18nStrings: { ...defaultStrings, ...restProps.i18nStrings } };
  return createFlashbarWrapper(<Flashbar {...props} items={items || defaultItems} />);
}
