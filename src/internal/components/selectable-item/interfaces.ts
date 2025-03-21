// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../../base-component';
import { HighlightType } from '../options-list/utils/use-highlight-option';

export type SelectableItemProps = BaseComponentProps & {
  children: React.ReactNode;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  hasBackground?: boolean;
  isParent?: boolean;
  isChild?: boolean;
  virtualPosition?: number;
  padBottom?: boolean;
  isNextSelected?: boolean;
  useInteractiveGroups?: boolean;
  screenReaderContent?: string;
  ariaPosinset?: number;
  ariaSetsize?: number;
  highlightType?: HighlightType['type'];
  ariaDescribedby?: string;
  value?: string;
  sticky?: boolean;
  afterHeader?: boolean;
  hasScrollbar?: boolean;
} & ({ ariaSelected?: boolean; ariaChecked?: never } | { ariaSelected?: never; ariaChecked?: boolean | 'mixed' });

export interface ItemDataAttributes {
  'data-group-index'?: string;
  'data-child-index'?: string;
  'data-in-group-index'?: string;
  'data-test-index'?: string;
}
