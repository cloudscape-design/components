// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import BasicTableWrapper from './basic-table';

export { BasicTableWrapper };

export class BasicTableComponentsWrapper extends ComponentWrapper {
  findBasicTable(selector?: string): BasicTableWrapper | null {
    const rootSelector = `.${BasicTableWrapper.rootSelector}`;
    return this.findComponent(selector ? `${selector} ${rootSelector}` : rootSelector, BasicTableWrapper);
  }

  findAllBasicTables(selector?: string): Array<BasicTableWrapper> {
    return this.findAllComponents(BasicTableWrapper, selector);
  }
}

export default function wrapper(root: HTMLElement = document.body): BasicTableComponentsWrapper {
  if (document && document.body && !document.body.contains(root)) {
    // eslint-disable-next-line no-console
    console.warn('The provided root element is not part of the document body, test utils may not work as expected.');
  }
  return new BasicTableComponentsWrapper(root);
}
