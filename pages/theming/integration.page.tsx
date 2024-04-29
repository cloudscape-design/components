// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import { Button, Link, SpaceBetween } from '~components';
import { Theme, applyTheme, generateThemeStylesheet } from '~components/theming';
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
  const [secondaryTheme, setSecondaryTheme] = useState<boolean>(false);
  const [themeMethod, setThemeMethod] = useState<'applyTheme' | 'generateThemeStylesheet'>('applyTheme');

  useEffect(() => {
    let reset: () => void = () => {};
    if (themed) {
      if (themeMethod === 'applyTheme') {
        const result = applyTheme({ theme, baseThemeId: secondaryTheme ? 'visual-refresh' : undefined });
        reset = result.reset;
      } else {
        const stylesheet = generateThemeStylesheet({
          theme,
          baseThemeId: secondaryTheme ? 'visual-refresh' : undefined,
        });

        const styleNode = document.createElement('style');
        styleNode.appendChild(document.createTextNode(stylesheet));
        document.head.appendChild(styleNode);

        reset = () => {
          styleNode.remove();
        };
      }
    }
    return reset;
  }, [themed, secondaryTheme, themeMethod]);
  return (
    <div style={{ padding: 15 }}>
      <h1>Theming Integration Page</h1>
      <p>Only for internal theme</p>
      <label>
        <input
          type="checkbox"
          data-testid="change-theme"
          checked={themed}
          onChange={evt => setThemed(evt.currentTarget.checked)}
        />
        <span style={{ marginLeft: 5 }}>Apply theme</span>
      </label>
      <label>
        <input
          style={{ marginLeft: 15 }}
          type="checkbox"
          data-testid="set-secondary"
          checked={secondaryTheme}
          onChange={evt => setSecondaryTheme(evt.currentTarget.checked)}
        />
        <span style={{ marginLeft: 5 }}>Secondary theme</span>
      </label>
      <label>
        <input
          style={{ marginLeft: 15 }}
          type="checkbox"
          data-testid="change-theme-method"
          checked={themeMethod === 'applyTheme'}
          onChange={evt => setThemeMethod(evt.currentTarget.checked ? 'applyTheme' : 'generateThemeStylesheet')}
        />
        <span style={{ marginLeft: 5 }}>Use applyTheme</span>
      </label>
      <ScreenshotArea>
        <SpaceBetween direction="vertical" size="m">
          <Button variant="primary">Primary Button</Button>
          <Link href="#">Link</Link>
          <a data-testid="element-color-text-link-default" style={{ color: Tokens.colorTextLinkDefault }}>
            Anchor using colorTextLinkDefault
          </a>
        </SpaceBetween>
      </ScreenshotArea>
    </div>
  );
}
