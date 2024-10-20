// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { useFunnelContext } from '../internal/analytics/hooks/use-funnel';
import { useFunnelSubstep } from '../internal/analytics/hooks/use-funnel-substep';
import { ButtonContext, ButtonContextProps } from '../internal/context/button-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ModalProps } from './interfaces';
import InternalModal, { InternalModalProps } from './internal';

export { ModalProps };

function FocusEnabledModal({ visible, footer, ...props }: InternalModalProps) {
  const modalId = useUniqueId();
  const ref = useRef<HTMLDivElement>(null);
  const funnelContext = useFunnelContext();
  const funnelSubstep = useFunnelSubstep(ref);

  useEffect(() => {
    if (!funnelContext || !funnelContext?.controller || !visible) {
      return;
    }

    const funnelName = document.querySelector<HTMLHeadingElement>(`[data-modalid="${modalId}"] h2`)?.innerText || '';

    funnelContext.controller?.setName(funnelName);
    funnelContext.controller?.currentStep.setName(funnelName);

    funnelSubstep.setName(funnelName);
    funnelContext.controller?.currentStep.registerSubstep(funnelSubstep);

    const funnelStartTimeout = setTimeout(() => {
      funnelContext.controller?.start();
    }, 0);

    return () => {
      funnelContext.controller?.complete();
      clearTimeout(funnelStartTimeout);
    };
  }, [modalId, visible, funnelContext, funnelSubstep]);

  const handleButtonClick: ButtonContextProps['onClick'] = ({ variant }) => {
    if (variant === 'primary') {
      funnelContext?.controller?.submit();
    }
  };

  const referrerId =
    funnelContext?.controller?.context?.currentStep?.currentSubstep?.id ??
    funnelContext?.controller?.context?.currentStep?.id ??
    funnelContext?.controller?.context?.id;

  return (
    <InternalModal
      referrerId={referrerId}
      data-modalid={modalId}
      visible={visible}
      footer={<ButtonContext.Provider value={{ onClick: handleButtonClick }}>{footer}</ButtonContext.Provider>}
      {...props}
    >
      <div ref={ref}>{props.children}</div>
    </InternalModal>
  );
}

export default function Modal({ size = 'medium', ...props }: ModalProps) {
  const baseComponentProps = useBaseComponent('Modal', {
    props: { size, disableContentPaddings: props.disableContentPaddings },
  });
  return (
    <FunnelProvider rootComponent="modal" allowNesting={false}>
      <FocusEnabledModal size={size} {...props} {...baseComponentProps} __injectAnalyticsComponentMetadata={true} />
    </FunnelProvider>
  );
}

applyDisplayName(Modal, 'Modal');
