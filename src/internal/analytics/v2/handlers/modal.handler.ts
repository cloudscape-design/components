// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Handler, PropertyChangeDetail } from '../interfaces';
import { findDown } from '../utils/browser';
import { getFunnel } from '../utils/funnel';

export const propertyChange: Handler<PropertyChangeDetail> = ({ target, detail }) => {
  const childForm = findDown('Form', target);
  if (!childForm) {
    return;
  }

  const funnel = getFunnel(childForm);
  const visible = detail!.value;
  if (visible) {
    funnel?.start();
  } else {
    funnel?.complete();
  }
};

export const submit: Handler = ({ target }) => {
  const childForm = findDown('Form', target);
  if (!childForm) {
    return;
  }

  const funnel = getFunnel(childForm);
  funnel?.submit();
};
