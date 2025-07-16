// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import dragHandleStyles from '../../../internal/components/drag-handle/test-classes/styles.selectors.js';

export default class DragHandleWrapper extends ComponentWrapper {
  static rootSelector: string = dragHandleStyles.root;

  findAllVisibleDirectionButtons(): Array<ElementWrapper> | null {
    return this.findAll(`.${dragHandleStyles['direction-button-visible']}`);
  }

  findVisibleDirectionButtonBlockStart(): ElementWrapper | null {
    return this.find(
      `.${dragHandleStyles['direction-button-block-start']}.${dragHandleStyles['direction-button-visible']}`
    );
  }

  findVisibleDirectionButtonBlockEnd(): ElementWrapper | null {
    return this.find(
      `.${dragHandleStyles['direction-button-block-end']}.${dragHandleStyles['direction-button-visible']}`
    );
  }

  findVisibleDirectionButtonInlineStart(): ElementWrapper | null {
    return this.find(
      `.${dragHandleStyles['direction-button-inline-start']}.${dragHandleStyles['direction-button-visible']}`
    );
  }

  findVisibleDirectionButtonInlineEnd(): ElementWrapper | null {
    return this.find(
      `.${dragHandleStyles['direction-button-inline-end']}.${dragHandleStyles['direction-button-visible']}`
    );
  }
}
