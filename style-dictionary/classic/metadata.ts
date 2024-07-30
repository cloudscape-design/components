// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { updateDescriptions } from '../utils/metadata';
import parentMetadata from '../visual-refresh/metadata';

const updatedDescriptions: StyleDictionary.TokenIndex<string> = {
  colorTextAccent:
    'The accent color used to guide a user. *For example: the highlighted page in the side navigation and active tab text.*',
  colorTextDropdownItemHighlighted:
    'The text color of hovered or selected dropdown items. *For example: selected day text color in date picker, label text color of the item on hover in a select, multiselect, and autosuggest.*',
  colorTextInteractiveDefault:
    'The color of clickable elements in their default state. *For example: expandable sections, tabs, and icons.*',
  colorTextInteractiveHover:
    'The color of clickable elements on hover. *For example: expandable sections, and icons on hover.*',
  colorTextToggleButtonIconPressed: 'The pressed text color of icon toggle buttons.',
  spaceScaledM: 'The M spacing unit which scales between modes. For example: top padding of content inside a container',
  spaceScaledXxl:
    'The XXL spacing unit which scales between modes. For example: horizontal padding for side navigation and help panel content.',
};

const metadata: StyleDictionary.MetadataIndex = updateDescriptions(updatedDescriptions, parentMetadata);
export default metadata;
