// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { FocusEventHandler, useImperativeHandle, useRef } from 'react';
import { CardsForwardRefType, CardsProps } from './interfaces';
import styles from './styles.css.js';
import { getCardsPerRow } from './cards-layout-helper';
import { getBaseProps } from '../internal/base-component';
import { useContainerQuery } from '../internal/hooks/container-queries/use-container-query';
import ToolsHeader from '../table/tools-header';
import { getItemKey } from '../table/utils';
import { focusMarkers, useFocusMove, useSelection } from '../table/use-selection';
import SelectionControl, { SelectionControlProps } from '../table/selection-control';
import InternalContainer from '../container/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import stickyScrolling from '../table/sticky-scrolling';
import { useSupportsStickyHeader } from '../container/use-sticky-header';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

export { CardsProps };

const Cards = React.forwardRef(function <T = any>(
  {
    items = [],
    cardDefinition,
    cardsPerRow = [],
    header,
    filter,
    pagination,
    preferences,
    empty,
    loading,
    loadingText,
    trackBy,
    selectedItems,
    selectionType,
    isItemDisabled,
    onSelectionChange,
    ariaLabels,
    visibleSections,
    stickyHeader,
    stickyHeaderVerticalOffset,
    variant = 'container',
    ...rest
  }: CardsProps<T>,
  ref: React.Ref<CardsProps.Ref>
) {
  const { __internalRootRef } = useBaseComponent('Cards');
  const baseProps = getBaseProps(rest);
  const isRefresh = useVisualRefresh();
  const computedVariant = isRefresh ? variant : 'container';

  const [columns, measureRef] = useContainerQuery<number>(
    ({ width }) => getCardsPerRow(width, cardsPerRow),
    [cardsPerRow]
  );
  const refObject = useRef(null);
  const mergedRef = useMergeRefs(measureRef, refObject, __internalRootRef);

  const { isItemSelected, getItemSelectionProps, updateShiftToggle } = useSelection({
    items,
    trackBy,
    selectedItems,
    selectionType,
    isItemDisabled,
    onSelectionChange,
    ariaLabels,
  });
  const hasToolsHeader = header || filter || pagination || preferences;
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollToTop, scrollToItem } = stickyScrolling(refObject, headerRef);
  stickyHeader = useSupportsStickyHeader() && stickyHeader;
  const onCardFocus: FocusEventHandler<HTMLElement> = event => {
    if (stickyHeader) {
      scrollToItem(event.currentTarget);
    }
  };
  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: () => {
        if (stickyHeader) {
          scrollToTop();
        }
      },
    }),
    [stickyHeader, scrollToTop]
  );
  let status;
  if (loading) {
    status = (
      <div className={styles.loading}>
        <InternalStatusIndicator type="loading">{loadingText}</InternalStatusIndicator>
      </div>
    );
  } else if (empty && !items.length) {
    status = <div className={styles.empty}>{empty}</div>;
  }

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={mergedRef}>
      <InternalContainer
        header={
          hasToolsHeader && (
            <div
              className={clsx(
                styles.header,
                isRefresh && styles['header-refresh'],
                styles[`header-variant-${computedVariant}`]
              )}
            >
              <ToolsHeader header={header} filter={filter} pagination={pagination} preferences={preferences} />
            </div>
          )
        }
        disableContentPaddings={true}
        disableHeaderPaddings={computedVariant === 'full-page'}
        variant={computedVariant === 'container' ? 'cards' : computedVariant}
        __stickyHeader={stickyHeader}
        __stickyOffset={stickyHeaderVerticalOffset}
        __headerRef={headerRef}
      >
        <div className={clsx(hasToolsHeader && styles['has-header'])}>
          {status ?? (
            <CardsList
              items={items}
              cardDefinition={cardDefinition}
              trackBy={trackBy}
              selectionType={selectionType}
              columns={columns}
              isItemSelected={isItemSelected}
              getItemSelectionProps={getItemSelectionProps}
              visibleSections={visibleSections}
              updateShiftToggle={updateShiftToggle}
              onFocus={onCardFocus}
            />
          )}
        </div>
      </InternalContainer>
    </div>
  );
}) as CardsForwardRefType;

export default Cards;

const CardsList = <T,>({
  items,
  cardDefinition,
  trackBy,
  selectionType,
  columns,
  isItemSelected,
  getItemSelectionProps,
  visibleSections,
  updateShiftToggle,
  onFocus,
}: Pick<CardsProps<T>, 'items' | 'cardDefinition' | 'trackBy' | 'selectionType' | 'visibleSections'> & {
  columns: number | null;
  isItemSelected: (item: T) => boolean;
  getItemSelectionProps: (item: T) => SelectionControlProps;
  updateShiftToggle: (state: boolean) => void;
  onFocus: FocusEventHandler<HTMLElement>;
}) => {
  const selectable = !!selectionType;
  const { moveFocusDown, moveFocusUp } = useFocusMove(selectionType, items.length);

  let visibleSectionsDefinition = cardDefinition.sections || [];
  visibleSectionsDefinition = visibleSections
    ? visibleSectionsDefinition.filter(
        (section: CardsProps.SectionDefinition<T>) => section.id && visibleSections.indexOf(section.id) !== -1
      )
    : visibleSectionsDefinition;

  return (
    <ol className={clsx(styles.list, styles[`list-grid-${columns || 1}`])} {...(focusMarkers && focusMarkers.root)}>
      {items.map((item, index) => (
        <li
          className={clsx(styles.card, {
            [styles['card-selectable']]: selectable,
            [styles['card-selected']]: selectable && isItemSelected(item),
          })}
          key={getItemKey(trackBy, item, index)}
          onFocus={onFocus}
          {...(focusMarkers && focusMarkers.item)}
        >
          <div className={styles['card-inner']}>
            <div className={styles['card-header']}>
              <span className={styles['card-header-inner']}>
                {cardDefinition.header ? cardDefinition.header(item) : ''}
              </span>
              {selectable && (
                <div className={styles['selection-control']}>
                  <SelectionControl
                    onFocusDown={moveFocusDown}
                    onFocusUp={moveFocusUp}
                    onShiftToggle={updateShiftToggle}
                    {...getItemSelectionProps(item)}
                  />
                </div>
              )}
            </div>
            {visibleSectionsDefinition.map(({ width = 100, header, content, id }, index) => (
              <div key={id || index} className={styles.section} style={{ width: `${width}%` }}>
                {header ? <div className={styles['section-header']}>{header}</div> : ''}
                {content ? <div className={styles['section-content']}>{content(item)}</div> : ''}
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
};

applyDisplayName(Cards, 'Cards');
