// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CodeEditorI18n {
  i18nStrings: {
    cursorPosition: ({ row, column }: { row: string; column: string }) => string;
    editorGroupAriaLabel: string;
    errorsTab: string;
    errorState: string;
    errorStateRecovery: string;
    loadingState: string;
    paneCloseButtonAriaLabel: string;
    preferencesButtonAriaLabel: string;
    preferencesModalCancel: string;
    preferencesModalConfirm: string;
    preferencesModalDarkThemes: string;
    preferencesModalHeader: string;
    preferencesModalLightThemes: string;
    preferencesModalTheme: string;
    preferencesModalWrapLines: string;
    statusBarGroupAriaLabel: string;
    warningsTab: string;
  };
}
