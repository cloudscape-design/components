// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { AttributeEditorForwardRefType, AttributeEditorProps } from './interfaces.js';
import InternalAttributeEditor from './internal.js';

const AttributeEditor = React.forwardRef(
  <T,>(
    { items = [], addButtonVariant = 'normal', isItemRemovable = () => true, ...props }: AttributeEditorProps<T>,
    ref: React.Ref<AttributeEditorProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('AttributeEditor', {
      props: {
        addButtonVariant: addButtonVariant,
      },
      metadata: {
        definitionItems: props.definition?.length ?? null,
        hasGridLayout: !!props.gridLayout,
        hasCustomRowActions: !!props.customRowActions,
      },
    });
    return (
      <InternalAttributeEditor
        items={items}
        isItemRemovable={isItemRemovable}
        addButtonVariant={addButtonVariant}
        {...props}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
) as AttributeEditorForwardRefType;

applyDisplayName(AttributeEditor, 'AttributeEditor');

export { AttributeEditorProps };
export default AttributeEditor;
