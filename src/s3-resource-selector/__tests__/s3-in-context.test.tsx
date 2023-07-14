// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
import FormField from '../../../lib/components/form-field';
import S3ResourceSelector from '../../../lib/components/s3-resource-selector';
import createWrapper from '../../../lib/components/test-utils/dom';
import { buckets, i18nStrings, objects, versions, waitForFetch } from './fixtures';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';

const defaultProps = {
  resource: { uri: '' },
  selectableItemsTypes: ['buckets', 'objects', 'versions'],
  fetchBuckets: () => Promise.resolve(buckets),
  fetchObjects: () => Promise.resolve(objects),
  fetchVersions: () => Promise.resolve(versions),
  i18nStrings,
} as const;

const findLoadingIndicator = (wrapper: ComponentWrapper) => createWrapper(wrapper.getElement()).findStatusIndicator();

function renderComponent(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findS3ResourceSelector()!.findInContext();
}

test('renders initial plain state', () => {
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} />);
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveValue('');
  expect(wrapper.findVersionsSelect()!.isDisabled()).toEqual(true);
  expect(wrapper.findBrowseButton().getElement()).toBeEnabled();
  expect(wrapper.findViewButton().getElement()).toBeDisabled();
});

test('renders element labels', () => {
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} />);
  expect(screen.getByRole('searchbox', { name: i18nStrings.inContextUriLabel })).toBeTruthy();
  // testing-library does not see the combobox role
  // https://github.com/testing-library/dom-testing-library/issues/927
  expect(
    screen.getByRole('button', {
      name: i18nStrings.inContextVersionSelectLabel + ' ' + i18nStrings.inContextSelectPlaceholder,
    })
  ).toBeTruthy();
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveAttribute(
    'placeholder',
    i18nStrings.inContextInputPlaceholder
  );
  expect(wrapper.findVersionsSelect()!.findTrigger().getElement()).toHaveTextContent(
    i18nStrings.inContextSelectPlaceholder!
  );
  expect(wrapper.findViewButton().getElement()).toHaveTextContent(i18nStrings.inContextViewButton!);
  expect(wrapper.findBrowseButton().getElement()).toHaveTextContent(i18nStrings.inContextBrowseButton!);
});

test('prefers inputPlaceholder over i18nStrings.inContextInputPlaceholder', () => {
  const placeholder = 's3://bucket/component/test';
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} inputPlaceholder={placeholder} />);
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveAttribute('placeholder', placeholder);
});

test('inherits aria-describedby from the surrounding FormField', () => {
  const wrapper = renderComponent(
    <FormField controlId="test-control" description="test">
      <S3ResourceSelector {...defaultProps} />
    </FormField>
  );
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveAttribute(
    'aria-describedby',
    'test-control-description'
  );
});

test('supports overriding aria-describedby label', () => {
  const wrapper = renderComponent(
    <FormField controlId="test-control" description="test">
      <S3ResourceSelector {...defaultProps} inputAriaDescribedby="custom-description" />
    </FormField>
  );
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveAttribute(
    'aria-describedby',
    'custom-description'
  );
});

test('renders loading state', async () => {
  const wrapper = renderComponent(
    <S3ResourceSelector {...defaultProps} resource={{ uri: 's3://my-bucket/folder-1/my-song.mp3' }} />
  );
  expect(wrapper.findUriInput().findNativeInput().getElement()).toBeEnabled();
  expect(wrapper.findVersionsSelect()!.isDisabled()).toEqual(true);
  expect(wrapper.findBrowseButton().getElement()).toBeDisabled();
  expect(findLoadingIndicator(wrapper)!.getElement()).toHaveTextContent(i18nStrings.inContextLoadingText!);
  await waitForFetch();
  expect(wrapper.findVersionsSelect()!.isDisabled()).toEqual(false);
  expect(wrapper.findBrowseButton().getElement()).toBeEnabled();
  expect(findLoadingIndicator(wrapper)).toBeFalsy();
});

