// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyboardEvent } from 'react';
import { findUpUntil } from '../../internal/utils/dom';
import { TableProps } from '../interfaces';
import selectionStyles from './styles.css.js';
import { SELECTION_ITEM } from './utils';

// The hooks moves focus between multi-selection checkboxes.
// Not eligible for tables with grid navigation.
export function useSelectionFocusMove(selectionType: TableProps['selectionType'], totalItems: number) {
  if (selectionType !== 'multi') {
    return {};
  }
  function moveFocus(sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) {
    let index = fromIndex;
    const rootContainer = findRootContainer(sourceElement);

    while (index >= -1 && index < totalItems) {
      index += direction;
      const control = findSelectionControlByIndex(rootContainer, index);
      if (control && !control.disabled) {
        control.focus();
        break;
      }
    }
  }
  const [moveFocusDown, moveFocusUp] = ([1, -1] as const).map(direction => {
    return (event: KeyboardEvent) => {
      const target = event.currentTarget as HTMLElement;
      const itemNode = findUpUntil(target, node => node.dataset.selectionItem === 'item')!;
      const fromIndex = Array.prototype.indexOf.call(itemNode.parentElement!.children, itemNode);
      moveFocus(target, fromIndex, direction);
    };
  });
  return {
    moveFocusDown,
    moveFocusUp,
    moveFocus,
  };
}

function findSelectionControlByIndex(rootContainer: HTMLElement, index: number) {
  if (index === -1) {
    // find "select all" checkbox
    return rootContainer.querySelector<HTMLInputElement>(
      `[data-${SELECTION_ITEM}="all"] .${selectionStyles.root} input`
    );
  }
  return rootContainer.querySelectorAll<HTMLInputElement>(
    `[data-${SELECTION_ITEM}="item"] .${selectionStyles.root} input`
  )[index];
}

function findRootContainer(element: HTMLElement) {
  return findUpUntil(element, node => node.dataset.selectionRoot === 'true')!;
}
