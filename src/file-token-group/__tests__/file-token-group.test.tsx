// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, fireEvent, render as testingLibraryRender, screen } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import FileTokenGroup, { FileTokenGroupProps } from '../../../lib/components/file-token-group';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/file-token-group/styles.css.js';
import testStyles from '../../../lib/components/file-token-group/test-classes/styles.css.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

jest.mock('../../../lib/components/internal/utils/date-time', () => ({
  formatDateTime: () => '2020-06-01T00:00:00',
}));

const onDismiss = jest.fn();

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
const file3 = new File(
  [new Blob(['Test content 3'], { type: 'text/plain' })],
  'test-file-3-with-a-really-long-name.txt',
  {
    type: 'image/png',
    lastModified: 1590962400000,
  }
);

function render(props: Partial<FileTokenGroupProps>) {
  const { container } = testingLibraryRender(
    <div>
      <FileTokenGroup {...{ ...defaultProps, ...props }} />
      <div id="test-label">Test label</div>
    </div>
  );
  return createWrapper(container).findFileTokenGroup()!;
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
    expect(wrapper.findFileToken(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Remove file 1');
  });

  test('selected file can be removed - single', () => {
    const wrapperSingular = render({ items: [{ file: file1 }] });
    wrapperSingular.findFileToken(1)!.findRemoveButton()!.click();

    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ detail: { fileIndex: 0 } }));
  });

  test('selected file can be removed - multiple', () => {
    const wrapperMultiple = render({ items: [{ file: file1 }, { file: file2 }] });
    wrapperMultiple.findFileToken(2)!.findRemoveButton()!.click();

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

  test('thumbnail is only shown when file type starts with "image"', () => {
    const wrapper = render({ items: [{ file: file1 }, { file: file2 }], showFileThumbnail: true });
    expect(wrapper.findFileToken(1)!.findFileThumbnail()).toBe(null);

    expect(wrapper.findFileToken(2)!.findFileThumbnail()).not.toBe(null);
  });

  test('selected file size can be customized', () => {
    const wrapper = render({
      items: [{ file: file1 }],
      showFileSize: true,
      i18nStrings: {
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
    expect(wrapper.findFileToken(1)!.findFileError().getElement()).toHaveTextContent('Error 1');
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
    expect(wrapper.findFileToken(1)!.findFileWarning().getElement()).toHaveTextContent('Warning 1');
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

describe('File loading', () => {
  test('Aria-disabled added when loading', () => {
    const wrapper = render({ items: [{ file: file1, loading: true }, { file: file2 }] });

    expect(wrapper.findFileToken(1)?.getElement()).toHaveAttribute('aria-disabled');
    expect(wrapper.findFileToken(2)?.getElement()).not.toHaveAttribute('aria-disabled');
  });

  test('Spinner added when loading', () => {
    const wrapper = render({ items: [{ file: file1, loading: true }, { file: file2 }] });

    expect(wrapper.findFileToken(1)?.getElement().firstChild).toHaveClass(styles.loading);
    expect(wrapper.findFileToken(2)?.getElement().firstChild).not.toHaveClass(styles.loading);
  });
});

describe('Tooltip', () => {
  test('Should show ellipsis on long file names', () => {
    const wrapper = render({ items: [{ file: file3 }] });
    act(() => {
      fireEvent.mouseEnter(wrapper.findFileToken(1)!.findFileName().getElement());
    });

    expect(wrapper.findFileToken(1)!.findFileName().getElement()).toHaveClass(testStyles['ellipsis-active']);
  });

  test('Should show tooltip on mouse enter', () => {
    const wrapper = render({ items: [{ file: file3 }], alignment: 'horizontal' });

    act(() => {
      fireEvent.mouseEnter(wrapper.findFileToken(1)!.findFileName().getElement());
    });

    expect(document.querySelector(`.${tooltipStyles.root}`)).not.toBeNull();

    act(() => {
      fireEvent.mouseLeave(wrapper.findFileToken(1)!.findFileName().getElement());
    });

    expect(document.querySelector(`.${tooltipStyles.root}`)).toBeNull();
  });
});

describe('Focusing behavior', () => {
  test.each([1, 2])(`Focus is dispatched to the next token when the token before it is removed, limit=%s`, limit => {
    const wrapper = renderStateful({ items: [{ file: file1 }, { file: file2 }], limit });
    wrapper.findFileToken(1)!.findRemoveButton().click();

    expect(wrapper.findFileToken(1)!.findRemoveButton().getElement()).toHaveFocus();
  });

  test('Focus is dispatched to the previous token when removing the token at the end', () => {
    const wrapper = renderStateful({ items: [{ file: file1 }, { file: file2 }] });
    wrapper.findFileToken(2)!.findRemoveButton().click();

    expect(wrapper.findFileToken(1)!.findRemoveButton().getElement()).toHaveFocus();
  });
});

describe('i18n', () => {
  test('supports providing custom i18n strings', () => {
    const { container } = testingLibraryRender(
      <TestI18nProvider
        messages={{
          'file-token-group': {
            'i18nStrings.limitShowMore': 'Custom show more',
            'i18nStrings.removeFileAriaLabel': `Custom remove file {fileIndex}`,
            'i18nStrings.errorIconAriaLabel': 'Custom error',
            'i18nStrings.warningIconAriaLabel': 'Custom warning',
          },
        }}
      >
        <FileTokenGroup
          items={[{ file: file1, errorText: 'Error' }, { file: file2, warningText: 'Warning' }, { file: file2 }]}
          limit={2}
          onDismiss={onDismiss}
        />
      </TestI18nProvider>
    );

    const wrapper = createWrapper(container).findFileTokenGroup()!;

    expect(wrapper.getElement()).toHaveTextContent('Custom show more');
    expect(wrapper.findFileToken(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Custom remove file 1');
    expect(screen.getByLabelText('Custom error')).not.toBeNull();
    expect(screen.getByLabelText('Custom warning')).not.toBeNull();
  });
});

describe('a11y', () => {
  test('empty', async () => {
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

  test('multiple', async () => {
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

  test('loading', async () => {
    const wrapper = render({
      items: [{ file: file1, loading: true }],
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });
});
