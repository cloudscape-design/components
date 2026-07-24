// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Each component has its own test definition file.
// Import them here manually to form the full test suite.
import { TestSuite } from './types';
export { TestSuite, TestDefinition, ScreenshotType, ScreenshotTestConfiguration } from './types';

import actionCardSuite from './visual/action-card';
import alertSuite from './visual/alert';
import appLayoutGeneral from './visual/app-layout';
import appLayoutContentPaddings from './visual/app-layout-content-paddings';
import appLayoutDrawers from './visual/app-layout-drawers';
import appLayoutFlashbar from './visual/app-layout-flashbar';
import appLayoutHeader from './visual/app-layout-header';
import appLayoutMulti from './visual/app-layout-multi';
import appLayoutResponsive from './visual/app-layout-responsive';
import appLayoutStickyTableHeaderSplitPanel from './visual/app-layout-sticky-table-header-split-panel';
import appLayoutToolbar from './visual/app-layout-toolbar';
import appLayoutZIndex from './visual/app-layout-z-index';
import areaChartSuite from './visual/area-chart';
import attributeEditorSuite from './visual/attribute-editor';
import autosuggestSuite from './visual/autosuggest';
import badgeSuite from './visual/badge';
import barChartSuite from './visual/bar-chart';
import boxSuite from './visual/box';
import breadcrumbGroupSuite from './visual/breadcrumb-group';
import buttonSuite from './visual/button';
import buttonDropdownSuite from './visual/button-dropdown';
import buttonGroupSuite from './visual/button-group';
import cardsSuite from './visual/cards';
import checkboxSuite from './visual/checkbox';
import codeEditorSuite from './visual/code-editor';
import collectionPreferencesSuite from './visual/collection-preferences';
import columnLayoutSuite from './visual/column-layout';
import containerSuite from './visual/container';
import containerStickySuite from './visual/container-sticky';
import contentLayoutSuite from './visual/content-layout';
import contentLayoutPermutationsSuite from './visual/content-layout-permutations';
import copyToClipboardSuite from './visual/copy-to-clipboard';
import dateInputSuite from './visual/date-input';
import datePickerSuite from './visual/date-picker';
import dateRangePickerSuite from './visual/date-range-picker';
import expandableSectionSuite from './visual/expandable-section';
import flashbarSuite from './visual/flashbar';
import flashbarStackedSuite from './visual/flashbar-stacked';
import formSuite from './visual/form';
import formFieldSuite from './visual/form-field';
import headerSuite from './visual/header';
import inputSuite from './visual/input';
import itemCardSuite from './visual/item-card';

// Per-component exports (grouped by component)
export const actionCard: TestSuite[] = [actionCardSuite];
export const alert: TestSuite[] = [alertSuite];
export const appLayout: TestSuite[] = [
  appLayoutGeneral,
  appLayoutContentPaddings,
  appLayoutDrawers,
  appLayoutFlashbar,
  appLayoutHeader,
  appLayoutMulti,
  appLayoutResponsive,
  appLayoutStickyTableHeaderSplitPanel,
  appLayoutToolbar,
  appLayoutZIndex,
];
export const areaChart: TestSuite[] = [areaChartSuite];
export const attributeEditor: TestSuite[] = [attributeEditorSuite];
export const autosuggest: TestSuite[] = [autosuggestSuite];
export const badge: TestSuite[] = [badgeSuite];
export const barChart: TestSuite[] = [barChartSuite];
export const box: TestSuite[] = [boxSuite];
export const breadcrumbGroup: TestSuite[] = [breadcrumbGroupSuite];
export const button: TestSuite[] = [buttonSuite];
export const buttonDropdown: TestSuite[] = [buttonDropdownSuite];
export const buttonGroup: TestSuite[] = [buttonGroupSuite];
export const cards: TestSuite[] = [cardsSuite];
export const checkbox: TestSuite[] = [checkboxSuite];
export const codeEditor: TestSuite[] = [codeEditorSuite];
export const collectionPreferences: TestSuite[] = [collectionPreferencesSuite];
export const columnLayout: TestSuite[] = [columnLayoutSuite];
export const container: TestSuite[] = [containerSuite, containerStickySuite];
export const contentLayout: TestSuite[] = [contentLayoutSuite, contentLayoutPermutationsSuite];
export const copyToClipboard: TestSuite[] = [copyToClipboardSuite];
export const dateInput: TestSuite[] = [dateInputSuite];
export const datePicker: TestSuite[] = [datePickerSuite];
export const dateRangePicker: TestSuite[] = [dateRangePickerSuite];
export const expandableSection: TestSuite[] = [expandableSectionSuite];
export const flashbar: TestSuite[] = [flashbarSuite, flashbarStackedSuite];
export const form: TestSuite[] = [formSuite];
export const formField: TestSuite[] = [formFieldSuite];
export const header: TestSuite[] = [headerSuite];
export const input: TestSuite[] = [inputSuite];
export const itemCard: TestSuite[] = [itemCardSuite];

export const allSuites: TestSuite[] = [
  ...actionCard,
  ...alert,
  ...appLayout,
  ...areaChart,
  ...attributeEditor,
  ...autosuggest,
  ...badge,
  ...barChart,
  ...box,
  ...breadcrumbGroup,
  ...button,
  ...buttonDropdown,
  ...buttonGroup,
  ...cards,
  ...checkbox,
  ...codeEditor,
  ...collectionPreferences,
  ...columnLayout,
  ...container,
  ...contentLayout,
  ...copyToClipboard,
  ...dateInput,
  ...datePicker,
  ...dateRangePicker,
  ...expandableSection,
  ...flashbar,
  ...form,
  ...formField,
  ...header,
  ...input,
  ...itemCard,
];
