// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render as testingLibraryRender } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import FileTokenGroup, { FileTokenGroupProps } from '../../../lib/components/file-token-group';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

jest.mock('../../../lib/components/internal/utils/date-time', () => ({
  formatDateTime: () => '2020-06-01T00:00:00',
}));

const onDismiss = jest.fn();

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
  onDismiss.mockReset();
});

const defaultProps: FileTokenGroupProps = {
  items: [],
  onDismiss,
  i18nStrings: {
    removeFileAriaLabel: fileIndex => `Remove file ${fileIndex + 1}`,
    errorIconAriaLabel: 'Error',
    warningIconAriaLabel: 'Warning',
    limitShowFewer: 'Show fewer files',
    limitShowMore: 'Show more files',
  },
};

const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
  type: 'text/plain',
  lastModified: 1590962400000,
});
const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
  type: 'image/png',
  lastModified: 1590962400000,
});

function render(props: Partial<FileTokenGroupProps>) {
  const renderResult = testingLibraryRender(
    <div>
      <FileTokenGroup {...{ ...defaultProps, ...props }} />
      <div id="test-label">Test label</div>
    </div>
  );
  return createWrapper(renderResult.container).findFileTokenGroup()!;
}

function renderStateful(props: Partial<FileTokenGroupProps> = {}) {
  const { container } = testingLibraryRender(<StatefulFileTokenGroup {...props} />);
  return createWrapper(container).findFileTokenGroup()!;
}

function StatefulFileTokenGroup({ items: initialItems = [], ...rest }: Partial<FileTokenGroupProps>) {
  const [items, setItems] = useState(initialItems);
  return (
    <FileTokenGroup
      {...defaultProps}
      {...rest}
      items={items}
      onDismiss={event => setItems(prev => prev.filter((_, index) => index !== event.detail.fileIndex))}
    />
  );
}

describe('File upload tokens', () => {
  test(`renders file tokens`, () => {
    const wrapper = render({ items: [{ file: file1 }, { file: file2 }] });

    expect(wrapper.findFileTokens()).toHaveLength(2);

    expect(wrapper.findFileTokens()[0].getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.getElement()).toHaveTextContent('test-file-1.txt');

    expect(wrapper.findFileTokens()[1].getElement()).toHaveTextContent('test-file-2.txt');
    expect(wrapper.findFileToken(2)!.getElement()).toHaveTextContent('test-file-2.txt');
  });

  test('file token remove button has ARIA label set', () => {
    const wrapper = render({ items: [{ file: file1 }] });
    expect(wrapper.findFileToken(1)!.findFileDismiss()!.getElement()).toHaveAccessibleName('Remove file 1');
  });

  test('selected file can be removed', () => {
    const wrapperSingular = render({ items: [{ file: file1 }] });
    wrapperSingular.findFileToken(1)!.findFileDismiss()!.click();

    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { fileIndex: 0 } }));

    const wrapperMultiple = render({ items: [{ file: file1 }, { file: file2 }] });
    wrapperMultiple.findFileToken(2)!.findFileDismiss()!.click();

    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { fileIndex: 1 } }));
  });

  test('file token only shows name by default', () => {
    const wrapper = render({ items: [{ file: file1 }] });

    expect(wrapper.findFileToken(1)!.findFileName().getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.findFileSize()).toBe(null);
    expect(wrapper.findFileToken(1)!.findFileLastModified()).toBe(null);
    expect(wrapper.findFileToken(1)!.findFileThumbnail()).toBe(null);
  });

  test('file token metadata can be opt-in', () => {
    const wrapper = render({
      items: [{ file: file1 }],
      showFileSize: true,
      showFileLastModified: true,
    });
    expect(wrapper.findFileToken(1)!.findFileName().getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.findFileSize()!.getElement()).toHaveTextContent('0.01 KB');
    expect(wrapper.findFileToken(1)!.findFileLastModified()!.getElement()).toHaveTextContent('2020-06-01T00:00:00');
  });

  test('thumbnail is only shown  when file type starts with "image"', () => {
    expect(
      render({ items: [{ file: file1 }], showFileThumbnail: true })
        .findFileToken(1)!
        .findFileThumbnail()
    ).toBe(null);

    expect(
      render({ items: [{ file: file2 }], showFileThumbnail: true })
        .findFileToken(1)!
        .findFileThumbnail()
    ).not.toBe(null);
  });

  test('selected file size can be customized', () => {
    const wrapper = render({
      items: [{ file: file1 }],
      showFileSize: true,
      i18nStrings: {
        ...defaultProps.i18nStrings,
        formatFileSize: sizeInBytes => `${sizeInBytes} bytes`,
      },
    });
    expect(wrapper.findFileToken(1)!.findFileSize()!.getElement()).toHaveTextContent('14 bytes');
  });

  test('selected file last update timestamp can be customized', () => {
    const wrapper = render({
      items: [{ file: file1 }],
      showFileLastModified: true,
      i18nStrings: {
        ...defaultProps.i18nStrings,
        formatFileLastModified: date => `${date.getFullYear()} year`,
      },
    });
    expect(wrapper.findFileToken(1)!.findFileLastModified()!.getElement()).toHaveTextContent('2020 year');
  });

  test('the `tokenLimit` property controls the number of tokens shown by default', () => {
    const wrapper = render({ items: [{ file: file1 }, { file: file2 }], limit: 1 });
    expect(wrapper.findFileTokens()).toHaveLength(1);
    expect(wrapper.getElement().textContent).toContain('Show more files');
  });

  test('file tokens have aria labels set to file names', () => {
    const wrapper = render({ items: [{ file: file1 }, { file: file2 }] });
    expect(wrapper.findFileToken(1)!.getElement()).toHaveAttribute('aria-label', file1.name);
    expect(wrapper.findFileToken(2)!.getElement()).toHaveAttribute('aria-label', file2.name);
  });

  test('file errors are associated to file tokens', () => {
    const wrapper = render({
      items: [
        { file: file1, errorText: 'Error 1' },
        { file: file2, errorText: 'Error 2' },
      ],
    });
    expect(wrapper.findFileToken(1)!.getElement()).toHaveAccessibleDescription('Error 1');
    expect(wrapper.findFileToken(2)!.getElement()).toHaveAccessibleDescription('Error 2');
  });

  test('file warnings are associated to file tokens', () => {
    const wrapper = render({
      items: [
        { file: file1, warningText: 'Warning 1' },
        { file: file2, warningText: 'Warning 2' },
      ],
    });
    expect(wrapper.findFileToken(1)!.getElement()).toHaveAccessibleDescription('Warning 1');
    expect(wrapper.findFileToken(2)!.getElement()).toHaveAccessibleDescription('Warning 2');
  });

  test('file error takes precedence over file warning associated to file tokens', () => {
    const wrapper = render({
      items: [{ file: file1, errorText: 'Error 1', warningText: 'Warning 1' }],
    });
    expect(wrapper.findFileToken(1)!.getElement()).toHaveAccessibleDescription('Error 1');
    expect(wrapper.findFileToken(1)!.getElement()).not.toHaveAccessibleDescription('Warning 1');
  });
});

