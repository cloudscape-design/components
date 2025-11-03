// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Textarea from '~components/textarea';

export default function Page() {
  const [value, setValue] = useState('');
  const [submitStatus, setSubmitStatus] = useState(false);

  return (
    <div id="test" style={{ padding: 10 }}>
      <h1>Textarea submit test</h1>
      {submitStatus ? <div id="submit-success">Submitted</div> : null}
      <form
        onSubmit={event => {
          console.log('submitted');
          event.preventDefault();
          setSubmitStatus(true);
        }}
      >
        <Textarea value={value} ariaLabel="textarea" onChange={event => setValue(event.detail.value)} />
      </form>
    </div>
  );
}