test('applies invalid state only to the input', () => {
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} resource={{ uri: '' }} invalid={true} />);
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveAttribute('aria-invalid', 'true');
  expect(wrapper.findVersionsSelect()!.findTrigger().getElement()).not.toHaveAttribute('aria-invalid');
});

test('renders selected version', async () => {
  const wrapper = renderComponent(
    <S3ResourceSelector
      {...defaultProps}
      resource={{ uri: 's3://my-bucket/folder-1/my-song.mp3', versionId: versions[0].VersionId }}
    />
  );
  await waitForFetch();
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveValue('s3://my-bucket/folder-1/my-song.mp3');
  const versionSelect = wrapper.findVersionsSelect()!.findTrigger().getElement();
  expect(wrapper.findVersionsSelect()!.isDisabled()).toEqual(false);
  expect(versionSelect).toHaveTextContent('April 10, 2019, 21:21:10 (UTC+02:00)');
});

test('populates versions data to select', async () => {
  const wrapper = renderComponent(
    <S3ResourceSelector {...defaultProps} resource={{ uri: 's3://my-bucket/folder-1/my-song.mp3' }} />
  );
  await waitForFetch();
  const versionsSelect = wrapper.findVersionsSelect()!;
  versionsSelect.openDropdown();
  expect(versionsSelect.findDropdown().findOptions()).toHaveLength(versions.length);
});

test('hides versions select when this type is not selectable', () => {
  const wrapper = renderComponent(
    <S3ResourceSelector {...defaultProps} selectableItemsTypes={['buckets', 'objects']} />
  );
  expect(wrapper.findUriInput().findNativeInput().getElement()).toHaveValue('');
  expect(wrapper.findVersionsSelect()).toBeFalsy();
});

test('has view button with href and target', () => {
  const wrapper = renderComponent(
    <S3ResourceSelector {...defaultProps} viewHref="https://s3.console.aws.amazon.com/" />
  );
  const viewButton = wrapper.findViewButton().getElement();
  expect(viewButton).toHaveAttribute('href', 'https://s3.console.aws.amazon.com/');
  expect(viewButton).toHaveAttribute('target', '_blank');
  expect(viewButton).toHaveAttribute('aria-label', 'View (opens a new tab)');
});

