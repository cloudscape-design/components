// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import { InlineEditor } from '../../../lib/components/table/body-cell/inline-editor';
import createWrapper from '../../../lib/components/test-utils/dom';
import { TableProps } from '../interfaces';

const handleSubmitEdit = jest.fn();
const handleEditEnd = jest.fn();

let thereBeErrors = false;

function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId, getByRole } = render(jsx);
  const wrapper = createWrapper(container).find('[data-testid="inline-editor"]')!;
  return { wrapper, rerender, getByTestId, queryByTestId, getByRole };
}

const TestComponent = ({
  disableNativeForm,
  submitValueRef,
}: {
  disableNativeForm?: boolean;
  submitValueRef?: React.MutableRefObject<TableProps.CellContext<any>['submitValue'] | null>;
}) => {
  const column = {
    id: 'test',
    header: 'test',
    editConfig: {
      disableNativeForm,
      ariaLabel: 'test-input',
      errorIconAriaLabel: 'error-icon',
      constraintText: 'Requirement',
      validation: () => (thereBeErrors ? 'there be errors' : undefined),
      editingCell: (item: any, { currentValue, setValue, submitValue }: TableProps.CellContext<string>) => {
        if (submitValueRef) {
          submitValueRef.current = submitValue;
        }
        return <input value={currentValue ?? item.test} onChange={event => setValue(event.target.value)} />;
      },
    },
    cell: (item: any) => <span>{item.test}</span>,
  };

  return (
    <div data-testid="inline-editor">
      <InlineEditor
        ariaLabels={{
          activateEditLabel: () => 'edit cell',
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

  it('should render as a dialog', () => {
    const { getByRole } = renderComponent(<TestComponent />);
    expect(getByRole('dialog')).toHaveAttribute('aria-label', 'edit cell');
  });

  it('should show error', () => {
    thereBeErrors = true;
    const { wrapper } = renderComponent(<TestComponent />);
    const input = wrapper.find('input')!.getElement();
    fireEvent.click(input);
    act(() => {
      fireEvent.change(input, { bubbles: true, target: { value: 'new value' } });
    });
    expect(wrapper.find('[aria-label="error-icon"]')?.getElement()).toBeInTheDocument();
  });

  it.each([false, true])(
    'should submit edit when submit button is pressed (disableNativeForm=%s)',
    async disableNativeForm => {
      thereBeErrors = false;
      const { wrapper } = renderComponent(<TestComponent disableNativeForm={disableNativeForm} />);
      const input = wrapper.find('input')!.getElement();

      fireEvent.click(input);

      act(() => {
        fireEvent.change(input, { bubbles: true, target: { value: 'new value' } });
      });
      expect(wrapper.find('[aria-label="error-icon"]')?.getElement()).toBeUndefined();

      fireEvent.click(wrapper.getElement().querySelector('[aria-label="save edit"]')!);
      await waitFor(() => {
        expect(handleSubmitEdit).toHaveBeenCalled();
        expect(handleSubmitEdit.mock.lastCall!.length).toBe(3);
        expect(handleEditEnd).toHaveBeenCalled();
      });
    }
  );

  it('should submit edit when submitValue is called', async () => {
    thereBeErrors = false;
    const submitValueRef = React.createRef<TableProps.CellContext<string>['submitValue'] | null>();
    const { wrapper } = renderComponent(<TestComponent submitValueRef={submitValueRef} />);
    const input = wrapper.find('input')!.getElement();

    fireEvent.click(input);

    act(() => {
      fireEvent.change(input, { bubbles: true, target: { value: 'new value' } });
    });
    expect(wrapper.find('[aria-label="error-icon"]')?.getElement()).toBeUndefined();

    act(() => {
      submitValueRef.current!();
    });
    await waitFor(() => {
      expect(handleSubmitEdit).toHaveBeenCalled();
      expect(handleSubmitEdit.mock.lastCall!.length).toBe(3);
      expect(handleEditEnd).toHaveBeenCalled();
    });
  });

  it('should not render a form element if disableNativeForm is set', () => {
    const { wrapper } = renderComponent(<TestComponent disableNativeForm={true} />);
    expect(wrapper.find('form')).toBe(null);
  });

  it('should not render a submit button if disableNativeForm is set', () => {
    const { wrapper } = renderComponent(<TestComponent disableNativeForm={true} />);
    expect(wrapper.find('button[type=submit]')).toBe(null);
  });

  it('should not submit any wrapping forms', async () => {
    thereBeErrors = false;
    const onSubmitSpy = jest.fn();
    const { wrapper } = renderComponent(
      <form onSubmit={onSubmitSpy}>
        <TestComponent />
      </form>
    );

    const input = wrapper.find('input')!.getElement();
    fireEvent.click(input);

    act(() => {
      fireEvent.change(input, { bubbles: true, target: { value: 'new value' } });
    });
    fireEvent.click(wrapper.getElement().querySelector('[aria-label="save edit"]')!);

    await waitFor(() => {
      expect(handleSubmitEdit).toHaveBeenCalled();
      expect(handleSubmitEdit.mock.lastCall!.length).toBe(3);
    });

    expect(onSubmitSpy).not.toHaveBeenCalled();
  });

  it('should handle failed submission', async () => {
    thereBeErrors = false;
    const { wrapper } = renderComponent(<TestComponent />);
    const input = wrapper.find('input')!.getElement();

    fireEvent.click(input);
    act(() => {
      fireEvent.change(input, { bubbles: true, target: { value: 'new value' } });
    });

    // eslint-disable-next-line require-await
    handleSubmitEdit.mockImplementation(() => Promise.reject(new Error('test error')));

    fireEvent.click(wrapper.getElement().querySelector('[aria-label="save edit"]')!);
    await waitFor(() => {
      expect(handleSubmitEdit).toHaveBeenCalled();
      expect(handleSubmitEdit.mock.lastCall!.length).toBe(3);
      expect(handleEditEnd).not.toHaveBeenCalled();
    });
  });

  it('should cancel edit', () => {
    const { wrapper } = renderComponent(<TestComponent />);
    fireEvent.click(wrapper.find('button:first-child')!.getElement());
    expect(handleEditEnd).toHaveBeenCalled();
    expect(handleSubmitEdit).not.toHaveBeenCalled();
  });

  // useless test but need the coverage
  it('should render spinner while submitting', async () => {
    thereBeErrors = false;
    const { wrapper } = renderComponent(<TestComponent />);
    let resolveSubmit = () => {};
    handleSubmitEdit.mockImplementationOnce(() => {
      return new Promise<void>(resolve => {
        resolveSubmit = resolve;
      });
    });

    const input = wrapper.find('input')!.getElement();
    fireEvent.click(input);
    act(() => {
      fireEvent.change(input, { bubbles: true, target: { value: 'new value' } });
    });

    const button = wrapper.findButton('[aria-label="save edit"]')!;
    fireEvent.click(button.getElement());
    await waitFor(() => {
      expect(button.findLoadingIndicator()).not.toBeNull();
      expect(button.getElement()).toHaveAttribute('aria-disabled');
    });
    resolveSubmit();
    await waitFor(() => {
      expect(button.findLoadingIndicator()).toBeNull();
      expect(button.getElement()).not.toHaveAttribute('aria-disabled');
    });
  });

  it('should show constraint text', () => {
    const { wrapper } = renderComponent(<TestComponent />);

    expect(wrapper.findFormField()?.findConstraint()?.getElement()).toHaveTextContent('Requirement');
  });
});
