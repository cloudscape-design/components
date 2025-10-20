// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import { TokenGroupItemWrapper } from './token';

import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import newTokenSelectors from '../../../token/test-classes/styles.selectors.js';
import selectors from '../../../token-group/styles.selectors.js';

export default class TokenGroupWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.root;

  findTokens(): Array<TokenGroupItemWrapper> {
    const legacyTokens = this.findAllByClassName(selectors.root).map(
      tokenElement => new TokenGroupItemWrapper(tokenElement.getElement())
    );
    const newTokens = this.findAllByClassName(newTokenSelectors.root).map(
      tokenElement => new TokenGroupItemWrapper(tokenElement.getElement())
    );

    /**
     * Convert legacyTokens to a record to avoid limited functions on MultiElementWrapper at build time.
     * MultiElementWrapper does not have array-like functions available, meaning it's not possible
     * to check for .length > 0 or check the first item with traditional array indexing like legacyTokens[0].
     * It does have a .get function, but that is not available on the array returned from .findAllByClassName.
     * Converting to a record keeps both happy and allows to check the first item in legacyTokens,
     * if found to be undefined return newTokens.
     */
    const legacyTokensRecord: Record<number, TokenGroupItemWrapper> = { ...legacyTokens };

    return legacyTokensRecord[0] !== undefined ? legacyTokens : newTokens;
  }

  /**
   * Returns a token from the group for a given index.
   *
   * @param tokenIndex 1-based index of the token to return.
   */
  findToken(tokenIndex: number): TokenGroupItemWrapper | null {
    const legacyToken = this.findComponent(
      `.${tokenListSelectors['list-item']}:nth-child(${tokenIndex}) > .${selectors.root}`,
      TokenGroupItemWrapper
    );
    const newToken = this.findComponent(
      `.${tokenListSelectors['list-item']}:nth-child(${tokenIndex}) > .${newTokenSelectors.root}`,
      TokenGroupItemWrapper
    );

    return legacyToken ?? newToken;
  }

  /**
   * Returns the token toggle button.
   */
  findTokenToggle(): ElementWrapper | null {
    return this.findByClassName(tokenListSelectors.toggle);
  }
}
