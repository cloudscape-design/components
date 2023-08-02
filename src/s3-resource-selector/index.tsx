// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useState, useRef, useEffect } from 'react';
import InternalBox from '../box/internal';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { S3InContext, S3InContextRef } from './s3-in-context';
import { S3ResourceSelectorProps } from './interfaces';
import { S3Modal, S3ModalProps } from './s3-modal';
import styles from './styles.css.js';
import useBaseComponent from '../internal/hooks/use-base-component';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { useFormFieldContext } from '../contexts/form-field';

export { S3ResourceSelectorProps };

const S3ResourceSelector = React.forwardRef(
  (
    {
      i18nStrings,
      inputPlaceholder,
      alert,
      resource,
      viewHref,
      invalid,
      selectableItemsTypes = [],
      inputAriaDescribedby,
      bucketsVisibleColumns = ['Name', 'CreationDate'],
      bucketsIsItemDisabled,
      fetchBuckets,
      fetchObjects,
      objectsVisibleColumns = ['Key', 'LastModified', 'Size'],
      objectsIsItemDisabled,
      fetchVersions,
      versionsVisibleColumns = ['ID', 'LastModified', 'Size'],
      versionsIsItemDisabled,
      onChange,
      ariaLabel,
      ...rest
    }: S3ResourceSelectorProps,
    ref: React.Ref<S3ResourceSelectorProps.Ref>
  ) => {
    checkSafeUrl('S3ResourceSelector', viewHref);
    const { __internalRootRef } = useBaseComponent('S3ResourceSelector');
    const [modalOpen, setModalOpen] = useState(false);
    const inContextRef = useRef<S3InContextRef>(null);
    const modalWasSubmitted = useRef<boolean>(false);
    useForwardFocus(ref, inContextRef);
    const { ariaLabelledby, ariaDescribedby } = useFormFieldContext(rest);

    useEffect(() => {
      // Focus uriInput only when modal was submitted.
      // When it was dismissed, the focus naturally goes to previously focused element (browse button)
      if (!modalOpen && modalWasSubmitted.current) {
        modalWasSubmitted.current = false;
        inContextRef.current?.focus();
      }
    }, [modalOpen]);

    const baseProps = getBaseProps(rest);
    const modalProps: S3ModalProps = {
      alert,
      i18nStrings,
      fetchBuckets,
      selectableItemsTypes,
      bucketsVisibleColumns,
      bucketsIsItemDisabled,
      fetchObjects,
      objectsVisibleColumns,
      objectsIsItemDisabled,
      fetchVersions,
      versionsVisibleColumns,
      versionsIsItemDisabled,
      onSubmit: resource => {
        fireNonCancelableEvent(onChange, { resource });
        setModalOpen(false);
        modalWasSubmitted.current = true;
      },
      onDismiss: () => setModalOpen(false),
    };
    return (
      <div
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        ref={__internalRootRef}
        role="group"
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
      >
        <S3InContext
          ref={inContextRef}
          selectableItemsTypes={selectableItemsTypes}
          i18nStrings={i18nStrings}
          inputPlaceholder={inputPlaceholder}
          resource={resource}
          viewHref={viewHref}
          invalid={invalid}
          inputAriaDescribedby={inputAriaDescribedby}
          fetchVersions={fetchVersions}
          onBrowse={() => setModalOpen(true)}
          onChange={(resource, errorText) => fireNonCancelableEvent(onChange, { resource, errorText })}
        />
        {!modalOpen && alert && (
          <InternalBox className={styles.alert} margin={{ top: 's' }}>
            {alert}
          </InternalBox>
        )}
        {modalOpen && <S3Modal {...modalProps} />}
      </div>
    );
  }
);

applyDisplayName(S3ResourceSelector, 'S3ResourceSelector');
export default S3ResourceSelector;
