// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { join } from 'path';

import {
  buildThemedComponents as themingCoreBuild,
  generateThemeStylesheet as themingCoreGenerateThemeStylesheet,
} from '@cloudscape-design/theming-build';

import { preset, TypedOverride } from './internal/template/internal/generated/theming/index.cjs';

const internalDir = join(__dirname, './internal');
const scssDir = join(internalDir, './scss');
const templateDir = join(internalDir, './template');
const designTokensTemplateDir = join(internalDir, './template-tokens');

const VISUAL_REFRESH_THEME_ID = 'visual-refresh';

export type Theme = TypedOverride;
export interface BuildThemedComponentsParams {
  theme: Theme;
  outputDir: string;
  baseThemeId?: string;
}

export function buildThemedComponents({
  theme,
  outputDir,
  baseThemeId,
  ...rest
}: BuildThemedComponentsParams): Promise<void> {
  // Website-only escape hatch to avoid token hash collisions in generated output.
  const version = (rest as any).__tokenHashSeed;
  return themingCoreBuild({
    override: theme,
    preset: {
      ...preset,
      ...(version
        ? {
            tokenVersions: Object.fromEntries(Object.entries(preset.propertiesMap).map(([token]) => [token, version])),
          }
        : {}),
    },
    baseThemeId,
    componentsOutputDir: join(outputDir, 'components'),
    designTokensOutputDir: join(outputDir, 'design-tokens'),
    templateDir,
    designTokensTemplateDir,
    scssDir,
  });
}

export interface GenerateThemeStylesheetParams {
  theme: Theme;
  selector: string;
}

export function generateThemeStylesheet({ theme, selector }: GenerateThemeStylesheetParams): string {
  return themingCoreGenerateThemeStylesheet({
    override: theme,
    selector,
    preset,
    // Current theming builder relies on tokens being relative to a base theme for
    // all non-themeable tokens, which is currently visual refresh.
    baseThemeId: VISUAL_REFRESH_THEME_ID,
  });
}
