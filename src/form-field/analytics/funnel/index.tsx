// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

import { useFunnelContext } from '../../../internal/analytics/hooks/use-funnel';
import { FormFieldProps } from '../../interfaces';

interface UseFormFieldFunnel {
  errorText: FormFieldProps['errorText'];
  rootRef: React.MutableRefObject<HTMLElement | null> | null;
  getLabelText: () => string;
  getErrorText: () => string;
}
export const useFormFieldFunnel = ({ rootRef, errorText, getLabelText, getErrorText }: UseFormFieldFunnel) => {
  const funnelContext = useFunnelContext();

  useEffect(() => {
    const fieldLabel = getLabelText();
    const fieldError = getErrorText();

    // TODO: Move data attribute to common place
    const parentSubstepElement = rootRef?.current?.closest('[data-funnel-substep-id]');
    const substepId = parentSubstepElement?.getAttribute('data-funnel-substep-id');
    funnelContext?.controller?.currentStep?.substeps.forEach(substep => {
      if (substep.id === substepId) {
        substep.error({ errorText: fieldError, scope: { type: 'field', label: fieldLabel } });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorText]);
};
