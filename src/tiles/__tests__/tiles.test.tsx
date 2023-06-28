// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';
import createWrapper, { ElementWrapper, TilesWrapper } from '../../../lib/components/test-utils/dom';
import TileWrapper from '../../../lib/components/test-utils/dom/tiles/tile';
import Tiles, { TilesProps } from '../../../lib/components/tiles';
import styles from '../../../lib/components/tiles/styles.css.js';

class TilesInternalWrapper extends TilesWrapper {
  findColumns(): ElementWrapper {
    return this.findByClassName(styles.columns)!;
  }
}

const defaultItems: TilesProps.TilesDefinition[] = [
  { value: 'val1', label: 'Option one', image: 'Imagine img tag here' },
  { value: 'val2', label: 'Option two' },
];

function renderTiles(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return { rerender, wrapper: createWrapper(container.parentElement!).findTiles()! };
}

test('hides the decorative icon from assistive technology', function () {
  const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} />);
  const svgs = wrapper.findAll('svg');
  expect(svgs).toHaveLength(2);
  for (const svg of svgs) {
    expect(svg.getElement()).toHaveAttribute('focusable', 'false');
    expect(svg.getElement()).toHaveAttribute('aria-hidden', 'true');
  }
});

test('renders attributes for assistive technology when set', function () {
  const ariaLabelledby = 'something';
  const ariaDescribedby = 'something else';
  const ariaLabel = 'the last one';
  const ariaControls = 'aria controls';

  const { wrapper } = renderTiles(
    <Tiles
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      ariaControls={ariaControls}
      value={null}
      items={defaultItems}
    />
  );
  const rootElement = wrapper.getElement();
  expect(rootElement).toHaveAttribute('aria-labelledby', ariaLabelledby);
  expect(rootElement).toHaveAttribute('aria-describedby', ariaDescribedby);
  expect(rootElement).toHaveAttribute('aria-label', ariaLabel);
  expect(rootElement).toHaveAttribute('aria-controls', ariaControls);
});

test('does not render attributes for assistive technology when not set', function () {
  const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} />);
  const rootElement = wrapper.getElement();
  expect(rootElement).not.toHaveAttribute('aria-labelledby');
  expect(rootElement).not.toHaveAttribute('aria-describedby');
  expect(rootElement).not.toHaveAttribute('aria-label');
});

describe('ref', () => {
  test('when unselected, focuses the first tile when .focus() is called', () => {
    let tilesRef: TilesProps.Ref | null = null;
    const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} ref={ref => (tilesRef = ref)} />);
    tilesRef!.focus();
    expect(wrapper.findInputByValue('val1')!.getElement()).toHaveFocus();
  });

  test('when selected, focuses the checked tile', () => {
    let tilesRef: TilesProps.Ref | null = null;
    const { wrapper } = renderTiles(<Tiles value="val2" items={defaultItems} ref={ref => (tilesRef = ref)} />);
    tilesRef!.focus();
    expect(wrapper.findInputByValue('val2')!.getElement()).toHaveFocus();
  });
});

describe('items', () => {
  test('renders items', () => {
    const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} />);
    expect(wrapper.findItems()).toHaveLength(2);
  });

  test('can be disabled', () => {
    const onChange = jest.fn();
    const { wrapper, rerender } = renderTiles(
      <Tiles value={null} items={[defaultItems[0], { ...defaultItems[1], disabled: true }]} onChange={onChange} />
    );
    const items = wrapper.findItems();
    expect(items[0].findNativeInput().getElement()).toBeEnabled();
    expect(items[1].findNativeInput().getElement()).toBeDisabled();

    rerender(<Tiles value={null} items={defaultItems} onChange={onChange} />);
    expect(items[0].findNativeInput().getElement()).toBeEnabled();
    expect(items[1].findNativeInput().getElement()).toBeEnabled();
  });

  test('does not trigger change handler if disabled', () => {
    const onChange = jest.fn();
    const { wrapper } = renderTiles(
      <Tiles value={null} items={[defaultItems[0], { ...defaultItems[1], disabled: true }]} onChange={onChange} />
    );

    act(() => wrapper.findItems()[1].findLabel().click());
    expect(onChange).not.toHaveBeenCalled();
  });

  test('displays the proper label', () => {
    const { wrapper } = renderTiles(<Tiles value={null} items={[{ value: '1', label: 'Please select' }]} />);
    expect(wrapper.findItems()[0].findLabel().getElement()).toHaveTextContent('Please select');
  });

  test('displays no label text when label is empty', () => {
    const { wrapper } = renderTiles(<Tiles value={null} items={[{ value: '1', label: '' }]} />);
    expect(wrapper.findItems()[0].findLabel().getElement()).toHaveTextContent('');
  });

  test('displays the description', () => {
    const { wrapper } = renderTiles(
      <Tiles value={null} items={[{ value: '1', label: 'Please select', description: 'Tile description test' }]} />
    );
    expect(wrapper.findItemByValue('1')!.findDescription()!.getElement()).toHaveTextContent('Tile description test');
  });

  test('does not display description when it is not defined', () => {
    const { wrapper } = renderTiles(<Tiles value={null} items={[{ value: '1', label: 'Please select' }]} />);
    expect(wrapper.findItems()[0].findDescription()).toBeNull();
  });

  it('renders the image region for items', function () {
    const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} />);
    expect(wrapper.findItemByValue('val1')!.findImage()).not.toBe(null);
  });
});

