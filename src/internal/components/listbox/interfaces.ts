// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { DropdownOption } from '../option/interfaces';
import { OptionsListProps } from '../options-list';
import { ItemProps } from './parts/item';

/** Props spread onto the list element (`OptionsList`). */
export type ListElementProps = Omit<OptionsListProps, 'children'> & { ref: React.RefObject<HTMLDivElement> };

/** Props for the row at `index`. */
export type GetOptionProps = (option: DropdownOption, index: number) => ItemProps;
