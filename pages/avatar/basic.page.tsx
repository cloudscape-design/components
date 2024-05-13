// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Avatar from '~components/avatar';

export default function AvatarsPage() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Avatar demo</h1>

      <Avatar variant="user" i18nStrings={{ userIconAriaLabel: 'User agent' }} />
      <Avatar variant="genai" i18nStrings={{ genAiIconAriaLabel: 'Assistant agent' }} />
      <Avatar variant="user" userName="Timothee Fontaka" />
      <Avatar variant="genai" loading={true} i18nStrings={{ loading: 'Loading' }} />

      <div style={{ marginTop: '15px' }}>
        <Avatar variant="user" />
      </div>
      <br />
      <div>
        <Avatar variant="genai" />
      </div>
      <br />
      <div>
        <Avatar variant="user" userName="Timothee Fontaka" />
      </div>
      <br />
      <div>
        <Avatar variant="genai" loading={true} />
      </div>
    </div>
  );
}
