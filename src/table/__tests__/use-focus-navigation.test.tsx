// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';

import useTableFocusNavigation from '../use-table-focus-navigation';
import { renderHook } from '../../__tests__/render-hook';

const focusFn = jest.fn();
const rootRemoveEventListener = jest.fn();

function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = createWrapper(container).find('table')!;
  return { wrapper, rerender, getByTestId, queryByTestId };
}

const TestComponent = () => {
  const tableRef = React.useRef<HTMLTableElement>(null);

  const [enableFocusNavigation, setEnableFocusNavigation] = React.useState(true);

  const editConfig = { __mock: true };

  useTableFocusNavigation(
    enableFocusNavigation,
    tableRef,
    [{ editConfig }, { editConfig: undefined }, { editConfig }] as any,
    3
  );

  const focusHandler = (evt: React.FocusEvent) => {
    focusFn(evt.target.innerHTML);
  };

  const tdProps = {
    'data-inline-editing-active': 'false',
    onFocus: focusHandler,
    onClick(evt: any) {
      evt.target?.focus();
    },
  };

  const handleKeyup = (evt: React.KeyboardEvent) => {
    if (evt.key === 'BIGUP') {
      jest.spyOn(tableRef.current!, 'removeEventListener').mockImplementation(rootRemoveEventListener as any);
      setEnableFocusNavigation(false);
    }
  };

  return (
    <table data-testid="table-root" onKeyUp={handleKeyup} ref={tableRef}>
      <tbody>
        <tr>
          <td {...tdProps}>
            <button data-testid="0,0">0,0</button>
          </td>
          <td {...tdProps}>
            <button data-testid="0,1">0,1</button>
          </td>
          <td {...tdProps}>
            <button data-testid="0,2">0,2</button>
          </td>
        </tr>
        <tr>
          <td {...tdProps}>
            <button data-testid="1,0">1,0</button>
          </td>
          <td {...tdProps}>
            <button data-testid="1,1">1,1</button>
          </td>
          <td {...tdProps}>
            <button data-testid="1,2">1,2</button>
          </td>
        </tr>
        <tr>
          <td {...tdProps}>
            <button data-testid="2,0">2,0</button>
          </td>
          <td {...tdProps}>
            <button data-testid="2,1">2,1</button>
          </td>
          <td {...tdProps}>
            <button data-testid="2,2">2,2</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

describe('useTableFocusNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should skip over non-editable cells', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    fireEvent.click(getByTestId('0,0'));
    expect(focusFn).toHaveBeenCalledWith('0,0');
    fireEvent.keyDown(getByTestId('0,0'), { key: 'ArrowRight' });
    expect(focusFn).not.toHaveBeenCalledWith('0,1');
    expect(focusFn).toHaveBeenCalledWith('0,2');
  });

  it('should skip over non-editable cells when navigating backwards', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    fireEvent.click(getByTestId('0,2'));
    expect(focusFn).toHaveBeenCalledWith('0,2');
    fireEvent.keyDown(getByTestId('0,2'), { key: 'ArrowLeft' });
    expect(focusFn).not.toHaveBeenCalledWith('0,1');
    expect(focusFn).toHaveBeenCalledWith('0,0');
  });

  it('should navigate focus vertically', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    fireEvent.click(getByTestId('0,0'));
    expect(focusFn).toHaveBeenCalledWith('0,0');
    fireEvent.keyDown(getByTestId('0,0'), { key: 'ArrowDown' });
    expect(focusFn).toHaveBeenCalledWith('1,0');
    fireEvent.keyDown(getByTestId('1,0'), { key: 'ArrowUp' });
    expect(focusFn).toHaveBeenCalledWith('0,0');
  });

  it('should navigate focus horizontally', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    fireEvent.click(getByTestId('0,0'));
    expect(focusFn).toHaveBeenCalledWith('0,0');
    fireEvent.keyDown(getByTestId('0,0'), { key: 'ArrowRight' });
    expect(focusFn).toHaveBeenCalledWith('0,2');
    fireEvent.keyDown(getByTestId('0,2'), { key: 'ArrowLeft' });
    expect(focusFn).toHaveBeenCalledWith('0,0');
  });

  it('should not navigate focus while editing a cell', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    fireEvent.keyUp(getByTestId('0,0'), { key: 'UPD' });
    fireEvent.click(getByTestId('0,0'));
    expect(focusFn).toHaveBeenCalledWith('0,0');
    getByTestId('0,0').parentElement!.setAttribute('data-inline-editing-active', 'true');
    fireEvent.keyDown(getByTestId('0,0'), { key: 'ArrowRight' });
    expect(focusFn).not.toHaveBeenCalledWith('0,1');
  });

  it('should remove event listener when focus navigation is disabled', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    fireEvent.click(getByTestId('0,0'));
    fireEvent.keyUp(getByTestId('0,0'), { key: 'BIGUP' });
    expect(rootRemoveEventListener).toHaveBeenCalled();
  });

  it('should not navigate focus when focus navigation is disabled', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    fireEvent.keyUp(getByTestId('0,0'), { key: 'BIGUP' });
    fireEvent.click(getByTestId('0,0'));
    fireEvent.keyDown(getByTestId('0,0'), { key: 'ArrowRight' });
    expect(focusFn).not.toHaveBeenCalledWith('0,1');
  });

  describe('eventListeners', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    const addEventListenerRoot = jest.fn();
    let table = document.createElement('table');

    beforeEach(() => {
      jest.clearAllMocks();
      table = document.createElement('table');
      for (let i = 0; i < 3; i++) {
        const row = table.insertRow();
        for (let j = 0; j < 3; j++) {
          const cell = row.insertCell();
          const button = document.createElement('button');
          cell.appendChild(button);
          Object.defineProperty(cell, 'addEventListener', { value: addEventListener });
          Object.defineProperty(cell, 'removeEventListener', { value: removeEventListener });
        }
      }
      jest.spyOn(table, 'addEventListener').mockImplementation(addEventListenerRoot);
    });
    it('should attach event listener for focus navigation when focus navigation is enabled', () => {
      renderHook(() =>
        useTableFocusNavigation(
          true,
          { current: table },
          [{ editConfig: {} }, { editConfig: {} }, { editConfig: {} }],
          3
        )
      );

      expect(addEventListenerRoot).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalledWith('focusin', expect.any(Function), { passive: true });
    });

    it('should detach event listener for focus navigation when focus navigation is disabled', () => {
      const { rerender } = renderHook(
        ({ enabled }) =>
          useTableFocusNavigation(
            enabled,
            { current: table },
            [{ editConfig: {} }, { editConfig: {} }, { editConfig: {} }],
            3
          ),
        { initialProps: { enabled: true } }
      );
      expect(removeEventListener).not.toHaveBeenCalled();
      rerender({ enabled: false });
      waitFor(() => expect(removeEventListener).toHaveBeenCalled());
    });

    it('should not attach event listener for focus navigation when focus navigation is disabled', () => {
      renderHook(() =>
        useTableFocusNavigation(
          false,
          { current: table },
          [{ editConfig: {} }, { editConfig: {} }, { editConfig: {} }],
          3
        )
      );
      expect(addEventListenerRoot).not.toHaveBeenCalled();
      expect(addEventListener).not.toHaveBeenCalled();
    });
    it('satisfies istanbul coverage', () => {
      renderHook(() =>
        useTableFocusNavigation(
          true,
          { current: null },
          [{ editConfig: {} }, { editConfig: {} }, { editConfig: {} }],
          3
        )
      );
      expect(removeEventListener).not.toHaveBeenCalled();
      expect(addEventListenerRoot).not.toHaveBeenCalled();
    });
  });
});
