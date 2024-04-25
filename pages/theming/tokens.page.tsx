// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import { Theme, applyTheme, generateThemeStylesheet } from '~components/theming';
import * as Tokens from '~design-tokens';
import { preset } from '~components/internal/generated/theming';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';

const isColor: (token: string) => boolean = token => token.slice(0, 5) === 'color';
const themeableColorTokens = preset.themeable.filter(isColor);
const theme: Theme = {
  tokens: themeableColorTokens.reduce((acc: Theme['tokens'], token: string) => {
    (acc as any)[token] = {
      light: '#23850b',
      dark: '#0d8193',
    };
    return acc;
  }, {} as Theme['tokens']),
};

const tiles: Tile[] = themeableColorTokens
  .filter((token: string) => preset.exposed.indexOf(token) > -1) // Only exists for pre-release of theming. Normally every themeable token should be exposed
  .map((token: string) => ({ text: token, color: Tokens[token as keyof typeof Tokens] }));

export default function () {
  const [themed, setThemed] = useState<boolean>(false);
  const [secondaryTheme, setSecondaryTheme] = useState<boolean>(false);
  const [themeMethod, setThemeMethod] = useState<'applyTheme' | 'generateThemeStylesheet'>('applyTheme');

  useEffect(() => {
    let reset: () => void = () => {};
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
    return reset;
  }, [themed, secondaryTheme, themeMethod]);
  return (
    <div style={{ padding: 15, backgroundColor: 'white' }}>
      <h1 className={styles.title}>Color Token Mosaik</h1>
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
        <Mosaik tiles={tiles} />
      </ScreenshotArea>
    </div>
  );
}

interface Tile {
  text: string;
  color: string;
}

const Mosaik = ({ tiles }: { tiles: Tile[] }) => {
  return (
    <div className={styles.mosaik}>
      {tiles.map(tile => (
        <Tile tile={tile} key={tile.text} />
      ))}
    </div>
  );
};

const Tile = ({ tile }: { tile: Tile }) => (
  <div className={styles.tile} style={{ backgroundColor: tile.color }}>
    {tile.text}
  </div>
);
