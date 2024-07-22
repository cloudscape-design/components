// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GlobalValue, ModeValue, TokenCategory } from '@cloudscape-design/theming-build';

import {
  BordersTokenName,
  ColorChartsTokenName,
  ColorPaletteTokenName,
  ColorScopeTokenName,
  ColorsTokenName,
  DensityScopeTokenName,
  GlobalScopeTokenName,
  MotionScopeTokenName,
  MotionTokenName,
  ShadowsTokenName,
  SizesTokenName,
  SpacingTokenName,
  TokenName,
  TypographyTokenName,
} from './token-names';

export namespace StyleDictionary {
  export type GlobalEntry = GlobalValue;

  export type ModeIdentifier = 'color' | 'density' | 'motion';

  export type ExpandedColorModeEntry = Partial<ModeValue<'light' | 'dark'>>;
  export type ExpandedDensityModeEntry = Partial<ModeValue<'comfortable' | 'compact'>>;
  export type ExpandedMotionModeEntry = Partial<ModeValue<'default' | 'disabled'>>;

  export type ColorModeEntry = ExpandedColorModeEntry | GlobalEntry;
  export type DensityModeEntry = ExpandedDensityModeEntry | GlobalEntry;
  export type MotionModeEntry = ExpandedMotionModeEntry | GlobalEntry;

  export type GlobalScopeDictionary = Partial<TokenCategory<GlobalScopeTokenName, GlobalValue>>;

  export type ModeScopeDictionary = Partial<TokenCategory<ColorScopeTokenName, ColorModeEntry>>;
  export type DensityScopeDictionary = Partial<TokenCategory<DensityScopeTokenName, DensityModeEntry>>;
  export type MotionScopeDictionary = Partial<TokenCategory<MotionScopeTokenName, MotionModeEntry>>;

  export type ExpandedGlobalScopeDictionary = Partial<TokenCategory<GlobalScopeTokenName, GlobalEntry>>;
  export type ExpandedColorScopeDictionary = Partial<TokenCategory<ColorScopeTokenName, ExpandedColorModeEntry>>;
  export type ExpandedDensityScopeDictionary = Partial<TokenCategory<DensityScopeTokenName, ExpandedDensityModeEntry>>;

  export type ExpandedMotionScopeDictionary = Partial<TokenCategory<MotionScopeTokenName, ExpandedMotionModeEntry>>;
  export type ColorPaletteDictionary = Partial<TokenCategory<ColorPaletteTokenName, GlobalEntry>>;
  export type TypographyDictionary = Partial<TokenCategory<TypographyTokenName, GlobalEntry>>;
  export type BordersDictionary = Partial<TokenCategory<BordersTokenName, GlobalEntry>>;
  export type ColorChartsDictionary = Partial<TokenCategory<ColorChartsTokenName, ColorModeEntry>>;
  export type ColorsDictionary = Partial<TokenCategory<ColorsTokenName, ColorModeEntry>>;
  export type ShadowsDictionary = Partial<TokenCategory<ShadowsTokenName, ColorModeEntry>>;

  export type MotionDictionary = Partial<TokenCategory<MotionTokenName, MotionModeEntry>>;
  export type SizesDictionary = Partial<TokenCategory<SizesTokenName, DensityModeEntry>>;
  export type SpacingDictionary = Partial<TokenCategory<SpacingTokenName, DensityModeEntry>>;

  export interface Metadata {
    description?: string;
    public?: boolean;
    themeable?: boolean;
    sassName?: string;
    visualRefreshOnly?: boolean;
  }
  export type TokenIndex<T> = {
    [key in TokenName]?: T;
  };

  export type MetadataIndex = TokenIndex<Metadata>;
}
