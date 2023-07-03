// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Box from '../../../lib/components/box';
import Select from '../../../lib/components/select';

import createWrapper from '../../../lib/components/test-utils/dom';

import { useClickAway } from '../body-cell/click-away';

const onHookClickAway = jest.fn() as () => void;

const TestHookComponent = ({ children }: { children: React.ReactNode }) => {
  const clickAwayRef = useClickAway(onHookClickAway);
  return (
    <Box variant="div">
      <div data-testid="outside">outside text</div>
      <div ref={clickAwayRef} data-testid="inside">
        some text
        {children}
      </div>
    </Box>
  );
};

function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = createWrapper(container).findBox()!;
  return { wrapper, rerender, getByTestId, queryByTestId };
}

describe('Hook Version', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call the callback when clicking outside the element', () => {
    const { getByTestId } = renderComponent(
      <TestHookComponent>
        <div data-testid="inside-inside">nested calls</div>
      </TestHookComponent>
    );
    fireEvent.click(getByTestId('outside'));
    expect(onHookClickAway).toHaveBeenCalled();
  });

  test('should not call the callback when clicking inside the element', () => {
    const { getByTestId } = renderComponent(
      <TestHookComponent>
        <div data-testid="inside-inside">nested calls</div>
      </TestHookComponent>
    );
    fireEvent.click(getByTestId('inside'));
    expect(onHookClickAway).not.toHaveBeenCalled();
  });

  test('should not call the callback when clicking inside the nested element', () => {
    const { getByTestId } = renderComponent(
      <TestHookComponent>
        <div data-testid="inside-inside">nested calls</div>
      </TestHookComponent>
    );
    fireEvent.click(getByTestId('inside-inside'));
    expect(onHookClickAway).not.toHaveBeenCalled();
  });

  test('should not call the callback when clicking inside the nested element portal', () => {
    renderComponent(
      <TestHookComponent>
        <Select selectedOption={null} options={[{ value: '1' }, { value: '2' }]} expandToViewport={true} />
      </TestHookComponent>
    );
    createWrapper().findSelect()!.openDropdown();
    createWrapper().findSelect()!.findDropdown({ expandToViewport: true }).findOption(1)!.click();
    expect(onHookClickAway).not.toHaveBeenCalled();
  });
});
