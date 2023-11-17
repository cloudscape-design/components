// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import Autosuggest from '~components/autosuggest';
import Alert from '~components/alert';
import React, { useState } from 'react';

export default function () {
  const [isSubmitted, setSubmitted] = useState(false);
  return (
    <>
      <h1>Autosuggest in a form</h1>
      <form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Autosuggest
          data-testid="autosuggest-with-keydown"
          placeholder="Should not submit the form"
          value=""
          empty="No suggestions"
          onKeyDown={event => {
            if (event.detail.key === 'Enter') {
              event.preventDefault();
            }
          }}
        />
        <Autosuggest
          data-testid="autosuggest-no-keydown"
          placeholder="Can submit the form"
          value=""
          empty="No suggestions"
        />
        <button type="submit">Submit</button>
      </form>
      {isSubmitted && (
        <Alert data-testid="submit-message" dismissible={true} onDismiss={() => setSubmitted(false)}>
          Form sent!
        </Alert>
      )}
    </>
  );
}
