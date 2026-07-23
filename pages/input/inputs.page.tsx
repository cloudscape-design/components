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

// ── Character count demos ──────────────────────────────────────────────────

function CharacterCountStandalone() {
  const [value, setValue] = useState('');
  return (
    <SpaceBetween size="xs">
      <h3>Standalone — maxLength=50, showCharacterCount</h3>
      <Input
        ariaLabel="Short description"
        placeholder="Enter a short description"
        value={value}
        maxLength={50}
        showCharacterCount={true}
        onChange={e => setValue(e.detail.value)}
      />
    </SpaceBetween>
  );
}

function CharacterCountInFormField() {
  const [value, setValue] = useState('Hello');
  return (
    <SpaceBetween size="xs">
      <h3>Inside FormField — maxLength=100, showCharacterCount</h3>
      <FormField
        label="Resource name"
        description="Maximum 100 characters."
        constraintText="Only alphanumeric characters and hyphens are allowed."
        controlId="res-name"
      >
        <Input
          controlId="res-name"
          placeholder="my-resource-name"
          value={value}
          maxLength={100}
          showCharacterCount={true}
          onChange={e => setValue(e.detail.value)}
        />
      </FormField>
    </SpaceBetween>
  );
}

function CharacterCountAtLimit() {
  const max = 20;
  const [value, setValue] = useState('This is exactly 20!');
  return (
    <SpaceBetween size="xs">
      <h3>At limit — maxLength=20</h3>
      <Input
        ariaLabel="At-limit input"
        value={value}
        maxLength={max}
        showCharacterCount={true}
        onChange={e => setValue(e.detail.value)}
      />
    </SpaceBetween>
  );
}

function CharacterCountDisabled() {
  return (
    <SpaceBetween size="xs">
      <h3>Disabled with character count</h3>
      <Input
        ariaLabel="Disabled with count"
        value="disabled text"
        maxLength={30}
        showCharacterCount={true}
        disabled={true}
        onChange={() => {}}
      />
    </SpaceBetween>
  );
}

function MaxLengthOnly() {
  const [value, setValue] = useState('');
  return (
    <SpaceBetween size="xs">
      <h3>maxLength only (no showCharacterCount) — enforces limit without visual counter</h3>
      <Input
        ariaLabel="maxLength only"
        placeholder="Max 10 chars, no counter"
        value={value}
        maxLength={10}
        onChange={e => setValue(e.detail.value)}
      />
    </SpaceBetween>
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

      <hr />
      <h2>Character count / maxlength (AWSUI-58637)</h2>
      <SpaceBetween size="l">
        <CharacterCountStandalone />
        <CharacterCountInFormField />
        <CharacterCountAtLimit />
        <CharacterCountDisabled />
        <MaxLengthOnly />
      </SpaceBetween>
    </div>
  );
}
