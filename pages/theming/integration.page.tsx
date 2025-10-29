// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import { Button, Container, Header, Link, Multiselect, SpaceBetween, Table } from '~components';
import { applyTheme, generateThemeStylesheet, Theme } from '~components/theming';
import * as Tokens from '~design-tokens';

import AppContext from '../app/app-context';
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
      light: 'rgba(220, 24, 24, 1)',
      dark: 'rgba(255, 165, 0, 1)',
    },
  },
};

const sharedItems = [
  {
    alt: 'First',
    description: 'This is the first item',
    label: 'Item 1',
    value: '1',
  },
  {
    alt: 'Second',
    description: 'This is the second item',
    label: 'Item 2',
    value: '2',
  },
  {
    alt: 'Third',
    label: 'Item 3',
    value: '3',
  },
  {
    alt: 'Fourth',
    description: 'This is the fourth item',
    label: 'Item 4',
    value: '4',
  },
  {
    description: 'This is the fifth item with a longer description',
    label: 'Item 5',
    value: '5',
  },
];

export default function () {
  const { urlParams } = useContext(AppContext);
  const [themed, setThemed] = useState<boolean>(false);
  const [secondaryTheme, setSecondaryTheme] = useState<boolean>(urlParams.visualRefresh);
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
        <span style={{ marginInlineStart: 5 }}>Apply theme</span>
      </label>
      <label>
        <input
          style={{ marginInlineStart: 15 }}
          type="checkbox"
          data-testid="set-secondary"
          checked={secondaryTheme}
          onChange={evt => setSecondaryTheme(evt.currentTarget.checked)}
        />
        <span style={{ marginInlineStart: 5 }}>Secondary theme</span>
      </label>
      <label>
        <input
          style={{ marginInlineStart: 15 }}
          type="checkbox"
          data-testid="change-theme-method"
          checked={themeMethod === 'applyTheme'}
          onChange={evt => setThemeMethod(evt.currentTarget.checked ? 'applyTheme' : 'generateThemeStylesheet')}
        />
        <span style={{ marginInlineStart: 5 }}>Use applyTheme</span>
      </label>
      <ScreenshotArea>
        <SpaceBetween size="xl" direction="horizontal">
          <SpaceBetween direction="vertical" size="m">
            <Button variant="primary">Primary button</Button>
            <Button variant="normal">Normal button</Button>
            <Link href="#">Link</Link>
            <a data-testid="element-color-text-link-default" style={{ color: Tokens.colorTextLinkDefault }}>
              Anchor using colorTextLinkDefault
            </a>
            <Button
              variant="primary"
              style={{
                root: {
                  background: { default: Tokens.colorBackgroundButtonNormalActive },
                  borderRadius: '4px',
                  color: { default: `light-dark(darkblue, aliceblue)` },
                },
              }}
            >
              <span style={{ fontSize: '16px' }}>Styled button</span>
            </Button>
          </SpaceBetween>
          <Table
            selectionType="multi"
            selectedItems={[sharedItems[1]]}
            stripedRows={true}
            ariaLabels={{
              selectionGroupLabel: 'Items selection',
              allItemsSelectionLabel: () => 'select all',
              itemSelectionLabel: (_, item) => item.label,
            }}
            columnDefinitions={[
              {
                id: 'variable',
                header: 'Variable name',
                cell: item => <Link href="#">{item.label || '-'}</Link>,
                sortingField: 'label',
                isRowHeader: true,
              },
              {
                id: 'alt',
                header: 'Text value',
                cell: item => item.alt || '-',
                sortingField: 'alt',
              },
              {
                id: 'description',
                header: 'Description',
                cell: item => item.description || '-',
              },
            ]}
            items={sharedItems}
          />
          <Container
            header={
              <Header variant="h2" description="Container description">
                Container title
              </Header>
            }
          >
            <Multiselect
              selectedOptions={[sharedItems[3]]}
              options={sharedItems}
              deselectAriaLabel={() => 'Remove'}
              placeholder="Choose options"
            />
          </Container>
        </SpaceBetween>
      </ScreenshotArea>
    </div>
  );
}
