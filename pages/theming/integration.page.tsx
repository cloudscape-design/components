// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import {
  Button,
  Checkbox,
  Container,
  FormField,
  Header,
  Link,
  Multiselect,
  SpaceBetween,
  Table,
  Textarea,
} from '~components';
import { applyTheme, generateFullThemeStylesheet, generateThemeStylesheet, Theme } from '~components/theming';
import * as Tokens from '~design-tokens';

import AppContext from '../app/app-context';
import { SimplePage } from '../app/templates';
import pink from './theme-pink';

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

let resetApplyTheme: null | (() => void) = null;
let styleNode: null | HTMLStyleElement = null;

function applyCss(css: null | string) {
  if (styleNode) {
    styleNode.remove();
    styleNode = null;
  }
  if (css) {
    styleNode = document.createElement('style');
    styleNode.appendChild(document.createTextNode(css));
    document.head.appendChild(styleNode);
  }
}

export default function () {
  const { urlParams } = useContext(AppContext);
  const [secondaryTheme, setSecondaryTheme] = useState<boolean>(urlParams.visualRefresh);
  const fullThemeStylesheet = generateFullThemeStylesheet({ theme: pink });
  const baseThemeId = secondaryTheme ? 'visual-refresh' : undefined;
  const callApplyTheme = () => (resetApplyTheme = applyTheme({ theme, baseThemeId }).reset);
  const callGenerateThemeStylesheet = () => applyCss(generateThemeStylesheet({ theme, baseThemeId }));
  const callGenerateFullThemeStylesheet = () => applyCss(fullThemeStylesheet);
  const reset = () => {
    applyCss(null);
    resetApplyTheme?.();
  };
  return (
    <SimplePage
      title="Theming Integration Page"
      subtitle="Demonstrates use of theming utils"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs" direction="horizontal" alignItems="center">
          <Checkbox checked={secondaryTheme} onChange={({ detail }) => setSecondaryTheme(detail.checked)}>
            Use secondary theme
          </Checkbox>
          <Button onClick={callApplyTheme}>Use applyTheme</Button>
          <Button onClick={callGenerateThemeStylesheet}>Use generateThemeStylesheet</Button>
          <Button onClick={callGenerateFullThemeStylesheet}>Use generateFullThemeStylesheet</Button>
          <Button onClick={reset}>Reset</Button>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="m">
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

        <FormField label="CSS generated with generateFullThemeStylesheet">
          <Textarea readOnly={true} rows={20} value={fullThemeStylesheet} />
        </FormField>
      </SpaceBetween>
    </SimplePage>
  );
}
