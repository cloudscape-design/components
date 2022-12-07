// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import { renderCollectionPreferences, stripedRowsPreference } from './shared';

function renderWithStripedRows(props: Partial<CollectionPreferencesProps>): CollectionPreferencesWrapper {
  return renderCollectionPreferences({ stripedRowsPreference, ...props });
}

const isChecked = (wrapper: CollectionPreferencesWrapper, checked = true) => {
  if (checked) {
    expect(wrapper.findModal()!.findStripedRowsPreference()!.findNativeInput().getElement()).toBeChecked();
  } else {
    expect(wrapper.findModal()!.findStripedRowsPreference()!.findNativeInput().getElement()).not.toBeChecked();
  }
};

describe('Striped rows', () => {
  test('correctly displays label and description', () => {
    const wrapper = renderWithStripedRows({});
    wrapper.findTriggerButton().click();
    expect(wrapper.findModal()!.findStripedRowsPreference()!.findLabel()!.getElement()).toHaveTextContent(
      'Striped rows label'
    );
    expect(wrapper.findModal()!.findStripedRowsPreference()!.findDescription()!.getElement()).toHaveTextContent(
      'Striped rows description'
    );
  });
  test('displays as checked when value specified in preferences property is true', () => {
    const wrapper = renderWithStripedRows({ preferences: { stripedRows: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('displays as checked when value specified in preferences property is true', () => {
    const wrapper = renderWithStripedRows({ preferences: { stripedRows: false }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    isChecked(wrapper, false);
  });
  test('changes temporary value upon click', () => {
    const wrapper = renderWithStripedRows({ preferences: { stripedRows: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findStripedRowsPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
  });
  test('restores previous value on dismiss', () => {
    const wrapper = renderWithStripedRows({ preferences: { stripedRows: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findStripedRowsPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
    wrapper.findModal()!.findDismissButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('restores previous value on cancel', () => {
    const wrapper = renderWithStripedRows({ preferences: { stripedRows: true }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findStripedRowsPreference()!.findNativeInput().click();
    isChecked(wrapper, false);
    wrapper.findModal()!.findCancelButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper);
  });
  test('decorates onConfim event details correctly upon change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithStripedRows({ preferences: { stripedRows: true }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findStripedRowsPreference()!.findNativeInput().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { stripedRows: false } }));
  });
  test('decorates onConfim event details correctly even without change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithStripedRows({ preferences: { stripedRows: true }, onConfirm: onConfirmSpy });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { stripedRows: true } }));
  });
});
