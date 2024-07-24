// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render } from '@testing-library/react';

import {
  SingleTabStopNavigationContext,
  useSingleTabStopNavigation,
} from '../../../../lib/components/internal/context/single-tab-stop-navigation-context';
import { renderWithSingleTabStopNavigation } from './utils';

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef, { tabIndex: props.tabIndex });
  return <button {...props} ref={buttonRef} tabIndex={tabIndex} />;
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
      <SingleTabStopNavigationContext.Provider value={{ navigationActive, registerFocusable: () => () => {} }}>
        <Component />
      </SingleTabStopNavigationContext.Provider>
    );
  }

  const { rerender } = render(<Test navigationActive={true} />);
  expect(document.querySelector('div')).toHaveTextContent('true');

  rerender(<Test navigationActive={false} />);
  expect(document.querySelector('div')).toHaveTextContent('false');
});
