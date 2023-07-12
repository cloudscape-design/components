// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';

const metadata: StyleDictionary.MetadataIndex = {
  colorBackgroundButtonNormalActive: {
    description: 'The background color of normal buttons in active state.',
    themeable: true,
    public: true,
  },
  colorBackgroundButtonNormalDefault: {
    description: 'The default background color of normal buttons.',
    themeable: true,
    public: true,
  },
  colorBackgroundButtonNormalDisabled: {
    description: 'The background color of normal buttons in disabled state.',
    themeable: true,
    public: true,
  },
  colorBackgroundButtonNormalHover: {
    description: 'The background color of normal buttons in hover state.',
    themeable: true,
    public: true,
  },
  colorBackgroundButtonPrimaryActive: {
    description: 'The background color of primary buttons in active state.',
    themeable: true,
    public: true,
  },
  colorBackgroundButtonPrimaryDefault: {
    description: 'The default background color of primary buttons.',
    themeable: true,
    public: true,
  },
  colorBackgroundButtonPrimaryDisabled: {
    description: 'The background color of primary buttons in disabled state.',
    themeable: true,
    public: true,
  },
  colorBackgroundButtonPrimaryHover: {
    description: 'The background color of primary buttons in hover state.',
    themeable: true,
    public: true,
  },
  colorBackgroundCellShaded: {
    description: 'The background color of shaded table cells.',
    themeable: true,
    public: true,
  },
  colorBackgroundContainerContent: {
    description:
      'The background color of container main content areas. For example: content areas of form sections, containers, tables, and cards.',
    public: true,
    themeable: true,
  },
  colorBackgroundContainerHeader: {
    description:
      'The background color of container headers. For example: headers of form sections, containers, tables, and card collections.',
    public: true,
    themeable: true,
  },
  colorBackgroundControlChecked: {
    description:
      'The background color of a checked form control. For example: background fill of a selected radio button, checked checkbox, and toggle that is switched on.',
    public: true,
    themeable: true,
  },
  colorBackgroundControlDefault: {
    description:
      'The default background color of form controls. For example: radio buttons and checkboxes default background fill color.',
    public: true,
    themeable: true,
  },
  colorBackgroundControlDisabled: {
    description:
      'The background color of a disabled form control. For example: background fill of a disabled radio button and checkbox.',
    public: true,
    themeable: true,
  },
  colorBackgroundDropdownItemDefault: {
    description:
      'The default background color of dropdown items. For example: select, multiselect, autosuggest, and datepicker dropdown backgrounds.',
    public: true,
    themeable: true,
  },
  colorBackgroundDropdownItemFilterMatch: {
    description:
      "The background color of text that matches a user's query. For example: the background of text matching a query entered into a table filter, select, multiselect, or autosuggest.",
    public: true,
    themeable: true,
  },
  colorBackgroundDropdownItemHover: {
    description:
      'The background color of dropdown items on hover. For example: background of hovered items in select, multiselect, autosuggest, and datepicker dropdowns.',
    public: true,
    themeable: true,
  },
  colorBackgroundDropdownItemSelected: {
    description:
      'The background color of selected dropdown items. For example: background of selected items in select, multiselect, autosuggest, and datepicker dropdowns.',
  },
  colorBackgroundHomeHeader: {
    description: "The background color of the home header, displayed on the Service's home page.",
    public: true,
    themeable: true,
  },
  colorBackgroundInputDefault: {
    description:
      'The default background color of form inputs. For example: background fill of an input, textarea, autosuggest, and trigger of a select and multiselect.',
    public: true,
    themeable: true,
  },
  colorBackgroundInputDisabled: {
    description:
      'The background color of a disabled form input. For example: background fill of a disabled input, textarea, autosuggest, and trigger of a select and multiselect.',
    public: true,
    themeable: true,
  },
  colorBackgroundItemSelected: {
    description:
      'The background color of a selected item. For example: tokens, selected table rows, cards, and tile backgrounds.',
    public: true,
    themeable: true,
  },
  colorBackgroundLayoutMain: {
    description: 'The background color of the main content area on a page. For example: content area in app layout.',
    public: true,
    themeable: true,
  },
  colorBackgroundLayoutPanelContent: {
    description:
      'The background color of app layout panel content area. For example: The side navigation and tools panel content background color.',
  },
  colorBackgroundLayoutToggleActive: {
    description: "The background color of the app layout toggle button when it's active.",
    public: true,
    themeable: true,
  },
  colorBackgroundLayoutToggleDefault: {
    description: 'The default background color of the app layout toggle button.',
    public: true,
    themeable: true,
  },
  colorBackgroundLayoutToggleHover: {
    description: 'The background color of the app layout toggle button on hover.',
    public: true,
    themeable: true,
  },
  colorBackgroundLayoutToggleSelectedActive: {
    description: "The background color of the app layout toggle button when it's selected and active.",
    public: true,
    themeable: true,
  },
  colorBackgroundLayoutToggleSelectedDefault: {
    description: "The default background color of the app layout toggle button when it's selected.",
    public: true,
    themeable: true,
  },
  colorBackgroundLayoutToggleSelectedHover: {
    description: "The background color of the app layout toggle button on hover when it's selected.",
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationBlue: {
    description: 'Background color for blue notifications. For example: blue badges and info flash messages.',
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationGreen: {
    description: 'Background color for green notifications. For example: green badges and success flash messages.',
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationRed: {
    description: 'Background color for red notifications. For example: red badges and error flash messages.',
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationYellow: {
    description: 'Background color for yellow notifications. For example: yellow badges and warning flash messages.',
    public: true,
    themeable: true,
  },
  colorBackgroundPopover: {
    description: 'Background color for the popover container.',
    public: true,
    themeable: true,
  },
  colorBackgroundStatusError: {
    description: 'The background color of an item in error state. For example: error alerts.',
    public: true,
    themeable: true,
  },
  colorBackgroundStatusInfo: {
    description: 'The background color of an informational item. For example: information alerts.',
    public: true,
    themeable: true,
  },
  colorBackgroundStatusSuccess: {
    description: 'The background color of an item in success state. For example: success alerts.',
    public: true,
    themeable: true,
  },
  colorBackgroundStatusWarning: {
    description: 'The background color of an item in warning state. For example: warning alerts.',
    public: true,
    themeable: true,
  },
  colorBackgroundToggleCheckedDisabled: {
    description: 'The background color of checked toggles in disabled state.',
    themeable: true,
    public: true,
  },
  colorBorderButtonNormalActive: { description: 'The border color of normal buttons in active state.' },
  colorBorderButtonNormalDefault: { description: 'The border color of normal buttons.', themeable: true, public: true },
  colorBorderButtonNormalDisabled: {
    description: 'The border color of normal buttons in disabled state.',
    themeable: true,
    public: true,
  },
  colorBorderButtonNormalHover: {
    description: 'The border color of normal buttons in hover state.',
    themeable: true,
    public: true,
  },
  colorBorderButtonPrimaryDisabled: {
    description: 'The border color of primary buttons in disabled state.',
    themeable: true,
    public: true,
  },
  colorBorderContainerTop: {
    description:
      'The top border color for containers and first item in dropdowns. For example: the top border of a card, dropdown, and table.',
    public: true,
    themeable: true,
  },
  colorBorderControlDefault: {
    description: 'The default border color of form controls. For example: radio buttons and checkboxes.',
    public: true,
    themeable: true,
  },
  colorBorderControlDisabled: {
    description: 'The border color of disabled form controls. For example: disabled radio buttons and checkboxes.',
  },
  colorBorderDividerDefault: {
    description:
      'The default color for dividers. For example: dividers in column layout, expanding sections, side nav, help panel, between table rows and dropdown items, and inside containers.',
    public: true,
    themeable: true,
  },
  colorBorderDropdownItemHover: {
    description:
      'The border color of dropdown items on hover. For example: border of hovered items in select, multiselect, autosuggest, and hovered days in datepicker.',
    public: true,
    themeable: true,
  },
  colorBorderInputDefault: {
    description:
      'The default border color of form inputs. For example: input, textarea, autosuggest, datepicker, select, and multiselect.',
    public: true,
    themeable: true,
  },
  colorBorderItemFocused: {
    description: 'The color of focus states. For example: the focus ring around interactive elements.',
    public: true,
    themeable: true,
  },
  colorBorderItemPlaceholder: {
    description: 'The border color for dividers.',
  },
  colorBorderItemSelected: {
    description:
      'The border color of a selected item. For example: tokens, selected table rows, selected cards, and selected tile borders.',
    public: true,
    themeable: true,
  },
  colorBorderStatusError: {
    description: 'The border color of an item in error state. For example: error alerts.',
    public: true,
    themeable: true,
  },
  colorBorderStatusInfo: {
    description: 'The border color of an informational item. For example: information alerts.',
    public: true,
    themeable: true,
  },
  colorBorderStatusSuccess: {
    description: 'The border color of an item in success state. For example: success alerts.',
    public: true,
    themeable: true,
  },
  colorBorderStatusWarning: {
    description: 'The border color of an item in warning state. For example: warning alerts.',
    public: true,
    themeable: true,
  },
  colorBorderTutorial: { description: 'The border color of tutorials in the tutorials list in the tutorial panel.' },
  colorForegroundControlDefault: {
    description:
      'The color used to mark enabled form controls. For example: the checkmark on checkboxes, inner circle on radio buttons, and handle on toggles.',
    public: true,
    themeable: true,
  },
  colorForegroundControlDisabled: {
    description:
      'The color used to mark disabled form controls. For example: the checkmark on checkboxes, inner circle on radio buttons, and handle on toggles.',
    public: true,
    themeable: true,
  },
  colorTextAccent: {
    description:
      'The accent text color used to guide a user. For example: the highlighted page in the side navigation, active tab text, selected day text color in date picker, and hover state in expandable section.',
    public: true,
    themeable: true,
  },
  colorTextBodyDefault: {
    description:
      'The default color of non-heading text and body content. For example: text in a paragraph tag, table cell data, form field labels and values.',
    public: true,
    themeable: true,
  },
  colorTextBodySecondary: {
    description:
      'The color of text that is secondary to base text. For example: text in the navigation and tools panels.',
    public: true,
    themeable: true,
  },
  colorTextBreadcrumbCurrent: {
    description: 'The text color that marks the breadcrumb item for the page the user is currently viewing.',
    themeable: true,
    public: true,
  },
  colorTextBreadcrumbIcon: {
    description: 'The color used for the icon delimiter between breadcrumb items.',
    themeable: true,
    public: true,
  },
  colorTextButtonNormalActive: {
    description: 'The active text color of normal buttons. For example: Active text color in normal and link buttons.',
    themeable: true,
    public: true,
  },
  colorTextButtonNormalDefault: {
    description: 'The default text color of normal buttons.',
    themeable: true,
    public: true,
  },
  colorTextButtonNormalHover: {
    description: 'The hover text color of normal buttons.',
    themeable: true,
    public: true,
  },
  colorTextButtonPrimaryActive: {
    description: 'The active text color of primary buttons.',
    themeable: true,
    public: true,
  },
  colorTextLinkButtonNormalDefault: {
    description: 'The default text color of link buttons.',
    themeable: true,
    public: false,
  },
  colorTextLinkButtonNormalHover: {
    description: 'The hover text color of link buttons.',
    themeable: true,
    public: false,
  },
  colorTextLinkButtonNormalActive: {
    description: 'The active text color of link buttons.',
    themeable: true,
    public: false,
  },
  colorTextButtonPrimaryDefault: {
    description: 'The default text color of primary buttons.',
    themeable: true,
    public: true,
  },
  colorTextButtonPrimaryHover: {
    description: 'The hover text color of primary buttons.',
    themeable: true,
    public: true,
  },
  colorTextControlDisabled: {
    description:
      'The text color of a disabled control. For example: the label and description on a disabled checkbox, radio button, or toggle.',
  },
  colorTextCounter: {
    description: 'The default color for counters. For example: counters in table headers',
    themeable: true,
    public: true,
  },
  colorTextDropdownFooter: {
    description:
      'The default color of dropdown footer text. For example: end of results text in an asynchrounous select and autosuggest.',
  },
  colorTextDropdownItemDefault: {
    description:
      'The default text color of dropdown items. For example: label and label tag text color for autosuggest, select, and multiselect.',
  },
  colorTextDropdownItemDisabled: {
    description:
      'The text color of disabled dropdown items. For example: label, label tag, description, and tag text color of a disabled item in a select, multiselect, and autosuggest.',
  },
  colorTextDropdownItemFilterMatch: {
    description:
      "The color of text matching a user's query. For example: the text matching a query entered into a table filter, select, multiselect, or autosuggest.",
    public: true,
    themeable: true,
  },
  colorTextDropdownItemHighlighted: {
    description:
      'The text color of hovered or selected dropdown items. For example: label text color of the item on hover in a select, multiselect, and autosuggest.',
    public: true,
    themeable: true,
  },
  colorTextDropdownItemSecondary: {
    description:
      'The text color of secondary information in dropdown items. For example: descriptions and tags text color in a select, multiselect, and autosuggest.',
  },
  colorTextEmpty: {
    description:
      'The color of text in non-dropdown empty states. For example: tables, card collections, and attribute editor empty state text.',
    public: true,
    themeable: true,
  },
  colorTextFormDefault: {
    description:
      'The default color of form field labels and values. For example: the label in form fields, checkboxes, radio buttons, toggles, and the value in inputs and text areas.',
    public: true,
    themeable: true,
  },
  colorTextFormLabel: { description: 'Component specific: Special because control group is different.' },
  colorTextFormSecondary: {
    description:
      'The color of secondary text in form fields and controls. For example: the description and constraint text in form fields, the descriptions in checkboxes, radio buttons, toggles, and any additional info in an attribute editor.',
    public: true,
    themeable: true,
  },
  colorTextGroupLabel: {
    description:
      "The default color for group labels. For example: group label in dropdown part of button dropdown, select, and multiselect, and group label in table and cards' preferences content selector.",
    public: true,
    themeable: true,
  },
  colorTextHeadingDefault: {
    description:
      'The default color for headings 1-5. For example: headings in tables, card collections, containers, form sections, forms, and app layout panels.',
    public: true,
    themeable: true,
  },
  colorTextHeadingSecondary: {
    description:
      'The default color for secondary heading text such as page and container descriptions. For example: descriptions in containers such as form sections, tables, and card collections, as well as form page descriptions.',
    public: true,
    themeable: true,
  },
  colorTextHomeHeaderDefault: {
    description: "The color of the home header's text, displayed on the Service's home page.",
    public: true,
    themeable: true,
  },
  colorTextHomeHeaderSecondary: {
    description: "The color of the home header's secondary text, displayed on the Service's home page.",
    public: true,
    themeable: true,
  },
  colorTextInputDisabled: {
    description:
      'The color of the text value in a disabled input. For example: text in a disabled input, autosuggest, datepicker, and the trigger of a select and multiselect.',
    public: true,
    themeable: true,
  },
  colorTextInputPlaceholder: {
    description:
      'The color of placeholder text in an input. For example: placeholder text in an input, autosuggest, datepicker, and the trigger of a select and multiselect.',
    public: true,
    themeable: true,
  },
  colorTextInteractiveActive: {
    description: 'The color of clickable elements in their active state. For example: tabs and icons.',
    public: true,
    themeable: true,
  },
  colorTextInteractiveDefault: {
    description: 'The color of clickable elements in their default state. For example: tabs, and icons.',
    public: true,
    themeable: true,
  },
  colorTextInteractiveDisabled: {
    description:
      'The color of clickable elements in their disabled state. For example: disabled tabs, button text, and icons.',
    public: true,
    themeable: true,
  },
  colorTextInteractiveHover: {
    description: 'The color of clickable elements on hover. For example: icons on hover.',
    public: true,
    themeable: true,
  },
  colorTextInteractiveInvertedDefault: {
    description:
      'The default color of clickable elements in the flashbar. For example: The dismiss icon button in a flashbar.',
    themeable: true,
    public: true,
  },
  colorTextInteractiveInvertedHover: {
    description:
      'The hover color of clickable elements in the flashbar. For example: The dismiss icon button in a flashbar.',
    themeable: true,
    public: true,
  },
  colorTextLayoutToggle: {
    description: 'The default color of the app layout toggle.',
    public: true,
    themeable: true,
  },
  colorTextLayoutToggleActive: {
    description: "The color of the app layout toggle button when it's active.",
    public: true,
    themeable: true,
  },
  colorTextLayoutToggleHover: {
    description: 'The color of the app layout toggle button on hover.',
    public: true,
    themeable: true,
  },
  colorTextLayoutToggleSelected: {
    description: "The color of the app layout toggle button when it's selected.",
    public: true,
    themeable: true,
  },
  colorTextLabel: {
    description:
      "The default color for non-form labels. For example: the key in key/value pairs and card's sections labels.",
    public: true,
    themeable: true,
  },
  colorTextLinkDefault: {
    description:
      'The default color for links. For example: text in an anchor tag, info links, breadcrumb links, and icon links.',
    public: true,
    themeable: true,
  },
  colorTextLinkHover: {
    description:
      'The hover color for links. For example: text in an anchor tag, info links, breadcrumb links, and icon links.',
    public: true,
    themeable: true,
  },
  colorTextNotificationDefault: {
    description: 'Default text color for notifications. For example: the text on badges and flashes.',
    public: true,
    themeable: true,
  },
  colorTextNotificationYellow: {
    description: 'Warning text color for notifications. For example: the text on warning flash messages.',
    public: true,
    themeable: true,
  },
  colorTextStatusError: {
    description: 'The color of error text and icons. For example: form field error text and error status indicators.',
    public: true,
    themeable: true,
  },
  colorTextStatusInactive: {
    description:
      'The color of inactive and loading text and icons. For example: table and card collection loading states icon and text and inactive and pending status indicators.',
    public: true,
    themeable: true,
  },
  colorTextStatusInfo: {
    description: 'The color of info text and icons. For example: info status indicators and info alert icon.',
    public: true,
    themeable: true,
  },
  colorTextStatusSuccess: {
    description: 'The color of success text and icons. For example: success status indicators and success alert icon.',
    public: true,
    themeable: true,
  },
  colorTextStatusWarning: {
    description: 'The color of warning icons.',
    themeable: true,
    public: true,
  },
  colorTextTopNavigationTitle: {
    description: 'The color of the title in the top navigation.',
    public: true,
    themeable: true,
  },
  colorBoardPlaceholderActive: {
    description: 'The color of board placeholder in active state.',
    themeable: false,
    public: true,
  },
  colorBoardPlaceholderHover: {
    description: 'The color of board placeholder in hovered state.',
    themeable: false,
    public: true,
  },
  colorDragPlaceholderActive: {
    description: 'The color of drag placeholder in active state.',
    themeable: false,
    public: true,
  },
  colorDragPlaceholderHover: {
    description: 'The color of drag placeholder in hovered state.',
    themeable: false,
    public: true,
  },
  colorDropzoneBackgroundActive: {
    description: 'The color of file upload dropzone background in active state.',
    themeable: false,
    public: false,
  },
  colorDropzoneBackgroundHover: {
    description: 'The color of file upload dropzone background in hovered state.',
    themeable: false,
    public: false,
  },
  colorDropzoneTextActive: {
    description: 'The color of file upload dropzone text in active state.',
    themeable: false,
    public: false,
  },
  colorDropzoneTextHover: {
    description: 'The color of file upload dropzone text in hovered state.',
    themeable: false,
    public: false,
  },
};

export default metadata;
