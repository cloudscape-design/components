// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { useGridNavigationFocusable } from '../../../../lib/components/table/table-role/grid-navigation-context';
import { renderWithGridNavigation } from './utils';

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useGridNavigationFocusable(buttonRef, { tabIndex: props.tabIndex });
  return <button {...props} ref={buttonRef} tabIndex={tabIndex} />;
}

test('does not override tab index when keyboard navigation is not active', () => {
  renderWithGridNavigation({ target: null }, <Button id="button">button</Button>);
  expect(document.querySelector('#button')).not.toHaveAttribute('tabIndex');
});

test('overrides tab index when keyboard navigation is active', () => {
  renderWithGridNavigation(
    { target: '#button1' },
    <div>
      <Button id="button1">button 1</Button>
      <Button id="button2">button 2</Button>
    </div>
  );
  expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '0');
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
});

test('does not override explicit tab index with 0', () => {
  renderWithGridNavigation(
    { target: '#button1' },
    <div>
      <Button id="button1" tabIndex={-2}>
        button 1
      </Button>
      <Button id="button2" tabIndex={-2}>
        button 2
      </Button>
    </div>
  );
  expect(document.querySelector('#button1')).toHaveAttribute('tabIndex', '-2');
  expect(document.querySelector('#button2')).toHaveAttribute('tabIndex', '-1');
});
