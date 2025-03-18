// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FormFieldErrorDetail, Handler } from '../interfaces';
import { getFunnel } from '../utils/funnel';

export const error: Handler = ({ target, detail }) => {
  const funnel = getFunnel(target);
  if (!funnel) {
    console.warn('Could not find funnel for formfield error');
    return;
  }

  const { fieldLabel, fieldError } = detail as FormFieldErrorDetail;
  funnel.activeStep?.activeSubstep?.setFieldError(fieldLabel, fieldError);
};

export const errorClear: Handler = ({ target, detail }) => {
  const funnel = getFunnel(target);
  if (!funnel) {
    console.warn('Could not find funnel for formfield error clear');
    return;
  }

  const { fieldLabel } = detail as FormFieldErrorDetail;
  funnel.activeStep?.activeSubstep?.setFieldError(fieldLabel, '');
};
