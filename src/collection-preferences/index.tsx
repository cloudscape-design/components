// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalBox from '../box/internal';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { CollectionPreferencesMetadata } from '../internal/context/collection-preferences-metadata-context';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalModal from '../modal/internal';
import InternalSpaceBetween from '../space-between/internal';
import { getComponentAnalyticsMetadata } from './analytics-metadata/utils';
import ContentDisplayPreference from './content-display';
import { CollectionPreferencesProps } from './interfaces';
import {
  ContentDensityPreference,
  copyPreferences,
  CustomPreference,
  mergePreferences,
  ModalContentLayout,
  PageSizePreference,
  StickyColumnsPreference,
  StripedRowsPreference,
  WrapLinesPreference,
} from './utils';
import VisibleContentPreference from './visible-content';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export { CollectionPreferencesProps };

const componentName = 'CollectionPreferences';

export default function CollectionPreferences({
  title,
  confirmLabel,
  cancelLabel,
  disabled = false,
  onConfirm,
  onCancel,
  visibleContentPreference,
  contentDisplayPreference,
  pageSizePreference,
  wrapLinesPreference,
  stripedRowsPreference,
  contentDensityPreference,
  stickyColumnsPreference,

  preferences,
  customPreference,
  getModalRoot,
  removeModalRoot,
  ...rest
}: CollectionPreferencesProps) {
  const parentMetadata = useContext(CollectionPreferencesMetadata);
  const { __internalRootRef } = useBaseComponent('CollectionPreferences', {
    props: {},
    metadata: {
      ...parentMetadata,
      hasStripedRowsPreference: !!stripedRowsPreference,
      hasVisibleContentPreference: !!visibleContentPreference,
      hasContentDisplayPreference: !!contentDisplayPreference,
      hasContentDensityPreference: !!contentDensityPreference,
      hasStickyColumnsPreference: !!stickyColumnsPreference,
    },
  });
  checkControlled('CollectionPreferences', 'preferences', preferences, 'onConfirm', onConfirm);

  const i18n = useInternalI18n('collection-preferences');
  const baseProps = getBaseProps(rest);
  const [modalVisible, setModalVisible] = useState(false);
  const [temporaryPreferences, setTemporaryPreferences] = useState(copyPreferences(preferences || {}));
  const triggerRef = useRef<ButtonProps.Ref>(null);
  const dialogPreviouslyOpen = useRef(false);

  useLayoutEffect(() => {
    if (!modalVisible) {
      dialogPreviouslyOpen.current && triggerRef.current && triggerRef.current.focus();
    } else {
      dialogPreviouslyOpen.current = true;
    }
  }, [modalVisible]);

  const onConfirmListener = () => {
    setModalVisible(false);
    fireNonCancelableEvent(onConfirm, temporaryPreferences);
  };

  const onCancelListener = () => {
    fireNonCancelableEvent(onCancel, {});
    setModalVisible(false);
    setTemporaryPreferences(copyPreferences(preferences || {}));
  };

  const hasContentOnTheLeft = !!(
    pageSizePreference ||
    wrapLinesPreference ||
    stripedRowsPreference ||
    contentDensityPreference ||
    stickyColumnsPreference ||
    customPreference
  );
  const hasContentOnTheRight = !!(visibleContentPreference || contentDisplayPreference);

  const onChange = (changedPreferences: CollectionPreferencesProps.Preferences) =>
    setTemporaryPreferences(mergePreferences(changedPreferences, temporaryPreferences));

  if (visibleContentPreference && contentDisplayPreference) {
    warnOnce(
      componentName,
      'You provided both `visibleContentPreference` and `contentDisplayPreference` props. `visibleContentPreference` will be ignored and only `contentDisplayPreference` will be rendered.'
    );
  }

  const referrerId = useUniqueId();

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      <div
        id={referrerId}
        {...getAnalyticsMetadataAttribute({ component: getComponentAnalyticsMetadata(disabled, preferences) })}
      >
        <InternalButton
          ref={triggerRef}
          className={clsx(styles['trigger-button'], analyticsSelectors['trigger-button'])}
          disabled={disabled}
          ariaLabel={i18n('title', title)}
          onClick={() => {
            setTemporaryPreferences(copyPreferences(preferences || {}));
            setModalVisible(true);
          }}
          variant="icon"
          iconName="settings"
          formAction="none"
          analyticsAction="open"
        />
        {!disabled && modalVisible && (
          <InternalModal
            className={styles['modal-root']}
            visible={true}
            getModalRoot={getModalRoot}
            removeModalRoot={removeModalRoot}
            header={i18n('title', title)}
            referrerId={referrerId}
            footer={
              <InternalBox float="right">
                <InternalSpaceBetween direction="horizontal" size="xs">
                  <InternalButton
                    className={styles['cancel-button']}
                    variant="link"
                    formAction="none"
                    onClick={onCancelListener}
                    analyticsAction="cancel"
                  >
                    {i18n('cancelLabel', cancelLabel)}
                  </InternalButton>
                  <InternalButton
                    className={styles['confirm-button']}
                    variant="primary"
                    formAction="none"
                    onClick={onConfirmListener}
                    analyticsAction="confirm"
                  >
                    {i18n('confirmLabel', confirmLabel)}
                  </InternalButton>
                </InternalSpaceBetween>
              </InternalBox>
            }
            closeAriaLabel={cancelLabel}
            size={hasContentOnTheLeft && hasContentOnTheRight ? 'large' : 'medium'}
            onDismiss={onCancelListener}
          >
            <ModalContentLayout
              left={
                hasContentOnTheLeft && (
                  <InternalSpaceBetween size="l">
                    {pageSizePreference && (
                      <PageSizePreference
                        value={temporaryPreferences.pageSize}
                        {...pageSizePreference}
                        onChange={pageSize => onChange({ pageSize })}
                      />
                    )}
                    {wrapLinesPreference && (
                      <WrapLinesPreference
                        value={temporaryPreferences.wrapLines}
                        {...wrapLinesPreference}
                        onChange={wrapLines => onChange({ wrapLines })}
                      />
                    )}
                    {stripedRowsPreference && (
                      <StripedRowsPreference
                        value={temporaryPreferences.stripedRows}
                        {...stripedRowsPreference}
                        onChange={stripedRows => onChange({ stripedRows })}
                      />
                    )}
                    {contentDensityPreference && (
                      <ContentDensityPreference
                        value={temporaryPreferences.contentDensity}
                        {...contentDensityPreference}
                        onChange={contentDensity => onChange({ contentDensity })}
                      />
                    )}
                    {stickyColumnsPreference && (
                      <StickyColumnsPreference
                        value={temporaryPreferences.stickyColumns}
                        {...stickyColumnsPreference}
                        onChange={stickyColumns => onChange({ stickyColumns })}
                      />
                    )}
                    {customPreference && (
                      <CustomPreference
                        value={temporaryPreferences.custom}
                        customPreference={customPreference}
                        onChange={custom => onChange({ custom })}
                      />
                    )}
                  </InternalSpaceBetween>
                )
              }
              right={
                contentDisplayPreference ? (
                  <ContentDisplayPreference
                    {...contentDisplayPreference}
                    value={temporaryPreferences.contentDisplay}
                    onChange={contentDisplay => onChange({ contentDisplay })}
                  />
                ) : (
                  visibleContentPreference && (
                    <VisibleContentPreference
                      value={temporaryPreferences.visibleContent}
                      {...visibleContentPreference}
                      onChange={visibleItems => onChange({ visibleContent: visibleItems })}
                    />
                  )
                )
              }
            />
          </InternalModal>
        )}
      </div>
    </div>
  );
}

applyDisplayName(CollectionPreferences, componentName);
