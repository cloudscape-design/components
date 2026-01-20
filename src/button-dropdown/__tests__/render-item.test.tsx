// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';

describe('ButtonDropdown renderItem', () => {
  function renderButtonDropdown(props?: Partial<ButtonDropdownProps>) {
    const { container } = render(
      <ButtonDropdown items={props?.items ?? []} {...props}>
        Button
      </ButtonDropdown>
    );
    return createWrapper(container).findButtonDropdown()!;
  }

  const defaultItems: ButtonDropdownProps.Items = [
    { id: 'action1', text: 'Action 1' },
    { id: 'checkbox1', itemType: 'checkbox', text: 'Checkbox 1', checked: false },
    {
      id: 'group1',
      text: 'Group 1',
      items: [
        { id: 'nested-action', text: 'Nested Action' },
        { id: 'nested-checkbox', itemType: 'checkbox', text: 'Nested Checkbox', checked: true },
      ],
    },
  ];

  test('renders custom item content', () => {
    const renderItem = jest.fn(() => <div>Custom</div>);
    const wrapper = renderButtonDropdown({ items: defaultItems, renderItem });
    wrapper.openDropdown();
    expect(renderItem).toHaveBeenCalled();
    const elementWrapper = wrapper.findItemById('action1')!.getElement();
    expect(elementWrapper).not.toBeNull();
    expect(elementWrapper).toHaveTextContent('Custom');
  });

  test('receives correct item properties for action item', () => {
    const renderItem = jest.fn(() => <div>Custom</div>);
    const actionItem = { id: 'test-action', text: 'Test Action' };
    const wrapper = renderButtonDropdown({
      items: [actionItem],
      renderItem,
    });
    wrapper.openDropdown();
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          option: expect.objectContaining(actionItem),
          disabled: false,
          type: 'action',
        }),
      })
    );
  });

  test('receives correct item properties for checkbox item', () => {
    const renderItem = jest.fn(() => <div>Custom</div>);
    const checkboxItem = { id: 'test-checkbox', itemType: 'checkbox' as const, text: 'Test Checkbox', checked: true };
    const wrapper = renderButtonDropdown({
      items: [checkboxItem],
      renderItem,
    });
    wrapper.openDropdown();
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          option: expect.objectContaining(checkboxItem),
          disabled: false,
          checked: true,
          type: 'checkbox',
        }),
      })
    );
  });

  test('receives correct item properties for group item', () => {
    const renderItem = jest.fn(() => <div>Custom</div>);
    const groupItem = {
      id: 'test-group',
      text: 'Test Group',
      items: [{ id: 'child', text: 'Child' }],
    };
    const wrapper = renderButtonDropdown({
      items: [groupItem],
      renderItem,
    });
    wrapper.openDropdown();
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          option: expect.objectContaining(groupItem),
          disabled: false,
          type: 'group',
        }),
      })
    );
  });

  test('reflects highlighted state', () => {
    const renderItem = jest.fn(props => <div>{props.item.highlighted ? 'highlighted' : 'normal'}</div>);
    const wrapper = renderButtonDropdown({ items: [{ id: 'first', text: 'First' }], renderItem });
    wrapper.openDropdown();
    wrapper.keydown(KeyCode.down);
    expect(wrapper.getElement().textContent).toContain('highlighted');
  });

  test('reflects disabled state', () => {
    const renderItem = jest.fn(props => <div>{props.item.disabled ? 'disabled' : 'enabled'}</div>);
    const wrapper = renderButtonDropdown({
      items: [{ id: 'test', text: 'Test', disabled: true }],
      renderItem,
    });
    wrapper.openDropdown();
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          disabled: true,
        }),
      })
    );
  });

  test('reflects checked state for checkbox items', () => {
    const renderItem = jest.fn(props => <div>{props.item.checked ? 'checked' : 'unchecked'}</div>);
    const checkboxItem = { id: 'test', itemType: 'checkbox' as const, text: 'Test', checked: true };
    const wrapper = renderButtonDropdown({
      items: [checkboxItem],
      renderItem,
    });
    wrapper.openDropdown();
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ checked: true }),
      })
    );
  });

  test('renders children within groups correctly', () => {
    const renderItem = jest.fn(props => (
      <div>
        {props.item.type}-{props.item.option.text}
      </div>
    ));
    const wrapper = renderButtonDropdown({
      items: [{ id: 'group', text: 'Group', items: [{ id: 'child', text: 'Child' }] }],
      renderItem,
    });
    wrapper.openDropdown();
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ type: 'action' }),
      })
    );
  });

  test('receives correct parent attribute for child item in group', () => {
    const renderItem = jest.fn(() => <div>Custom</div>);
    const groupItem = {
      id: 'parent-group',
      text: 'Parent Group',
      items: [{ id: 'child-item', text: 'Child Item' }],
    };
    const wrapper = renderButtonDropdown({
      items: [groupItem],
      renderItem,
    });
    wrapper.openDropdown();

    // Verify that the child item receives the correct parent attribute
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'action',
          option: expect.objectContaining({ id: 'child-item', text: 'Child Item' }),
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining(groupItem),
          }),
        }),
      })
    );
  });

  test('allows interaction with custom rendered items', () => {
    const onItemClick = jest.fn();
    const renderItem = jest.fn(props => <div>{props.item.option.id}</div>);
    const wrapper = renderButtonDropdown({
      items: [
        { id: 'test1', text: 'Test 1' },
        { id: 'test2', text: 'Test 2' },
      ],
      renderItem,
      onItemClick,
    });
    wrapper.openDropdown();
    wrapper.findItemById('test2')!.click();
    expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'test2' } }));
  });

  test('renders nested action items in groups with custom render', () => {
    const renderItem = jest.fn(props => (
      <div data-testid={`custom-${props.item.option.id}`}>
        Custom {props.item.type}: {props.item.option.text}
      </div>
    ));
    const groupWithActions = {
      id: 'action-group',
      text: 'Action Group',
      items: [
        { id: 'nested-action1', text: 'Nested Action 1' },
        { id: 'nested-action2', text: 'Nested Action 2' },
      ],
    };
    const wrapper = renderButtonDropdown({
      items: [groupWithActions],
      renderItem,
    });
    wrapper.openDropdown();

    // Verify group item is rendered
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'group',
          option: expect.objectContaining({ id: 'action-group' }),
        }),
      })
    );

    // Verify nested action items are rendered
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'action',
          option: expect.objectContaining({ id: 'nested-action1' }),
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining({ id: 'action-group' }),
          }),
        }),
      })
    );
  });

  test('renders nested checkbox items in groups with custom render', () => {
    const renderItem = jest.fn(props => (
      <div data-testid={`custom-${props.item.option.id}`}>
        Custom {props.item.type}: {props.item.option.text}
        {props.item.type === 'checkbox' && (props.item.checked ? ' (checked)' : ' (unchecked)')}
      </div>
    ));
    const groupWithCheckboxes = {
      id: 'checkbox-group',
      text: 'Checkbox Group',
      items: [
        { id: 'nested-checkbox1', itemType: 'checkbox' as const, text: 'Nested Checkbox 1', checked: true },
        { id: 'nested-checkbox2', itemType: 'checkbox' as const, text: 'Nested Checkbox 2', checked: false },
      ],
    };
    const wrapper = renderButtonDropdown({
      items: [groupWithCheckboxes],
      renderItem,
    });
    wrapper.openDropdown();

    // Verify nested checkbox items are rendered with correct checked state
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'checkbox',
          option: expect.objectContaining({ id: 'nested-checkbox1' }),
          checked: true,
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining({ id: 'checkbox-group' }),
          }),
        }),
      })
    );

    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'checkbox',
          option: expect.objectContaining({ id: 'nested-checkbox2' }),
          checked: false,
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining({ id: 'checkbox-group' }),
          }),
        }),
      })
    );
  });

  test('renders mixed nested items (actions and checkboxes) in groups', () => {
    const renderItem = jest.fn(props => (
      <div data-testid={`custom-${props.item.option.id}`}>
        {props.item.type === 'action' && `Action: ${props.item.option.text}`}
        {props.item.type === 'checkbox' &&
          `Checkbox: ${props.item.option.text} (${props.item.checked ? 'checked' : 'unchecked'})`}
        {props.item.type === 'group' && `Group: ${props.item.option.text}`}
      </div>
    ));
    const mixedGroup = {
      id: 'mixed-group',
      text: 'Mixed Group',
      items: [
        { id: 'action-in-group', text: 'Action in Group' },
        { id: 'checkbox-in-group', itemType: 'checkbox' as const, text: 'Checkbox in Group', checked: true },
        { id: 'another-action', text: 'Another Action' },
      ],
    };
    const wrapper = renderButtonDropdown({
      items: [mixedGroup],
      renderItem,
    });
    wrapper.openDropdown();

    // Verify all nested items are rendered with correct types and parent references
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'action',
          option: expect.objectContaining({ id: 'action-in-group' }),
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining({ id: 'mixed-group' }),
          }),
        }),
      })
    );

    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'checkbox',
          option: expect.objectContaining({ id: 'checkbox-in-group' }),
          checked: true,
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining({ id: 'mixed-group' }),
          }),
        }),
      })
    );

    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'action',
          option: expect.objectContaining({ id: 'another-action' }),
          parent: expect.objectContaining({
            type: 'group',
            option: expect.objectContaining({ id: 'mixed-group' }),
          }),
        }),
      })
    );
  });

  test('handles checkbox item clicks with custom render', () => {
    const onItemClick = jest.fn();
    const renderItem = jest.fn(props => (
      <div>
        Custom checkbox: {props.item.option.text}
        {props.item.type === 'checkbox' && (props.item.checked ? ' ✓' : ' ○')}
      </div>
    ));
    const checkboxItem = {
      id: 'clickable-checkbox',
      itemType: 'checkbox' as const,
      text: 'Clickable Checkbox',
      checked: false,
    };
    const wrapper = renderButtonDropdown({
      items: [checkboxItem],
      renderItem,
      onItemClick,
    });
    wrapper.openDropdown();
    wrapper.findItemById('clickable-checkbox')!.click();
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          id: 'clickable-checkbox',
          checked: true, // Should toggle to true when clicked
        },
      })
    );
  });

  test('renders expandable groups with custom render', () => {
    const renderItem = jest.fn(props => (
      <div data-testid={`custom-${props.item.option.id || 'group'}`}>
        {props.item.type === 'group' &&
          `Expandable Group: ${props.item.option.text} (${props.item.expanded ? 'expanded' : 'collapsed'})`}
        {props.item.type === 'action' && `Action: ${props.item.option.text}`}
      </div>
    ));
    const expandableGroup = {
      id: 'expandable-group',
      text: 'Expandable Group',
      items: [{ id: 'hidden-action', text: 'Hidden Action' }],
    };
    const wrapper = renderButtonDropdown({
      items: [expandableGroup],
      renderItem,
      expandableGroups: true,
    });
    wrapper.openDropdown();

    // Verify expandable group is rendered
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          type: 'group',
          option: expect.objectContaining({ id: 'expandable-group' }),
          expanded: expect.any(Boolean),
        }),
      })
    );
  });

  test('renders items with index property', () => {
    const renderItem = jest.fn(props => (
      <div data-testid={`item-${props.item.index}`}>
        Item {props.item.index}: {props.item.option.text}
      </div>
    ));
    const items = [
      { id: 'first', text: 'First Item' },
      { id: 'second', text: 'Second Item' },
      { id: 'third', text: 'Third Item' },
    ];
    const wrapper = renderButtonDropdown({
      items,
      renderItem,
    });
    wrapper.openDropdown();

    // Verify items are rendered with correct index values
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          index: 0,
          option: expect.objectContaining({ id: 'first' }),
        }),
      })
    );

    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          index: 1,
          option: expect.objectContaining({ id: 'second' }),
        }),
      })
    );

    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({
          index: 2,
          option: expect.objectContaining({ id: 'third' }),
        }),
      })
    );
  });
});
