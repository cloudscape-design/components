// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { AttributeEditorForwardRefType, AttributeEditorProps } from './interfaces.js';
import InternalAttributeEditor from './internal.js';

const AttributeEditor = React.forwardRef(
  <T,>(
    { items = [], isItemRemovable = () => true, ...props }: AttributeEditorProps<T>,
    ref: React.Ref<AttributeEditorProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('AttributeEditor');
    return (
      <InternalAttributeEditor
        items={items}
        isItemRemovable={isItemRemovable}
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
