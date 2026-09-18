// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import FormField from '~components/form-field';
import RichTextEditor from '~components/rich-text-editor';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

export default function RichTextEditorSimplePage() {
  const [value, setValue] = useState<string>('<p>Hello, <b>Cloudscape</b>!</p>');
  return (
    <Box padding="l">
      <h1>Rich text editor (WIP v0)</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <FormField label="Description" description="A minimal WYSIWYG editor over contenteditable.">
            <RichTextEditor
              value={value}
              placeholder="Enter formatted text"
              ariaLabel="Description editor"
              onChange={event => setValue(event.detail.value)}
            />
          </FormField>

          <FormField label="Read-only">
            <RichTextEditor value={value} readOnly={true} ariaLabel="Read-only editor" onChange={() => {}} />
          </FormField>

          <Box variant="code">{value}</Box>
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
