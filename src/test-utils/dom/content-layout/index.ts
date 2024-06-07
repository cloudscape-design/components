// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../content-layout/styles.selectors.js';
import testutilStyles from '../../../content-layout/test-classes/styles.selectors.js';

export default class ContentLayoutWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.layout;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(testutilStyles.header);
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  findNotifications(): ElementWrapper {
    return this.findByClassName(testutilStyles.notifications)!;
  }

  findBreadcrumbs(): ElementWrapper {
    return this.findByClassName(testutilStyles.breadcrumbs)!;
  }

  findSecondaryHeader(): ElementWrapper {
    return this.findByClassName(testutilStyles['secondary-header'])!;
  }
}
