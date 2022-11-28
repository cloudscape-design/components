// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { TableProps } from '../interfaces';

import createWrapper from '../../../lib/components/test-utils/dom';

import { InlineEditor } from '../../../lib/components/table/body-cell/inline-editor';

const handleSubmitEdit = jest.fn(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
});
const handleEditEnd = jest.fn();

let thereBeErrors = false;

function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = createWrapper(container).find('[data-testid="inline-editor"]')!;
  return { wrapper, rerender, getByTestId, queryByTestId };
}

const TestComponent = () => {
  const column = {
    id: 'test',
    header: 'test',
    editConfig: {
      ariaLabel: 'test-input',
      errorIconAriaLabel: 'error-icon',
      validation: () => (thereBeErrors ? 'there be errors' : undefined),
    },
    cell: (item: any, { isEditing, currentValue, setValue }: TableProps.CellContext<string>) =>
      isEditing ? (
        <input value={currentValue ?? item.test} onChange={() => setValue('test')} />
      ) : (
        <span>{currentValue ?? item.test}</span>
      ),
  };

  return (
    <div data-testid="inline-editor">
      <InlineEditor
        ariaLabels={{
          submitEditLabel: () => 'save edit',
          cancelEditLabel: () => 'cancel edit',
        }}
        item={{
          test: 'test',
        }}
        column={column}
        onEditEnd={handleEditEnd}
        submitEdit={handleSubmitEdit}
      />
    </div>
  );
};

describe('InlineEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    thereBeErrors = false;
    cleanup();
  });

  it('should render', () => {
    const { getByTestId } = renderComponent(<TestComponent />);
    expect(getByTestId('inline-editor')).toBeInTheDocument();
  });

  it('should show error', () => {
    thereBeErrors = true;
    const changeEvent = new Event('change', { bubbles: true });
    const { wrapper } = renderComponent(<TestComponent />);
    const input = wrapper.find('input')!.getElement();
    fireEvent.click(input);
    fireEvent(input, changeEvent);
    expect(wrapper.find('[aria-label="error-icon"]')?.getElement()).toBeInTheDocument();
  });

  it('should submit edit', () => {
    thereBeErrors = false;
    const changeEvent = new Event('change', { bubbles: true });
    const { wrapper } = renderComponent(<TestComponent />);
    const input = wrapper.find('input')!.getElement();
    fireEvent.click(input);
    fireEvent(input, changeEvent);
    expect(wrapper.find('[aria-label="error-icon"]')?.getElement()).toBeUndefined();
    fireEvent.click(wrapper.getElement().querySelector('[aria-label="save edit"]')!);
    waitFor(() => expect(handleSubmitEdit).toHaveBeenCalled());
    expect(handleEditEnd).toHaveBeenCalled();
  });

  it('should cancel edit', () => {
    const { wrapper } = renderComponent(<TestComponent />);
    fireEvent.click(wrapper.find('button:first-child')!.getElement());
    expect(handleEditEnd).toHaveBeenCalled();
    expect(handleSubmitEdit).not.toHaveBeenCalled();
  });
});
