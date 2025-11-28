// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import mapValues from 'lodash/mapValues.js';
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../../utils/interfaces.js';
import { expandMetadata } from '../../utils/metadata.js';
import theme from '../index.js';
import borders from './borders.js';

const allTokens = mapValues(theme.tokens, () => ({}));

const metadata: StyleDictionary.MetadataIndex = expandMetadata(merge({}, allTokens, borders));

export default metadata;
