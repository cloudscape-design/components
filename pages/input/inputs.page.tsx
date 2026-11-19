// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Container from '~components/container';
import FormField from '~components/form-field';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import Textarea from '~components/textarea';

function Inputs() {
  const [inputValue, setInputValue] = useState('something');
  const [textareaValue, setTextareaValue] = useState('something');
  return (
    <SpaceBetween size="xs">
      <Input ariaLabel="input" placeholder="Enter something" value="" readOnly={true} />
      <Input
        ariaLabel="invalid input"
        invalid={true}
        value={inputValue}
        onChange={event => setInputValue(event.detail.value)}
      />
      <Input ariaLabel="disabled input" disabled={true} placeholder="Enter something" value="" />

      <Textarea ariaLabel="textarea" placeholder="Enter something" value="" readOnly={true} />
      <Textarea
        ariaLabel="Invalid textarea"
        invalid={true}
        value={textareaValue}
        onChange={event => setTextareaValue(event.detail.value)}
      />
      <Textarea ariaLabel="Disabled textarea" disabled={true} placeholder="Enter something" value="" />
    </SpaceBetween>
  );
}

function SimpleForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div style={{ maxWidth: 400, padding: 10 }}>
      <Container header="Simple form">
        <SpaceBetween size="xs">
          <Input ariaLabel="Login" placeholder="Login" value={login} onChange={event => setLogin(event.detail.value)} />

          <Input
            ariaLabel="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={event => setPassword(event.detail.value)}
          />

          <Button variant="primary">Login</Button>
        </SpaceBetween>
      </Container>
    </div>
  );
}

export default function InputsPage() {
  return (
    <div style={{ padding: 10 }}>
      <h1>Inputs demo</h1>
      <Inputs />
      <SimpleForm />
      <FormField description="This is a description." label="Form field label" id="formfield-with-input">
        <Input value={''} onChange={() => {}} />
      </FormField>
    </div>
  );
}