describe('fetchVersions', () => {
  beforeEach(() => {
    // ensure there are no react warnings
    jest.spyOn(console, 'error').mockImplementation(() => {
      /*do not print anything to browser logs*/
    });
  });

  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('does not fetch versions when uri is empty', () => {
    const fetchVersions = jest.fn(defaultProps.fetchVersions);
    renderComponent(<S3ResourceSelector {...defaultProps} resource={{ uri: '' }} fetchVersions={fetchVersions} />);
    expect(fetchVersions).not.toHaveBeenCalled();
  });

  test('does not fetch versions when uri is invalid', () => {
    const fetchVersions = jest.fn(defaultProps.fetchVersions);
    renderComponent(
      <S3ResourceSelector {...defaultProps} resource={{ uri: 'not-a-uri' }} fetchVersions={fetchVersions} />
    );
    expect(fetchVersions).not.toHaveBeenCalled();
  });

  test('does not fetch versions when uri has a trailing slash (it is a folder)', () => {
    const fetchVersions = jest.fn(defaultProps.fetchVersions);
    renderComponent(
      <S3ResourceSelector
        {...defaultProps}
        resource={{ uri: 's3://my-bucket/folder/' }}
        fetchVersions={fetchVersions}
      />
    );
    expect(fetchVersions).not.toHaveBeenCalled();
  });

  test('does not fetch versions while input has focus', async () => {
    const fetchVersions = jest.fn(defaultProps.fetchVersions);
    const props = { ...defaultProps, fetchVersions };
    const { container, rerender } = render(<S3ResourceSelector {...props} />);
    const wrapper = createWrapper(container).findS3ResourceSelector()!.findInContext();
    wrapper.findUriInput().focus();
    rerender(<S3ResourceSelector {...props} resource={{ uri: 's3://my-bucket/folder/doc1.txt' }} />);
    rerender(<S3ResourceSelector {...props} resource={{ uri: 's3://my-bucket/folder/doc2.txt' }} />);
    expect(fetchVersions).toHaveBeenCalledTimes(0);
    act(() => wrapper.findUriInput().blur());
    await waitForFetch();
    expect(fetchVersions).toHaveBeenCalledTimes(1);
    expect(fetchVersions).toHaveBeenCalledWith('my-bucket', 'folder/doc2.txt');
  });

  test('does not fetch versions when they are not selectable', () => {
    const fetchVersions = jest.fn(defaultProps.fetchVersions);
    renderComponent(
      <S3ResourceSelector
        {...defaultProps}
        resource={{ uri: 's3://my-bucket/folder/doc.txt' }}
        fetchVersions={fetchVersions}
        selectableItemsTypes={['objects']}
      />
    );
    expect(fetchVersions).not.toHaveBeenCalled();
  });

  test('does not fetch versions after bluring input when they are not selectable', () => {
    const fetchVersions = jest.fn(defaultProps.fetchVersions);
    const wrapper = renderComponent(
      <S3ResourceSelector
        {...defaultProps}
        resource={{ uri: 's3://my-bucket/folder/doc.txt' }}
        fetchVersions={fetchVersions}
        selectableItemsTypes={['objects']}
      />
    );
    act(() => wrapper.findUriInput().findNativeInput().focus());
    act(() => wrapper.findUriInput().findNativeInput().blur());
    expect(fetchVersions).not.toHaveBeenCalled();
  });

  test('fetches available versions for a valid uri', async () => {
    const fetchVersions = jest.fn(defaultProps.fetchVersions);
    renderComponent(
      <S3ResourceSelector
        {...defaultProps}
        resource={{ uri: 's3://my-bucket/folder/doc.txt' }}
        fetchVersions={fetchVersions}
      />
    );
    await waitForFetch();
    expect(fetchVersions).toHaveBeenCalledWith('my-bucket', 'folder/doc.txt');
  });

  test('should abort pending requests when component gets destroyed', () => {
    const { rerender } = render(
      <S3ResourceSelector {...defaultProps} resource={{ uri: 's3://my-bucket/folder/doc.txt' }} />
    );
    rerender(<></>);
    // should not have "Can't perform a React state update on an unmounted component" warning
  });

  test('does not abort the fetch when input gets focus', async () => {
    const wrapper = renderComponent(
      <S3ResourceSelector {...defaultProps} resource={{ uri: 's3://my-bucket/folder/doc.txt' }} />
    );
    act(() => wrapper.findUriInput().findNativeInput().focus());
    expect(wrapper.findVersionsSelect()!.isDisabled()).toEqual(true);
    expect(findLoadingIndicator(wrapper)).toBeTruthy();
    await waitForFetch();
    expect(wrapper.findVersionsSelect()!.isDisabled()).toEqual(false);
    expect(findLoadingIndicator(wrapper)).toBeFalsy();
  });

  test('does not fetch again if the input blurs but value did not change', async () => {
    const wrapper = renderComponent(
      <S3ResourceSelector {...defaultProps} resource={{ uri: 's3://my-bucket/folder/doc.txt' }} />
    );
    await waitForFetch();
    expect(findLoadingIndicator(wrapper)).toBeFalsy();
    act(() => wrapper.findUriInput().findNativeInput().focus());
    act(() => wrapper.findUriInput().findNativeInput().blur());
    expect(findLoadingIndicator(wrapper)).toBeFalsy();
  });

  test('handles fetch errors', async () => {
    const wrapper = renderComponent(
      <S3ResourceSelector
        {...defaultProps}
        resource={{ uri: 's3://my-bucket/folder/doc.txt' }}
        fetchVersions={() => Promise.reject(new Error('fetch error'))}
      />
    );
    expect(findLoadingIndicator(wrapper)).toBeTruthy();
    await waitForFetch();
    expect(findLoadingIndicator(wrapper)).toBeFalsy();
  });
});

