// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { contentDisplayPreference, renderCollectionPreferences } from '../../__tests__/shared';
import { CollectionPreferencesProps } from '../../../../lib/components';
import ContentDisplayPreferenceWrapper, {
  ContentDisplayOptionWrapper,
} from '../../../../lib/components/test-utils/dom/collection-preferences/content-display-preference';
import { KeyCode } from '../../../internal/keycode';

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

  it('displays list of options with correct semantics', () => {
    const wrapper = renderContentDisplay({});
    const items = wrapper.findOptions();
    for (let i = 0; i < items.length; i++) {
      testOptionItem({ wrapper, item: items[i], index: i });
    }
  });

  it('reorders content items with the keyboard', () => {
    const wrapper = renderContentDisplay({});
    const items = wrapper.findOptions();
    for (let i = 0; i < items.length; i++) {
      testOptionItem({ wrapper, item: items[i], index: i });
    }
    const dragHandle = items[0].findDragHandle();
    dragHandle.keydown({ keyCode: KeyCode.space });
    dragHandle.keydown({ keyCode: KeyCode.down });
    dragHandle.keydown({ keyCode: KeyCode.space });
    for (const i of [1, 0, 2, 3]) {
      testOptionItem({ wrapper, item: items[i], index: i });
    }
  });
});

function renderContentDisplay(props: Partial<CollectionPreferencesProps> = {}) {
  const collectionPreferencesWrapper = renderCollectionPreferences({ contentDisplayPreference, ...props });
  collectionPreferencesWrapper.findTriggerButton().click();
  return collectionPreferencesWrapper.findModal()!.findContentDisplayPreference()!;
}

function expectLabel(wrapper: ContentDisplayPreferenceWrapper, element: HTMLElement, label: string) {
  const labelAttribute = element.getAttribute('aria-label');
  if (labelAttribute === label) {
    return;
  }
  const labelledBy = element.getAttribute('aria-labelledby');
  expect(labelledBy).toBeTruthy();
  const labelElement = wrapper.find(`#${labelledBy}`);
  expect(labelElement!.getElement()).toHaveTextContent(label);
}

function testOptionItem({
  wrapper,
  item,
  index,
}: {
  wrapper: ContentDisplayPreferenceWrapper;
  item: ContentDisplayOptionWrapper;
  index: number;
}) {
  const element = item.getElement();
  expect(element.tagName).toBe('LI');
  expect(element.parentElement!.tagName).toBe('UL');
  expect(element).toHaveTextContent(`Item ${index + 1}`);
  const dragHandle = item.findDragHandle().getElement();
  expectLabel(wrapper, dragHandle, `Drag handle, Item ${index + 1}`);
}
