// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import ContentDisplayPreference, {
  ContentDisplayPreferenceProps,
} from '../../../lib/components/content-display-preference';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper, { ContentDisplayPreferenceWrapper } from '../../../lib/components/test-utils/dom';

const options: ContentDisplayPreferenceProps['options'] = [
  { id: 'id1', label: 'Item 1', alwaysVisible: true },
  { id: 'id2', label: 'Item 2' },
  { id: 'id3', label: 'Item 3' },
  { id: 'id4', label: 'Item 4' },
];

const i18nMessages = {
  'collection-preferences': {
    'contentDisplayPreference.i18nStrings.columnFilteringPlaceholder': 'Filter columns',
    'contentDisplayPreference.i18nStrings.columnFilteringAriaLabel': 'Filter columns',
    'contentDisplayPreference.i18nStrings.columnFilteringNoMatchText': 'No matches found',
    'contentDisplayPreference.i18nStrings.columnFilteringClearFilterText': 'Clear filter',
    'contentDisplayPreference.i18nStrings.columnFilteringCountText':
      '{count, select, zero {0 matches} one {1 match} other {{count} matches}}',
    'contentDisplayPreference.dragHandleAriaLabel': 'Drag handle',
    'contentDisplayPreference.liveAnnouncementDndStarted': 'Picked up item at position {position} of {total}',
    'contentDisplayPreference.liveAnnouncementDndItemReordered':
      '{isInitialPosition, select, true {Moving item back to position {currentPosition} of {total}} false {Moving item to position {currentPosition} of {total}} other {}}',
    'contentDisplayPreference.liveAnnouncementDndItemCommitted':
      '{isInitialPosition, select, true {Item moved back to its original position {initialPosition} of {total}} false {Item moved from position {initialPosition} to position {finalPosition} of {total}} other {}}',
    'contentDisplayPreference.liveAnnouncementDndDiscarded': 'Reordering canceled',
  },
};

/**
 * Renders the standalone component with local state so that the controlled `value`
 * updates when the user interacts, mirroring real usage.
 */
function StatefulContentDisplayPreference({
  onChange,
  ...props
}: Partial<ContentDisplayPreferenceProps> & { onChange?: ContentDisplayPreferenceProps['onChange'] }) {
  const [value, setValue] = useState<ContentDisplayPreferenceProps['value']>(props.value);
  return (
    <ContentDisplayPreference
      title="Content display title"
      description="Content display description"
      options={options}
      {...props}
      value={value}
      onChange={event => {
        setValue(event.detail.value);
        onChange?.(event);
      }}
    />
  );
}

function renderCDP(
  props: Partial<ContentDisplayPreferenceProps> & { onChange?: ContentDisplayPreferenceProps['onChange'] } = {},
  withI18nProvider = false
): ContentDisplayPreferenceWrapper {
  const node = <StatefulContentDisplayPreference {...props} />;
  render(withI18nProvider ? <TestI18nProvider messages={i18nMessages}>{node}</TestI18nProvider> : node);
  return createWrapper().findContentDisplayPreference()!;
}

function pressKey(element: HTMLElement, key: string) {
  fireEvent.keyDown(element, { key, code: key });
}

