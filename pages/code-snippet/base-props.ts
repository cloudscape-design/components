// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CodeEditorProps } from '~components';
import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/dawn.css';
import 'ace-builds/css/theme/tomorrow_night_bright.css';

// supported themes should match imports above
export const themes = { light: ['dawn'], dark: ['tomorrow_night_bright'] };

export const i18nStrings: CodeEditorProps.I18nStrings = {
  loadingState: 'Loading code editor',
  errorState: 'There was an error loading the code editor.',
  errorStateRecovery: 'Retry',

  editorGroupAriaLabel: 'Code editor',
  statusBarGroupAriaLabel: 'Status bar',

  cursorPosition: (row, column) => `Ln ${row}, Col ${column}`,
  errorsTab: 'Errors',
  warningsTab: 'Warnings',
  preferencesButtonAriaLabel: 'Preferences',

  paneCloseButtonAriaLabel: 'Close',

  preferencesModalHeader: 'Preferences',
  preferencesModalCancel: 'Cancel',
  preferencesModalConfirm: 'Confirm',
  preferencesModalWrapLines: 'Wrap lines',
  preferencesModalTheme: 'Theme',
  preferencesModalLightThemes: 'Light themes',
  preferencesModalDarkThemes: 'Dark themes',

  preferencesModalThemeFilteringAriaLabel: 'Filter themes',
  preferencesModalThemeFilteringClearAriaLabel: 'Clear',
  preferencesModalThemeFilteringPlaceholder: 'Filter themes',
};
