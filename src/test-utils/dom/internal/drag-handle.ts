// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import dragHandleStyles from '../../../internal/components/drag-handle/test-classes/styles.selectors.js';
import dragHandleWrapperStyles from '../../../internal/components/drag-handle-wrapper/test-classes/styles.selectors.js';

export default class DragHandleWrapper extends ComponentWrapper {
  static rootSelector: string = dragHandleStyles.root;

  findAllVisibleDirectionButtons(): Array<ElementWrapper> | null {
    return createWrapper().findAll(`.${dragHandleWrapperStyles['direction-button-visible']}`);
  }

  findVisibleDirectionButtonBlockStart(): ElementWrapper | null {
    return createWrapper().find(
      `.${dragHandleWrapperStyles['direction-button-block-start']}.${dragHandleWrapperStyles['direction-button-visible']}`
    );
  }

  findVisibleDirectionButtonBlockEnd(): ElementWrapper | null {
    return createWrapper().find(
      `.${dragHandleWrapperStyles['direction-button-block-end']}.${dragHandleWrapperStyles['direction-button-visible']}`
    );
  }

  findVisibleDirectionButtonInlineStart(): ElementWrapper | null {
    return createWrapper().find(
      `.${dragHandleWrapperStyles['direction-button-inline-start']}.${dragHandleWrapperStyles['direction-button-visible']}`
    );
  }

  findVisibleDirectionButtonInlineEnd(): ElementWrapper | null {
    return createWrapper().find(
      `.${dragHandleWrapperStyles['direction-button-inline-end']}.${dragHandleWrapperStyles['direction-button-visible']}`
    );
  }
}
