// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import CodeEditor from '../../../lib/components/code-editor';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { defaultProps, editorMock } from './util';

beforeEach(() => {
  editorMock.renderer.textarea = document.createElement('textarea');
});

test('renders own aria-attributes', () => {
  render(
    <CodeEditor
      {...defaultProps}
      controlId="123"
      ariaLabelledby="something-label"
      ariaDescribedby="something-description"
    />
  );
  expect(editorMock.renderer.textarea).toHaveAttribute('id', '123');
  expect(editorMock.renderer.textarea).toHaveAttribute('aria-labelledby', 'something-label');
  expect(editorMock.renderer.textarea).toHaveAttribute('aria-describedby', 'something-description');
});

test('no aria-attributes by default', () => {
  render(<CodeEditor {...defaultProps} />);
  expect(editorMock.renderer.textarea).not.toHaveAttribute('id');
  expect(editorMock.renderer.textarea).not.toHaveAttribute('aria-labelledby');
  expect(editorMock.renderer.textarea).not.toHaveAttribute('aria-describedby');
});

test('inherits aria-attributes from surrounding form field', () => {
  render(
    <FormField label="Some code" description="This is code" controlId="123">
      <CodeEditor {...defaultProps} />
    </FormField>
  );
  expect(editorMock.renderer.textarea).toHaveAttribute('id', '123');
  expect(editorMock.renderer.textarea).toHaveAttribute('aria-labelledby', '123-label');
  expect(editorMock.renderer.textarea).toHaveAttribute('aria-describedby', '123-description');
});

test('does not render invalid state inside preferences modal', () => {
  render(
    <FormField label="Some code" errorText="Some error">
      <CodeEditor {...defaultProps} />
    </FormField>
  );
  const wrapper = createWrapper();
  wrapper.findCodeEditor()!.findSettingsButton()!.click();
  expect(wrapper.findModal()!.findContent().find('[aria-invalid]')).toBeFalsy();
});
