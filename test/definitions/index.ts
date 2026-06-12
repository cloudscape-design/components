// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from './types';
export { TestSuite, TestDefinition, ScreenshotType, ScreenshotTestConfiguration } from './types';
import actionCard from './visual/action-card';
import alert from './visual/alert';
import appLayout from './visual/app-layout';
import appLayoutContentPaddings from './visual/app-layout-content-paddings';
import appLayoutDrawers from './visual/app-layout-drawers';
import appLayoutFlashbar from './visual/app-layout-flashbar';
import appLayoutHeader from './visual/app-layout-header';
import appLayoutMulti from './visual/app-layout-multi';
import appLayoutResponsive600 from './visual/app-layout-responsive-600';
import appLayoutResponsive1280 from './visual/app-layout-responsive-1280';
import appLayoutResponsive1400 from './visual/app-layout-responsive-1400';
import appLayoutResponsive1920 from './visual/app-layout-responsive-1920';
import appLayoutResponsive2540 from './visual/app-layout-responsive-2540';
import appLayoutStickyTableHeaderSplitPanel from './visual/app-layout-sticky-table-header-split-panel';
import appLayoutToolbar from './visual/app-layout-toolbar';
import appLayoutZIndex from './visual/app-layout-z-index';
import areaChart from './visual/area-chart';
import attributeEditor from './visual/attribute-editor';
import autosuggest from './visual/autosuggest';
import badge from './visual/badge';
import barChart from './visual/bar-chart';
import box from './visual/box';
import breadcrumbGroup from './visual/breadcrumb-group';
import button from './visual/button';
import buttonDropdown from './visual/button-dropdown';
import buttonGroup from './visual/button-group';
import cards from './visual/cards';
import checkbox from './visual/checkbox';
import codeEditor from './visual/code-editor';
import collectionPreferences from './visual/collection-preferences';
import columnLayout from './visual/column-layout';
import container from './visual/container';
import containerSticky from './visual/container-sticky';
import contentLayout from './visual/content-layout';
import contentLayoutPermutations from './visual/content-layout-permutations';
import copyToClipboard from './visual/copy-to-clipboard';
import dateInput from './visual/date-input';
import datePicker from './visual/date-picker';
import dateRangePicker from './visual/date-range-picker';
import divider from './visual/divider';
import drawer from './visual/drawer';
import dropdown from './visual/dropdown';
import expandableSection from './visual/expandable-section';
import fileDropzone from './visual/file-dropzone';
import fileInput from './visual/file-input';
import fileTokenGroup from './visual/file-token-group';
import fileUpload from './visual/file-upload';
import flashbar from './visual/flashbar';
import flashbarStacked from './visual/flashbar-stacked';
import form from './visual/form';
import formField from './visual/form-field';
import grid from './visual/grid';
import header from './visual/header';
import helpPanel from './visual/help-panel';
import icon from './visual/icon';
import input from './visual/input';
import itemCard from './visual/item-card';
import keyValuePairs from './visual/key-value-pairs';
import lineChart from './visual/line-chart';
import link from './visual/link';
import list from './visual/list';
import mixedLineBarChart from './visual/mixed-line-bar-chart';
import modal from './visual/modal';
import multiselect from './visual/multiselect';
import pagination from './visual/pagination';
import pieChart from './visual/pie-chart';
import popover from './visual/popover';
import progressBar from './visual/progress-bar';
import promptInput from './visual/prompt-input';
import propertyFilter from './visual/property-filter';
import radioButton from './visual/radio-button';
import radioGroup from './visual/radio-group';
import s3ResourceSelector from './visual/s3-resource-selector';
import segmentedControl from './visual/segmented-control';
import select from './visual/select';
import sideNavigation from './visual/side-navigation';
import slider from './visual/slider';
import spaceBetween from './visual/space-between';
import spinner from './visual/spinner';
import splitPanel from './visual/split-panel';
import statusIndicator from './visual/status-indicator';
import steps from './visual/steps';
import table from './visual/table';
import tableCells from './visual/table-cells';
import tableEmbedded from './visual/table-embedded';
import tableInlineEditing from './visual/table-inline-editing';
import tableResizableColumns from './visual/table-resizable-columns';
import tableStickyHeader from './visual/table-sticky-header';
import tableStickyScrollbar from './visual/table-sticky-scrollbar';
import tabs from './visual/tabs';
import tagEditor from './visual/tag-editor';
import textContent from './visual/text-content';
import textFilter from './visual/text-filter';
import textarea from './visual/textarea';
import tiles from './visual/tiles';
import timeInput from './visual/time-input';
import toggle from './visual/toggle';
import toggleButton from './visual/toggle-button';
import tokenGroup from './visual/token-group';
import topNavigation from './visual/top-navigation';
import treeView from './visual/tree-view';
import wizard from './visual/wizard';

export const allSuites: TestSuite[] = [
  actionCard,
  alert,
  appLayout,
  appLayoutContentPaddings,
  appLayoutDrawers,
  appLayoutFlashbar,
  appLayoutHeader,
  appLayoutMulti,
  appLayoutResponsive1280,
  appLayoutResponsive1400,
  appLayoutResponsive1920,
  appLayoutResponsive2540,
  appLayoutResponsive600,
  appLayoutStickyTableHeaderSplitPanel,
  appLayoutToolbar,
  appLayoutZIndex,
  areaChart,
  attributeEditor,
  autosuggest,
  badge,
  barChart,
  box,
  breadcrumbGroup,
  button,
  buttonDropdown,
  buttonGroup,
  cards,
  checkbox,
  codeEditor,
  collectionPreferences,
  columnLayout,
  container,
  containerSticky,
  contentLayout,
  contentLayoutPermutations,
  copyToClipboard,
  dateInput,
  datePicker,
  dateRangePicker,
  divider,
  drawer,
  dropdown,
  expandableSection,
  fileDropzone,
  fileInput,
  fileTokenGroup,
  fileUpload,
  flashbar,
  flashbarStacked,
  form,
  formField,
  grid,
  header,
  helpPanel,
  icon,
  input,
  itemCard,
  keyValuePairs,
  lineChart,
  link,
  list,
  mixedLineBarChart,
  modal,
  multiselect,
  pagination,
  pieChart,
  popover,
  progressBar,
  promptInput,
  propertyFilter,
  radioButton,
  radioGroup,
  s3ResourceSelector,
  segmentedControl,
  select,
  sideNavigation,
  slider,
  spaceBetween,
  spinner,
  splitPanel,
  statusIndicator,
  steps,
  table,
  tableCells,
  tableEmbedded,
  tableInlineEditing,
  tableResizableColumns,
  tableStickyHeader,
  tableStickyScrollbar,
  tabs,
  tagEditor,
  textContent,
  textFilter,
  textarea,
  tiles,
  timeInput,
  toggle,
  toggleButton,
  tokenGroup,
  topNavigation,
  treeView,
  wizard,
];
