// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

export default function FocusTarget() {
  return (
    <p>
      Click here to focus so we can tab to the content below{' '}
      <button type="button" id="focus-target">
        focus
      </button>
    </p>
  );
}
