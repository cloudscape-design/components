// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import testClasses from '../../../error-boundary/test-classes/styles.selectors.js';

export default class ErrorBoundaryWrapper extends ComponentWrapper<HTMLButtonElement> {
  static rootSelector: string = testClasses.fallback;

  findHeader(): ElementWrapper {
    return this.findByClassName(testClasses.header)!;
  }

  findDescription(): ElementWrapper {
    return this.findByClassName(testClasses.description)!;
  }

  findAction(): null | ElementWrapper {
    return this.findByClassName(testClasses.action);
  }

  findFeedbackAction(): null | ElementWrapper {
    return this.findByClassName(testClasses['feedback-action']);
  }

  findRefreshAction(): null | ElementWrapper {
    return this.findByClassName(testClasses['refresh-action']);
  }
}
