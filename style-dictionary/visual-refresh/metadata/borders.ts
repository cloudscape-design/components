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
    public: true,
    themeable: true,
  },
  borderRadiusBadge: {
    description: 'The border radius of badges.',
    public: true,
    themeable: true,
  },
  borderRadiusButton: {
    description: "The border radius of buttons and segmented control's segments.",
    public: true,
    themeable: true,
  },
  borderRadiusCalendarDayFocusRing: {
    description: 'The border radius of the focused day in date picker and date range picker.',
    public: true,
    themeable: true,
  },
  borderRadiusCodeEditor: {
    description: 'The border radius of code editors.',
  },
  borderRadiusContainer: {
    description:
      'The border radius of containers. Also used in container-based components like table, cards, expandable section, and modal.',
    public: true,
    themeable: true,
  },
  borderRadiusControlCircularFocusRing: {
    description: 'The border radius of the focus indicator of circular controls. For example: radio button.',
    public: true,
    themeable: true,
  },
  borderRadiusControlDefaultFocusRing: {
    description:
      'The border radius of the focus indicator of interactive elements. For example: button, link, toggle, pagination controls, expandable section header, popover trigger.',
    public: true,
    themeable: true,
  },
  borderRadiusDropdown: {
    description:
      'The border radius of dropdown containers. For example: button dropdown, select, multiselect, autosuggest, date picker, date range picker.',
    public: true,
    themeable: true,
  },
  borderRadiusDropzone: {
    description: 'The border radius of file upload dropzone.',
    public: false,
    themeable: false,
  },
  borderRadiusFlashbar: {
    description: 'The border radius of flash messages in flashbars.',
    public: true,
    themeable: true,
  },
  borderRadiusItem: {
    description:
      'The border radius of items that can be selected from a list. For example: select options, table rows, calendar days.',
    public: true,
    themeable: true,
  },
  borderRadiusInput: {
    description: 'The border radius of form controls. For example: input, select.',
    public: true,
    themeable: true,
  },
  borderRadiusPopover: {
    description: 'The border radius of popovers.',
    public: true,
    themeable: true,
  },
  borderRadiusTabsFocusRing: {
    description: "The border radius of tabs' focus indicator. Used in tabs and in the code editor status bar.",
    public: true,
    themeable: true,
  },
  borderRadiusTiles: {
    description: 'The border radius of tiles.',
    public: true,
    themeable: true,
  },
  borderRadiusToken: {
    description: 'The border radius of tokens. For example: token groups, multiselect tokens, property filter tokens.',
    public: true,
    themeable: true,
  },
  borderRadiusTutorialPanelItem: {
    description: 'The border radius of tutorials inside a tutorial panel.',
    public: true,
    themeable: true,
  },
};

export default metadata;
