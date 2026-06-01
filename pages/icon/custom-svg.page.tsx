// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const sizes = ['small', 'normal', 'big', 'large'] as const;
const variants = ['normal', 'disabled', 'error', 'inverted', 'link', 'subtle', 'success', 'warning'] as const;

export default function IconScenario() {
  return (
    <ScreenshotArea>
      <h1>Custom icons with SVGs</h1>
      <h2>Custom icons with SVGs inheriting styles</h2>
      <SpaceBetween size="s">
        {sizes.map(size => (
          <SpaceBetween direction="horizontal" size="s" key={size}>
            {variants.map(variant => (
              <div style={{ backgroundColor: variant === 'inverted' ? 'black' : 'transparent' }} key={variant}>
                <Icon
                  svg={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
                      <circle cx="8" cy="8" r="7" />
                      <circle cx="8" cy="8" r="3" />
                    </svg>
                  }
                  size={size}
                  variant={variant}
                />
              </div>
            ))}
          </SpaceBetween>
        ))}
      </SpaceBetween>
      <h2>Custom icons with SVGs not inheriting styles</h2>

      <SpaceBetween direction="horizontal" size="s">
        {sizes.map(size => (
          <Icon
            key={size}
            variant="error"
            svg={
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
                  <circle cx="8" cy="8" r="7" strokeWidth="2" stroke="currentColor" fill="none" />
                  <circle cx="8" cy="8" r="3" />
                </svg>
              </span>
            }
            size={size}
          />
        ))}
      </SpaceBetween>
    </ScreenshotArea>
  );
}
