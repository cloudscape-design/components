// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle } from 'react';
import { render, act, screen } from '@testing-library/react';
import { clearMessageCache } from '@cloudscape-design/component-toolkit/internal';
import { useControllable } from '../../../../../lib/components/internal/hooks/use-controllable';

interface Props {
  value?: string;
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

  return <span data-testid="hook-value">{hookValue}</span>;
});

function getHookValue() {
  return screen.getByTestId('hook-value').textContent;
}

describe('useControllable', () => {
  let consoleWarnSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    // ensure there is no any unexpected warnings
    expect(console.warn).not.toHaveBeenCalled();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    clearMessageCache();
  });

  test('prints a warning if the property switches from controlled to uncontrolled only in event handler', () => {
    const ref = React.createRef<Ref>();
    const { rerender } = render(
      <Component ref={ref} value="a value" defaultValue="the default value" onChange={() => {}} />
    );
    act(() => ref.current!.setHookValue('first change'));
    expect(console.warn).not.toHaveBeenCalled();

    rerender(<Component ref={ref} defaultValue="the default value" />);
    expect(console.warn).not.toHaveBeenCalled();

    act(() => ref.current!.setHookValue('second change'));
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "[AwsUi] [MyComponent] A component tried to change controlled 'value' property to be uncontrolled. " +
        'This is not supported. Properties should not switch from controlled to uncontrolled (or vice versa). ' +
        'Decide between using a controlled or uncontrolled mode for the lifetime of the component. ' +
        'More info: https://fb.me/react-controlled-components'
    );
    consoleWarnSpy.mockClear();
  });

  test('prints a warning if the property switches from uncontrolled to controlled only in event handler', () => {
    const ref = React.createRef<Ref>();
    const { rerender } = render(<Component ref={ref} defaultValue="the default value" />);
    act(() => ref.current!.setHookValue('first change'));
    expect(console.warn).not.toHaveBeenCalled();

    rerender(<Component ref={ref} value="a value" defaultValue="the default value" onChange={() => {}} />);
    expect(console.warn).not.toHaveBeenCalled();

    act(() => ref.current!.setHookValue('second change'));
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "[AwsUi] [MyComponent] A component tried to change uncontrolled 'value' property to be controlled. " +
        'This is not supported. Properties should not switch from uncontrolled to controlled (or vice versa). ' +
        'Decide between using a controlled or uncontrolled mode for the lifetime of the component. ' +
        'More info: https://fb.me/react-controlled-components'
    );
    consoleWarnSpy.mockClear();
  });

  test('prints a warning if the onChange handler is missing', () => {
    render(<Component value="any value" defaultValue="the default value" />);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      '[AwsUi] [MyComponent] You provided a `value` prop without an `onChange` handler. This will render a non-interactive component.'
    );
    consoleWarnSpy.mockClear();
  });

  test('tracks the defaultValue if and only if the component is uncontrolled and unchanged', () => {
    const ref = React.createRef<Ref>();

    const { rerender } = render(<Component value={undefined} defaultValue="the default value" ref={ref} />);
    expect(getHookValue()).toEqual('the default value');

    rerender(<Component value={undefined} defaultValue="a different default value" ref={ref} />);
    expect(getHookValue()).toEqual('a different default value');

    act(() => ref.current!.setHookValue('a value set inside the component'));
    expect(getHookValue()).toEqual('a value set inside the component');

    rerender(<Component value={undefined} defaultValue="another different default value" />);
    expect(getHookValue()).toEqual('a value set inside the component');
  });

  test('if property is provided, the component is controlled', () => {
    const ref = React.createRef<Ref>();

    const { rerender } = render(
      <Component ref={ref} value="value one" defaultValue="the default value" onChange={() => {}} />
    );
    expect(getHookValue()).toEqual('value one');

    rerender(<Component ref={ref} value="value two" defaultValue="the default value" onChange={() => {}} />);
    expect(getHookValue()).toEqual('value two');

    act(() => ref.current!.setHookValue('a value set from inside the component'));
    expect(getHookValue()).toEqual('value two');
  });

  test('if property and change handler are not provided, the component is uncontrolled', () => {
    const ref = React.createRef<Ref>();
    render(<Component ref={ref} defaultValue="the default value" />);
    expect(getHookValue()).toEqual('the default value');

    act(() => ref.current!.setHookValue('another value'));
    expect(getHookValue()).toEqual('another value');

    act(() => ref.current!.setHookValue(oldState => oldState + ' but modified'));
    expect(getHookValue()).toEqual('another value but modified');

    act(() => ref.current!.setHookValue(undefined!));
    expect(getHookValue()).toEqual('');
  });

  test('if only change handler is provided, the component is uncontrolled', () => {
    const ref = React.createRef<Ref>();
    render(<Component ref={ref} defaultValue="the default value" onChange={() => {}} />);
    expect(getHookValue()).toEqual('the default value');

    act(() => ref.current!.setHookValue('another value'));
    expect(getHookValue()).toEqual('another value');

    act(() => ref.current!.setHookValue(undefined!));
    expect(getHookValue()).toEqual('');
  });

  test('allow async switch to controlled mode', () => {
    const ref = React.createRef<Ref>();
    const { rerender } = render(<Component ref={ref} defaultValue="the default value" />);
    expect(getHookValue()).toEqual('the default value');

    rerender(<Component ref={ref} value="any value" defaultValue="the default value" onChange={() => {}} />);
    expect(getHookValue()).toEqual('any value');

    act(() => ref.current!.setHookValue('uncontrolled value'));
    expect(getHookValue()).toEqual('any value');
  });

  test('allow async switch to uncontrolled mode', () => {
    const ref = React.createRef<Ref>();
    const { rerender } = render(
      <Component ref={ref} value="any value" defaultValue="the default value" onChange={() => {}} />
    );
    expect(getHookValue()).toEqual('any value');

    act(() => ref.current!.setHookValue('uncontrolled value'));
    expect(getHookValue()).toEqual('any value');

    rerender(<Component ref={ref} defaultValue="the default value" />);
    expect(getHookValue()).toEqual('uncontrolled value');
  });
});
