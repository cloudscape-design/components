// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import dragHandleStyles from '../../../internal/components/drag-handle/test-classes/styles.selectors.js';
import dragHandleWrapperStyles from '../../../internal/components/drag-handle-wrapper/test-classes/styles.selectors.js';

export default class DragHandleWrapper extends ComponentWrapper {
  static rootSelector: string = dragHandleStyles.root;

  findAllDirectionButtons(): Array<ElementWrapper> | null {
    return this.findAllByClassName(dragHandleWrapperStyles['direction-button']);
  }

  findDirectionButtonBlockStart(): ElementWrapper | null {
    return this.findByClassName(dragHandleWrapperStyles['direction-bock-start']);
  }

  findDirectionButtonBlockEnd(): ElementWrapper | null {
    return this.findByClassName(dragHandleWrapperStyles['direction-bock-end']);
  }

  findDirectionButtonInlineStart(): ElementWrapper | null {
    return this.findByClassName(dragHandleWrapperStyles['direction-inline-start']);
  }

  findDirectionButtonInlineEnd(): ElementWrapper | null {
    return this.findByClassName(dragHandleWrapperStyles['direction-inline-end']);
  }
}