describe('onChange', () => {
  test('fires onChange handler when input changes', () => {
    const onChange = jest.fn();
    const wrapper = renderComponent(
      <S3ResourceSelector {...defaultProps} onChange={event => onChange(event.detail)} />
    );
    wrapper.findUriInput().setInputValue('123');
    expect(onChange).toHaveBeenCalledWith({ errorText: undefined, resource: { uri: '123' } });
  });

  test('fires change event with validation error after field blur', () => {
    const onChange = jest.fn();
    const wrapper = renderComponent(
      <S3ResourceSelector
        {...defaultProps}
        resource={{ uri: 'not-a-uri' }}
        onChange={event => onChange(event.detail)}
      />
    );
    wrapper.findUriInput().findNativeInput().focus();
    wrapper.findUriInput().setInputValue('new-value');
    expect(onChange).toHaveBeenCalledWith({ errorText: undefined, resource: { uri: 'new-value' } });
    onChange.mockClear();
    wrapper.findUriInput().findNativeInput().blur();
    expect(onChange).toHaveBeenCalledWith({
      errorText: 'The path must begin with s3://',
      resource: { uri: 'not-a-uri' },
    });
  });

  test('fires change event with validation error for all consecutive changes after the first field blur', () => {
    const onChange = jest.fn();
    const wrapper = renderComponent(
      <S3ResourceSelector {...defaultProps} onChange={event => onChange(event.detail)} />
    );
    wrapper.findUriInput().setInputValue('new-value');
    expect(onChange).toHaveBeenCalledWith({ errorText: undefined, resource: { uri: 'new-value' } });
    wrapper.findUriInput().findNativeInput().focus();
    wrapper.findUriInput().findNativeInput().blur();
    onChange.mockClear();
    wrapper.findUriInput().setInputValue('new-value-2');
    expect(onChange).toHaveBeenCalledWith({
      errorText: 'The path must begin with s3://',
      resource: { uri: 'new-value-2' },
    });
  });

  test('fires change event when selected version changes', async () => {
    const onChange = jest.fn();
    const wrapper = renderComponent(
      <S3ResourceSelector
        {...defaultProps}
        resource={{ uri: 's3://my-bucket/folder-1/my-song.mp3' }}
        onChange={event => onChange(event.detail)}
      />
    );
    await waitForFetch();
    const versionsSelect = wrapper.findVersionsSelect()!;
    versionsSelect.openDropdown();
    versionsSelect.selectOption(2);
    expect(onChange).toHaveBeenCalledWith({
      errorText: undefined,
      resource: { uri: 's3://my-bucket/folder-1/my-song.mp3', versionId: versions[1].VersionId },
    });
  });
});

describe('i18n', () => {
  test('supports using in-context strings from i18n provider', () => {
    const wrapper = renderComponent(
      <TestI18nProvider
        messages={{
          's3-resource-selector': {
            'i18nStrings.inContextUriLabel': 'Custom URI label',
            'i18nStrings.inContextSelectPlaceholder': 'Custom version select',
            'i18nStrings.inContextViewButton': 'Custom view',
            'i18nStrings.inContextViewButtonAriaLabel': 'Custom view aria label',
            'i18nStrings.inContextBrowseButton': 'Custom browse',
          },
        }}
      >
        <S3ResourceSelector {...defaultProps} i18nStrings={undefined} />
      </TestI18nProvider>
    );
    expect(createWrapper(wrapper.getElement()).findFormField()!.findLabel()!.getElement()).toHaveTextContent(
      'Custom URI label'
    );
    expect(wrapper.findVersionsSelect()!.findTrigger().getElement()).toHaveTextContent('Custom version select');
    expect(wrapper.findViewButton()!.getElement()).toHaveTextContent('Custom view');
    expect(wrapper.findViewButton()!.getElement()).toHaveAttribute('aria-label', 'Custom view aria label');
    expect(wrapper.findBrowseButton().getElement()).toHaveTextContent('Custom browse');
  });
});
