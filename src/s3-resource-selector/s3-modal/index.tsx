// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useReducer, useRef } from 'react';
import InternalBreadcrumbGroup from '../../breadcrumb-group/internal';
import { InternalButton } from '../../button/internal';
import InternalModal from '../../modal/internal';
import InternalSpaceBetween from '../../space-between/internal';
import { ForwardFocusRef } from '../../internal/hooks/forward-focus';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { S3ResourceSelectorProps } from '../interfaces';
import { BucketsTable } from './buckets-table';
import { ObjectsTable } from './objects-table';
import { VersionsTable } from './versions-table';
import styles from './styles.css.js';
import { joinObjectPath } from '../utils';
import { useInternalI18n } from '../../i18n/context';

export interface S3ModalProps {
  alert: React.ReactNode;
  selectableItemsTypes: S3ResourceSelectorProps['selectableItemsTypes'];
  fetchBuckets: S3ResourceSelectorProps['fetchBuckets'];
  bucketsVisibleColumns: ReadonlyArray<string>;
  bucketsIsItemDisabled: S3ResourceSelectorProps['bucketsIsItemDisabled'];
  fetchObjects: S3ResourceSelectorProps['fetchObjects'];
  objectsVisibleColumns: ReadonlyArray<string>;
  objectsIsItemDisabled: S3ResourceSelectorProps['objectsIsItemDisabled'];
  fetchVersions: S3ResourceSelectorProps['fetchVersions'];
  versionsVisibleColumns: ReadonlyArray<string>;
  versionsIsItemDisabled: S3ResourceSelectorProps['versionsIsItemDisabled'];
  i18nStrings: S3ResourceSelectorProps.I18nStrings | undefined;
  getModalRoot: S3ResourceSelectorProps['getModalRoot'];
  removeModalRoot: S3ResourceSelectorProps['removeModalRoot'];
  onDismiss: () => void;
  onSubmit: (resource: S3ResourceSelectorProps.Resource) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(_value: never) {
  return null;
}

interface S3BrowseState {
  selectedItem: string | null;
  currentView: 'buckets' | 'objects' | 'versions';
  breadcrumbs: ReadonlyArray<string>;
}

type S3BrowseActions =
  | { type: 'browse-buckets' }
  | { type: 'browse-objects' | 'browse-versions'; breadcrumbs: S3BrowseState['breadcrumbs'] }
  | { type: 'select-item'; item: string };

const initialBrowseState: S3BrowseState = {
  selectedItem: null,
  currentView: 'buckets',
  breadcrumbs: [],
};

function s3BrowseReducer(state: S3BrowseState, action: S3BrowseActions) {
  switch (action.type) {
    case 'browse-buckets':
      return initialBrowseState;
    case 'browse-objects':
      return {
        selectedItem: null,
        currentView: 'objects' as const,
        breadcrumbs: action.breadcrumbs,
      };
    case 'browse-versions':
      return {
        selectedItem: null,
        currentView: 'versions' as const,
        breadcrumbs: action.breadcrumbs,
      };
    case 'select-item':
      return {
        ...state,
        selectedItem: action.item,
      };
    default:
      assertNever(action);
  }
  return state;
}

function createResourceInfo({ currentView, breadcrumbs, selectedItem }: S3BrowseState) {
  const prefix = 's3://';
  if (currentView === 'versions') {
    return { uri: prefix + joinObjectPath(breadcrumbs), versionId: selectedItem ?? undefined };
  }
  return { uri: prefix + joinObjectPath([...breadcrumbs, selectedItem!]) };
}

export function S3Modal({
  i18nStrings,
  alert,
  selectableItemsTypes,
  fetchBuckets,
  bucketsVisibleColumns,
  bucketsIsItemDisabled,
  fetchObjects,
  objectsVisibleColumns,
  objectsIsItemDisabled,
  fetchVersions,
  versionsVisibleColumns,
  versionsIsItemDisabled,
  getModalRoot,
  removeModalRoot,
  onSubmit,
  onDismiss,
}: S3ModalProps) {
  const [{ currentView, breadcrumbs, selectedItem }, dispatch] = useReducer(s3BrowseReducer, initialBrowseState);
  const forwardFocusRef = useRef<ForwardFocusRef>(null);
  const i18n = useInternalI18n('s3-resource-selector');

  const isVisualRefresh = useVisualRefresh();

  useEffectOnUpdate(() => {
    forwardFocusRef.current?.focus();
  }, [breadcrumbs]);

  return (
    <div>
      <InternalModal
        visible={true}
        size="max"
        getModalRoot={getModalRoot}
        removeModalRoot={removeModalRoot}
        closeAriaLabel={i18nStrings?.labelModalDismiss}
        onDismiss={onDismiss}
        header={i18n('i18nStrings.modalTitle', i18nStrings?.modalTitle)}
        footer={
          <InternalSpaceBetween className={styles['modal-actions']} size="xs" direction="horizontal">
            <InternalButton variant="link" formAction="none" onClick={onDismiss}>
              {i18n('i18nStrings.modalCancelButton', i18nStrings?.modalCancelButton)}
            </InternalButton>
            <InternalButton
              variant="primary"
              className={styles['submit-button']}
              disabled={!selectedItem}
              formAction="none"
              onClick={() => onSubmit(createResourceInfo({ currentView, breadcrumbs, selectedItem }))}
            >
              {i18n('i18nStrings.modalSubmitButton', i18nStrings?.modalSubmitButton)}
            </InternalButton>
          </InternalSpaceBetween>
        }
      >
        <InternalSpaceBetween size={isVisualRefresh ? 'xxs' : 'xs'}>
          <InternalBreadcrumbGroup
            ariaLabel={i18n('i18nStrings.labelBreadcrumbs', i18nStrings?.labelBreadcrumbs)}
            expandAriaLabel={i18nStrings?.labelExpandBreadcrumbs}
            onFollow={event => {
              event.preventDefault();
              event.detail.item.meta.onClick();
            }}
            items={[
              {
                text: i18n('i18nStrings.modalBreadcrumbRootItem', i18nStrings?.modalBreadcrumbRootItem) ?? '',
                href: '',
                meta: { onClick: () => dispatch({ type: 'browse-buckets' }) },
              },
              ...breadcrumbs.map((segment, index) => ({
                text: segment,
                href: '',
                meta: {
                  onClick: () =>
                    dispatch({
                      type: 'browse-objects',
                      breadcrumbs: breadcrumbs.slice(0, index + 1),
                    }),
                },
              })),
            ]}
          />
          {alert}
          {currentView === 'buckets' ? (
            <BucketsTable
              forwardFocusRef={forwardFocusRef}
              fetchData={fetchBuckets}
              visibleColumns={bucketsVisibleColumns}
              isItemDisabled={bucketsIsItemDisabled}
              selectableItemsTypes={selectableItemsTypes}
              i18nStrings={i18nStrings}
              isVisualRefresh={isVisualRefresh}
              onDrilldown={path =>
                dispatch({
                  type: 'browse-objects',
                  breadcrumbs: [path],
                })
              }
              onSelect={item => dispatch({ type: 'select-item', item })}
            />
          ) : currentView === 'objects' ? (
            <ObjectsTable
              forwardFocusRef={forwardFocusRef}
              pathSegments={breadcrumbs}
              fetchData={fetchObjects}
              visibleColumns={objectsVisibleColumns}
              isItemDisabled={objectsIsItemDisabled}
              selectableItemsTypes={selectableItemsTypes}
              i18nStrings={i18nStrings}
              isVisualRefresh={isVisualRefresh}
              onDrilldown={item => {
                dispatch({
                  type: item.IsFolder ? 'browse-objects' : 'browse-versions',
                  breadcrumbs: [...breadcrumbs, item.Key!],
                });
              }}
              onSelect={item => dispatch({ type: 'select-item', item })}
            />
          ) : currentView === 'versions' ? (
            <VersionsTable
              forwardFocusRef={forwardFocusRef}
              pathSegments={breadcrumbs}
              fetchData={fetchVersions}
              visibleColumns={versionsVisibleColumns}
              isItemDisabled={versionsIsItemDisabled}
              i18nStrings={i18nStrings}
              isVisualRefresh={isVisualRefresh}
              onSelect={item => dispatch({ type: 'select-item', item })}
            />
          ) : (
            assertNever(currentView)
          )}
        </InternalSpaceBetween>
      </InternalModal>
    </div>
  );
}
