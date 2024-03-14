// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ModalProps } from './interfaces';
import InternalModal from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { ModalProps };

export default function Modal({ size = 'medium', ...props }: ModalProps) {
  const baseComponentProps = useBaseComponent('Modal', {
    props: { size, disableContentPaddings: props.disableContentPaddings },
  });
  return <InternalModal size={size} {...props} {...baseComponentProps} />;
}

applyDisplayName(Modal, 'Modal');
