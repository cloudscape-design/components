// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle } from 'react';
import { act, render } from '@testing-library/react';

import { useControllable } from '../index';

interface Props {
  value: string | undefined;
  defaultValue: string;
  onChange?: () => void;
}

interface Ref {
  setHookValue: (newValue: React.SetStateAction<string | undefined>) => void;
}

const Component = React.forwardRef(({ value, defaultValue, onChange }: Props, ref: React.Ref<Ref>) => {
  const [hookValue, setHookValue] = useControllable(value, onChange, defaultValue, {
    componentName: 'MyComponent',
    controlledProp: 'value',
    changeHandler: 'onChange',
  });

  useImperativeHandle(ref, () => ({
    setHookValue,
  }));

  return <span>{hookValue}</span>;
});

let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

describe('useControllable', () => {
  test('only prints a warning if the property switches from controlled to uncontrolled', () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const onChange = () => void 0;
    const { container, rerender } = render(
      <Component value="a value" defaultValue="the default value" onChange={onChange} />
    );
    expect(console.warn).not.toHaveBeenCalled();

    rerender(<Component value={undefined} defaultValue="the default value" onChange={onChange} />);
    expect(container).toHaveTextContent('');

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "[AwsUi] [MyComponent] A component tried to change controlled 'value' property to be uncontrolled. " +
        'This is not supported. Properties should not switch from controlled to uncontrolled (or vice versa). ' +
        'Decide between using a controlled or uncontrolled mode for the lifetime of the component. ' +
        'More info: https://fb.me/react-controlled-components'
    );
  });

  test('only prints a warning if the property switches from uncontrolled to controlled', () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container, rerender } = render(<Component value={undefined} defaultValue="the default value" />);
    expect(console.warn).not.toHaveBeenCalled();

    rerender(<Component value="a value" defaultValue="the default value" />);
    expect(container).toHaveTextContent('the default value');

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "[AwsUi] [MyComponent] A component tried to change uncontrolled 'value' property to be controlled. " +
        'This is not supported. Properties should not switch from uncontrolled to controlled (or vice versa). ' +
        'Decide between using a controlled or uncontrolled mode for the lifetime of the component. ' +
        'More info: https://fb.me/react-controlled-components'
    );
  });

  test('prints a warning if the onChange handler is missing', () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    render(<Component value="any value" defaultValue="the default value" />);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [MyComponent] You provided a `value` prop without an `onChange` handler. This will render a non-interactive component.'
    );
  });

  test('tracks the defaultValue if and only if the component is uncontrolled and unchanged', () => {
    const ref = React.createRef<Ref>();

    const { container, rerender } = render(<Component value={undefined} defaultValue="the default value" ref={ref} />);
    expect(container).toHaveTextContent('the default value');

    rerender(<Component value={undefined} defaultValue="a different default value" ref={ref} />);
    expect(container).toHaveTextContent('a different default value');

    act(() => ref.current!.setHookValue('a value set inside the component'));
    expect(container).toHaveTextContent('a value set inside the component');

    rerender(<Component value={undefined} defaultValue="another different default value" />);
    expect(container).toHaveTextContent('a value set inside the component');
  });

  test('if property is provided, the component is controlled', () => {
    const ref = React.createRef<Ref>();

    const { container, rerender } = render(<Component value="value one" defaultValue="the default value" ref={ref} />);
    expect(container).toHaveTextContent('value one');

    rerender(<Component value="value two" defaultValue="the default value" ref={ref} />);
    expect(container).toHaveTextContent('value two');

    act(() => ref.current!.setHookValue('a value set from inside the component'));
    expect(container).toHaveTextContent('value two');
  });

  test('if property is not provided, the component is uncontrolled', () => {
    const ref = React.createRef<Ref>();
    const { container } = render(<Component value={undefined} defaultValue="the default value" ref={ref} />);
    expect(container).toHaveTextContent('the default value');

    act(() => ref.current!.setHookValue('another value'));
    expect(container).toHaveTextContent('another value');

    act(() => ref.current!.setHookValue(oldState => oldState + ' but modified'));
    expect(container).toHaveTextContent('another value but modified');

    act(() => ref.current!.setHookValue(undefined!));
    expect(container).toHaveTextContent('');
  });
});
