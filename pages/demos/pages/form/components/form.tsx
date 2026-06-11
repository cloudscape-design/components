// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useRef, useState } from 'react';

import { AttributeEditorProps } from '@cloudscape-design/components/attribute-editor';
import Button from '@cloudscape-design/components/button';
import { CodeEditorProps } from '@cloudscape-design/components/code-editor';
import { DatePickerProps } from '@cloudscape-design/components/date-picker';
import { FileUploadProps } from '@cloudscape-design/components/file-upload';
import Form from '@cloudscape-design/components/form';
import Header from '@cloudscape-design/components/header';
import { InputProps } from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import { SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { TagEditorProps } from '@cloudscape-design/components/tag-editor';
import { TextareaProps } from '@cloudscape-design/components/textarea';

import { InfoLink } from '../../commons/common-components';
import validateField from '../form-validation-config';
import {
  CachePolicyProps,
  FormDataAttributesErrors,
  FormDataAttributesKeys,
  FormDataAttributesValues,
  FormRefs,
} from '../types';
import CacheBehaviorPanel from './cache-behavior-panel/cache-behavior-panel';
import ContentDeliveryPanel from './content-delivery-panel';
import DistributionsPanel from './distribution-panel';
import OriginPanel from './origin-panel';
import TagsPanel from './tags-panel';

export function FormHeader({ loadHelpPanelContent }: { loadHelpPanelContent: (value: number) => void }) {
  return (
    <Header
      variant="h1"
      info={<InfoLink id="form-main-info-link" onFollow={() => loadHelpPanelContent(0)} />}
      description="When you create an Amazon CloudFront distribution, you tell CloudFront where to find your content by specifying your origin servers."
    >
      Create distribution
    </Header>
  );
}

function FormActions({ onCancelClick }: { onCancelClick: (event: CustomEvent) => void }) {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <Button variant="link" onClick={onCancelClick}>
        Cancel
      </Button>
      <Button data-testid="create" variant="primary">
        Create distribution
      </Button>
    </SpaceBetween>
  );
}

function BaseForm({
  content,
  onCancelClick,
  errorText = null,
  onSubmitClick,
  header,
}: {
  content?: React.ReactNode;
  onCancelClick: (event: CustomEvent) => void;
  errorText?: React.ReactNode;
  onSubmitClick?: () => void;
  header?: React.ReactNode;
}) {
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (onSubmitClick) {
          onSubmitClick();
        }
      }}
    >
      <Form
        header={header}
        actions={<FormActions onCancelClick={onCancelClick} />}
        errorText={errorText}
        errorIconAriaLabel="Error"
      >
        {content}
      </Form>
    </form>
  );
}

const defaultErrors: FormDataAttributesErrors = {
  cloudFrontRootObject: '',
  alternativeDomainNames: '',
  s3BucketSelectedOption: '',
  certificateExpiryDate: '',
  certificateExpiryTime: '',
  functions: '',
  customHeaders: '',
  functionFiles: [],
  tags: '',
  originId: '',
  codeEditor: '',
  httpVersion: '',
  ipv6isOn: '',
  functionFile: '',
  originRequestPolicyName: '',
  isOriginRequestPolicyNew: '',
  cachePolicy: '',
};

const defaultData: FormDataAttributesValues = {
  cloudFrontRootObject: '',
  alternativeDomainNames: '',
  s3BucketSelectedOption: null,
  certificateExpiryDate: '',
  certificateExpiryTime: '',
  httpVersion: 'http2',
  ipv6isOn: false,
  functions: [],
  originId: '',
  customHeaders: [
    {
      key: '',
      value: '',
    },
  ],
  codeEditor: '',
  tags: '',
  functionFile: undefined,
  functionFiles: [],
  originRequestPolicyName: '',
  isOriginRequestPolicyNew: false,
  cachePolicy: null,
};

