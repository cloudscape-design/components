// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import TagEditor, { TagEditorProps } from '../../../lib/components/tag-editor';
import { i18nStrings } from './common';

const defaultProps: TagEditorProps = {
  i18nStrings,
  tags: [
    { key: 'a', value: '1', existing: true },
    { key: 'b', value: '2', existing: true },
    { key: 'c', value: '3', existing: false },
  ],
};

test('simple', async () => {
  const { container } = render(<TagEditor {...defaultProps} />);
  await expect(container).toValidateA11y();
});

test('over limit', async () => {
  const { container } = render(<TagEditor {...defaultProps} tagLimit={2} />);
  await expect(container).toValidateA11y();
});

test('field validation error', async () => {
  const { container } = render(
    <TagEditor {...defaultProps} tags={[...defaultProps.tags!, { key: 'aws:', value: '', existing: false }]} />
  );
  await expect(container).toValidateA11y();
});
