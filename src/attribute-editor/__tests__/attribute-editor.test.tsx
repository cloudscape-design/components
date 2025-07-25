// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import AttributeEditor, { AttributeEditorProps } from '../../../lib/components/attribute-editor';
import ButtonDropdown from '../../../lib/components/button-dropdown';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import Input from '../../../lib/components/input';
import createWrapper, { AttributeEditorWrapper } from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/attribute-editor/styles.css.js';
import buttonStyles from '../../../lib/components/button/styles.css.js';
import liveRegionStyles from '../../../lib/components/live-region/test-classes/styles.css.js';

let containerQueryBreakpoint = 'm';
jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation();
  (useContainerQuery as jest.Mock).mockImplementation(() => [containerQueryBreakpoint, () => {}]);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.resetAllMocks();
});

interface Item {
  key: string;
  value: string;
  additional: string;
}

const defaultProps: AttributeEditorProps<Item> = {
  addButtonText: 'Add new item',
  removeButtonText: 'Remove',
  definition: [
    {
      label: 'Key label',
      info: 'Key info',
      control: item => item.key,
    },
    {
      label: 'Value label',
      info: 'Value info',
      control: item => item.value,
    },
    {
      label: 'Additional label',
      info: 'Additional info',
      control: item => item.additional,
    },
  ],
  items: Array(3)
    .fill(0)
    .map((_, idx) => {
      return {
        key: `k${idx + 1}`,
        value: `v${idx + 1}`,
        additional: `a${idx + 1}`,
      };
    }),
  empty: 'empty region',
  i18nStrings: {
    errorIconAriaLabel: 'Error',
    warningIconAriaLabel: 'Warning',
  },
};

function renderAttributeEditor(
  props: Partial<AttributeEditorProps<Item>> & { ref?: React.Ref<AttributeEditorProps.Ref> } = {}
): AttributeEditorWrapper {
  const { container } = render(<AttributeEditor {...defaultProps} {...props} />);
  return createWrapper(container).findAttributeEditor()!;
}

const expectRowTextContent = (wrapper: AttributeEditorWrapper, rowIndex: number, expectedValues: string[]) => {
  const row = wrapper.findRow(rowIndex + 1)!;
  expectedValues.forEach((expectedValue, index) => {
    expect(row.findFields()[index].getElement()).toHaveTextContent(expectedValue);
  });
};

const expectRowLabelTextContent = (wrapper: AttributeEditorWrapper, rowIndex: number, expectedValues: string[]) => {
  const row = wrapper.findRow(rowIndex + 1)!;
  expectedValues.forEach((expectedValue, index) => {
    expect(row.findFields()[index].getElement()).toHaveTextContent(expectedValue);
  });
};

const expectRowErrorTextContent = (wrapper: AttributeEditorWrapper, rowIndex: number, expectedValues: string[]) => {
  const row = wrapper.findRow(rowIndex + 1)!;
  expectedValues.forEach((expectedValue, index) => {
    const errorField = row.findFields()[index].findError();
    expect(errorField).not.toBe(null);
    expect(errorField!.getElement()).toHaveTextContent(expectedValue);
  });
};

const expectRowWarningTextContent = (wrapper: AttributeEditorWrapper, rowIndex: number, expectedValues: string[]) => {
  const row = wrapper.findRow(rowIndex + 1)!;
  expectedValues.forEach((expectedValue, index) => {
    const warningField = row.findFields()[index].findWarning();
    expect(warningField).not.toBe(null);
    expect(warningField!.getElement()).toHaveTextContent(expectedValue);
  });
};

function TestComponent(propOverrides: Partial<AttributeEditorProps<Item>> = {}) {
  const [items, setItems] = React.useState(defaultProps.items!);
  const onRemoveButtonClick = (event: any) => {
    const newItems = items.slice();
    newItems.splice(event.detail.itemIndex, 1);
    setItems(newItems);
  };

  return (
    <AttributeEditor
      {...defaultProps}
      items={items}
      onRemoveButtonClick={onRemoveButtonClick}
      i18nStrings={{ ...defaultProps.i18nStrings, itemRemovedAriaLive: 'An item was removed.' }}
      additionalInfo="+++ADDN+++"
      {...propOverrides}
    />
  );
}

