// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import { renderCollectionPreferences, stickyColumnsPreference } from './shared';

function renderWithStickyColumnsPreferences(props: Partial<CollectionPreferencesProps>): CollectionPreferencesWrapper {
  return renderCollectionPreferences({ stickyColumnsPreference, ...props });
}

const firstColumnOptions = [0, 1, 2];
const lastColumnOptions = [0, 1];

function isSelectedOption(
  wrapper: CollectionPreferencesWrapper,
  firstOrLast: 'first' | 'last',
  expectedOption: number
) {
  const options = firstOrLast === 'first' ? firstColumnOptions : lastColumnOptions;
  const radioGroupWrapper = wrapper.findModal()!.findStickyColumnsPreference(firstOrLast)!.findRadioGroup();
  options.forEach(option => {
    if (option === expectedOption) {
      expect(radioGroupWrapper.findInputByValue(`${option}`)!.getElement()).toBeChecked();
    } else {
      expect(radioGroupWrapper.findInputByValue(`${option}`)!.getElement()).not.toBeChecked();
    }
  });
}

describe('Sticky columns preference selection', () => {
  test('correctly displays titles', () => {
    const wrapper = renderWithStickyColumnsPreferences({});
    wrapper.findTriggerButton().click();
    const preferencesModalWrapper = wrapper.findModal();

    expect(preferencesModalWrapper!.findStickyColumnsPreference('first')!.findTitle().getElement()).toHaveTextContent(
      'Stick first column(s)'
    );
    expect(preferencesModalWrapper!.findStickyColumnsPreference('last')!.findTitle().getElement()).toHaveTextContent(
      'Stick last column'
    );
  });
  test('correctly displays descriptions', () => {
    const wrapper = renderWithStickyColumnsPreferences({});
    wrapper.findTriggerButton().click();
    const preferencesModalWrapper = wrapper.findModal();

    expect(
      preferencesModalWrapper!.findStickyColumnsPreference('first')!.findDescription().getElement()
    ).toHaveTextContent('Keep the first column(s) visible while horizontally scrolling table content.');
    expect(
      preferencesModalWrapper!.findStickyColumnsPreference('last')!.findDescription().getElement()
    ).toHaveTextContent('Keep the last column visible while horizontally scrolling table content.');
  });
  test('correctly displays labels', () => {
    const wrapper = renderWithStickyColumnsPreferences({});
    wrapper.findTriggerButton().click();
    const firstColumnsOptions = wrapper
      .findModal()!
      .findStickyColumnsPreference('first')!
      .findRadioGroup()!
      .findButtons();
    const lastColumnsOptions = wrapper
      .findModal()!
      .findStickyColumnsPreference('last')!
      .findRadioGroup()!
      .findButtons();

    expect(firstColumnsOptions[0].getElement()).toHaveTextContent('None');
    expect(firstColumnsOptions[1].getElement()).toHaveTextContent('First column');
    expect(firstColumnsOptions[2].getElement()).toHaveTextContent('First two columns');
    expect(lastColumnsOptions[0].getElement()).toHaveTextContent('None');
    expect(lastColumnsOptions[1].getElement()).toHaveTextContent('Last column');
  });
  test('displays the correct value from preferences prop', () => {
    const wrapper = renderWithStickyColumnsPreferences({
      preferences: { stickyColumns: { first: 2, last: 1 } },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    isSelectedOption(wrapper, 'first', 2);
    isSelectedOption(wrapper, 'last', 1);
  });
  test('changes temporary value upon click', () => {
    const wrapper = renderWithStickyColumnsPreferences({
      preferences: { stickyColumns: { first: 1, last: 1 } },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    const radioGroupWrapper = wrapper.findModal()!.findStickyColumnsPreference('first')!.findRadioGroup();
    radioGroupWrapper.findInputByValue('0')!.click();
    isSelectedOption(wrapper, 'first', 0);
  });
  test('restores previous value on dismiss', () => {
    const wrapper = renderWithStickyColumnsPreferences({
      preferences: { stickyColumns: { first: 1, last: 1 } },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    const radioGroupWrapper = wrapper.findModal()!.findStickyColumnsPreference('first')!.findRadioGroup();
    radioGroupWrapper.findInputByValue('0')!.click();
    isSelectedOption(wrapper, 'first', 0);
    wrapper.findModal()!.findDismissButton()!.click();
    wrapper.findTriggerButton().click();
    isSelectedOption(wrapper, 'first', 1);
  });
  test('restores previous value on cancel', () => {
    const wrapper = renderWithStickyColumnsPreferences({
      preferences: { stickyColumns: { first: 1, last: 1 } },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    const radioGroupWrapper = wrapper.findModal()!.findStickyColumnsPreference('last')!.findRadioGroup();
    radioGroupWrapper.findInputByValue('0')!.click();
    isSelectedOption(wrapper, 'last', 0);
    wrapper.findModal()!.findCancelButton()!.click();
    wrapper.findTriggerButton().click();
    isSelectedOption(wrapper, 'last', 1);
  });
  test('decorates onConfim event details correctly upon change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithStickyColumnsPreferences({
      preferences: { stickyColumns: { first: 1, last: 1 } },
      onConfirm: onConfirmSpy,
    });
    wrapper.findTriggerButton().click();
    const radioGroupWrapper = wrapper.findModal()!.findStickyColumnsPreference('first')!.findRadioGroup();
    radioGroupWrapper.findInputByValue('0')!.click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { stickyColumns: { first: 0, last: 1 } } })
    );
  });
  test('decorates onConfim event details correctly even without change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithStickyColumnsPreferences({
      preferences: { stickyColumns: { first: 1, last: 1 } },
      onConfirm: onConfirmSpy,
    });
    wrapper.findTriggerButton().click();
    const radioGroupWrapper = wrapper.findModal()!.findStickyColumnsPreference('first')!.findRadioGroup();
    radioGroupWrapper.findInputByValue('1')!.click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { stickyColumns: { first: 1, last: 1 } } })
    );
  });
});
