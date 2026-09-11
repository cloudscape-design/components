// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReferenceTokens } from '@cloudscape-design/theming-build';

import { StyleDictionary } from '../utils/interfaces.js';
import { referenceTokens as vrReferenceTokens, tokens as vrTokens } from '../visual-refresh/color-palette.js';

const referenceTokens: ReferenceTokens = {
  ...vrReferenceTokens,
  color: {
    ...vrReferenceTokens.color,
    primary: { seed: '#1b232d' },
  },
};

export const tokens = vrTokens;
export const mode: StyleDictionary.ModeIdentifier = 'color';
export { referenceTokens };
