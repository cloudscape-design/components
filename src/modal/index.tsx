// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { ButtonContext } from '../internal/context/button-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { useModalFunnel } from './analytics/funnel';
import { ModalProps } from './interfaces';
import InternalModal from './internal';

export { ModalProps };

function BaseModal({ size = 'medium', footer, ...props }: ModalProps) {
  const baseComponentProps = useBaseComponent('Modal', {
    props: { size, disableContentPaddings: props.disableContentPaddings },
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const { funnelProps, buttonContextProps } = useModalFunnel({
    contentRef,
    visible: props.visible,
  });

  return (
    <InternalModal
      size={size}
      footer={footer && <ButtonContext.Provider value={buttonContextProps}>{footer}</ButtonContext.Provider>}
      {...baseComponentProps}
      {...props}
      {...funnelProps}
      __injectAnalyticsComponentMetadata={true}
    >
      <div ref={contentRef}>{props.children}</div>
    </InternalModal>
  );
}

const Modal = (props: ModalProps) => {
  return (
    <FunnelProvider rootComponent="modal" allowNesting={false}>
      <BaseModal {...props} />
    </FunnelProvider>
  );
};

applyDisplayName(Modal, 'Modal');
export default Modal;