describe('Focusing behavior', () => {
  test.each([1, 2])(`Focus is dispatched to the next token when the token before it is removed, limit=%s`, limit => {
    const wrapper = renderStateful({ items: [{ file: file1 }, { file: file2 }], limit });
    wrapper.findFileToken(1)!.findFileDismiss().click();

    expect(wrapper.findFileToken(1)!.findFileDismiss().getElement()).toHaveFocus();
  });

  test('Focus is dispatched to the previous token when removing the token at the end', () => {
    const wrapper = renderStateful({ items: [{ file: file1 }, { file: file2 }] });
    wrapper.findFileToken(2)!.findFileDismiss().click();

    expect(wrapper.findFileToken(1)!.findFileDismiss().getElement()).toHaveFocus();
  });

  //   test('Focus is dispatched to the file input when the last token is removed, multiple=%s', () => {
  //       const wrapper = renderStateful({ items: [{ file: file1 }] });
  //       wrapper.findFileToken(1)!.findFileDismiss().click();

  //       expect(wrapper.findNativeInput().getElement()).toHaveFocus();
  // });
});

describe('a11y', () => {
  test('multiple empty', async () => {
    const wrapper = render({ items: [] });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('single', async () => {
    const wrapper = render({
      items: [{ file: file1 }],
      showFileSize: true,
      showFileLastModified: true,
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('single w/ errors', async () => {
    const wrapper = render({
      items: [{ file: file1, errorText: 'Error' }],
      showFileSize: true,
      showFileLastModified: true,
    });

    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('single w/ warnings', async () => {
    const wrapper = render({
      items: [{ file: file1, warningText: 'Warning' }],
      showFileSize: true,
      showFileLastModified: true,
    });

    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('multiple w/o errors nor warnings', async () => {
    const wrapper = render({
      items: [{ file: file1 }, { file: file2 }],
      showFileSize: true,
      showFileLastModified: true,
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('multiple w/ errors', async () => {
    const wrapper = render({
      items: [
        { file: file1, errorText: 'Error 1' },
        { file: file2, errorText: 'Error 2' },
      ],
      showFileSize: true,
      showFileLastModified: true,
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('multiple w/ warnings', async () => {
    const wrapper = render({
      items: [
        { file: file1, warningText: 'Warning 1' },
        { file: file2, warningText: 'Warning 2' },
      ],
      showFileSize: true,
      showFileLastModified: true,
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });
});
