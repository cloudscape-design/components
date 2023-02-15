// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { fireNonCancelableEvent } from '../internal/events';
import { getBaseProps } from '../internal/base-component';
import InternalBox from '../box/internal';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import InternalModal from '../modal/internal';
import InternalSpaceBetween from '../space-between/internal';
import {
  copyPreferences,
  mergePreferences,
  ModalContentLayout,
  PageSizePreference,
  WrapLinesPreference,
  StripedRowsPreference,
  ContentDensityPreference,
  CustomPreference,
} from './utils';
import VisibleContentPreference from './visible-content';
import checkControlled from '../internal/hooks/check-controlled';
import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { CollectionPreferencesProps };

export default function CollectionPreferences({
  title,
  confirmLabel,
  cancelLabel,
  disabled = false,
  onConfirm,
  onCancel,
  visibleContentPreference,
  pageSizePreference,
  wrapLinesPreference,
  stripedRowsPreference,
  contentDensityPreference,
  preferences,
  customPreference,
  ...rest
}: CollectionPreferencesProps) {
  const { __internalRootRef } = useBaseComponent('CollectionPreferences');
  checkControlled('CollectioPreferences', 'preferences', preferences, 'onConfirm', onConfirm);
  const baseProps = getBaseProps(rest);
  const [modalVisible, setModalVisible] = useState(false);
  const [temporaryPreferences, setTemporaryPreferences] = useState(copyPreferences(preferences || {}));
  const triggerRef = useRef<ButtonProps.Ref>(null);
  const dialogPreviouslyOpen = useRef(false);
  useEffect(() => {
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

  const hasLeftContent = !!(pageSizePreference || wrapLinesPreference || stripedRowsPreference || customPreference);
  const hasRightContent = !!visibleContentPreference;

  const onChange = changedPreferences =>
    setTemporaryPreferences(mergePreferences(changedPreferences, temporaryPreferences));

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      <InternalButton
        ref={triggerRef}
        className={styles['trigger-button']}
        disabled={disabled}
        ariaLabel={title}
        onClick={() => {
          setTemporaryPreferences(copyPreferences(preferences || {}));
          setModalVisible(true);
        }}
        variant="icon"
        iconName="settings"
        formAction="none"
      />
      {!disabled && modalVisible && (
        <InternalModal
          className={styles['modal-root']}
          visible={true}
          header={title}
          footer={
            <InternalBox float="right">
              <InternalSpaceBetween direction="horizontal" size="xs">
                <InternalButton
                  className={styles['cancel-button']}
                  variant="link"
                  formAction="none"
                  onClick={onCancelListener}
                >
                  {cancelLabel}
                </InternalButton>
                <InternalButton
                  className={styles['confirm-button']}
                  variant="primary"
                  formAction="none"
                  onClick={onConfirmListener}
                >
                  {confirmLabel}
                </InternalButton>
              </InternalSpaceBetween>
            </InternalBox>
          }
          closeAriaLabel={cancelLabel}
          size={hasLeftContent && hasRightContent ? 'large' : 'medium'}
          onDismiss={onCancelListener}
        >
          <ModalContentLayout
            left={
              hasLeftContent && (
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
              visibleContentPreference && (
                <VisibleContentPreference
                  value={temporaryPreferences.visibleContent}
                  {...visibleContentPreference}
                  onChange={visibleContent => onChange({ visibleContent })}
                />
              )
            }
          />
        </InternalModal>
      )}
    </div>
  );
}

applyDisplayName(CollectionPreferences, 'CollectionPreferences');