describe('name', () => {
  test('propagates its name onto the child tiles', () => {
    const { wrapper } = renderTiles(<Tiles name="test" value="val1" items={defaultItems} />);
    expect(wrapper.findInputByValue('val1')!.getElement().name).toMatch('test');
    expect(wrapper.findInputByValue('val2')!.getElement().name).toMatch('test');
  });

  test('generates a random name', () => {
    const { wrapper } = renderTiles(<Tiles value="val1" items={defaultItems} />);
    expect(wrapper.findInputByValue('val1')!.getElement().name).toMatch(/awsui-tiles-\d+/);
    expect(wrapper.findInputByValue('val2')!.getElement().name).toMatch(/awsui-tiles-\d+/);
  });
});

describe('correct number of columns', () => {
  const expected: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 3,
    6: 3,
    7: 3,
    8: 2,
    9: 3,
    10: 3,
  };
  let items = [{ value: '_', label: '_' }];
  for (let nItems = 1; nItems <= 10; nItems++) {
    it(`can have ${nItems} columns`, () => {
      const dummyItem = { value: `${nItems}`, label: '_' };
      const { wrapper } = renderTiles(<Tiles value={null} items={items} />);
      const internalWrapper = new TilesInternalWrapper(wrapper.getElement());
      expect(internalWrapper.findColumns().getElement()).toHaveClass(styles[`column-${expected[nItems]}`]);
      items = [...items, dummyItem];
    });
  }

  for (let nColumns = 1; nColumns <= 4; nColumns++) {
    it('keeps the number of columns if supplied by the customer', function () {
      const { wrapper } = renderTiles(<Tiles value={null} items={items} columns={nColumns} />);
      const internalWrapper = new TilesInternalWrapper(wrapper.getElement());
      expect(internalWrapper.findColumns().getElement()).toHaveClass(styles[`column-${nColumns}`]);
    });
  }
});

