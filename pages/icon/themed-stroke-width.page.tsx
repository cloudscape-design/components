// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Box from '~components/box';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import TextContent from '~components/text-content';
import { applyTheme, Theme } from '~components/theming';

import ScreenshotArea from '../utils/screenshot-area';

const theme: Theme = {
  tokens: {
    borderWidthIconSmall: '1px',
    borderWidthIconNormal: '1px',
    borderWidthIconMedium: '1px',
    borderWidthIconBig: '1.5px',
    borderWidthIconLarge: '2px',
  },
};

export default function () {
  const [themed, setThemed] = useState<boolean>(false);

  useEffect(() => {
    let reset: () => void = () => {};
    const result = applyTheme({
      theme: themed ? theme : { tokens: {} },
      baseThemeId: 'visual-refresh',
    });
    reset = result.reset;
    return reset;
  }, [themed]);

  return (
    <div style={{ padding: 15 }}>
      <h1>Themed Icon Stroke Width</h1>
      <label>
        <input
          type="checkbox"
          data-testid="apply-theme"
          checked={themed}
          onChange={evt => setThemed(evt.currentTarget.checked)}
        />
        <span style={{ marginInlineStart: 5 }}>Apply custom stroke widths (thinner icons)</span>
      </label>
      <ScreenshotArea>
        <SpaceBetween size="l" direction="vertical">
          <Box fontSize="display-l" fontWeight="light">
            <Icon name="settings" size="large" /> Display large (48px, 4px→2px)
          </Box>
          <TextContent>
            <h1>
              <Icon name="settings" size="big" /> Heading 1 (32px, 3px→1.5px)
            </h1>
            <h2>
              <Icon name="settings" size="medium" /> Heading 2 (20px, 2px→1px)
            </h2>
            <h3>
              <Icon name="settings" /> Heading 3 (16px, 2px→1px)
            </h3>
            <h4>
              <Icon name="settings" /> Heading 4 (16px, 2px→1px)
            </h4>
            <h5>
              <Icon name="settings" /> Heading 5 (16px, 2px→1px)
            </h5>
            <p>
              <Icon name="settings" /> Paragraph (16px, 2px→1px)
            </p>
            <small>
              <Icon name="settings" size="small" /> Small (16px, 2px→1px)
            </small>
          </TextContent>
        </SpaceBetween>
      </ScreenshotArea>
    </div>
  );
}
