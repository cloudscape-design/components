// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { join } from 'path';
import { buildThemedComponents as themingCoreBuild } from '@cloudscape-design/theming-build';
import { preset, TypedOverride } from './internal/template/internal/generated/theming/index.cjs';

const internalDir = join(__dirname, './internal');
const scssDir = join(internalDir, './scss');
const templateDir = join(internalDir, './template');
const designTokensTemplateDir = join(internalDir, './template-tokens');

export type Theme = TypedOverride;
export interface BuildThemedComponentsParams {
  theme: Theme;
  outputDir: string;
  baseThemeId?: string;
}

export function buildThemedComponents({ theme, outputDir, baseThemeId }: BuildThemedComponentsParams): Promise<void> {
  return themingCoreBuild({
    override: theme,
    preset,
    baseThemeId,
    componentsOutputDir: join(outputDir, 'components'),
    designTokensOutputDir: join(outputDir, 'design-tokens'),
    templateDir,
    designTokensTemplateDir,
    scssDir,
  });
}
