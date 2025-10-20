// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import { TokenGroupProps } from '../../../lib/components/token-group/interfaces.js';
import InternalTokenGroup from '../../../lib/components/token-group/internal';

import tokenSelectors from '../../../lib/components/token/test-classes/styles.selectors.js';
import tokenGroupselectors from '../../../lib/components/token-group/styles.selectors.js';

function renderTokenGroup(props: any) {
  const renderResult = render(
    <InternalTokenGroup alignment="vertical" items={[{ label: 'test' }]} onDismiss={() => {}} {...props} />
  );
  return createWrapper(renderResult.container).findTokenGroup()!;
}

describe('Token Group test utils return expected elements', () => {
  test('legacy token', () => {
    const wrapper = renderTokenGroup({
      renderToken: (item: TokenGroupProps.Item) => (
        <div className={tokenGroupselectors.token}>
          {item.label}
          <button className={tokenGroupselectors['dismiss-button']}>Dismiss</button>
        </div>
      ),
    });

    const legacyTokens = wrapper.findTokens();
    const legacyToken = wrapper.findToken(1);
    const legacyTokenDismiss = wrapper.findToken(1)!.findDismiss();

    expect(legacyTokens.length).toBe(1);
    expect(legacyToken).toBeDefined();
    expect(legacyTokenDismiss).toBeDefined();
  });

  test('new token', () => {
    const wrapper = renderTokenGroup({
      renderToken: (item: TokenGroupProps.Item) => (
        <div className={tokenSelectors.root}>
          {item.label}
          <button className={tokenSelectors['dismiss-button']}>Dismiss</button>
        </div>
      ),
    });

    const newTokens = wrapper.findTokens();
    const newToken = wrapper.findToken(1);
    const newTokenDismiss = wrapper.findToken(1)!.findDismiss();

    expect(newTokens.length).toBe(1);
    expect(newToken).toBeDefined();
    expect(newTokenDismiss).toBeDefined();
  });
});