const fieldsToValidate = [
  'cloudFrontRootObject',
  's3BucketSelectedOption',
  'alternativeDomainNames',
  'certificateExpiryDate',
  'certificateExpiryTime',
  'functions',
  'originId',
  'codeEditor',
] as const;

export function FormFull({
  loadHelpPanelContent,
  header,
  cachePolicyProps,
}: {
  loadHelpPanelContent: (value: number) => void;
  header: React.ReactNode;
  cachePolicyProps: CachePolicyProps;
}) {
  const [data, _setData] = useState(defaultData);
  const setData = (updateObj = {}) => _setData(prevData => ({ ...prevData, ...updateObj }));

  const handleCancelClick = () => {
    // do nothing
  };

  return (
    <BaseForm
      onCancelClick={handleCancelClick}
      header={header}
      content={
        <SpaceBetween size="l">
          <ContentDeliveryPanel loadHelpPanelContent={loadHelpPanelContent} />
          <DistributionsPanel
            loadHelpPanelContent={loadHelpPanelContent}
            data={data}
            setData={setData}
            showAPIDefaultInputs={true}
          />
          <OriginPanel loadHelpPanelContent={loadHelpPanelContent} data={data} setData={setData} />
          <CacheBehaviorPanel
            loadHelpPanelContent={loadHelpPanelContent}
            data={data}
            setData={setData}
            cachePolicyProps={cachePolicyProps}
          />
          <TagsPanel loadHelpPanelContent={loadHelpPanelContent} />
        </SpaceBetween>
      }
    />
  );
}

export const LimitedForm = ({
  loadHelpPanelContent,
  updateDirty,
  onCancelClick,
  header,
}: {
  loadHelpPanelContent: (value: number) => void;
  updateDirty: (value: boolean) => void;
  onCancelClick: (event: CustomEvent) => void;
  header: React.ReactNode;
}) => {
  const [data, _setData] = useState(defaultData);
  const setData = (updateObj = {}) => _setData(prevData => ({ ...prevData, ...updateObj }));

  useEffect(() => {
    const isDirty = JSON.stringify(data) !== JSON.stringify(defaultData);
    updateDirty(isDirty);
  }, [data, updateDirty]);

  return (
    <BaseForm
      header={header}
      onCancelClick={onCancelClick}
      content={<DistributionsPanel loadHelpPanelContent={loadHelpPanelContent} data={data} setData={setData} />}
    />
  );
};

