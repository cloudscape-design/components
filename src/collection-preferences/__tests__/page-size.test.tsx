// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import { CollectionPreferencesWrapper, RadioGroupWrapper } from '../../../lib/components/test-utils/dom';
import { pageSizePreference, renderCollectionPreferences } from './shared';

import styles from '../../../lib/components/collection-preferences/styles.css.js';

function renderwithPageSizeSelection(props: Partial<CollectionPreferencesProps>): CollectionPreferencesWrapper {
  return renderCollectionPreferences({ pageSizePreference, ...props });
}
const findRadioGroup = (wrapper: CollectionPreferencesWrapper): RadioGroupWrapper => {
  return new RadioGroupWrapper(
    wrapper.findModal()!.findPageSizePreference()!.findByClassName(styles['page-size-radio-group'])!.getElement()
  );
};

const isSelectedOption = (wrapper: CollectionPreferencesWrapper, pageSize: number) => {
  const radioGroupWrapper = findRadioGroup(wrapper);
  [10, 20, 50].forEach(size => {
    if (size === pageSize) {
      expect(radioGroupWrapper.findInputByValue(`${size}`)!.getElement()).toBeChecked();
    } else {
      expect(radioGroupWrapper.findInputByValue(`${size}`)!.getElement()).not.toBeChecked();
    }
  });
};

describe('Page size selection', () => {
  test('correctly displays title', () => {
    const wrapper = renderwithPageSizeSelection({});
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findPageSizePreference()!.findTitle().getElement()).toHaveTextContent(
      'Select page size'
    );
  });
  test('correctly displays labels', () => {
    const wrapper = renderwithPageSizeSelection({});
    wrapper.findTriggerButton().click();
    const options = wrapper.findModal()!.findPageSizePreference()!.findOptions();
    expect(options[0].getElement()).toHaveTextContent('10 items');
    expect(options[1].getElement()).toHaveTextContent('20 items');
    expect(options[2].getElement()).toHaveTextContent('50 items');
  });
  test('displays the correct value from preferences prop', () => {
    const wrapper = renderwithPageSizeSelection({ preferences: { pageSize: 20 }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    isSelectedOption(wrapper, 20);
  });
  test('changes temporary value upon click', () => {
    const wrapper = renderwithPageSizeSelection({ preferences: { pageSize: 20 }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findTriggerButton().click();
    findRadioGroup(wrapper).findInputByValue('50')!.click();
    isSelectedOption(wrapper, 50);
  });
  test('restores previous value on dismiss', () => {
    const wrapper = renderwithPageSizeSelection({ preferences: { pageSize: 20 }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    findRadioGroup(wrapper).findInputByValue('50')!.click();
    isSelectedOption(wrapper, 50);
    wrapper.findModal()!.findDismissButton()!.click();
    wrapper.findTriggerButton().click();
    isSelectedOption(wrapper, 20);
  });
  test('restores previous value on cancel', () => {
    const wrapper = renderwithPageSizeSelection({ preferences: { pageSize: 20 }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    findRadioGroup(wrapper).findInputByValue('10')!.click();
    isSelectedOption(wrapper, 10);
    wrapper.findModal()!.findCancelButton()!.click();
    wrapper.findTriggerButton().click();
    isSelectedOption(wrapper, 20);
  });
  test('decorates onConfim event details correctly upon change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderwithPageSizeSelection({ preferences: { pageSize: 20 }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    findRadioGroup(wrapper).findInputByValue('50')!.click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { pageSize: 50 } }));
  });
  test('decorates onConfim event details correctly even without change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderwithPageSizeSelection({ preferences: { pageSize: 20 }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { pageSize: 20 } }));
  });
});
