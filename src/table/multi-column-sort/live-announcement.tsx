// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { CustomHandler, useInternalI18n, useLocale } from '../../i18n/context';
import { I18nFormatArgTypes } from '../../i18n/messages-types';
import InternalLiveRegion from '../../live-region/internal';
import { TableProps } from '../interfaces';
import { buildSortLiveAnnouncement } from './utils';

import analyticsSelectors from '../analytics-metadata/styles.css.js';

// Adapt the i18n `format` function to the `ariaLabels.liveAnnouncementSortOrder` signature.
const formatSortOrder: CustomHandler<
  TableProps.AriaLabels<any>['liveAnnouncementSortOrder'],
  I18nFormatArgTypes['table']['ariaLabels.liveAnnouncementSortOrder']
> =
  format =>
  ({ columns }) =>
    format({ columns });

/**
 * Reads a column's rendered (localized) header text from the DOM. `columnDefinitions[].header` is a
 * ReactNode (often a translation component such as `<I18nString .../>`), so the reliable source for a
 * plain-text, localized name is the rendered header cell — the same text a screen reader reads for
 * `aria-sort`. Returns undefined when the column has no id or the element can't be found.
 */
function readColumnHeaderText<T>(
  container: HTMLElement | null,
  column: TableProps.ColumnDefinition<T> | undefined
): string | undefined {
  if (!container || column?.id === undefined) {
    return undefined;
  }
  const selector = `[data-focus-id=${CSS.escape(`header-${column.id}`)}] .${analyticsSelectors['header-cell-text']}`;
  const headerText = container.querySelector(selector);
  return headerText?.textContent?.trim() || undefined;
}

interface SortLiveAnnouncementProps<T> {
  sortingColumns: ReadonlyArray<TableProps.SortingState<T>>;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  ariaLabels: TableProps.AriaLabels<T> | undefined;
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Announces multi-column sort changes politely. The announcement is (re)built in an effect after each
 * sort change, when the table DOM is present, so it can read the rendered header text. It is not
 * announced on the initial render — only on subsequent sort changes.
 */
export function SortLiveAnnouncement<T>({
  sortingColumns,
  columnDefinitions,
  ariaLabels,
  containerRef,
}: SortLiveAnnouncementProps<T>) {
  const i18n = useInternalI18n('table');
  const locale = useLocale();
  // Join sorted-column fragments with locale-appropriate separators (e.g. `、` for Japanese, the Arabic
  // comma for Arabic). `type: 'unit'` keeps a neutral list without an "and" conjunction, which would
  // otherwise blur the sort priority order.
  const listFormatter = useMemo(() => new Intl.ListFormat(locale ?? undefined, { type: 'unit' }), [locale]);
  const sortAscending = i18n('ariaLabels.sortAscending', ariaLabels?.sortAscending) ?? '';
  const sortDescending = i18n('ariaLabels.sortDescending', ariaLabels?.sortDescending) ?? '';
  const renderSortColumn = ({ columnLabel, isDescending }: { columnLabel: string; isDescending: boolean }) =>
    `${columnLabel} ${isDescending ? sortDescending : sortAscending}`.trim();
  const renderSortOrder = i18n(
    'ariaLabels.liveAnnouncementSortOrder',
    ariaLabels?.liveAnnouncementSortOrder,
    formatSortOrder
  );
  const sortCleared = i18n('ariaLabels.liveAnnouncementSortCleared', ariaLabels?.liveAnnouncementSortCleared);

  const [announcement, setAnnouncement] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    // A live region should only announce subsequent sort changes, not the initial sort state.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setAnnouncement(
      buildSortLiveAnnouncement({
        sortingColumns,
        columnDefinitions,
        renderSortColumn,
        renderSortOrder,
        sortCleared,
        formatList: parts => listFormatter.format(parts),
        resolveColumnLabel: column => readColumnHeaderText(containerRef.current, column),
      })
    );
    // Recompute only when the sort changes; the render functions and formatter are behaviourally stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortingColumns]);

  if (!announcement) {
    return null;
  }
  return (
    <InternalLiveRegion hidden={true} tagName="span">
      {announcement}
    </InternalLiveRegion>
  );
}
