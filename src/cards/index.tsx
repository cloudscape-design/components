// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { FocusEventHandler, useCallback, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalCard from '../card/internal';
import { InternalContainerAsSubstep } from '../container/internal';
import { useInternalI18n } from '../i18n/context';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';
import { getBaseProps } from '../internal/base-component';
import { CollectionLabelContext } from '../internal/context/collection-label-context';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMobile } from '../internal/hooks/use-mobile';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalLiveRegion from '../live-region/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import {
  focusMarkers,
  SelectionControl,
  SelectionControlProps,
  useSelection,
  useSelectionFocusMove,
} from '../table/selection';
import stickyScrolling from '../table/sticky-scrolling';
import ToolsHeader from '../table/tools-header';
import { getItemKey } from '../table/utils';
import {
  GeneratedAnalyticsMetadataCardsComponent,
  GeneratedAnalyticsMetadataCardsDeselect,
  GeneratedAnalyticsMetadataCardsSelect,
} from './analytics-metadata/interfaces';
import { getCardsPerRow } from './cards-layout-helper';
import { CardsForwardRefType, CardsProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

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
    firstIndex = 1,
    totalItemsCount,
    entireCardClickable,
    ...rest
  }: CardsProps<T>,
  ref: React.Ref<CardsProps.Ref>
) {
  const { __internalRootRef } = useBaseComponent('Cards', {
    props: { entireCardClickable, selectionType, stickyHeader, variant },
    metadata: { usesVisibleSections: !!visibleSections },
  });
  const baseProps = getBaseProps(rest);
  const isRefresh = useVisualRefresh();
  const isMobile = useMobile();

  const computedVariant = isRefresh ? variant : 'container';

  const headerIdRef = useRef<string | undefined>(undefined);
  const setHeaderRef = useCallback((id: string) => {
    headerIdRef.current = id;
  }, []);
  const isLabelledByHeader = !ariaLabels?.cardsLabel && !!header;

  const [columns, measureRef] = useContainerQuery<number>(
    ({ contentBoxWidth }) => getCardsPerRow(contentBoxWidth, cardsPerRow),
    [cardsPerRow]
  );
  const refObject = useRef(null);
  const mergedRef = useMergeRefs(measureRef, refObject, __internalRootRef);
  const getMouseDownTarget = useMouseDownTarget();

  const i18n = useInternalI18n('cards');
  const { isItemSelected, getItemSelectionProps } = useSelection({
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
  stickyHeader = !isMobile && stickyHeader;
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
          <InternalLiveRegion tagName="span">{loadingText}</InternalLiveRegion>
        </InternalStatusIndicator>
      </div>
    );
  } else if (empty && !items.length) {
    status = <div className={styles.empty}>{empty}</div>;
  }

  const analyticsComponentMetadata: GeneratedAnalyticsMetadataCardsComponent = {
    name: 'awsui.Cards',
    label: `.${analyticsSelectors.container}`,
    properties: {
      selectionType: selectionType || 'none',
      itemsCount: `${items.length}`,
      selectedItemsCount: `${(selectedItems || []).length}`,
      selectedItemsLabels: {
        root: 'self',
        selector: `.${styles['card-selected']} .${analyticsSelectors['card-header']}`,
      },
      variant,
    },
  };

  if (trackBy) {
    analyticsComponentMetadata.properties.selectedItems = (selectedItems || []).map(
      (item, index) => `${getItemKey(trackBy, item, index)}`
    );
  }

  return (
    <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
      <AnalyticsFunnelSubStep>
        <div
          {...baseProps}
          className={clsx(baseProps.className, styles.root)}
          ref={mergedRef}
          {...getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata })}
        >
          <InternalContainerAsSubstep
            header={
              hasToolsHeader && (
                <div
                  className={clsx(
                    styles.header,
                    isRefresh && styles['header-refresh'],
                    styles[`header-variant-${computedVariant}`]
                  )}
                >
                  <CollectionLabelContext.Provider value={{ assignId: setHeaderRef }}>
                    <ToolsHeader header={header} filter={filter} pagination={pagination} preferences={preferences} />
                  </CollectionLabelContext.Provider>
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
            __fullPage={computedVariant === 'full-page'}
            __disableFooterDivider={true}
            className={analyticsSelectors.container}
          >
            <div
              className={clsx(
                hasToolsHeader && styles['has-header'],
                isRefresh && styles.refresh,
                styles[`header-variant-${computedVariant}`]
              )}
            >
              {!!renderAriaLive && !!firstIndex && (
                <InternalLiveRegion hidden={true} tagName="span">
                  <span>
                    {renderAriaLive({ totalItemsCount, firstIndex, lastIndex: firstIndex + items.length - 1 })}
                  </span>
                </InternalLiveRegion>
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
                  onFocus={onCardFocus}
                  ariaLabel={ariaLabels?.cardsLabel}
                  ariaLabelledby={isLabelledByHeader && headerIdRef.current ? headerIdRef.current : undefined}
                  entireCardClickable={entireCardClickable}
                />
              )}
            </div>
          </InternalContainerAsSubstep>
        </div>
      </AnalyticsFunnelSubStep>
    </LinkDefaultVariantContext.Provider>
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
  onFocus,
  ariaLabelledby,
  ariaLabel,
  entireCardClickable,
}: Pick<
  CardsProps<T>,
  'items' | 'cardDefinition' | 'trackBy' | 'selectionType' | 'visibleSections' | 'entireCardClickable'
> & {
  columns: number | null;
  isItemSelected: (item: T) => boolean;
  getItemSelectionProps?: (item: T) => SelectionControlProps;
  onFocus: FocusEventHandler<HTMLElement>;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}) => {
  const selectable = !!selectionType;
  const canClickEntireCard = selectable && entireCardClickable;

  const { moveFocusDown, moveFocusUp } = useSelectionFocusMove(selectionType, items.length);

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
      className={clsx(styles.list, styles[`list-grid-${columns || 1}`], analyticsSelectors['cards-list'])}
      role={listRole}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      {...(focusMarkers && focusMarkers.root)}
    >
      {items.map((item, index) => {
        const key = getItemKey(trackBy, item, index);
        const selectionProps = getItemSelectionProps ? getItemSelectionProps(item) : null;
        const selected = isItemSelected(item);
        const disabled = selectionProps && selectionProps.disabled;
        const selectionAnalyticsMetadata:
          | GeneratedAnalyticsMetadataCardsSelect
          | GeneratedAnalyticsMetadataCardsDeselect = {
          action: selected ? 'deselect' : 'select',
          detail: {
            label: {
              selector: `.${analyticsSelectors['cards-list']} li:nth-child(${index + 1}) .${analyticsSelectors['card-header']}`,
              root: 'component',
            },
            position: `${index + 1}`,
            item: `${key}`,
          },
        };
        return (
          <li
            className={clsx(styles.card, {
              [styles['card-selected']]: selectable && selected,
            })}
            key={key}
            onFocus={onFocus}
            {...(focusMarkers && focusMarkers.item)}
            role={listItemRole}
            {...getAnalyticsMetadataAttribute({
              component: {
                innerContext: {
                  position: `${index + 1}`,
                  item: `${key}`,
                },
              },
            })}
          >
            <InternalCard
              highlighted={selectable && selected}
              header={
                <div className={styles['card-header']}>
                  <div
                    className={clsx(
                      styles['card-header-inner'],
                      selectable && styles['card-header-inner-selectable'],
                      analyticsSelectors['card-header']
                    )}
                  >
                    {cardDefinition.header ? cardDefinition.header(item) : ''}
                  </div>
                  {selectionProps && (
                    <div
                      className={styles['selection-control']}
                      {...(!canClickEntireCard && !disabled
                        ? getAnalyticsMetadataAttribute(selectionAnalyticsMetadata)
                        : {})}
                    >
                      <SelectionControl onFocusDown={moveFocusDown} onFocusUp={moveFocusUp} {...selectionProps} />
                    </div>
                  )}
                </div>
              }
              metadataAttributes={
                canClickEntireCard && !disabled ? getAnalyticsMetadataAttribute(selectionAnalyticsMetadata) : {}
              }
              onClick={
                canClickEntireCard
                  ? event => {
                      selectionProps?.onChange();
                      // Manually move focus to the native input (checkbox or radio button)
                      event.currentTarget.querySelector('input')?.focus();
                    }
                  : undefined
              }
            >
              {visibleSectionsDefinition.length > 0 &&
                visibleSectionsDefinition.map(({ width = 100, header, content, id }, index) => (
                  <div key={id || index} className={styles.section} style={{ width: `${width}%` }}>
                    {header ? <div className={styles['section-header']}>{header}</div> : ''}
                    {content ? <div className={styles['section-content']}>{content(item)}</div> : ''}
                  </div>
                ))}
            </InternalCard>
          </li>
        );
      })}
    </ol>
  );
};

applyDisplayName(Cards, 'Cards');
