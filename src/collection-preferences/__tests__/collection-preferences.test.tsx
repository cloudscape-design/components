// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import {
  renderCollectionPreferences,
  visibleContentPreference,
  pageSizePreference,
  wrapLinesPreference,
  stripedRowsPreference,
} from './shared';

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
  test('raises a warning when setting preferences without onConfirm listener', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    renderCollectionPreferences({ preferences: {} });
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[AwsUi] [CollectionPreferences] You provided `preferences` prop without an `onConfirm` handler. This will render a read-only component. If the component should be mutable, set an `onConfirm` handler.'
    );
  });
});

describe('Collection preferences - Preferences display', () => {
  test('does not preferences if they are not specified', () => {
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
});
