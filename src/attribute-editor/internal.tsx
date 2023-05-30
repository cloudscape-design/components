// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, useState } from 'react';
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
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { usePrevious } from '../internal/hooks/use-previous';
import LiveRegion from '../internal/components/live-region';

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
      i18nStrings,
      onAddButtonClick,
      onRemoveButtonClick,
      __internalRootRef = null,
      ...props
    }: InternalAttributeEditorProps<T>,
    ref: React.Ref<AttributeEditorProps.Ref>
  ) => {
    const [breakpoint, breakpointRef] = useContainerBreakpoints(['default', 'xxs', 'xs']);
    const removeButtonRefs = useRef<Array<ButtonProps.Ref | undefined>>([]);
    const addButtonRef = useRef<ButtonProps.Ref>(null);
    const wasNonEmpty = useRef<boolean>(false);
    const [removalAnnouncement, setRemovalAnnouncement] = useState<string>('');

    const baseProps = getBaseProps(props);
    const isEmpty = items && items.length === 0;

    wasNonEmpty.current = wasNonEmpty.current || !isEmpty;

    useImperativeHandle(ref, () => ({
      focusRemoveButton(rowIndex: number) {
        removeButtonRefs.current[rowIndex]?.focus();
      },
      focusAddButton() {
        addButtonRef.current?.focus();
      },
    }));

    const mergedRef = useMergeRefs(breakpointRef, __internalRootRef);

    const additionalInfoId = useUniqueId('attribute-editor-info');
    const infoAriaDescribedBy = additionalInfo ? additionalInfoId : undefined;

    const prevItemsLength = usePrevious(items.length);

    React.useEffect(() => {
      if (prevItemsLength && prevItemsLength > items.length && i18nStrings?.itemRemovedAriaLive) {
        setRemovalAnnouncement(i18nStrings.itemRemovedAriaLive);
      } else {
        setRemovalAnnouncement('');
      }
      // we only want to announce when the number of items decreases (i.e. when an item is removed)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, i18nStrings?.itemRemovedAriaLive]);

    return (
      <div {...baseProps} ref={mergedRef} className={clsx(baseProps.className, styles.root)}>
        <InternalBox margin={{ bottom: 'l' }}>
          {isEmpty && <div className={clsx(styles.empty, wasNonEmpty.current && styles['empty-appear'])}>{empty}</div>}
          {items.map((item, index) => (
            <Row
              key={index}
              index={index}
              breakpoint={breakpoint}
              item={item}
              definition={definition}
              i18nStrings={i18nStrings}
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
          ref={addButtonRef}
          ariaDescribedby={infoAriaDescribedBy}
        >
          {addButtonText}
        </InternalButton>
        <LiveRegion data-testid="removal-announcement" delay={5} key={items.length}>
          {removalAnnouncement}
        </LiveRegion>
        {!!additionalInfo && <AdditionalInfo id={infoAriaDescribedBy}>{additionalInfo}</AdditionalInfo>}
      </div>
    );
  }
) as AttributeEditorForwardRefType;

export default InternalAttributeEditor;
