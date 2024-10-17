// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { useFunnel } from '../internal/analytics/hooks/use-funnel';
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
  const funnel = useFunnel();
  const funnelSubstep = useFunnelSubstep(ref);

  useEffect(() => {
    if (!funnel || !funnel?.controller || !visible) {
      return;
    }

    const funnelName = document.querySelector<HTMLHeadingElement>(`[data-modalid="${modalId}"] h2`)?.innerText || '';

    funnel.controller?.setName(funnelName);
    funnel.controller?.currentStep.setName(funnelName);

    funnelSubstep.setName(funnelName);
    funnel.controller?.currentStep.registerSubstep(funnelSubstep);

    const funnelStartTimeout = setTimeout(() => {
      funnel.controller?.start();
    }, 0);

    return () => {
      funnel.controller?.complete();
      clearTimeout(funnelStartTimeout);
    };
  }, [modalId, visible, funnel, funnelSubstep]);

  const handleButtonClick: ButtonContextProps['onClick'] = ({ variant }) => {
    if (variant === 'primary') {
      funnel?.controller?.submit();
    }
  };

  const referrerId =
    funnel?.controller?.context?.currentStep?.currentSubstep?.id ??
    funnel?.controller?.context?.currentStep?.id ??
    funnel?.controller?.context?.id;

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
