// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import { TokenGroupItemWrapper } from './token';

import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import selectors from '../../../token-group/styles.selectors.js';

export default class TokenGroupWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.root;

  findTokens(): Array<TokenGroupItemWrapper> {
    return this.findAllByClassName(selectors.token).map(
      tokenElement => new TokenGroupItemWrapper(tokenElement.getElement())
    );
  }

  /**
   * Returns a token from the group for a given index.
   *
   * @param tokenIndex 1-based index of the token to return.
   */
  findToken(tokenIndex: number): TokenGroupItemWrapper | null {
    return this.findComponent(
      `.${tokenListSelectors['list-item']}:nth-child(${tokenIndex}) > .${selectors.token}`,
      TokenGroupItemWrapper
    );
  }

  /**
   * Returns the token toggle button.
   */
  findTokenToggle(): ElementWrapper | null {
    return this.findByClassName(tokenListSelectors.toggle);
  }
}
