// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AlertWrapper } from '../../../lib/components/test-utils/dom';
import FlashWrapper from '../../../lib/components/test-utils/dom/flashbar/flash.js';

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
      expect(wrapper.findReplacementHeader()?.getElement().textContent).toBe(header);
    } else {
      expect(wrapper.findReplacementHeader()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findHeader()?.getElement().textContent).toBe(header);
    }
  } else if (header === false) {
    if (wrapper.findHeader()) {
      expect(wrapper.findHeader()?.getElement()).toHaveClass(stylesCss.hidden);
    }
    expect(wrapper.findReplacementHeader()?.getElement()).toHaveClass(stylesCss.hidden);
  }
  if (content) {
    if (contentReplaced) {
      expect(wrapper.findContent()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findReplacementContent()?.getElement().textContent).toBe(content);
    } else {
      expect(wrapper.findReplacementContent()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findContent()?.getElement().textContent).toBe(content);
    }
  } else if (content === false) {
    expect(wrapper.findContent()?.getElement()).toHaveClass(stylesCss.hidden);
    expect(wrapper.findReplacementContent()?.getElement()).toHaveClass(stylesCss.hidden);
  }
};
