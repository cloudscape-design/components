// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MutableRefObject, useEffect } from 'react';

import { useFunnel } from '../../../internal/analytics/funnel/hooks/use-funnel';
import { useFunnelSubstep } from '../../../internal/analytics/funnel/hooks/use-funnel-substep';
import { ButtonContextProps } from '../../../internal/context/button-context';
import { useUniqueId } from '../../../internal/hooks/use-unique-id';
import { ModalProps } from '../../interfaces';

interface UseModalFunnel {
  contentRef: MutableRefObject<HTMLElement | null>;
  visible: ModalProps['visible'];
}

// TODO: Better funnel name retrievel as this does not cater for iframes
function getFunnelName(modalId: string) {
  return document.querySelector<HTMLHeadingElement>(`[data-modalid="${modalId}"] h2`)?.innerText || '';
}

export const useModalFunnel = ({ contentRef, visible }: UseModalFunnel) => {
  const modalId = useUniqueId();
  const { funnelContext } = useFunnel();
  const funnelSubstep = useFunnelSubstep(contentRef);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const funnelName = getFunnelName(modalId);
    funnelSubstep.setName(funnelName);
  }, [funnelSubstep, modalId, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const funnelName = getFunnelName(modalId);
    funnelContext?.controller?.setFunnelType('modal');
    funnelContext?.controller?.setName(funnelName);
    funnelContext?.controller?.currentStep.setName(funnelName);
    funnelContext?.controller?.currentStep.registerSubstep(funnelSubstep);

    funnelContext?.controller?.start();
    return () => {
      funnelContext?.controller?.complete();
    };

    // FIXME: Can this effect be broken down to separate hooks to be able to include all deps?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const buttonContextProps: ButtonContextProps = {
    onClick: ({ variant }) => {
      if (variant === 'primary') {
        funnelContext?.controller?.submit();
      }
    },
    onLoadingChange: ({ value, variant }) => {
      if (variant === 'primary' && typeof value === 'boolean') {
        funnelContext?.controller?.validate(value);
      }
    },
  };

  const referrerId =
    funnelContext?.controller?.context?.currentStep?.currentSubstep?.id ??
    funnelContext?.controller?.context?.currentStep?.id ??
    funnelContext?.controller?.context?.id;

  const dataAttributes = {
    'data-modalid': modalId,
  };

  return { funnelProps: { referrerId, ...dataAttributes }, buttonContextProps };
};
