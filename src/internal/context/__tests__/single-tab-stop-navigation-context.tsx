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
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
});

test('propagates keyboard navigation state', () => {
  function Component() {
    const { navigationActive } = useSingleTabStopNavigation(null);
    return <div>{String(navigationActive)}</div>;
  }

  const { rerender } = render(
    <SingleTabStopNavigationContext.Provider value={{ navigationActive: true, registerFocusable: () => () => {} }}>
      <Component />
    </SingleTabStopNavigationContext.Provider>
  );

  expect(document.querySelector('div')).toHaveTextContent('true');

  rerender(
    <SingleTabStopNavigationContext.Provider value={{ navigationActive: false, registerFocusable: () => () => {} }}>
      <Component />
    </SingleTabStopNavigationContext.Provider>
  );

  expect(document.querySelector('div')).toHaveTextContent('false');
});