describe('Attribute Editor', () => {
  describe('items property', () => {
    let wrapper: AttributeEditorWrapper;

    beforeEach(() => {
      wrapper = renderAttributeEditor();
    });
    test('renders as many rows as are defined', () => {
      expect(wrapper.findRows()).toHaveLength(defaultProps.items!.length);
    });
    test('renders expected item structure', () => {
      expectRowTextContent(wrapper, 0, ['k1', 'v1', 'a1']);
      expectRowTextContent(wrapper, 1, ['k2', 'v2', 'a2']);
    });
    test('renders labels above all row items', () => {
      expectRowLabelTextContent(wrapper, 0, ['Key label', 'Value label', 'Additional label']);
      expectRowLabelTextContent(wrapper, 1, ['Key label', 'Value label', 'Additional label']);
    });
  });

  describe('empty items', () => {
    test('should render 0 rows when passed empty array', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, items: [] });
      expect(wrapper.findRows()).toHaveLength(0);
    });
    test('should fade in empty state when items were previously visible', () => {
      const { container, rerender } = render(<AttributeEditor {...defaultProps} />);
      rerender(<AttributeEditor {...defaultProps} items={[]} />);
      const wrapper = createWrapper(container).findAttributeEditor()!;
      expect(wrapper.findEmptySlot()?.getElement()).toHaveClass(styles['empty-appear']);
    });
    test('should not fade in empty state when it is initially displayed', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, items: [] });
      expect(wrapper.findEmptySlot()?.getElement()).not.toHaveClass(styles['empty-appear']);
    });
  });

  describe('add button', () => {
    test('renders `add` button using `addButtonText`', () => {
      const addButtonText = 'Test add text';
      const wrapper = renderAttributeEditor({ ...defaultProps, addButtonText: addButtonText });
      expect(wrapper.findAddButton().getElement()).toHaveTextContent(addButtonText);
    });

    test('triggers `onAddButtonClick` event when clicked', () => {
      const onAddButtonClick = jest.fn();
      const wrapper = renderAttributeEditor({ ...defaultProps, onAddButtonClick });

      wrapper.findAddButton().click();
      expect(onAddButtonClick).toHaveBeenCalled();
    });

    test('enables the add button by default', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps });
      const buttonElement = wrapper.findAddButton().getElement();
      expect(buttonElement).not.toHaveAttribute('aria-disabled');
    });

    test('enables the add button when disableAddButton is false', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, disableAddButton: false });
      const buttonElement = wrapper.findAddButton().getElement();
      expect(buttonElement).not.toHaveAttribute('aria-disabled');
    });

    test('disables the add button when disableAddButton is true', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, disableAddButton: true });
      const buttonElement = wrapper.findAddButton().getElement();
      expect(buttonElement).toHaveAttribute('aria-disabled');
    });

    test('allows the add button to be focused manually when disableAddButton is true', () => {
      const ref: React.Ref<AttributeEditorProps.Ref> = React.createRef();
      const wrapper = renderAttributeEditor({ ...defaultProps, ref, disableAddButton: true });
      ref.current!.focusAddButton();
      expect(wrapper.findAddButton().getElement()).toHaveFocus();
    });

    test('has no aria-describedby if there is no additional info', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps });
      const buttonElement = wrapper.findAddButton().getElement();
      expect(buttonElement).not.toHaveAttribute('aria-describedby');
    });

    test('allows button variant to be changed', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, addButtonVariant: 'inline-link' });
      const buttonElement = wrapper.findAddButton().getElement();
      expect(buttonElement).toHaveClass(buttonStyles['variant-inline-link']);
    });

    test('adds icon for inline-link variant', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, addButtonVariant: 'inline-link' });
      const buttonElement = wrapper.findAddButton().getElement();
      expect(createWrapper(buttonElement).findIcon()).toBeTruthy();
    });
  });

  describe('remove button', () => {
    test('renders `remove` button using `removeButtonText` on all rows', () => {
      const removeButtonText = 'Test remove text';
      const wrapper = renderAttributeEditor({ ...defaultProps, removeButtonText });
      defaultProps.items!.forEach((_, index) => {
        expect(
          wrapper
            .findRow(index + 1)!
            .findRemoveButton()!
            .getElement()
        ).toHaveTextContent(removeButtonText);
      });
    });

    test('renders `ariaLabel` on remove button using `removeButtonAriaLabel` on all rows', () => {
      const removeButtonAriaLabel = (item: Item) => `Remove ${item.key}`;
      const wrapper = renderAttributeEditor({
        ...defaultProps,
        i18nStrings: { ...defaultProps.i18nStrings, removeButtonAriaLabel },
      });
      defaultProps.items!.forEach((item, index) => {
        expect(
          wrapper
            .findRow(index + 1)!
            .findRemoveButton()!
            .getElement()
        ).toHaveAccessibleName(`Remove ${item.key}`);
      });
    });

    test('uses `removeButtonAriaLabel` over `i18nStrings.removeButtonAriaLabel`', () => {
      const removeButtonAriaLabel = (item: Item) => `Remove ${item.key}`;
      const wrapper = renderAttributeEditor({
        ...defaultProps,
        i18nStrings: { ...defaultProps.i18nStrings, removeButtonAriaLabel: () => `Don't render` },
        removeButtonAriaLabel,
      });
      defaultProps.items!.forEach((item, index) => {
        expect(
          wrapper
            .findRow(index + 1)!
            .findRemoveButton()!
            .getElement()
        ).toHaveAccessibleName(`Remove ${item.key}`);
      });
    });

    test('conditionally renders `remove` button depending on isItemRemovable return value', () => {
      const isItemRemovable = (item: Item) => item.key !== 'k1';
      const wrapper = renderAttributeEditor({ ...defaultProps, isItemRemovable });
      expect(wrapper.findRow(1)!.findRemoveButton()).toEqual(null);
      expect(wrapper.findRow(2)!.findRemoveButton()).not.toEqual(null);
      expect(wrapper.findRow(3)!.findRemoveButton()).not.toEqual(null);
    });

    test('triggers `onRemoveButtonClick` event when clicked', () => {
      const onRemoveButtonClick = jest.fn();
      const wrapper = renderAttributeEditor({ ...defaultProps, onRemoveButtonClick });

      wrapper.findRow(1)!.findRemoveButton()!.click();

      expect(onRemoveButtonClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { itemIndex: 0 } }));
    });

    test('renders itemRemovedAriaLive on remove button click', async () => {
      const { container } = render(<TestComponent />);
      const wrapper = createWrapper(container).findAttributeEditor()!;

      wrapper.findRow(1)!.findRemoveButton()!.click();
      await waitFor(() =>
        expect(wrapper.find(`[data-testid="removal-announcement"]`)?.getElement()).toHaveTextContent(
          'An item was removed.'
        )
      );
    });
  });

  describe.each(['control', 'errorText', 'warningText', 'constraintText'] as const)(`%s`, renderableFn => {
    const renderableFns: Record<string, jest.Mock> = {};

    beforeEach(() => {
      const definition = defaultProps.definition.map(definition => ({ ...definition }));
      ['key', 'value', 'additional'].forEach((type, i) => {
        renderableFns[type] = jest.fn();
        definition[i][renderableFn] = renderableFns[type];
      });

      renderAttributeEditor({ ...defaultProps, definition });
    });

    test(`passes 'item' and 'index' to ${renderableFn} function`, () => {
      Object.keys(renderableFns).forEach(key => {
        expect(renderableFns[key]).toHaveBeenCalledWith(expect.any(Object), expect.any(Number));
      });
    });
  });

  describe('additional info', () => {
    test('renders correctly', () => {
      const wrapper = renderAttributeEditor({ additionalInfo: 'test' });
      expect(wrapper.findAdditionalInfo()!.getElement()).toHaveTextContent('test');
    });

    test('is connected to add button with aria-describedby', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, additionalInfo: 'Test Info' });
      const buttonElement = wrapper.findAddButton().getElement();
      const info = wrapper.findAdditionalInfo()?.getElement();
      expect(buttonElement).toHaveAttribute('aria-describedby', info?.id);
    });

    test('has an ARIA live region', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, additionalInfo: 'Test Info' });
      expect(
        wrapper.find(`.${liveRegionStyles.root}[data-testid="info-live-region"]`)?.getElement()
      ).toBeInTheDocument();
    });
  });

  describe('label', () => {
    test('renders correctly', () => {
      const wrapper = renderAttributeEditor();
      expect(wrapper.findRow(1)!.findField(1)!.findLabel()!.getElement()).toHaveTextContent('Key label');
    });
  });

  describe('info', () => {
    test('renders correctly', () => {
      const wrapper = renderAttributeEditor();
      expect(wrapper.findRow(1)!.findField(1)!.findInfo()!.getElement()).toHaveTextContent('Key info');
    });
  });

  describe('empty state', () => {
    test('is displayed when no items are passed in', () => {
      const wrapper = renderAttributeEditor({ ...defaultProps, items: [] });
      expect(wrapper.findEmptySlot()).not.toEqual(null);
    });
  });

  describe('errors', () => {
    const errorFns: Record<string, jest.Mock> = {};

    beforeEach(() => {
      const definition = defaultProps.definition.map(definition => ({ ...definition }));
      ['key', 'value', 'additional'].forEach((type, i) => {
        errorFns[type] = jest.fn();
        definition[i].errorText = errorFns[type];
      });

      renderAttributeEditor({ ...defaultProps, definition });
    });

    test('should call the definition `errorText` method for each row item', () => {
      Object.keys(errorFns).forEach(key => {
        expect(errorFns[key]).toHaveBeenCalledWith(expect.any(Object), expect.any(Number));
      });
    });

    describe('displaying errors', () => {
      let wrapper: AttributeEditorWrapper;

      beforeEach(() => {
        const definition = defaultProps.definition.map(definition => ({ ...definition }));
        definition[0].errorText = (_item, index) => `Error with key ${index}`;
        wrapper = renderAttributeEditor({ ...defaultProps, definition });
      });

      test('should display the returned values as error messages', () => {
        expect(wrapper.findRow(1)!.findFields()[0].find('[role="img"]')!.getElement()).toHaveAttribute(
          'aria-label',
          'Error'
        );
        expectRowErrorTextContent(wrapper, 0, ['Error with key 0']);
        expectRowErrorTextContent(wrapper, 1, ['Error with key 1']);
      });

      test('should not display errors for items where no error value is returned', () => {
        const expectErrorFieldNotToExist = (wrapper: AttributeEditorWrapper, rowIndex: number, fieldIndex: number) => {
          const row = wrapper.findRow(rowIndex + 1)!;
          const errorField = row.findFields()[fieldIndex].findError();
          expect(errorField).toBe(null);
        };

        const valueFieldIndex = 1;
        expectErrorFieldNotToExist(wrapper, 0, valueFieldIndex);
        expectErrorFieldNotToExist(wrapper, 1, valueFieldIndex);
      });
    });
  });

  describe('warnings', () => {
    const warningFns: Record<string, jest.Mock> = {};

    beforeEach(() => {
      const definition = defaultProps.definition.map(definition => ({ ...definition }));
      ['key', 'value', 'additional'].forEach((type, i) => {
        warningFns[type] = jest.fn();
        definition[i].warningText = warningFns[type];
      });

      renderAttributeEditor({ ...defaultProps, definition });
    });

    test('should call the definition `warningText` method for each row item', () => {
      Object.keys(warningFns).forEach(key => {
        expect(warningFns[key]).toHaveBeenCalledWith(expect.any(Object), expect.any(Number));
      });
    });

    describe('displaying warnings', () => {
      let wrapper: AttributeEditorWrapper;

      beforeEach(() => {
        const definition = defaultProps.definition.map(definition => ({ ...definition }));
        definition[0].warningText = (_item, index) => `Warning with key ${index}`;
        wrapper = renderAttributeEditor({ ...defaultProps, definition });
      });

      test('should display the returned values as warning messages', () => {
        expect(wrapper.findRow(1)!.findFields()[0].find('[role="img"]')!.getElement()).toHaveAttribute(
          'aria-label',
          'Warning'
        );
        expectRowWarningTextContent(wrapper, 0, ['Warning with key 0']);
        expectRowWarningTextContent(wrapper, 1, ['Warning with key 1']);
      });

      test('should not display warnings for items where no warning value is returned', () => {
        const expectWarningFieldNotToExist = (
          wrapper: AttributeEditorWrapper,
          rowIndex: number,
          fieldIndex: number
        ) => {
          const row = wrapper.findRow(rowIndex + 1)!;
          const warningField = row.findFields()[fieldIndex].findWarning();
          expect(warningField).toBe(null);
        };

        const valueFieldIndex = 1;
        expectWarningFieldNotToExist(wrapper, 0, valueFieldIndex);
        expectWarningFieldNotToExist(wrapper, 1, valueFieldIndex);
      });
    });

    test('should display only errors when values for both error and warning messages are returned', () => {
      const definition = defaultProps.definition.map(definition => ({ ...definition }));
      definition[0].warningText = (_item, index) => `Warning with key ${index}`;
      definition[0].errorText = (_item, index) => `Error with key ${index}`;
      const wrapper: AttributeEditorWrapper = renderAttributeEditor({ ...defaultProps, definition });

      expect(wrapper.findRow(1)!.findFields()[0].find('[role="img"]')!.getElement()).toHaveAttribute(
        'aria-label',
        'Error'
      );
      expectRowErrorTextContent(wrapper, 0, ['Error with key 0']);
      expect(wrapper.findRow(1)!.findFields()[0].findWarning()).toBe(null);
    });

    test('should warn if no layout supplied for >6 attributes', () => {
      render(<AttributeEditor {...defaultProps} definition={new Array(7)} />);
      expect(console.warn).toHaveBeenCalledWith(
        'AttributeEditor',
        '`gridLayout` is required for more than 6 attributes. Cannot render.'
      );
    });
    test('should warn if no grid layout found for current breakpoint', () => {
      containerQueryBreakpoint = 'm';
      render(<AttributeEditor {...defaultProps} gridLayout={[{ breakpoint: 'xl', rows: [] }]} />);
      expect(console.warn).toHaveBeenCalledWith(
        'AttributeEditor',
        'No `gridLayout` entry found for breakpoint m. Cannot render.'
      );
    });
    test('should warn if grid layout does not match definition', () => {
      render(<AttributeEditor {...defaultProps} gridLayout={[{ rows: [[1]] }]} />);
      expect(console.warn).toHaveBeenCalledWith(
        'AttributeEditor',
        'Incorrect number of columns in layout (1) for definition (3). Cannot render.'
      );
    });
  });

  describe('form submission', () => {
    test('should not submit form when pressing Enter on Remove', () => {
      const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
        // JSDOM doesn't support form submissions, so we need to call preventDefault.
        e.preventDefault();
        // jest.fn accesses the event multiple times to print invocation logs on failure.
        e.persist();
      });
      const { container } = render(
        <form onSubmit={onSubmit}>
          <AttributeEditor {...defaultProps} />
        </form>
      );
      const wrapper = createWrapper(container).findAttributeEditor()!;

      wrapper.findRow(1)!.findRemoveButton()!.click();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('ref', () => {
    let ref: AttributeEditorProps.Ref, wrapper: AttributeEditorWrapper;
    beforeEach(() => {
      wrapper = renderAttributeEditor({
        ...defaultProps,
        ref: newRef => {
          if (newRef !== null) {
            ref = newRef;
          }
        },
      });
    });

    it('focuses on the correct remove button when focusRemoveButton is called', () => {
      ref.focusRemoveButton(1);
      expect(wrapper.findRow(2)!.findRemoveButton()!.getElement()).toHaveFocus();
    });

    it('focuses on the correct remove button after re-ordering', () => {
      // This test exists because managing refs inside memo'ed components is tricky.
      wrapper.findRow(1)!.findRemoveButton()!.click();
      ref.focusRemoveButton(1);
      expect(wrapper.findRow(2)!.findRemoveButton()!.getElement()).toHaveFocus();
    });

    it('does not focus anything if index is out of range', () => {
      ref.focusRemoveButton(3);
      for (const row of [1, 2, 3]) {
        expect(wrapper.findRow(row)!.findRemoveButton()!.getElement()).not.toHaveFocus();
      }
    });

    it('can focus add button', () => {
      ref.focusAddButton();
      expect(wrapper.findAddButton().getElement()).toHaveFocus();
    });
  });

  describe('a11y', () => {
    test('row has role group and aria-labelledby referring to first control label and content', () => {
      const wrapper = renderAttributeEditor({
        ...defaultProps,
        definition: [
          {
            label: 'Key label',
            info: 'Key info',
            control: item => <Input value={item.key} />,
          },
          {
            label: 'Value label',
            info: 'Value info',
            control: item => <Input value={item.value} />,
          },
        ],
      });
      const [labelId, inputId] = wrapper.findRow(1)!.getElement().getAttribute('aria-labelledby')!.split(' ');
      const label =
        wrapper.getElement().querySelector(`#${labelId}`)!.textContent +
        ' ' +
        wrapper.getElement().querySelector(`#${inputId}`)!.getAttribute('value');
      expect(label).toBe('Key label k1');
    });
  });

  describe('i18n', () => {
    test('supports providing removeButton text from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider messages={{ 'attribute-editor': { removeButtonText: 'Custom remove' } }}>
          <AttributeEditor {...defaultProps} removeButtonText={undefined} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findAttributeEditor()!;
      expect(wrapper.findRow(1)!.findRemoveButton()!.getElement()).toHaveTextContent('Custom remove');
    });
  });

  describe('custom buttons', () => {
    test('allows a custom row action', () => {
      const { container } = render(
        <AttributeEditor {...defaultProps} customRowActions={() => <ButtonDropdown items={[]} />} />
      );
      const wrapper = createWrapper(container).findAttributeEditor()!;
      expect(wrapper.findRow(1)!.findCustomAction()!.findButtonDropdown()).toBeTruthy();
    });
    test('passes expected arguments to custom row action', () => {
      const actionRenderer = jest.fn();
      render(<AttributeEditor {...defaultProps} customRowActions={actionRenderer} />);
      expect(actionRenderer).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          item: defaultProps.items![0],
          itemIndex: 0,
          ref: expect.any(Function),
          breakpoint: 'm',
        })
      );
      expect(actionRenderer).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          item: defaultProps.items![1],
          itemIndex: 1,
          ref: expect.any(Function),
          breakpoint: 'm',
        })
      );
      expect(actionRenderer).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          item: defaultProps.items![2],
          itemIndex: 2,
          ref: expect.any(Function),
          breakpoint: 'm',
        })
      );
    });
    test('does not render standard button if custom row action defined', () => {
      const { container } = render(
        <AttributeEditor {...defaultProps} customRowActions={() => <ButtonDropdown items={[]} />} />
      );
      const wrapper = createWrapper(container).findAttributeEditor()!;
      expect(wrapper.findRow(1)!.findRemoveButton()).toBeFalsy();
    });
    test('renders standard button if custom row action returns undefined, nothing if null', () => {
      const { container } = render(
        <AttributeEditor
          {...defaultProps}
          customRowActions={({ itemIndex }) =>
            itemIndex === 1 ? undefined : itemIndex === 2 ? null : <ButtonDropdown items={[]} />
          }
        />
      );
      const wrapper = createWrapper(container).findAttributeEditor()!;
      expect(wrapper.findRow(1)!.findCustomAction()!.findButtonDropdown()).toBeTruthy();
      expect(wrapper.findRow(2)!.findCustomAction()!.findButtonDropdown()).toBeFalsy();
      expect(wrapper.findRow(3)!.findCustomAction()!.findButtonDropdown()).toBeFalsy();

      expect(wrapper.findRow(1)!.findRemoveButton()).toBeFalsy();
      expect(wrapper.findRow(2)!.findRemoveButton()).toBeTruthy();
      expect(wrapper.findRow(3)!.findRemoveButton()).toBeFalsy();
    });
  });

  describe('responsiveness', () => {
    test('should pass resolved breakpoints from the gridLayout to useContainerQuery - 1', () => {
      render(<AttributeEditor {...defaultProps} gridLayout={[{ breakpoint: 'default', rows: [] }]} />);
      expect(useContainerQuery).toHaveBeenCalledWith(expect.any(Function), ['default']);
    });
    test('should pass resolved breakpoints from the gridLayout to useContainerQuery - 2', () => {
      render(
        <AttributeEditor
          {...defaultProps}
          gridLayout={[
            { breakpoint: 'default', rows: [] },
            { breakpoint: 'xl', rows: [] },
            { breakpoint: 's', rows: [] },
          ]}
        />
      );
      expect(useContainerQuery).toHaveBeenCalledWith(expect.any(Function), ['default,xl,s']);
    });
  });
});
