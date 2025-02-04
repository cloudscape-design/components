// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import mapValues from 'lodash/mapValues.js';
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../../utils/interfaces.js';
import { expandMetadata } from '../../utils/metadata.js';
import theme from '../index.js';
import borders from './borders.js';
import colorCharts from './color-charts.js';
import colorPalette from './color-palette.js';
import colorSeverity from './color-severity.js';
import colors from './colors.js';
import motion from './motion.js';
import shadows from './shadows.js';
import sizes from './sizes.js';
import spacing from './spacing.js';
import typography from './typography.js';

const allTokens = mapValues(theme.tokens, () => ({}));

const metadata: StyleDictionary.MetadataIndex = expandMetadata(
  merge(
    {},
    allTokens,
    borders,
    colorCharts,
    colorSeverity,
    colorPalette,
    colors,
    motion,
    shadows,
    sizes,
    spacing,
    typography
  )
);
export default metadata;
