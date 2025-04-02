// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import FlashWrapper from '../../../lib/components/test-utils/dom/flashbar/flash.js';
import { AlertWrapper } from '../../../lib/components/test-utils/dom/index.js';

import alertStyles from '../../../lib/components/alert/styles.selectors.js';
import flashbarStyles from '../../../lib/components/flashbar/styles.selectors.js';

export const expectContent = (
  wrapper: AlertWrapper | FlashWrapper,
  stylesCss: Record<string, string>,
  {
    header,
    headerReplaced,
    content,
    contentReplaced,
  }: {
    header?: string | false;
    headerReplaced?: boolean;
    content?: string | false;
    contentReplaced?: boolean;
  }
) => {
  if (header) {
    if (headerReplaced) {
      if (wrapper.findHeader()) {
        expect(wrapper.findHeader()?.getElement()).toHaveClass(stylesCss.hidden);
      }
      expect(findReplacementHeader(wrapper)?.getElement().textContent).toBe(header);
    } else {
      expect(findReplacementHeader(wrapper)?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findHeader()?.getElement().textContent).toBe(header);
    }
  } else if (header === false) {
    if (wrapper.findHeader()) {
      expect(wrapper.findHeader()?.getElement()).toHaveClass(stylesCss.hidden);
    }
    expect(findReplacementHeader(wrapper)?.getElement()).toHaveClass(stylesCss.hidden);
  }
  if (content) {
    if (contentReplaced) {
      expect(wrapper.findContent()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(findReplacementContent(wrapper)?.getElement().textContent).toBe(content);
    } else {
      expect(findReplacementContent(wrapper)?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findContent()?.getElement().textContent).toBe(content);
    }
  } else if (content === false) {
    expect(wrapper.findContent()?.getElement()).toHaveClass(stylesCss.hidden);
    expect(findReplacementContent(wrapper)?.getElement()).toHaveClass(stylesCss.hidden);
  }
};

function findReplacementHeader(wrapper: AlertWrapper | FlashWrapper) {
  const styles = wrapper instanceof AlertWrapper ? alertStyles : flashbarStyles;
  return wrapper.findByClassName(styles['header-replacement']);
}

function findReplacementContent(wrapper: AlertWrapper | FlashWrapper) {
  const styles = wrapper instanceof AlertWrapper ? alertStyles : flashbarStyles;
  return wrapper.findByClassName(styles['content-replacement'])!;
}
