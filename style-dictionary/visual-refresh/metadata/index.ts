// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';

import { StyleDictionary } from '../../utils/interfaces';
import { expandMetadata } from '../../utils/metadata';
import theme from '../index';
import borders from './borders';
import colorCharts from './color-charts';
import colorPalette from './color-palette';
import colors from './colors';
import motion from './motion';
import shadows from './shadows';
import sizes from './sizes';
import spacing from './spacing';
import typography from './typography';

const allTokens = mapValues(theme.tokens, () => ({}));

const metadata: StyleDictionary.MetadataIndex = expandMetadata(
  merge({}, allTokens, borders, colorCharts, colorPalette, colors, motion, shadows, sizes, spacing, typography)
);
export default metadata;
