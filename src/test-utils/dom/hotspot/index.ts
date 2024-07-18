// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import { AnnotationWrapper } from '../index.js';

import annotationStyles from '../../../annotation-context/annotation/styles.selectors.js';
import hotspotStyles from '../../../hotspot/styles.selectors.js';

export default class HotspotWrapper extends ComponentWrapper {
  static rootSelector: string = hotspotStyles.root;

  findTrigger(): ElementWrapper {
    return this.findByClassName(annotationStyles.hotspot)!;
  }

  findAnnotation(): AnnotationWrapper | null {
    return this.findComponent(`.${annotationStyles.annotation}`, AnnotationWrapper);
  }
}
