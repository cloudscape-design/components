// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AttributeEditorForwardRefType, AttributeEditorProps } from './interfaces';
import InternalAttributeEditor from './internal';

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
