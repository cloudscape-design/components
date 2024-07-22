// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Button from '~components/button';

export default function ButtonsPage() {
  return (
    <>
      <h1>Testing visible focus outline</h1>
      <Button id="first-button">First button</Button>
      <Button id="second-button">Second button</Button>
      <Button disabled={true} id="dismiss-focus">
        Focus dismiss target
      </Button>
    </>
  );
}
