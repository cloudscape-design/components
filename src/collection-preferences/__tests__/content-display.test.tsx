// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderCollectionPreferences } from './shared';
import { CollectionPreferencesProps } from '../../../lib/components';

describe('Content display', () => {
  it('correctly displays title', () => {
    const wrapper = renderContentDisplay({});
    const titleElement = wrapper.findTitle().getElement();
    expect(titleElement).toHaveTextContent('Content display title');
    expect(titleElement.tagName).toBe('H3');
  });

  it('correctly displays label', () => {
    const wrapper = renderContentDisplay({});
    const labelElement = wrapper.findLabel().getElement();
    expect(labelElement).toHaveTextContent('Content display label');
  });

  it('displays list of options as unordered list', () => {
    const wrapper = renderContentDisplay({});
    const items = wrapper.findOptions();
    for (const item of items) {
      expect(item.getElement().tagName).toBe('LI');
      expect(item.getElement().parentElement!.tagName).toBe('UL');
    }
  });
});

const contentDisplayPreference: CollectionPreferencesProps.ContentDisplayPreference = {
  title: 'Content display title',
  label: 'Content display label',
  options: [
    { id: 'id1', label: 'Item 1', editable: false },
    { id: 'id2', label: 'Item 2' },
    { id: 'id3', label: 'Item 3' },
    { id: 'id4', label: 'Item 4' },
  ],
};

function renderContentDisplay(props: Partial<CollectionPreferencesProps> = {}) {
  const collectionPreferencesWrapper = renderCollectionPreferences({ contentDisplayPreference, ...props });
  collectionPreferencesWrapper.findTriggerButton().click();
  return collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
}
