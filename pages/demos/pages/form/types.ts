// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Ref, RefObject } from 'react';

import { AttributeEditorProps } from '@cloudscape-design/components/attribute-editor';
import { ButtonProps } from '@cloudscape-design/components/button';
import { CodeEditorProps } from '@cloudscape-design/components/code-editor';
import { DatePickerProps } from '@cloudscape-design/components/date-picker';
import { FileUploadProps } from '@cloudscape-design/components/file-upload';
import { InputProps } from '@cloudscape-design/components/input';
import { SelectProps } from '@cloudscape-design/components/select';
import { TagEditorProps } from '@cloudscape-design/components/tag-editor';
import { TextareaProps } from '@cloudscape-design/components/textarea';

export interface CustomHeader {
  key: string;
  keyError?: string;
  keyWarning?: string;
  value: string;
  valueError?: string;
  valueWarning?: string;
}

export interface FormDataAttributesValues {
  cloudFrontRootObject: string;
  alternativeDomainNames: string;
  s3BucketSelectedOption: SelectProps.Option | null;
  certificateExpiryDate: string;
  certificateExpiryTime: string;
  httpVersion: string;
  ipv6isOn: boolean;
  functions: File[];
  originId: string;
  customHeaders: CustomHeader[];
  codeEditor: string;
  functionFiles: File[];
  tags: string;
  functionFile: File | undefined;
  originRequestPolicyName: string;
  isOriginRequestPolicyNew: boolean;
  cachePolicy: SelectProps.Option | null; // though this field's value is not kept here (kept in cachePolicyProps.selectedPolicy), it is added for validation and focusing on the input if there is an error
}

// Errors associated with each field
export interface FormDataAttributesErrors {
  cloudFrontRootObject: string;
  alternativeDomainNames: string;
  s3BucketSelectedOption: string;
  certificateExpiryDate: string;
  certificateExpiryTime: string;
  httpVersion: string;
  ipv6isOn: string;
  functions: string;
  customHeaders: string;
  functionFiles: string[];
  tags: string;
  originId: string;
  codeEditor: string;
  functionFile: string;
  originRequestPolicyName: string;
  isOriginRequestPolicyNew: string;
  cachePolicy: string;
}

// Attributes that utilize form-validation-config/validateField function
export interface FormDataValidationAttributes extends FormDataAttributesValues {
  cachePolicyName: string;
}

// Keys of the data attributes
export type FormDataAttributesKeys = keyof FormDataAttributesValues;
export type FormDataValidationAttributesKeys = keyof FormDataValidationAttributes;

export interface FormRefs {
  cloudFrontRootObject: RefObject<InputProps.Ref>;
  alternativeDomainNames: RefObject<TextareaProps.Ref>;
  s3BucketSelectedOption: RefObject<SelectProps.Ref>;
  certificateExpiryDate: RefObject<DatePickerProps.Ref>;
  certificateExpiryTime: Ref<HTMLInputElement>;
  functions: RefObject<FileUploadProps.Ref>;
  originId: Ref<HTMLInputElement>;
  customHeaders: RefObject<AttributeEditorProps.Ref>;
  codeEditor: RefObject<CodeEditorProps.Ref>;
  tags: RefObject<TagEditorProps.Ref>;
  originRequestPolicyName: RefObject<HTMLInputElement>;
  cachePolicy: RefObject<SelectProps.Ref>;
}

export interface FormPanelProps {
  loadHelpPanelContent: (value: number) => void;
  data: FormDataAttributesValues;
  setData: (value: Partial<FormDataAttributesValues>) => void;
  setErrors?: (value: Partial<FormDataAttributesErrors>) => void;
  validation?: boolean;
  errors?: FormDataAttributesErrors;
  refs?: FormRefs;
  showAPIDefaultInputs?: boolean;
}

export interface CreateCachePolicyAttributesValues {
  name: string;
  description?: string;
  minimumTtl: number;
  maximumTtl: number;
  defaultTtl: number;
  header: SelectProps.Option;
  queryStrings: SelectProps.Option;
  cookies: SelectProps.Option;
  isSubmitting: boolean;
}

export interface CreateCachePolicyAttributesErrors {
  nameError: string;
}

export interface CachePolicyProps {
  buttonRef: RefObject<ButtonProps.Ref>;
  policies: SelectProps.Options;
  selectedPolicy: SelectProps.Option | null;
  setSelectedPolicy: (option: SelectProps.Option) => void;
  toggleSplitPanel: (value: boolean) => void;
}
