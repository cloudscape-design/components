// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const SSL_CERTIFICATE_OPTIONS = [
  {
    label: 'Default CloudFront SSL/TLS certificate',
    value: 'default',
    description: 'Provides HTTPS or HTTP access to your content using a CloudFront domain name.',
  },
  {
    label: 'Custom SSL/TLS certificate (example.com)',
    value: 'custom',
    description: 'Grants access by using an alternate domain name, such as https://www.example.com/.',
  },
];

export const SUPPORTED_HTTP_VERSIONS_OPTIONS = [
  { label: 'HTTP 2', value: 'http2' },
  { label: 'HTTP 1', value: 'http1' },
];

export const VIEWER_PROTOCOL_POLICY_OPTIONS = [
  { label: 'HTTP and HTTPS', value: '0' },
  { label: 'Redirect HTTP to HTTPS', value: '1' },
  { label: 'HTTPS only', value: '2' },
];

export const ALLOWED_HTTP_METHOD_OPTIONS = [
  { label: 'GET, HEAD', value: '0' },
  { label: 'GET, HEAD, OPTIONS', value: '1' },
  { label: 'GET, HEAD, OPTIONS, PUT, POST, PATCH', value: '2' },
];

export const FORWARD_HEADER_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Allow list', value: 'allowlist' },
  { label: 'All', value: 'all' },
];

export const COOKIE_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Allow list', value: 'allowlist' },
  { label: 'All', value: 'all' },
];

export const QUERY_STRING_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Allow list', value: 'allowlist' },
  { label: 'All', value: 'all' },
];

export const CURRENT_COMPRESSION_OPTIONS = [
  { label: 'Manual', value: 'manual' },
  { label: 'Automatic', value: 'automatic' },
];

export const CODE_EDITOR_I18N_STRINGS = {
  loadingState: 'Loading code editor',
  errorState: 'There was an error loading the code editor.',
  errorStateRecovery: 'Retry',

  editorGroupAriaLabel: 'Code editor',
  statusBarGroupAriaLabel: 'Status bar',

  cursorPosition: (row: string, column: string) => `Ln ${row}, Col ${column}`,
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
};
