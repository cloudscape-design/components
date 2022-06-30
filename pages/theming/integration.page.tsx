// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import { Button, Link, SpaceBetween } from '~components';
import { Theme, applyTheme } from '~components/theming';
import * as Tokens from '~design-tokens';
import ScreenshotArea from '../utils/screenshot-area';

const colorGreen900 = '#172211';
const colorGreen700 = '#1a520f';
const colorGreen600 = '#1d8102';
const colorGreen500 = '#00a1c9';

const theme: Theme = {
  tokens: {
    colorBackgroundButtonPrimaryDefault: {
      light: colorGreen600,
      dark: colorGreen500,
    },
    colorBackgroundButtonPrimaryHover: {
      light: colorGreen700,
      dark: colorGreen600,
    },
    colorBackgroundButtonPrimaryActive: {
      light: colorGreen900,
      dark: colorGreen500,
    },
    colorTextLinkDefault: {
      light: 'rgba(255, 0, 0, 1)',
      dark: 'rgba(255, 165, 0, 1)',
    },
  },
};

export default function () {
  const [themed, setThemed] = useState<boolean>(false);

  useEffect(() => {
    let reset: () => void = () => {};
    if (themed) {
      const result = applyTheme({ theme });
      reset = result.reset;
    }
    return reset;
  }, [themed]);
  return (
    <div style={{ padding: 15 }}>
      <h1>Theming Integration Page</h1>
      <p>Only for internal theme</p>
      <button data-testid="change-theme" onClick={() => setThemed(!themed)}>
        Change Theme
      </button>
      <ScreenshotArea>
        <SpaceBetween direction="vertical" size="m">
          <Button variant="primary">Primary Button</Button>
          <Link>Link</Link>
          <a data-testid="element-color-text-link-default" style={{ color: Tokens.colorTextLinkDefault }}>
            Anchor using colorTextLinkDefault
          </a>
        </SpaceBetween>
      </ScreenshotArea>
    </div>
  );
}
