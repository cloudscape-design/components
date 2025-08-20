// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useEffect, useRef } from 'react';
import { render } from '@testing-library/react';

import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationContext,
  SingleTabStopNavigationProvider,
  useSingleTabStopNavigation,
} from '../../../../lib/components/internal/context/single-tab-stop-navigation-context';
import { renderWithSingleTabStopNavigation } from './utils';

// Simple STSN subscriber component
function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef, { tabIndex: props.tabIndex });
  return <button {...props} ref={buttonRef} tabIndex={tabIndex} />;
}

// Simple STSN provider component
function Group({
  id,
  navigationActive,
  children,
}: {
  id: string;
  navigationActive: boolean;
  children: React.ReactNode;
}) {
  const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);

  useEffect(() => {
    navigationAPI.current?.updateFocusTarget();
  });

  return (
    <SingleTabStopNavigationProvider
      ref={navigationAPI}
      navigationActive={navigationActive}
      getNextFocusTarget={() => document.querySelector(`#${id}`)!.querySelectorAll('button')[0] as HTMLElement}
    >
      <div id={id}>
        <Button>First</Button>
        <Button>Second</Button>
        {children}
      </div>
    </SingleTabStopNavigationProvider>
  );
}

function findGroupButton(groupId: string, buttonIndex: number) {
  return document.querySelector(`#${groupId}`)!.querySelectorAll('button')[buttonIndex] as HTMLElement;
}

test('does not override tab index when keyboard navigation is not active', () => {
  renderWithSingleTabStopNavigation(<Button id="button" />, { navigationActive: false });
  expect(document.querySelector('#button')).not.toHaveAttribute('tabIndex');
});

test('does not override tab index for suppressed elements', () => {
  const { setCurrentTarget } = renderWithSingleTabStopNavigation(
    <div>
      <Button id="button1" />
      <Button id="button2" />
      <Button id="button3" tabIndex={-1} />
      <Button id="button4" />
      <Button id="button5" tabIndex={-1} />
    </div>,
    { navigationActive: true }
  );
  setCurrentTarget(document.querySelector('#button1'), [
    document.querySelector('#button1'),
    document.querySelector('#button2'),
    document.querySelector('#button3'),
  ]);
  expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '0');
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '0');
  expect(document.querySelector('#button3')).toHaveAttribute('tabIndex', '-1');
  expect(document.querySelector('#button4')).toHaveAttribute('tabIndex', '-1');
  expect(document.querySelector('#button5')).toHaveAttribute('tabIndex', '-1');
});

test('overrides tab index when keyboard navigation is active', () => {
  const { setCurrentTarget } = renderWithSingleTabStopNavigation(
    <div>
      <Button id="button1" />
      <Button id="button2" />
    </div>
  );
  setCurrentTarget(document.querySelector('#button1'));
  expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '0');
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
});

test('does not override explicit tab index with 0', () => {
  const { setCurrentTarget } = renderWithSingleTabStopNavigation(
    <div>
      <Button id="button1" tabIndex={-2} />
      <Button id="button2" tabIndex={-2} />
    </div>
  );
  setCurrentTarget(document.querySelector('#button1'));
  expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '-2');
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-2');
});

test('propagates and suppresses navigation active state', () => {
  function Component() {
    const { navigationActive } = useSingleTabStopNavigation(null);
    return <div>{String(navigationActive)}</div>;
  }
  function Test({ navigationActive }: { navigationActive: boolean }) {
    return (
      <SingleTabStopNavigationContext.Provider
        value={{ navigationActive, registerFocusable: () => () => {}, resetFocusTarget: () => {} }}
      >
        <Component />
      </SingleTabStopNavigationContext.Provider>
    );
  }

  const { rerender } = render(<Test navigationActive={true} />);
  expect(document.querySelector('div')).toHaveTextContent('true');

  rerender(<Test navigationActive={false} />);
  expect(document.querySelector('div')).toHaveTextContent('false');
});

