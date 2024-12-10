// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { matchBreakpointMapping } from '../internal/breakpoints';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { usePrevious } from '../internal/hooks/use-previous';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { SomeRequired } from '../internal/types';
import InternalLiveRegion from '../live-region/internal';
import { AdditionalInfo } from './additional-info';
import { gridDefaults } from './grid-defaults';
import { AttributeEditorForwardRefType, AttributeEditorProps } from './interfaces';
import { Row } from './row';

import styles from './styles.css.js';

type InternalAttributeEditorProps<T> = SomeRequired<AttributeEditorProps<T>, 'items'> & InternalBaseComponentProps;

const InternalAttributeEditor = React.forwardRef(
  <T,>(
    {
      additionalInfo,
      disableAddButton,
      definition,
      gridLayout,
      items,
      isItemRemovable = () => true,
      empty,
      addButtonText,
      removeButtonText,
      removeButtonAriaLabel,
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

    if (!gridLayout) {
      if (definition.length > 8) {
        console.warn('AttributeEditor', '`gridLayout` is required for more than 8 attributes. Cannot render.');
        return <div />;
      }
      gridLayout = gridDefaults[definition.length];
    }

    const gridLayoutBreakpoints = gridLayout.reduce(
      (acc, layout) => ({
        ...acc,
        [layout.breakpoint || 'default']: layout,
      }),
      {} as Record<AttributeEditorProps.Breakpoint, AttributeEditorProps.GridLayout>
    );

    let gridLayoutForBreakpoint = matchBreakpointMapping(gridLayoutBreakpoints, breakpoint || 'default') || {
      rows: [],
    };

    const totalColumnsInLayout = gridLayoutForBreakpoint.rows.reduce((total, columns) => total + columns.length, 0);
    if (totalColumnsInLayout < definition.length) {
      console.warn(
        'AttributeEditor',
        `Not enough columns in layout (${totalColumnsInLayout}) for definition (${definition.length}). Cannot render.`
      );
      return <div />;
    } else if (totalColumnsInLayout === definition.length) {
      warnOnce('AttributeEditor', `Remove button column not present in layout, will add automatically`);
      gridLayoutForBreakpoint = { ...gridLayoutForBreakpoint, rows: [...gridLayoutForBreakpoint.rows, [1]] };
    }

    const gridTemplateColumns = `repeat(${gridLayoutForBreakpoint.rows.reduce(
      (maxCols, row) =>
        Math.max(
          maxCols,
          row.reduce((cols, col) => cols + col, 0)
        ),
      0
    )}, 1fr)`;

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(baseProps.className, styles.root)}
        style={{ gridTemplateColumns }}
      >
        {isEmpty && <div className={clsx(styles.empty, wasNonEmpty.current && styles['empty-appear'])}>{empty}</div>}
        {items.map((item, index) => (
          <Row<T>
            key={index}
            index={index}
            layout={gridLayoutForBreakpoint}
            item={item}
            definition={definition}
            i18nStrings={i18nStrings}
            removable={isItemRemovable(item)}
            removeButtonText={removeButtonText}
            removeButtonRefs={removeButtonRefs.current}
            onRemoveButtonClick={onRemoveButtonClick}
            removeButtonAriaLabel={removeButtonAriaLabel}
          />
        ))}

        <div className={styles['add-row']}>
        <InternalButton
          className={styles['add-button']}
          disabled={disableAddButton}
          // Using aria-disabled="true" and tabindex="-1" instead of "disabled"
          // because focus can be dynamically moved to this button by calling
          // `focusAddButton()` on the ref.
          __nativeAttributes={disableAddButton ? { tabIndex: -1 } : {}}
          __focusable={true}
          onClick={onAddButtonClick}
          formAction="none"
          ref={addButtonRef}
          ariaDescribedby={infoAriaDescribedBy}
        >
          {addButtonText}
        </InternalButton>
        <InternalLiveRegion
          data-testid="removal-announcement"
          tagName="span"
          hidden={true}
          delay={5}
          key={items.length}
        >
          {removalAnnouncement}
        </InternalLiveRegion>
        {!!additionalInfo && <AdditionalInfo id={infoAriaDescribedBy}>{additionalInfo}</AdditionalInfo>}
        </div>
      </div>
    );
  }
) as AttributeEditorForwardRefType;

export default InternalAttributeEditor;