describe('value', () => {
  test('selects the right tile when value changes', () => {
    const { wrapper, rerender } = renderTiles(<Tiles value={null} items={defaultItems} />);
    const input1 = wrapper.findInputByValue('val1')!;
    const input2 = wrapper.findInputByValue('val2')!;
    expect(input1.getElement()).not.toBeChecked();
    expect(input2.getElement()).not.toBeChecked();

    rerender(<Tiles value="val1" items={defaultItems} />);

    expect(input1.getElement()).toBeChecked();
    expect(input2.getElement()).not.toBeChecked();

    rerender(<Tiles value="val2" items={defaultItems} />);
    expect(input1.getElement()).not.toBeChecked();
    expect(input2.getElement()).toBeChecked();
  });

  test('fires change event when a tile is selected', () => {
    const onChange = jest.fn();
    const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} onChange={onChange} />);

    wrapper.findInputByValue('val1')!.click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 'val1' } }));
  });

  test('does not fire a change event when value changed programmatically', () => {
    const onChange = jest.fn();
    const { rerender } = renderTiles(<Tiles value={null} items={defaultItems} onChange={onChange} />);

    rerender(<Tiles value="val2" items={defaultItems} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not update the value without onChange handler (controlled component)', () => {
    const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} />);
    wrapper.findInputByValue('val1')!.click();
    expect(wrapper.findInputByValue('val1')!.getElement()).not.toBeChecked();
  });

  test('updates value via onChange handler (controlled component)', () => {
    function ComponentWrapper() {
      const [value, setValue] = useState('');
      return <Tiles value={value} items={defaultItems} onChange={event => setValue(event.detail.value)} />;
    }
    const { wrapper } = renderTiles(<ComponentWrapper />);
    wrapper.findInputByValue('val1')!.click();
    expect(wrapper.findInputByValue('val1')!.getElement()).toBeChecked();
  });

  test('deselects all tiles when reset to an empty value', () => {
    const { wrapper, rerender } = renderTiles(<Tiles value="val1" items={defaultItems} />);
    const input1 = wrapper.findInputByValue('val1')!;
    const input2 = wrapper.findInputByValue('val2')!;

    expect(input1.getElement()).toBeChecked();

    rerender(<Tiles value={null} items={defaultItems} />);
    expect(input1.getElement()).not.toBeChecked();
    expect(input2.getElement()).not.toBeChecked();
  });

  test('Keeps selected item when rerendering', () => {
    const { wrapper, rerender } = renderTiles(<Tiles value="val2" items={defaultItems} />);

    expect(wrapper.findInputByValue('val2')!.getElement()).toBeChecked();

    rerender(<Tiles value="val2" items={[defaultItems[0], { ...defaultItems[1], label: 'New label...' }]} />);

    expect(wrapper.findItems()[1].findLabel().getElement()).toHaveTextContent('New label...');
    expect(wrapper.findInputByValue('val2')!.getElement()).toBeChecked();
  });

  describe('tile controlId', () => {
    function check(tile: TileWrapper, controlId: string) {
      expect(tile.findNativeInput().getElement()).toHaveAttribute('id', controlId);
      expect(tile.findNativeInput().getElement()).toHaveAttribute('aria-labelledby', `${controlId}-label`);
    }

    test('uses controlId for setting up label relations when set', () => {
      const { wrapper } = renderTiles(
        <Tiles
          value="val2"
          items={[
            { value: 'val1', label: 'Option one', controlId: 'control-id-1' },
            { value: 'val2', label: 'Option two', controlId: 'control-id-2' },
          ]}
        />
      );

      check(wrapper.findItems()[0], 'control-id-1');
      check(wrapper.findItems()[1], 'control-id-2');
    });

    test('generates a own unique ids for setting up label relations when controlId is not set', () => {
      const { wrapper } = renderTiles(<Tiles value="val2" items={defaultItems} />);

      const button1 = wrapper.findItems()[0];
      const id1 = button1.findNativeInput().getElement().id;

      const button2 = wrapper.findItems()[1];
      const id2 = button2.findNativeInput().getElement().id;

      check(button1, id1);
      check(button2, id2);
      expect(id1).not.toBe(id2);
    });

    test('generates a own unique ids for setting up label relations when controlId is not set', () => {
      const id1 = 'control-id-1';

      const { wrapper } = renderTiles(
        <Tiles
          value="val2"
          items={[
            { value: 'val1', label: 'Option one', controlId: id1 },
            { value: 'val2', label: 'Option two' },
          ]}
        />
      );

      const button2 = wrapper.findItems()[1];
      const id2 = button2.findNativeInput().getElement().id;

      check(wrapper.findItems()[0], id1);
      check(button2, id2);
      expect(id1).not.toBe(id2);
    });
  });

  describe('aria-required', () => {
    test(`is set for value=true`, () => {
      const { wrapper } = renderTiles(<Tiles ariaRequired={true} value={null} items={defaultItems} />);
      expect(wrapper.getElement()).toHaveAttribute('aria-required', 'true');
    });

    test(`is not set for value=true`, () => {
      const { wrapper } = renderTiles(<Tiles ariaRequired={false} value={null} items={defaultItems} />);
      expect(wrapper.getElement()).toHaveAttribute('aria-required', 'false');
    });

    test(`is not set for undefined value`, () => {
      const { wrapper } = renderTiles(<Tiles value={null} items={defaultItems} />);
      expect(wrapper.getElement()).not.toHaveAttribute('aria-required');
    });
  });
});
