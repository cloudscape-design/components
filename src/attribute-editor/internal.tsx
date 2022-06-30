// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';

import { AttributeEditorForwardRefType, AttributeEditorProps } from './interfaces';
import { AdditionalInfo } from './additional-info';
import { Row } from './row';

import styles from './styles.css.js';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import InternalBox from '../box/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';

type InternalAttributeEditorProps<T> = SomeRequired<AttributeEditorProps<T>, 'items'> & InternalBaseComponentProps;

const InternalAttributeEditor = React.forwardRef(
  <T,>(
    {
      additionalInfo,
      disableAddButton,
      definition,
      items,
      isItemRemovable = () => true,
      empty,
      addButtonText,
      removeButtonText,
      onAddButtonClick,
      onRemoveButtonClick,
      __internalRootRef = null,
      ...props
    }: InternalAttributeEditorProps<T>,
    ref: React.Ref<AttributeEditorProps.Ref>
  ) => {
    const [breakpoint, breakpointRef] = useContainerBreakpoints(['default', 'xxs', 'xs']);
    const removeButtonRefs = useRef<Array<ButtonProps.Ref | undefined>>([]);

    const baseProps = getBaseProps(props);
    const isEmpty = items && items.length === 0;

    useImperativeHandle(ref, () => ({
      focusRemoveButton(rowIndex: number) {
        removeButtonRefs.current[rowIndex]?.focus();
      },
    }));

    const mergedRef = useMergeRefs(breakpointRef, __internalRootRef);

    return (
      <div {...baseProps} ref={mergedRef} className={clsx(baseProps.className, styles.root)}>
        <InternalBox margin={{ bottom: 'l' }}>
          {isEmpty && <div className={styles.empty}>{empty}</div>}
          {items.map((item, index) => (
            <Row
              key={index}
              index={index}
              breakpoint={breakpoint}
              item={item}
              definition={definition}
              removable={isItemRemovable(item)}
              removeButtonText={removeButtonText}
              removeButtonRefs={removeButtonRefs.current}
              onRemoveButtonClick={onRemoveButtonClick}
            />
          ))}
        </InternalBox>
        <InternalButton
          className={styles['add-button']}
          disabled={disableAddButton}
          onClick={onAddButtonClick}
          formAction="none"
        >
          {addButtonText}
        </InternalButton>
        {additionalInfo && <AdditionalInfo>{additionalInfo}</AdditionalInfo>}
      </div>
    );
  }
) as AttributeEditorForwardRefType;

export default InternalAttributeEditor;
