// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect, useRef } from 'react';
import InternalBox from '../../box/internal';
import { InternalButton } from '../../button/internal';
import InternalFormField from '../../form-field/internal';
import { InputProps } from '../../input/interfaces';
import InternalSelect from '../../select/internal';
import InternalStatusIndicator from '../../status-indicator/internal';
import { NonCancelableCustomEvent } from '../../internal/events';
import useForwardFocus from '../../internal/hooks/forward-focus';
import { useVersionsFetch } from './use-versions-fetch';
import { S3ResourceSelectorProps } from '../interfaces';
import { validate, getErrorText } from './validation';
import styles from './styles.css.js';
import { SearchInput } from './search-input';
import LiveRegion from '../../internal/components/live-region';
import { useInternalI18n } from '../../i18n/context';

interface S3InContextProps {
  i18nStrings: S3ResourceSelectorProps.I18nStrings | undefined;
  inputPlaceholder: string | undefined;
  resource: S3ResourceSelectorProps.Resource;
  viewHref: string | undefined;
  invalid: boolean | undefined;
  inputAriaDescribedby: string | undefined;
  selectableItemsTypes: S3ResourceSelectorProps['selectableItemsTypes'];
  fetchVersions: S3ResourceSelectorProps['fetchVersions'];
  onBrowse: () => void;
  onChange: (newResource: S3ResourceSelectorProps.Resource, errorText: string | undefined) => void;
}

export interface S3InContextRef {
  focus(): void;
}

export const S3InContext = React.forwardRef(
  (
    {
      i18nStrings,
      inputPlaceholder,
      resource,
      viewHref,
      invalid,
      inputAriaDescribedby,
      selectableItemsTypes,
      fetchVersions,
      onChange,
      onBrowse,
    }: S3InContextProps,
    ref: React.Ref<S3InContextRef>
  ) => {
    const i18n = useInternalI18n('s3-resource-selector');
    const isInputBlurredRef = useRef(true);
    const [isInputTouched, setInputTouched] = useState(false);
    const { versions, loading, loadVersions, resetVersions } = useVersionsFetch(fetchVersions);
    const inputRef = useRef<HTMLInputElement>(null);

    useForwardFocus(ref, inputRef);

    const uri = resource.uri;
    const supportsVersions = selectableItemsTypes && selectableItemsTypes.indexOf('versions') > -1;
    const selectedVersion = versions.filter(version => version.value === resource.versionId)[0] || null;

    function handleUriChange(event: NonCancelableCustomEvent<InputProps.ChangeDetail>) {
      const uri = event.detail.value;
      const errorCode = isInputTouched ? validate(uri) : undefined;
      resetVersions();
      onChange({ uri }, getErrorText(i18n, i18nStrings, errorCode));
    }

    function handleUriBlur() {
      isInputBlurredRef.current = true;
      setInputTouched(true);
      const errorCode = validate(resource.uri);
      onChange(resource, getErrorText(i18n, i18nStrings, errorCode));
      if (supportsVersions) {
        loadVersions(resource.uri);
      }
    }

    useEffect(() => {
      if (!isInputBlurredRef.current || !supportsVersions) {
        return;
      }
      const { cancel } = loadVersions(uri) ?? {};
      return cancel;
    }, [uri, supportsVersions, loadVersions]);

    return (
      <div className={styles.root}>
        <div className={styles.layout}>
          <InternalFormField
            className={styles['layout-uri']}
            label={i18n('i18nStrings.inContextUriLabel', i18nStrings?.inContextUriLabel)}
            stretch={true}
          >
            <SearchInput
              ref={inputRef}
              value={uri}
              ariaDescribedby={inputAriaDescribedby}
              clearAriaLabel={i18nStrings?.inContextInputClearAriaLabel}
              placeholder={inputPlaceholder ?? i18nStrings?.inContextInputPlaceholder}
              onChange={handleUriChange}
              invalid={invalid}
              onFocus={() => (isInputBlurredRef.current = false)}
              onBlur={handleUriBlur}
            />
          </InternalFormField>
          {supportsVersions && (
            <InternalFormField
              className={styles['layout-version']}
              label={i18n('i18nStrings.inContextVersionSelectLabel', i18nStrings?.inContextVersionSelectLabel)}
              stretch={true}
            >
              <InternalSelect
                selectedOption={selectedVersion}
                placeholder={i18n('i18nStrings.inContextSelectPlaceholder', i18nStrings?.inContextSelectPlaceholder)}
                disabled={versions.length === 0}
                options={versions}
                onChange={event => onChange({ ...resource, versionId: event.detail.selectedOption.value }, undefined)}
                invalid={false} // invalid state should not highlight the select, only the text input
              />
            </InternalFormField>
          )}
          <div>
            <InternalButton
              className={styles['view-button']}
              disabled={!viewHref}
              href={viewHref}
              target="_blank"
              iconName="external"
              iconAlign="right"
              formAction="none"
              ariaLabel={i18n('i18nStrings.inContextViewButtonAriaLabel', i18nStrings?.inContextViewButtonAriaLabel)}
            >
              {i18n('i18nStrings.inContextViewButton', i18nStrings?.inContextViewButton)}
            </InternalButton>
          </div>
          <div className={styles['layout-divider']} />
          <div>
            <InternalButton className={styles['browse-button']} disabled={loading} formAction="none" onClick={onBrowse}>
              {i18n('i18nStrings.inContextBrowseButton', i18nStrings?.inContextBrowseButton)}
            </InternalButton>
          </div>
        </div>

        <div role="alert" aria-live="assertive" aria-atomic="true">
          {loading && (
            <InternalBox margin={{ top: 's' }}>
              <InternalStatusIndicator type="loading">
                <LiveRegion visible={true}>
                  {i18n('i18nStrings.inContextLoadingText', i18nStrings?.inContextLoadingText)}
                </LiveRegion>
              </InternalStatusIndicator>
            </InternalBox>
          )}
        </div>
      </div>
    );
  }
);
