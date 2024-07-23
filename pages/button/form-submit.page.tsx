// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';

export default function ButtonIntegrationPage() {
  const [clickedButton, setClickedButton] = useState('');
  return (
    <article>
      <h1>Buttons with different types in a form</h1>

      <form onSubmit={event => event.preventDefault()}>
        <label>
          Input here:
          <input id="keyInput" name="test-value" />
        </label>
        <Button formAction="none" onClick={() => setClickedButton('Simple')}>
          Simple
        </Button>
        <Button formAction="submit" onClick={() => setClickedButton('Submit')}>
          Submit
        </Button>
        <span id="clickMessage">{clickedButton && `${clickedButton} button is triggered`}</span>
      </form>
    </article>
  );
}