test('subscriber components can be used without provider', () => {
  function TestComponent(props: React.HTMLAttributes<HTMLButtonElement>) {
    const ref = useRef(null);
    const contextResult = useContext(SingleTabStopNavigationContext);
    const hookResult = useSingleTabStopNavigation(ref, { tabIndex: props.tabIndex });
    useEffect(() => {
      contextResult.registerFocusable(ref.current!, () => {});
      contextResult.resetFocusTarget();
    });
    return (
      <div ref={ref}>
        Context: {`${contextResult.navigationActive}`}, Hook: {`${hookResult.navigationActive}:${hookResult.tabIndex}`}
      </div>
    );
  }
  const { container } = render(<TestComponent />);
  expect(container.textContent).toBe('Context: false, Hook: false:undefined');
});

describe('nested contexts', () => {
  test('tab indices are distributed correctly when switching contexts from inner to outer', () => {
    const { rerender } = render(
      <Group id="outer-most" navigationActive={false}>
        <Group id="outer" navigationActive={false}>
          <Group id="inner" navigationActive={true}>
            {null}
          </Group>
        </Group>
      </Group>
    );
    expect(findGroupButton('outer-most', 0)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer-most', 1)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer', 0)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer', 1)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('inner', 0)).toHaveAttribute('tabindex', '0');
    expect(findGroupButton('inner', 1)).toHaveAttribute('tabindex', '-1');

    rerender(
      <Group id="outer-most" navigationActive={false}>
        <Group id="outer" navigationActive={true}>
          <Group id="inner" navigationActive={true}>
            {null}
          </Group>
        </Group>
      </Group>
    );
    expect(findGroupButton('outer-most', 0)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer-most', 1)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer', 0)).toHaveAttribute('tabindex', '0');
    expect(findGroupButton('outer', 1)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 0)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 1)).toHaveAttribute('tabindex', '-1');

    rerender(
      <Group id="outer-most" navigationActive={true}>
        <Group id="outer" navigationActive={true}>
          <Group id="inner" navigationActive={true}>
            {null}
          </Group>
        </Group>
      </Group>
    );
    expect(findGroupButton('outer-most', 0)).toHaveAttribute('tabindex', '0');
    expect(findGroupButton('outer-most', 1)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('outer', 0)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('outer', 1)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 0)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 1)).toHaveAttribute('tabindex', '-1');
  });

  test('tab indices are distributed correctly when switching contexts from outer to inner', () => {
    const { rerender } = render(
      <Group id="outer-most" navigationActive={true}>
        <Group id="outer" navigationActive={true}>
          <Group id="inner" navigationActive={true}>
            {null}
          </Group>
        </Group>
      </Group>
    );
    expect(findGroupButton('outer-most', 0)).toHaveAttribute('tabindex', '0');
    expect(findGroupButton('outer-most', 1)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('outer', 0)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('outer', 1)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 0)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 1)).toHaveAttribute('tabindex', '-1');

    rerender(
      <Group id="outer-most" navigationActive={false}>
        <Group id="outer" navigationActive={true}>
          <Group id="inner" navigationActive={true}>
            {null}
          </Group>
        </Group>
      </Group>
    );
    expect(findGroupButton('outer-most', 0)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer-most', 1)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer', 0)).toHaveAttribute('tabindex', '0');
    expect(findGroupButton('outer', 1)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 0)).toHaveAttribute('tabindex', '-1');
    expect(findGroupButton('inner', 1)).toHaveAttribute('tabindex', '-1');

    rerender(
      <Group id="outer-most" navigationActive={false}>
        <Group id="outer" navigationActive={false}>
          <Group id="inner" navigationActive={true}>
            {null}
          </Group>
        </Group>
      </Group>
    );
    expect(findGroupButton('outer-most', 0)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer-most', 1)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer', 0)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('outer', 1)).not.toHaveAttribute('tabindex');
    expect(findGroupButton('inner', 0)).toHaveAttribute('tabindex', '0');
    expect(findGroupButton('inner', 1)).toHaveAttribute('tabindex', '-1');
  });
});
