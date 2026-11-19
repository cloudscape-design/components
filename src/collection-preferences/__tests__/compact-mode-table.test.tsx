// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import { contentDensityPreference, renderCollectionPreferences } from './shared';

function renderWithContentDensity(props: Partial<CollectionPreferencesProps>): CollectionPreferencesWrapper {
  return renderCollectionPreferences({ contentDensityPreference, ...props });
}

const isChecked = (wrapper: CollectionPreferencesWrapper, checked = true) => {
  if (checked) {
    expect(wrapper.findModal()!.findContentDensityPreference()!.findNativeInput().getElement()).toBeChecked();
  } else {
    expect(wrapper.findModal()!.findContentDensityPreference()!.findNativeInput().getElement()).not.toBeChecked();
  }
};

describe('Content density', () => {
  test('correctly displays label and description', () => {
    const wrapper = renderWithContentDensity({});
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findContentDensityPreference()!.findLabel()!.getElement()).toHaveTextContent(
      'Compact mode'
    );
    expect(wrapper.findModal()!.findContentDensityPreference()!.findDescription()!.getElement()).toHaveTextContent(
      'Display the content in a denser, more compact mode'
    );
  });
  test('displays as checked when value specified in preferences property is "compact"', () => {
    const wrapper = renderWithContentDensity({ preferences: { contentDensity: 'compact' }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('displays as not checked when value specified in preferences property is "comfortable"', () => {
    const wrapper = renderWithContentDensity({ preferences: { contentDensity: 'comfortable' }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    isChecked(wrapper, false);
  });
  test('changes temporary value upon click', () => {
    const wrapper = renderWithContentDensity({ preferences: { contentDensity: 'compact' }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findContentDensityPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
  });
  test('restores previous value on dismiss', () => {
    const wrapper = renderWithContentDensity({ preferences: { contentDensity: 'compact' }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findContentDensityPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
    wrapper.findModal()!.findDismissButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('restores previous value on cancel', () => {
    const wrapper = renderWithContentDensity({ preferences: { contentDensity: 'compact' }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findContentDensityPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
    wrapper.findModal()!.findCancelButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('decorates onConfim event details correctly upon change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithContentDensity({ preferences: { contentDensity: 'compact' }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findContentDensityPreference()!.findNativeInput().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { contentDensity: 'comfortable' } }));
  });
  test('decorates onConfim event details correctly even without change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithContentDensity({ preferences: { contentDensity: 'compact' }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { contentDensity: 'compact' } }));
  });
});
