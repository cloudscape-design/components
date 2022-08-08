// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';

const metadata: StyleDictionary.MetadataIndex = {
  borderActiveWidth: { description: 'The height of the active tab indicator.' },
  borderDividerListWidth: { description: 'Used for divider between repeated items such as dropdowns and tables.' },
  borderDividerSectionWidth: {
    description:
      'The default system divider width - used for dividers between sections of content such as key/value pairs and tabs, for both full width and inset dividers.',
  },
  borderInvalidWidth: { description: 'Used for invalid input left border width.' },
  borderPanelHeaderWidth: { description: 'The split panel header bottom divider width.' },
  borderPanelTopWidth: { description: 'The split panel top border width.' },
  borderRadiusAlert: {
    description: 'The border radius of alerts.',
  },
  borderRadiusBadge: {
    description: 'The border radius of badges.',
  },
  borderRadiusButton: {
    description: "The border radius of buttons and segmented control's segments.",
  },
  borderRadiusCalendarDayFocused: {
    description: 'The border radius of the focused day in date picker and date range picker.',
  },
  borderRadiusCodeEditor: {
    description: 'The border radius of code editors.',
  },
  borderRadiusContainer: {
    description:
      'The border radius of containers. Also used in container-based components like table, cards, expandable section, and modal.',
  },
  borderRadiusControl: {
    description: 'The border radius of form controls. For example: input, select, tokens.',
  },
  borderRadiusControlFocusRingCircle: {
    description: 'The border radius of the focus indicator of circular controls. For example: radio button.',
  },
  borderRadiusControlFocusRingDefault: {
    description:
      'The border radius of the focus indicator of interactive elements. For example: button, link, toggle, pagination controls, expandable section header, popover trigger.',
  },
  borderRadiusDropdown: {
    description:
      'The border radius of dropdown containers. For example: button dropdown, select, multiselect, autosuggest, date picker, date range picker.',
  },
  borderRadiusFlashbar: {
    description: 'The border radius of flash messages in flashbars.',
  },
  borderRadiusItem: {
    description:
      'The border radius of items that can be selected from a list. For example: select options, table rows, calendar days.',
  },
  borderRadiusPopover: {
    description: 'The border radius of popovers.',
  },
  borderRadiusTabsFocusRing: {
    description: "The border radius of tabs' focus indicator. Used in tabs and in the code editor status bar.",
  },
  borderRadiusTutorialPanelItem: {
    description: 'The border radius of tutorials inside a tutorial panel.',
  },
};

export default metadata;