export const FormWithValidation = ({
  loadHelpPanelContent,
  header,
  cachePolicyProps,
}: {
  loadHelpPanelContent: (value: number) => void;
  header: React.ReactNode;
  cachePolicyProps: CachePolicyProps;
}) => {
  const [formErrorText, setFormErrorText] = useState<React.ReactNode | null>(null);
  const [data, _setData] = useState<FormDataAttributesValues>(defaultData);
  const [errors, _setErrors] = useState<FormDataAttributesErrors>(defaultErrors);

  const setErrors = (updateObj: Partial<FormDataAttributesErrors> = {}) =>
    _setErrors(prevErrors => ({ ...prevErrors, ...updateObj }));
  const setData = (updateObj: Partial<FormDataAttributesValues> = {}) =>
    _setData(prevData => ({ ...prevData, ...updateObj }));

  const refs: FormRefs = {
    cloudFrontRootObject: useRef<InputProps.Ref>(null),
    alternativeDomainNames: useRef<TextareaProps.Ref>(null),
    s3BucketSelectedOption: useRef<SelectProps.Ref>(null),
    certificateExpiryDate: useRef<DatePickerProps.Ref>(null),
    certificateExpiryTime: useRef<HTMLInputElement>(null),
    functions: useRef<FileUploadProps.Ref>(null),
    originId: useRef<HTMLInputElement>(null),
    customHeaders: useRef<AttributeEditorProps.Ref>(null),
    codeEditor: useRef<CodeEditorProps.Ref>(null),
    tags: useRef<TagEditorProps.Ref>(null),
    originRequestPolicyName: useRef<HTMLInputElement>(null),
    cachePolicy: useRef<SelectProps.Ref>(null),
  };

  const shouldFocus = (errorsState: FormDataAttributesErrors, attribute: FormDataAttributesKeys) => {
    let shouldFocus = errorsState[attribute] && errorsState[attribute].length > 0;

    if (attribute === 'functions' && !shouldFocus) {
      shouldFocus = errorsState.functionFiles?.length !== undefined && errorsState.functionFiles.length > 0;
    }

    return shouldFocus;
  };

  const focusTopMostError = (errorsState: FormDataAttributesErrors) => {
    for (const [attribute, ref] of Object.entries(refs)) {
      if (shouldFocus(errorsState, attribute as FormDataAttributesKeys)) {
        if (ref.current?.focus) {
          return ref.current.focus();
        }

        if (ref.current?.focusAddButton) {
          return ref.current.focusAddButton();
        }
      }
    }
  };

  const validateCustomHeaders = () => {
    // Custom header errors are embedded in individual header items
    // customHeadersError here sets errors.customHeaders so that when there are
    // errors on submission, customHeaders is focused
    let customHeadersError = '';

    const validatedItems = data.customHeaders.map(item => {
      const { errorText: keyError } = validateField('customHeaders', item.key, 'name');
      const { errorText: valueError } = validateField('customHeaders', item.value, 'value');

      customHeadersError = keyError! || valueError!;

      return { ...item, keyError, valueError };
    });

    setData({ customHeaders: validatedItems });
    return customHeadersError;
  };

  const validateOriginRequestPolicyName = () => {
    if (!data.isOriginRequestPolicyNew) {
      return '';
    }

    const { errorText } = validateField('originRequestPolicyName', data.originRequestPolicyName);
    return errorText || '';
  };

  const validateCachePolicy = () => {
    const { errorText } = validateField('cachePolicy', cachePolicyProps.selectedPolicy);
    return errorText || '';
  };

  const handleCancelClick = () => {
    // do nothing
  };

  const onSubmit = () => {
    setFormErrorText(
      <>
        You have reached the maximum amount of distributions you can create.{' '}
        <Link external={true} variant="primary" href="#">
          Learn more about distribution limits
        </Link>
      </>
    );

    const newErrors = { ...errors };

    fieldsToValidate.forEach(attribute => {
      const { errorText } = validateField(attribute, data[attribute], data[attribute]);
      if (errorText) {
        newErrors[attribute] = errorText;
      }
    });
    newErrors.customHeaders = validateCustomHeaders();
    newErrors.originRequestPolicyName = validateOriginRequestPolicyName();
    newErrors.cachePolicy = validateCachePolicy();

    setErrors(newErrors);
    focusTopMostError(newErrors);
  };

  return (
    <BaseForm
      onCancelClick={handleCancelClick}
      header={header}
      content={
        <SpaceBetween size="l">
          <DistributionsPanel
            loadHelpPanelContent={loadHelpPanelContent}
            validation={true}
            data={data}
            errors={errors}
            setData={setData}
            setErrors={setErrors}
            refs={refs}
          />
          <OriginPanel
            loadHelpPanelContent={loadHelpPanelContent}
            validation={true}
            data={data}
            errors={errors}
            setData={setData}
            setErrors={setErrors}
            refs={refs}
          />
          <CacheBehaviorPanel
            loadHelpPanelContent={loadHelpPanelContent}
            refs={refs}
            validation={true}
            data={data}
            errors={errors}
            setErrors={setErrors}
            setData={setData}
            cachePolicyProps={cachePolicyProps}
          />
          <TagsPanel loadHelpPanelContent={loadHelpPanelContent} refs={refs} setErrors={setErrors} />
        </SpaceBetween>
      }
      onSubmitClick={onSubmit}
      errorText={formErrorText}
    />
  );
};
