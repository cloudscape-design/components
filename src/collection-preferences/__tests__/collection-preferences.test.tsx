// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import CollectionPreferences from '../../../lib/components/collection-preferences';
import createWrapper from '../../../lib/components/test-utils/dom';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import {
  renderCollectionPreferences,
  visibleContentPreference,
  pageSizePreference,
  wrapLinesPreference,
  stripedRowsPreference,
  contentDisplayPreference,
} from './shared';
import TestI18nProvider from '../../../lib/components/i18n/testing';

const expectVisibleModal = (wrapper: CollectionPreferencesWrapper, visible = true) => {
  if (visible) {
    expect(wrapper.findModal()).not.toBeNull();
  } else {
    expect(wrapper.findModal()).toBeNull();
  }
};

describe('Collection preferences - Trigger button', () => {
  test('has the correct aria-label', () => {
    const wrapper = renderCollectionPreferences({});
    expect(wrapper.findTriggerButton().getElement()).toHaveAttribute('aria-label', 'Preferences title');
  });
  test('displays the modal on click', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    expectVisibleModal(wrapper);
  });
  test('does not display modal on click when disabled', () => {
    const wrapper = renderCollectionPreferences({ disabled: true });
    wrapper.findTriggerButton().click();
    expectVisibleModal(wrapper, false);
  });
  test('does not receive focus on first render', () => {
    const wrapper = renderCollectionPreferences({});
    expect(wrapper.findTriggerButton().getElement()).not.toBe(document.activeElement);
  });
  test('receives focus after closing the modal', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findDismissButton().click();
    expect(wrapper.findTriggerButton().getElement()).toBe(document.activeElement);
  });
});

describe('Collection preferences - Modal', () => {
  test('is not visible at initial render', () => {
    const wrapper = renderCollectionPreferences({});
    expectVisibleModal(wrapper, false);
  });
  test('displays the correct title', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findHeader()!.getElement()).toHaveTextContent('Preferences title');
  });
  test('displays the correct labels for footer buttons', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findCancelButton()!.findTextRegion()!.getElement()).toHaveTextContent('Cancel');
    expect(wrapper.findModal()!.findConfirmButton()!.findTextRegion()!.getElement()).toHaveTextContent('Confirm');
  });
  test('is dismissed when clicking on the dismiss button', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findDismissButton()!.click();
    expectVisibleModal(wrapper, false);
  });
  test('is dismissed when clicking on the cancel button', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findCancelButton()!.click();
    expectVisibleModal(wrapper, false);
  });
  test('is dismissed when clicking on the confirm button', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expectVisibleModal(wrapper, false);
  });
});

describe('Collection preferences - Events', () => {
  test('calls onConfirm listener upon clicking on confirm button', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderCollectionPreferences({ onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
  });
  test('calls onCancel listener upon clicking on cancel button', () => {
    const onCancelSpy = jest.fn();
    const wrapper = renderCollectionPreferences({ onCancel: onCancelSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findCancelButton()!.click();
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
  });
  test('calls onCancel listener upon clicking on dismiss button', () => {
    const onCancelSpy = jest.fn();
    const wrapper = renderCollectionPreferences({ onCancel: onCancelSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findDismissButton()!.click();
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
  });
});

describe('Collection preferences - Warnings', () => {
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  beforeEach(() => {
    consoleWarnSpy.mockClear();
  });
  test('raises a warning when setting preferences without onConfirm listener', () => {
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    renderCollectionPreferences({ preferences: {} });
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[AwsUi] [CollectionPreferences] You provided `preferences` prop without an `onConfirm` handler. This will render a read-only component. If the component should be mutable, set an `onConfirm` handler.'
    );
  });
  test('raises a warning when both visibleContentPreference and contentDisplayPreference are provided', () => {
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    const wrapper = renderCollectionPreferences({
      visibleContentPreference,
      contentDisplayPreference,
    });
    wrapper.findTriggerButton().click();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[AwsUi] [CollectionPreferences] You provided both `visibleContentPreference` and `contentDisplayPreference` props. `visibleContentPreference` will be ignored and only `contentDisplayPreference` will be rendered.'
    );
  });
});

describe('Collection preferences - Preferences display', () => {
  test('does not display preferences if they are not specified', () => {
    const wrapper = renderCollectionPreferences({});
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findPageSizePreference()).toBeNull();
    expect(wrapper.findModal()!.findVisibleContentPreference()).toBeNull();
    expect(wrapper.findModal()!.findWrapLinesPreference()).toBeNull();
    expect(wrapper.findModal()!.findStripedRowsPreference()).toBeNull();
    expect(wrapper.findModal()!.findCustomPreference()).toBeNull();
  });
  test('displays predefined preferences', () => {
    const wrapper = renderCollectionPreferences({
      pageSizePreference,
      visibleContentPreference,
      wrapLinesPreference,
      stripedRowsPreference,
    });
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findPageSizePreference()).not.toBeNull();
    expect(wrapper.findModal()!.findVisibleContentPreference()).not.toBeNull();
    expect(wrapper.findModal()!.findWrapLinesPreference()).not.toBeNull();
    expect(wrapper.findModal()!.findStripedRowsPreference()).not.toBeNull();
  });
  test('displays custom preference when no predefined preference is specified', () => {
    const wrapper = renderCollectionPreferences({ customPreference: () => 'CustomPref' });
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findCustomPreference()!.getElement()).toHaveTextContent('CustomPref');
  });
  test('displays custom preference when predefined preferences are specified', () => {
    const wrapper = renderCollectionPreferences({
      customPreference: () => 'CustomPref',
      pageSizePreference,
      visibleContentPreference,
      wrapLinesPreference,
      stripedRowsPreference,
    });
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findCustomPreference()!.getElement()).toHaveTextContent('CustomPref');
  });
  test('displays only content display preference when both visible content preference and content display preference are provided', () => {
    const wrapper = renderCollectionPreferences({
      visibleContentPreference,
      contentDisplayPreference,
    });
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findVisibleContentPreference()).toBeNull();
    expect(wrapper.findModal()!.findContentDisplayPreference()).not.toBeNull();
  });
});

