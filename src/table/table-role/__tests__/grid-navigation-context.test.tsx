// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef } from 'react';
import { render } from '@testing-library/react';
import { GridNavigationContext } from '../../../../lib/components/table/table-role/grid-navigation-context';
import { useGridNavigationFocusable } from '../../../../lib/components/table/table-role';
import { renderWithGridNavigation } from './utils';

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useGridNavigationFocusable(buttonRef, { tabIndex: props.tabIndex });
  return <button {...props} ref={buttonRef} tabIndex={tabIndex} />;
}

function ButtonAlt(props: React.HTMLAttributes<HTMLButtonElement>) {
  const getElement = useCallback(() => document.querySelector(`#${props.id}`), [props.id]);
  const { tabIndex } = useGridNavigationFocusable(getElement, { tabIndex: props.tabIndex });
  return <button {...props} tabIndex={tabIndex} />;
}

test.each([Button, ButtonAlt])('does not override tab index when keyboard navigation is not active', Button => {
  renderWithGridNavigation({ target: null }, <Button id="button" />);
  expect(document.querySelector('#button')).not.toHaveAttribute('tabIndex');
});

test.each([Button, ButtonAlt])('overrides tab index when keyboard navigation is active', Button => {
  renderWithGridNavigation(
    { target: '#button1' },
    <div>
      <Button id="button1" />
      <Button id="button2" />
    </div>
  );
  expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '0');
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
});

test.each([Button, ButtonAlt])('does not override explicit tab index with 0', Button => {
  renderWithGridNavigation(
    { target: '#button1' },
    <div>
      <Button id="button1" tabIndex={-2} />
      <Button id="button2" tabIndex={-2} />
    </div>
  );
  expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '-2');
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
});

test('propagates keyboard navigation state', () => {
  function Component() {
    const { keyboardNavigation } = useGridNavigationFocusable(null);
    return <div>{String(keyboardNavigation)}</div>;
  }

  const { rerender } = render(
    <GridNavigationContext.Provider value={{ keyboardNavigation: true, focusTarget: null }}>
      <Component />
    </GridNavigationContext.Provider>
  );

  expect(document.querySelector('div')).toHaveTextContent('true');

  rerender(
    <GridNavigationContext.Provider value={{ keyboardNavigation: false, focusTarget: null }}>
      <Component />
    </GridNavigationContext.Provider>
  );

  expect(document.querySelector('div')).toHaveTextContent('false');
});
