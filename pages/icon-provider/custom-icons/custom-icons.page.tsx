// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Button from '~components/button';
import Icon from '~components/icon';
import { defineIcons, IconMap } from '~components/icon-provider';
import IconProvider from '~components/icon-provider';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../../utils/screenshot-area';

const ROCKET_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable={false}>
    <g transform="rotate(-45 8 8)">
      <path d="M8 1c-2 2-3 4.5-3 7v2l-2 2h4v3l1 1 1-1v-3h4l-2-2V8c0-2.5-1-5-3-7Z" />
    </g>
  </svg>
);

const ZAP_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable={false}>
    <polygon points="9,1 4,9 8,9 7,15 12,7 8,7" />
  </svg>
);

const customIcons = defineIcons({
  rocket: ROCKET_SVG,
  zap: ZAP_SVG,
});

// Module augmentation: makes "rocket" and "zap" type-safe icon names
// across all Cloudscape components. Isolated to this tsconfig project
// so it doesn't leak into other pages.
declare module '~components/icon-provider' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- needed for module augmentation to work correctly.
  interface IconRegistry extends IconMap<typeof customIcons> {}
}

export default function CustomIconsPage() {
  return (
    <article>
      <h1>Custom Icon Registration</h1>
      <ScreenshotArea>
        <IconProvider icons={customIcons}>
          <SpaceBetween size="l">
            {/* Custom icons rendered via <Icon> */}
            <div data-testid="custom-icons">
              <SpaceBetween direction="horizontal" size="s">
                <Icon data-testid="icon-rocket" name="rocket" />
                <Icon data-testid="icon-zap" name="zap" />
              </SpaceBetween>
            </div>

            {/* Custom icons used in Button */}
            <div data-testid="custom-icon-buttons">
              <SpaceBetween direction="horizontal" size="s">
                <Button data-testid="button-rocket" iconName="rocket">
                  Launch
                </Button>
                <Button data-testid="button-zap" iconName="zap" variant="primary">
                  Energize
                </Button>
              </SpaceBetween>
            </div>

            {/* Built-in icons still work alongside custom ones */}
            <div data-testid="builtin-icons">
              <SpaceBetween direction="horizontal" size="s">
                <Icon data-testid="icon-add-plus" name="add-plus" />
                <Icon data-testid="icon-settings" name="settings" />
                <Button data-testid="button-search" iconName="search">
                  Search
                </Button>
              </SpaceBetween>
            </div>

            {/* Nested provider: custom icons inherit */}
            <div data-testid="nested-provider">
              <IconProvider icons={{ close: ZAP_SVG }}>
                <SpaceBetween direction="horizontal" size="s">
                  <Icon data-testid="nested-icon-rocket" name="rocket" />
                  <Icon data-testid="nested-icon-close" name="close" />
                </SpaceBetween>
              </IconProvider>
            </div>

            {/* Null reset: custom icons disappear, built-in icons restored */}
            <div data-testid="null-reset">
              <IconProvider icons={null}>
                <SpaceBetween direction="horizontal" size="s">
                  <Icon data-testid="reset-icon-rocket" name="rocket" />
                  <Icon data-testid="reset-icon-close" name="close" />
                </SpaceBetween>
              </IconProvider>
            </div>
          </SpaceBetween>
        </IconProvider>
      </ScreenshotArea>
    </article>
  );
}
