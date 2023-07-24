// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { FocusEventHandler, useImperativeHandle, useRef } from 'react';
import { CardsForwardRefType, CardsProps } from './interfaces';
import styles from './styles.css.js';
import { getCardsPerRow } from './cards-layout-helper';
import { getBaseProps } from '../internal/base-component';
import ToolsHeader from '../table/tools-header';
import { getItemKey } from '../table/utils';
import { focusMarkers, useFocusMove, useSelection } from '../table/use-selection';
import SelectionControl, { SelectionControlProps } from '../table/selection-control';
import InternalContainer from '../container/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import stickyScrolling from '../table/sticky-scrolling';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import LiveRegion from '../internal/components/live-region';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { useMobile } from '../internal/hooks/use-mobile';
import { supportsStickyPosition } from '../internal/utils/dom';
import { useInternalI18n } from '../internal/i18n/context';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';

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
    renderAriaLive,
    firstIndex,
    totalItemsCount,
    ...rest
  }: CardsProps<T>,
  ref: React.Ref<CardsProps.Ref>
) {
  const { __internalRootRef } = useBaseComponent('Cards');
  const baseProps = getBaseProps(rest);
  const isRefresh = useVisualRefresh();
  const isMobile = useMobile();

  const computedVariant = isRefresh ? variant : 'container';
  const instanceUniqueId = useUniqueId('cards');
  const cardsId = baseProps?.id || instanceUniqueId;
  const cardsHeaderId = header ? `${cardsId}-header` : undefined;

  const [columns, measureRef] = useContainerQuery<number>(
    ({ contentBoxWidth }) => getCardsPerRow(contentBoxWidth, cardsPerRow),
    [cardsPerRow]
  );
  const refObject = useRef(null);
  const mergedRef = useMergeRefs(measureRef, refObject, __internalRootRef);
  const getMouseDownTarget = useMouseDownTarget();

  const i18n = useInternalI18n('cards');
  const { isItemSelected, getItemSelectionProps, updateShiftToggle } = useSelection({
    items,
    trackBy,
    selectedItems,
    selectionType,
    isItemDisabled,
    onSelectionChange,
    ariaLabels: {
      itemSelectionLabel: ariaLabels?.itemSelectionLabel,
      selectionGroupLabel: i18n('ariaLabels.selectionGroupLabel', ariaLabels?.selectionGroupLabel),
    },
  });
  const hasToolsHeader = header || filter || pagination || preferences;
  const hasFooterPagination = isMobile && variant === 'full-page' && !!pagination;
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollToTop, scrollToItem } = stickyScrolling(refObject, headerRef);
  stickyHeader = supportsStickyPosition() && !isMobile && stickyHeader;
  const onCardFocus: FocusEventHandler<HTMLElement> = event => {
    // When an element inside card receives focus we want to adjust the scroll.
    // However, that behavior is unwanted when the focus is received as result of a click
    // as it causes the click to never reach the target element.
    if (stickyHeader && !event.currentTarget.contains(getMouseDownTarget())) {
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
        <InternalStatusIndicator type="loading">
          <LiveRegion visible={true}>{loadingText}</LiveRegion>
        </InternalStatusIndicator>
      </div>
    );
  } else if (empty && !items.length) {
    status = <div className={styles.empty}>{empty}</div>;
  }

  return (
    <AnalyticsFunnelSubStep>
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
          footer={hasFooterPagination && <div className={styles['footer-pagination']}>{pagination}</div>}
          disableContentPaddings={true}
          disableHeaderPaddings={computedVariant === 'full-page'}
          variant={computedVariant === 'container' ? 'cards' : computedVariant}
          __stickyHeader={stickyHeader}
          __stickyOffset={stickyHeaderVerticalOffset}
          __headerRef={headerRef}
          __headerId={cardsHeaderId}
          __darkHeader={computedVariant === 'full-page'}
          __disableFooterDivider={true}
        >
          <div className={clsx(hasToolsHeader && styles['has-header'])}>
            {!!renderAriaLive && !!firstIndex && (
              <LiveRegion>
                <span>{renderAriaLive({ totalItemsCount, firstIndex, lastIndex: firstIndex + items.length - 1 })}</span>
              </LiveRegion>
            )}
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
                ariaLabel={ariaLabels?.cardsLabel}
                ariaLabelledby={ariaLabels?.cardsLabel ? undefined : cardsHeaderId}
              />
            )}
          </div>
        </InternalContainer>
      </div>
    </AnalyticsFunnelSubStep>
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
  ariaLabelledby,
  ariaLabel,
}: Pick<CardsProps<T>, 'items' | 'cardDefinition' | 'trackBy' | 'selectionType' | 'visibleSections'> & {
  columns: number | null;
  isItemSelected: (item: T) => boolean;
  getItemSelectionProps: (item: T) => SelectionControlProps;
  updateShiftToggle: (state: boolean) => void;
  onFocus: FocusEventHandler<HTMLElement>;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}) => {
  const selectable = !!selectionType;

  const { moveFocusDown, moveFocusUp } = useFocusMove(selectionType, items.length);

  let visibleSectionsDefinition = cardDefinition.sections || [];
  visibleSectionsDefinition = visibleSections
    ? visibleSectionsDefinition.filter(
        (section: CardsProps.SectionDefinition<T>) => section.id && visibleSections.indexOf(section.id) !== -1
      )
    : visibleSectionsDefinition;

  let listRole: 'group' | undefined = undefined;
  let listItemRole: 'presentation' | undefined = undefined;

  if (selectable) {
    listRole = 'group';
    listItemRole = 'presentation';
  }

  return (
    <ol
      className={clsx(styles.list, styles[`list-grid-${columns || 1}`])}
      role={listRole}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      {...(focusMarkers && focusMarkers.root)}
    >
      {items.map((item, index) => (
        <li
          className={clsx(styles.card, {
            [styles['card-selectable']]: selectable,
            [styles['card-selected']]: selectable && isItemSelected(item),
          })}
          key={getItemKey(trackBy, item, index)}
          onFocus={onFocus}
          {...(focusMarkers && focusMarkers.item)}
          role={listItemRole}
        >
          <div className={styles['card-inner']}>
            <div className={styles['card-header']}>
              <div className={styles['card-header-inner']}>
                {cardDefinition.header ? cardDefinition.header(item) : ''}
              </div>
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
