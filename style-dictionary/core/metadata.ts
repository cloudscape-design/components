// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// `core`'s token categories (see index.ts) reuse every visual-refresh module verbatim except
// color-palette, so its public/themeable metadata is identical to visual-refresh's: core's own
// color-palette.ts computes the full raw brand palette (../core/palette-values.js), but — same as
// visual-refresh — only the curated subset visual-refresh/color-palette.ts already picks out is
// exposed as public/themeable tokens.
import metadata from '../visual-refresh/metadata/index.js';

export default metadata;
