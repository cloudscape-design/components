// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export const SUPPORTED_HTTP_VERSIONS_OPTIONS = [
  { label: 'HTTP 2', value: 'http2' },
  { label: 'HTTP 1', value: 'http1' },
];

export const VIEWER_PROTOCOL_POLICY_OPTIONS = [
  { label: 'HTTP and HTTPS', value: '0' },
  { label: 'Redirect HTTP to HTTPS', value: '1' },
  { label: 'HTTPS only', value: '2' },
];

export const EXISTING_ORIGIN_REQUEST_POLICIES = [
  { label: 'Policy 1', value: '0' },
  { label: 'Policy 2', value: '1' },
  { label: 'Policy 3', value: '2' },
];

export const ORIGIN_REQUEST_HEADER_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'All', value: 'all' },
];

export const ORIGIN_REQUEST_QUERY_STRING_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'All', value: 'all' },
];

export const ORIGIN_REQUEST_COOKIE_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'All', value: 'all' },
];

export const EXISTING_CACHE_POLICIES = [
  { label: 'Policy 1', value: '0' },
  { label: 'Policy 2', value: '1' },
  { label: 'Policy 3', value: '2' },
];

export const CUSTOM_SSL_CERTIFICATES = [
  { label: 'Certificate 1', value: '0' },
  { label: 'Certificate 2', value: '1' },
  { label: 'Certificate 3', value: '2' },
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

export const ENCRYPTION_KEY_OPTIONS = [
  { label: 'aws/rds', value: 'aws/rds', description: 'Default encryption key' },
  { label: 'aws/rds/aaa', value: 'aws/rds/aaa' },
  { label: 'aws/rds/bbb', value: 'aws/rds/bbb' },
  { label: 'aws/rds/ccc', value: 'aws/rds/ccc' },
];

export const AVAILABILITY_ZONE_OPTIONS = [
  { label: 'Optimized value', value: 'default', description: 'Availability zone will be assigned automatically' },
  { label: 'us-west-2a', value: 'us-west-2a' },
  { label: 'us-west-2b', value: 'us-west-2b' },
  { label: 'us-west-2c', value: 'us-west-2c' },
];

export const CODE_EDITOR_THEMES = {
  light: [
    'chrome',
    'cloud_editor',
    'clouds',
    'crimson_editor',
    'dawn',
    'dreamweaver',
    'eclipse',
    'github',
    'iplastic',
    'katzenmilch',
    'kuroir',
    'solarized_light',
    'sqlserver',
    'textmate',
    'tomorrow',
    'xcode',
  ],
  dark: [
    'ambiance',
    'chaos',
    'cloud_editor_dark',
    'clouds_midnight',
    'cobalt',
    'dracula',
    'gob',
    'gruvbox',
    'idle_fingers',
    'kr_theme',
    'merbivore_soft',
    'merbivore',
    'mono_industrial',
    'monokai',
    'nord_dark',
    'pastel_on_dark',
    'solarized_dark',
    'terminal',
    'tomorrow_night_blue',
    'tomorrow_night_bright',
    'tomorrow_night_eighties',
    'tomorrow_night',
    'twilight',
    'vibrant_ink',
  ],
};
