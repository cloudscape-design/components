// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import classicTokensDefinitions from '../../lib/components-definitions/styles/tokens-classic.json';
import visualRefreshTokensDefinitions from '../../lib/components-definitions/styles/tokens-visual-refresh.json';

const extractIformation = (definitions: any) =>
  definitions.map((token: any) => ({
    name: token.name,
    description: token.description,
    themeable: !!token.themeable,
  }));

test('Do not inadvertently publish design tokens, change their description, or make them themeable - classic', () => {
  expect(extractIformation(classicTokensDefinitions)).toMatchSnapshot();
});
test('Do not inadvertently publish design tokens, change their description, or make them themeable - visual-refresh', () => {
  expect(extractIformation(visualRefreshTokensDefinitions)).toMatchSnapshot();
});
