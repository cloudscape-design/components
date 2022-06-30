// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import { renderCollectionPreferences, wrapLinesPreference } from './shared';

function renderwithWrapLines(props: Partial<CollectionPreferencesProps>): CollectionPreferencesWrapper {
  return renderCollectionPreferences({ wrapLinesPreference, ...props });
}

const isChecked = (wrapper: CollectionPreferencesWrapper, checked = true) => {
  if (checked) {
    expect(wrapper.findModal()!.findWrapLinesPreference()!.findNativeInput().getElement()).toBeChecked();
  } else {
    expect(wrapper.findModal()!.findWrapLinesPreference()!.findNativeInput().getElement()).not.toBeChecked();
  }
};

describe('Wrap lines', () => {
  test('correctly displays label and description', () => {
    const wrapper = renderwithWrapLines({});
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findWrapLinesPreference()!.findLabel()!.getElement()).toHaveTextContent(
      'Wrap lines label'
    );
    expect(wrapper.findModal()!.findWrapLinesPreference()!.findDescription()!.getElement()).toHaveTextContent(
      'Wrap lines description'
    );
  });
  test('displays as checked when value specified in preferences property is true', () => {
    const wrapper = renderwithWrapLines({ preferences: { wrapLines: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('displays as checked when value specified in preferences property is true', () => {
    const wrapper = renderwithWrapLines({ preferences: { wrapLines: false }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    isChecked(wrapper, false);
  });
  test('changes temporary value upon click', () => {
    const wrapper = renderwithWrapLines({ preferences: { wrapLines: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findWrapLinesPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
  });
  test('restores previous value on dismiss', () => {
    const wrapper = renderwithWrapLines({ preferences: { wrapLines: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findWrapLinesPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
    wrapper.findModal()!.findDismissButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('restores previous value on cancel', () => {
    const wrapper = renderwithWrapLines({ preferences: { wrapLines: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findWrapLinesPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
    wrapper.findModal()!.findCancelButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('decorates onConfim event details correctly upon change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderwithWrapLines({ preferences: { wrapLines: true }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findWrapLinesPreference()!.findNativeInput().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { wrapLines: false } }));
  });
  test('decorates onConfim event details correctly even without change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderwithWrapLines({ preferences: { wrapLines: true }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { wrapLines: true } }));
  });
});
