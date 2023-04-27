// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import { CollectionPreferencesWrapper } from '../../../lib/components/test-utils/dom';
import { renderCollectionPreferences, visibleContentPreference } from './shared';
import styles from '../../../lib/components/collection-preferences/styles.css.js';

function renderWithContentSelection(props: Partial<CollectionPreferencesProps>): CollectionPreferencesWrapper {
  return renderCollectionPreferences({ visibleContentPreference, ...props });
}

const isChecked = (wrapper: CollectionPreferencesWrapper, groupIndex: number, optionIndex: number, checked = true) => {
  const toggle = wrapper
    .findModal()!
    .findVisibleContentPreference()!
    .findToggleByIndex(groupIndex, optionIndex)!
    .findNativeInput()!
    .getElement();
  if (checked) {
    expect(toggle).toBeChecked();
  } else {
    expect(toggle).not.toBeChecked();
  }
};

describe('Content selection', () => {
  test('correctly displays title', () => {
    const wrapper = renderWithContentSelection({});
    wrapper.findTriggerButton().click();

    const titleElement = wrapper.findModal()!.findVisibleContentPreference()!.findTitle().getElement();
    expect(titleElement).toHaveTextContent('Content selection title');
    expect(titleElement.tagName).toBe('H3');
  });
  test('correctly displays group labels', () => {
    const wrapper = renderWithContentSelection({});
    wrapper.findTriggerButton().click();
    const groupLabels = wrapper
      .findModal()!
      .findVisibleContentPreference()!
      .findAllByClassName(styles['visible-content-group-label']);
    expect(groupLabels).toHaveLength(2);
    expect(groupLabels[0].getElement()).toHaveTextContent('Group label one');
    expect(groupLabels[1].getElement()).toHaveTextContent('Group label two');
  });
  test('displays non-editable non-visible options', () => {
    const wrapper = renderWithContentSelection({});
    wrapper.findTriggerButton().click();
    const optionLabels = wrapper
      .findModal()!
      .findVisibleContentPreference()!
      .findAllByClassName(styles['visible-content-option-label']);
    expect(optionLabels).toHaveLength(7);
    const disableToggle = wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(1, 1)!;
    expect(disableToggle).not.toBeNull();
    expect(disableToggle.findNativeInput().getElement()).toBeDisabled();
    isChecked(wrapper, 1, 1, false);
  });
  test('displays non-editable visible options', () => {
    const wrapper = renderWithContentSelection({ preferences: { visibleContent: ['id'] }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    const optionLabels = wrapper
      .findModal()!
      .findVisibleContentPreference()!
      .findAllByClassName(styles['visible-content-option-label']);
    expect(optionLabels).toHaveLength(7);
    expect(optionLabels[0].getElement()).toHaveTextContent('Distribution ID');
  });
  test('displays option labels', () => {
    const wrapper = renderWithContentSelection({});
    wrapper.findTriggerButton().click();
    const optionLabels = wrapper
      .findModal()!
      .findVisibleContentPreference()!
      .findAllByClassName(styles['visible-content-option-label']);
    expect(optionLabels[0].getElement()).toHaveTextContent('Distribution ID');
    expect(optionLabels[1].getElement()).toHaveTextContent('Domain name');
    expect(optionLabels[2].getElement()).toHaveTextContent('Price class');
    expect(optionLabels[3].getElement()).toHaveTextContent('Origin');
  });
  test('sets aria attributes', () => {
    const wrapper = renderWithContentSelection({ preferences: { visibleContent: ['id'] }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    const titleId = wrapper.findModal()!.findVisibleContentPreference()!.findTitle().getElement().id;
    // group
    const innerGroup = wrapper.findModal()!.findVisibleContentPreference()!.findOptionsGroups()[0]!.getElement();
    expect(innerGroup).toHaveAttribute('role', 'group');
    const innergroupLabelId = wrapper
      .findModal()!
      .findVisibleContentPreference()!
      .findOptionsGroups()[0]!
      .findByClassName(styles['visible-content-group-label'])!
      .getElement().id;
    expect(innerGroup).toHaveAttribute('aria-labelledby', `${titleId} ${innergroupLabelId}`);
  });
  test('label is associated with toggle', () => {
    const wrapper = renderWithContentSelection({ preferences: { visibleContent: ['id'] }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    const firstOptionToggleControlId = wrapper
      .findModal()!
      .findVisibleContentPreference()!
      .findToggleByIndex(1, 1)!
      .findNativeInput()!
      .getElement().id;
    const firstOptionLabelFor = wrapper
      .findModal()!
      .findVisibleContentPreference()!
      .findAllByClassName(styles['visible-content-option-label'])[0]!
      .getElement()!
      .getAttribute('for');
    expect(firstOptionToggleControlId).toBe(firstOptionLabelFor);
  });
  test('displays disabled toggle for non-editable visible options', () => {
    const wrapper = renderWithContentSelection({ preferences: { visibleContent: ['id'] }, onConfirm: () => {} });
    wrapper.findTriggerButton().click();
    const disableToggle = wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(1, 1)!;
    expect(disableToggle).not.toBeNull();
    expect(disableToggle.findNativeInput().getElement()).toBeDisabled();
  });
  test('displays the correct value from preferences prop', () => {
    const wrapper = renderWithContentSelection({
      preferences: { visibleContent: ['id', 'priceClass', 'origin'] },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    isChecked(wrapper, 1, 1);
    isChecked(wrapper, 1, 2, false);
    isChecked(wrapper, 2, 1);
    isChecked(wrapper, 2, 2);
    isChecked(wrapper, 2, 3, false);
    isChecked(wrapper, 2, 4, false);
    isChecked(wrapper, 2, 5, false);
  });

  test('changes temporary value upon click', () => {
    const wrapper = renderWithContentSelection({
      preferences: { visibleContent: ['id', 'priceClass', 'origin'] },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(1, 2)!.findNativeInput().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(2, 1)!.findNativeInput().click();
    isChecked(wrapper, 1, 1);
    isChecked(wrapper, 1, 2);
    isChecked(wrapper, 2, 1, false);
    isChecked(wrapper, 2, 2);
    isChecked(wrapper, 2, 3, false);
    isChecked(wrapper, 2, 4, false);
    isChecked(wrapper, 2, 5, false);
  });
  test('restores previous value on dismiss', () => {
    const wrapper = renderWithContentSelection({
      preferences: { visibleContent: ['id', 'priceClass', 'origin'] },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(1, 2)!.findNativeInput().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(2, 1)!.findNativeInput().click();
    wrapper.findModal()!.findDismissButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper, 1, 1);
    isChecked(wrapper, 1, 2, false);
    isChecked(wrapper, 2, 1);
    isChecked(wrapper, 2, 2);
    isChecked(wrapper, 2, 3, false);
    isChecked(wrapper, 2, 4, false);
    isChecked(wrapper, 2, 5, false);
  });
  test('restores previous value on cancel', () => {
    const wrapper = renderWithContentSelection({
      preferences: { visibleContent: ['id', 'priceClass', 'origin'] },
      onConfirm: () => {},
    });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(1, 2)!.findNativeInput().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(2, 1)!.findNativeInput().click();
    wrapper.findModal()!.findCancelButton()!.click();
    wrapper.findTriggerButton().click();
    isChecked(wrapper, 1, 1);
    isChecked(wrapper, 1, 2, false);
    isChecked(wrapper, 2, 1);
    isChecked(wrapper, 2, 2);
    isChecked(wrapper, 2, 3, false);
    isChecked(wrapper, 2, 4, false);
    isChecked(wrapper, 2, 5, false);
  });
  test('decorates onConfirm event details correctly upon change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithContentSelection({
      preferences: { visibleContent: ['id', 'priceClass', 'origin'] },
      onConfirm: onConfirmSpy,
    });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(1, 2)!.findNativeInput().click();
    wrapper.findModal()!.findVisibleContentPreference()!.findToggleByIndex(2, 1)!.findNativeInput().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { visibleContent: ['id', 'domainName', 'origin'] } })
    );
  });
  test('decorates onConfirm event details correctly even without change', () => {
    const onConfirmSpy = jest.fn();
    const wrapper = renderWithContentSelection({
      preferences: { visibleContent: ['id', 'priceClass', 'origin'] },
      onConfirm: onConfirmSpy,
    });
    wrapper.findTriggerButton().click();
    wrapper.findModal()!.findConfirmButton()!.click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    expect(onConfirmSpy).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { visibleContent: ['id', 'priceClass', 'origin'] } })
    );
  });
});
