// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Checkbox from '../../../lib/components/checkbox';
import { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import createWrapper from '../../../lib/components/test-utils/dom';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import { renderCollectionPreferences } from './shared';

const customPreferencesProps = (
  value: boolean
): Pick<CollectionPreferencesProps, 'preferences' | 'customPreference' | 'onConfirm'> => ({
  preferences: { custom: value },
  onConfirm: () => {},
  customPreference: (customState, setCustomState) => (
    <Checkbox checked={customState} onChange={({ detail }) => setCustomState(detail.checked)} />
  ),
});

const findNativeCheckbox = (wrapper: CollectionPreferencesWrapper) => {
  const customPreferenceElement = wrapper.findModal()!.findCustomPreference()!.getElement();
  return createWrapper(customPreferenceElement).findCheckbox()!.findNativeInput();
};

const isChecked = (wrapper: CollectionPreferencesWrapper, checked = true) => {
  const nativeInput = findNativeCheckbox(wrapper).getElement();
  if (checked) {
    expect(nativeInput).toBeChecked();
  } else {
    expect(nativeInput).not.toBeChecked();
  }
};

describe('Custom preference', () => {
  test('correctly displays initial state - true', () => {
    const wrapper = renderCollectionPreferences(customPreferencesProps(true));
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('correctly displays initial state - false', () => {
    const wrapper = renderCollectionPreferences(customPreferencesProps(false));
    wrapper.findTriggerButton().click();
    isChecked(wrapper, false);
  });
  test('updates the temporary value upon click', () => {
    const wrapper = renderCollectionPreferences(customPreferencesProps(false));
    wrapper.findTriggerButton().click();
    findNativeCheckbox(wrapper).click();
    isChecked(wrapper);
  });
  test('resets the previous value on cancel', () => {
    const wrapper = renderCollectionPreferences(customPreferencesProps(false));
    wrapper.findTriggerButton().click();
    findNativeCheckbox(wrapper).click();
    wrapper.findModal()!.findCancelButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper, false);
  });
  test('decorates onConfirm event details correctly upon change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderCollectionPreferences({ ...customPreferencesProps(false), onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    findNativeCheckbox(wrapper).click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { custom: true } }));
  });
  test('decorates onConfirm event details correctly even without change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderCollectionPreferences({ ...customPreferencesProps(false), onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { custom: false } }));
  });
  test('does not unwrap function value it is passed to setState callback', () => {
    const onConfirmSpy = jest.fn();
    const customPreference: CollectionPreferencesProps<boolean>['customPreference'] = (value, setValue) => {
      return (
        <Checkbox
          checked={value}
          onChange={({ detail }) => {
            // @ts-expect-error: this should not be allowed by our API
            setValue(() => detail.checked);
          }}
        />
      );
    };
    const wrapper = renderCollectionPreferences({
      preferences: { custom: false },
      customPreference,
      onConfirm: event => onConfirmSpy(event.detail),
    });
    wrapper.findTriggerButton().click();
    findNativeCheckbox(wrapper).click();
    // checkbox should not be checked, because we passed back an invalid value, a function
    expect(findNativeCheckbox(wrapper).getElement()).not.toBeChecked();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith({ custom: expect.any(Function) });
  });
});
