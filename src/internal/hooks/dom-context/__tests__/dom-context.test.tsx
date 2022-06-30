// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createDomContext } from '../index';

const { context, RootProvider, IntermediateProvider } = createDomContext('test-context', { result: 'no value' });

function Consumer() {
  const value = useContext(context);
  return <div>{value.result}</div>;
}

function ExpectValue({ expected }: { expected: string }) {
  const value = useContext(context);
  expect(value.result).toBe(expected);
  return <span>success</span>;
}

function ProviderUpdater({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('old value');
  return (
    <>
      <input data-testid="updater" value={value} onChange={event => setValue(event.target.value)} />
      <div data-testid="display">
        <RootProvider value={{ result: value }}>{children}</RootProvider>
      </div>
    </>
  );
}

test('returns default context value if nothing is provided', () => {
  const { container } = render(<Consumer />);
  expect(container).toHaveTextContent('no value');
});

test('loads the context value from root provider', () => {
  const { container } = render(
    <RootProvider value={{ result: 'from provider' }}>
      <Consumer />
    </RootProvider>
  );
  expect(container).toHaveTextContent('from provider');
});

test('transfers the value from one react tree to another', () => {
  const { getByTestId } = render(
    <RootProvider value={{ result: 'from another tree' }}>
      <div data-testid="sub-root" />
    </RootProvider>
  );
  const subRoot = getByTestId('sub-root');
  render(
    <IntermediateProvider parentElement={subRoot}>
      <Consumer />
    </IntermediateProvider>,
    { container: subRoot }
  );
  expect(subRoot).toHaveTextContent('from another tree');
});

test('IntermediateProvider should render children only once', () => {
  const { getByTestId } = render(
    <RootProvider value={{ result: 'from root' }}>
      <div data-testid="sub-root" />
    </RootProvider>
  );
  const subRoot = getByTestId('sub-root');
  render(
    <IntermediateProvider parentElement={subRoot}>
      <ExpectValue expected="from root" />
    </IntermediateProvider>,
    { container: subRoot }
  );
  expect(subRoot).toHaveTextContent('success');
});

test('returns default context value if IntermediateProvider did not find anything', () => {
  const container = document.createElement('div');
  render(
    <IntermediateProvider parentElement={container}>
      <Consumer />
    </IntermediateProvider>,
    { container }
  );
  expect(container).toHaveTextContent('no value');
});

test('prefers the value from the closest root provider', () => {
  const { getByTestId } = render(
    <RootProvider value={{ result: 'level-1' }}>
      <div data-testid="second-level" />
    </RootProvider>
  );
  const secondLevel = getByTestId('second-level')!;
  render(
    <RootProvider value={{ result: 'level-2' }}>
      <div data-testid="third-level" />
    </RootProvider>,
    { container: secondLevel }
  );
  const thirdLevel = getByTestId('third-level')!;
  render(
    <IntermediateProvider parentElement={thirdLevel}>
      <Consumer />
    </IntermediateProvider>,
    { container: thirdLevel }
  );
  expect(thirdLevel).toHaveTextContent('level-2');
});

test('works through multiple intermediate providers', () => {
  const { getByTestId } = render(
    <RootProvider value={{ result: 'level-1' }}>
      <div data-testid="second-level" />
    </RootProvider>
  );
  const secondLevel = getByTestId('second-level')!;
  render(
    <IntermediateProvider parentElement={secondLevel}>
      <div data-testid="third-level" />
    </IntermediateProvider>,
    { container: secondLevel }
  );
  const thirdLevel = getByTestId('third-level')!;
  render(
    <IntermediateProvider parentElement={thirdLevel}>
      <Consumer />
    </IntermediateProvider>,
    { container: thirdLevel }
  );
  expect(thirdLevel).toHaveTextContent('level-1');
});

test('updates value in React', () => {
  const { getByTestId } = render(
    <ProviderUpdater>
      <Consumer />
    </ProviderUpdater>
  );
  expect(getByTestId('display')).toHaveTextContent('old value');
  fireEvent.change(getByTestId('updater'), { target: { value: 'new value' } });
  expect(getByTestId('display')).toHaveTextContent('new value');
});

test('updates value across React trees', () => {
  const { getByTestId } = render(
    <ProviderUpdater>
      <div data-testid="sub-root" />
    </ProviderUpdater>
  );
  const subRoot = getByTestId('sub-root');
  render(
    <IntermediateProvider parentElement={subRoot}>
      <Consumer />
    </IntermediateProvider>,
    { container: subRoot }
  );
  expect(subRoot).toHaveTextContent('old value');

  fireEvent.change(getByTestId('updater'), { target: { value: 'new value' } });
  expect(subRoot).toHaveTextContent('new value');
});