describe('i18n', () => {
  test('supports using title from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider messages={{ 'collection-preferences': { title: 'Custom title' } }}>
        <CollectionPreferences />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findCollectionPreferences()!;
    expect(wrapper.findTriggerButton().getElement()).toHaveAttribute('aria-label', 'Custom title');
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findHeader()!.getElement()).toHaveTextContent('Custom title');
  });

  test('supports using confirmLabel and cancelLabel from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{ 'collection-preferences': { confirmLabel: 'Custom confirm', cancelLabel: 'Custom cancel' } }}
      >
        <CollectionPreferences />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findCollectionPreferences()!;
    wrapper.findTriggerButton().click();
    const footerItems = wrapper.findModal()!.findFooter()!.findSpaceBetween()!;
    expect(footerItems.find(':nth-child(1)')!.findButton()!.getElement()).toHaveTextContent('Custom cancel');
    expect(footerItems.find(':nth-child(2)')!.findButton()!.getElement()).toHaveTextContent('Custom confirm');
  });

  test('supports using preference labels and descriptions from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          'collection-preferences': {
            'pageSizePreference.title': 'Custom page size',
            'wrapLinesPreference.label': 'Custom wrap lines',
            'wrapLinesPreference.description': 'Custom wrap lines description',
            'stripedRowsPreference.label': 'Custom striped rows',
            'stripedRowsPreference.description': 'Custom striped rows description',
            'contentDensityPreference.label': 'Custom density',
            'contentDensityPreference.description': 'Custom density description',
            'contentDisplayPreference.title': 'Custom content display',
            'contentDisplayPreference.description': 'Custom content display description',
            'contentDisplayPreference.dragHandleAriaLabel': 'Custom drag handle',
            'contentDisplayPreference.liveAnnouncementDndStarted': 'Picked up item at position {position} of {total}',
            'contentDisplayPreference.liveAnnouncementDndItemReordered':
              '{isInitialPosition, select, true {Moving item back to position {currentPosition} of {total}} false {Moving item to position {currentPosition} of {total}} other {}}',
            'contentDisplayPreference.liveAnnouncementDndItemCommitted':
              '{isInitialPosition, select, true {Item moved back to its original position {initialPosition} of {total}} false {Item moved from position {initialPosition} to position {finalPosition} of {total}} other {}}',
          },
        }}
      >
        <CollectionPreferences
          preferences={{
            contentDisplay: [
              { id: '1', visible: true },
              { id: '2', visible: true },
            ],
          }}
          pageSizePreference={{ options: [] }}
          wrapLinesPreference={{}}
          stripedRowsPreference={{}}
          contentDensityPreference={{}}
          contentDisplayPreference={{
            options: [
              { id: '1', label: 'One' },
              { id: '2', label: 'Two' },
            ],
          }}
        />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findCollectionPreferences()!;
    wrapper.findTriggerButton().click();
    const modal = wrapper.findModal()!;
    expect(modal.findPageSizePreference()!.findTitle().getElement()).toHaveTextContent('Custom page size');
    expect(modal.findWrapLinesPreference()!.findLabel().getElement()).toHaveTextContent('Custom wrap lines');
    expect(modal.findWrapLinesPreference()!.findDescription()!.getElement()).toHaveTextContent(
      'Custom wrap lines description'
    );
    expect(modal.findStripedRowsPreference()!.findLabel().getElement()).toHaveTextContent('Custom striped rows');
    expect(modal.findStripedRowsPreference()!.findDescription()!.getElement()).toHaveTextContent(
      'Custom striped rows description'
    );
    expect(modal.findContentDensityPreference()!.findLabel().getElement()).toHaveTextContent('Custom density');
    expect(modal.findContentDensityPreference()!.findDescription()!.getElement()).toHaveTextContent(
      'Custom density description'
    );
    expect(modal.findContentDisplayPreference()!.findTitle().getElement()).toHaveTextContent('Custom content display');
    expect(modal.findContentDisplayPreference()!.findDescription()!.getElement()).toHaveTextContent(
      'Custom content display description'
    );
    expect(modal.findContentDisplayPreference()!.find('[aria-label*="Custom drag handle"')).toBeTruthy();
  });
});
