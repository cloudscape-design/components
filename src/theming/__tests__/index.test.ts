// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Theme, applyTheme, generateThemeStylesheet } from '../../../lib/components/theming';

const findStyleNode = () => document.head.querySelector('style');
const attachNonceMetaElement = (nonce: string) => {
  const metaNode = document.createElement('meta');
  metaNode.name = 'nonce';
  metaNode.content = nonce;
  document.head.appendChild(metaNode);
};

const theme: Theme = {
  tokens: {
    colorTextAccent: {
      light: 'red',
      dark: 'orange',
    },
  },
};

test('applyTheme appends and removes awsui style node', () => {
  const { reset } = applyTheme({ theme });

  expect(findStyleNode()).not.toBeNull();

  reset();

  expect(findStyleNode()).toBeNull();
});

test('applyTheme respects nonce meta elements', () => {
  const nonce = 'fgw4g5saf';
  attachNonceMetaElement(nonce);

  applyTheme({ theme });

  expect(findStyleNode()).toHaveAttribute('nonce', nonce);
});

test('generateThemeStylesheet returns the theme override stylesheet as a string', () => {
  expect(generateThemeStylesheet({ theme })).toEqual(expect.any(String));
});
