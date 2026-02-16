// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../../utils/interfaces.js';
import { expandMetadata } from '../../utils/metadata.js';
import visualRefreshMetadata from '../../visual-refresh/metadata/index.js';
import borders from './borders.js';
import colorPalette from './color-palette.js';
import colors from './colors.js';
import typography from './typography.js';

// Core theme extends visual-refresh metadata with its own overrides
const metadata: StyleDictionary.MetadataIndex = expandMetadata(
  merge({}, visualRefreshMetadata, borders, colorPalette, colors, typography)
);

export default metadata;