describe('ContentDisplayPreference (standalone)', () => {
  describe('Rendering', () => {
    it('renders the title as an h3', () => {
      const titleElement = renderCDP().findTitle().getElement();
      expect(titleElement).toHaveTextContent('Content display title');
      expect(titleElement.tagName).toBe('H3');
    });

    it('renders the description', () => {
      expect(renderCDP().findDescription().getElement()).toHaveTextContent('Content display description');
    });

    it('wraps content in a group role with aria-labelledby and aria-describedby', () => {
      const wrapper = renderCDP();
      const titleId = wrapper.findTitle().getElement().id;
      const descriptionId = wrapper.findDescription().getElement().id;
      const group = wrapper.getElement().querySelector('[role="group"]')!;
      expect(group).not.toBeNull();
      expect(group.getAttribute('aria-labelledby')).toBe(titleId);
      expect(group.getAttribute('aria-describedby')).toBe(descriptionId);
    });

    it('renders all options with all of them visible by default (uncontrolled value)', () => {
      const wrapper = renderCDP();
      const optionWrappers = wrapper.findOptions();
      expect(optionWrappers).toHaveLength(4);
      for (const optionWrapper of optionWrappers) {
        expect(optionWrapper.findVisibilityToggle().findNativeInput().getElement()).toBeChecked();
      }
    });

    it('renders the provided value ordering and visibility', () => {
      const wrapper = renderCDP({
        value: [
          { id: 'id1', visible: true },
          { id: 'id3', visible: false },
          { id: 'id2', visible: true },
          { id: 'id4', visible: false },
        ],
      });
      const labels = wrapper.findOptions().map(option => option.findLabel().getElement().textContent);
      expect(labels).toEqual(['Item 1', 'Item 3', 'Item 2', 'Item 4']);
      const statuses = wrapper
        .findOptions()
        .map(option => option.findVisibilityToggle().findNativeInput().getElement().hasAttribute('checked'));
      // id1 visible, id3 hidden, id2 visible, id4 hidden
      expect(wrapper.findOptionByIndex(2)!.findVisibilityToggle().findNativeInput().getElement()).not.toBeChecked();
      expect(statuses.length).toBe(4);
    });
  });

  describe('Reacting to changes immediately', () => {
    it('fires onChange with the updated value when toggling visibility', () => {
      const onChange = jest.fn();
      const wrapper = renderCDP({ onChange });
      wrapper.findOptionByIndex(2)!.findVisibilityToggle().findNativeInput().click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: [
              { id: 'id1', visible: true },
              { id: 'id2', visible: false },
              { id: 'id3', visible: true },
              { id: 'id4', visible: true },
            ],
          },
        })
      );
      // The controlled value is reflected back in the UI without a confirm step.
      expect(wrapper.findOptionByIndex(2)!.findVisibilityToggle().findNativeInput().getElement()).not.toBeChecked();
    });

    it('lets a consumer enforce a maximum number of visible columns', () => {
      const maxVisible = 2;
      function LimitedContentDisplay() {
        const [value, setValue] = useState<ContentDisplayPreferenceProps['value']>([
          { id: 'id1', visible: true },
          { id: 'id2', visible: true },
          { id: 'id3', visible: false },
          { id: 'id4', visible: false },
        ]);
        return (
          <ContentDisplayPreference
            options={[
              { id: 'id1', label: 'Item 1' },
              { id: 'id2', label: 'Item 2' },
              { id: 'id3', label: 'Item 3' },
              { id: 'id4', label: 'Item 4' },
            ]}
            value={value}
            onChange={event => {
              const visibleCount = event.detail.value.filter(item => item.visible).length;
              if (visibleCount <= maxVisible) {
                setValue(event.detail.value);
              }
            }}
          />
        );
      }
      render(<LimitedContentDisplay />);
      const wrapper = createWrapper().findContentDisplayPreference()!;
      // Attempting to enable a 3rd column is rejected by the consumer -> stays hidden.
      wrapper.findOptionByIndex(3)!.findVisibilityToggle().findNativeInput().click();
      expect(wrapper.findOptionByIndex(3)!.findVisibilityToggle().findNativeInput().getElement()).not.toBeChecked();
    });

    it('keeps alwaysVisible options checked and disabled', () => {
      const onChange = jest.fn();
      const wrapper = renderCDP({ onChange });
      const toggle = wrapper.findOptionByIndex(1)!.findVisibilityToggle().findNativeInput();
      expect(toggle.getElement()).toBeChecked();
      expect(toggle.getElement()).toBeDisabled();
      toggle.click();
      expect(toggle.getElement()).toBeChecked();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('fires onChange with the reordered value when moving an item with the keyboard', async () => {
      const onChange = jest.fn();
      const wrapper = renderCDP({ onChange }, true);
      const settle = () => new Promise(resolve => setTimeout(resolve, 0));
      const dragHandle = wrapper.findOptionByIndex(2)!.findDragHandle().getElement();
      pressKey(dragHandle, 'Space');
      await settle();
      pressKey(dragHandle, 'ArrowDown');
      await settle();
      pressKey(dragHandle, 'Space');
      await settle();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: [
              { id: 'id1', visible: true },
              { id: 'id3', visible: true },
              { id: 'id2', visible: true },
              { id: 'id4', visible: true },
            ],
          },
        })
      );
    });
  });

  describe('Column filtering', () => {
    it('does not render the text filter by default', () => {
      expect(renderCDP().findTextFilter()).toBeNull();
    });

    it('filters options when enableColumnFiltering is set', () => {
      const wrapper = renderCDP({ enableColumnFiltering: true }, true);
      const filter = wrapper.findTextFilter();
      expect(filter).not.toBeNull();
      filter!.findInput().setInputValue('Item 1');
      expect(wrapper.findOptions()).toHaveLength(1);
      filter!.findInput().findClearButton()?.click();
      expect(wrapper.findOptions()).toHaveLength(4);
    });
  });

  describe('Groups', () => {
    it('renders grouped options', () => {
      const wrapper = renderCDP({
        options: [
          { id: 'id1', label: 'Item 1' },
          { id: 'id2', label: 'Item 2' },
          { id: 'id3', label: 'Item 3' },
        ],
        groups: [{ id: 'g1', label: 'Group 1' }],
        value: [
          { id: 'id1', visible: true },
          {
            type: 'group',
            id: 'g1',
            visible: true,
            children: [
              { id: 'id2', visible: true },
              { id: 'id3', visible: false },
            ],
          },
        ],
      });
      expect(wrapper.findOptions({ group: true })).toHaveLength(1);
    });
  });

  describe('Base component API', () => {
    it('applies className, id and data attributes to the root and is findable', () => {
      const { container } = render(
        <ContentDisplayPreference
          className="custom-class"
          id="my-id"
          data-testid="cdp"
          options={options}
          value={undefined}
          onChange={() => {}}
        />
      );
      const root = container.querySelector('#my-id')!;
      expect(root).toHaveClass('custom-class');
      expect(root).toHaveAttribute('data-testid', 'cdp');
      expect(createWrapper(container).findContentDisplayPreference()).not.toBeNull();
    });
  });
});
