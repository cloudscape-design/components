// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import uniq from 'lodash/uniq';

import { SelectProps } from '@cloudscape-design/components/select';

import { FormDataValidationAttributesKeys } from './types';

const validateEmpty = (value: string | undefined | null | File[]) => Boolean(value && value.length > 0);

const validateURLPrefix = (value: string) => value.startsWith('https://') || value.startsWith('http://');

const validateURLFormat = (value: string) => {
  const urlFormatRegex = new RegExp(/^([a-zA-Z0-9]{1,63}\.)+[a-zA-Z]{2,}$/);
  // strip valid url prefixes
  let url = value;
  url = url.replace('http://', '');
  url = url.replace('https://', '');

  return urlFormatRegex.test(url);
};

const validateCNAMEs = (value: string) => {
  if (!value) {
    return true;
  }

  const CNAMEs = value.split(',');
  return CNAMEs?.length < 4;
};
const validateFileSize = (file: File) => file.size <= 500;

const validateS3Bucket = (value: string) => {
  return !value.includes('NO-ACCESS');
};

const URLSpecialCharacterRegex = new RegExp(/[^A-Za-z0-9:/.]/gm);
const originIdSpecialCharacterRegex = new RegExp(/[^A-Za-z0-9-.]/gm);
const validateSpecialCharacter = (value: string, regex: RegExp) => {
  const isValid = !regex.test(value);

  return isValid;
};
const getSpecialCharacters = (value: string, regex: RegExp) => {
  const specialCharacters = value.match(regex);
  return uniq(specialCharacters);
};

const validateCodeEditor = (value: string | undefined | null) => Boolean(!value || value.length === 0);
const validateEmptyCharacter = (value: string) => !value?.includes(' ');

// TODO: Will fix this in a follow up CR

type ValidationFunction = (value: any) => boolean;
type ValidationText = string | ((value: string) => string);

const validationConfig: Record<
  FormDataValidationAttributesKeys,
  Array<{ validate: ValidationFunction; errorText?: ValidationText; warningText?: ValidationText }>
> = {
  cloudFrontRootObject: [
    { validate: validateEmpty, errorText: 'Root object is required.' },
    { validate: validateURLPrefix, errorText: 'Root object must start with "https://" or "http://".' },
    {
      validate: value => validateSpecialCharacter(value, URLSpecialCharacterRegex),
      errorText: (value: string) =>
        `The root object has characters that aren’t valid: ${getSpecialCharacters(value, URLSpecialCharacterRegex).join(
          ', '
        )}`,
    },
    {
      validate: validateURLFormat,
      errorText: 'Enter a valid root object URL. Example: https://example.com',
    },
  ],
  alternativeDomainNames: [{ validate: validateCNAMEs, errorText: 'Too many CNAMEs.' }],
  certificateExpiryDate: [{ validate: validateEmpty, errorText: 'Certificate expiry date is required.' }],
  certificateExpiryTime: [{ validate: validateEmpty, errorText: 'Certificate expiry time is required.' }],
  s3BucketSelectedOption: [
    {
      validate: (selectedOption: SelectProps.Option) => validateEmpty(selectedOption?.value),
      errorText: 'S3 bucket is required.',
    },
    {
      validate: (selectedOption: SelectProps.Option) => validateS3Bucket(selectedOption?.label || ''),
      errorText:
        "CloudFront isn't allowed to write logs to this bucket. You must enable access control lists (ACL) for the bucket.",
    },
  ],
  functions: [{ validate: validateEmpty, errorText: 'File is required.' }],
  functionFile: [{ validate: validateFileSize, errorText: 'File size must be smaller than 0.5 KB.' }],
  originId: [
    { validate: validateEmpty, errorText: 'Origin ID is required.' },
    {
      validate: value => validateSpecialCharacter(value, originIdSpecialCharacterRegex),
      errorText: (value: string) =>
        `The name has characters that aren’t valid: ${getSpecialCharacters(value, originIdSpecialCharacterRegex).join(
          ', '
        )}`,
    },
  ],
  customHeaders: [
    { validate: validateEmpty, errorText: (value: string) => `Custom header ${value} is required.` },
    {
      validate: validateEmptyCharacter,
      warningText: (value: string) => `The ${value} has empty (space) characters.`,
    },
  ],
  codeEditor: [{ validate: validateCodeEditor, errorText: 'Policy is invalid.' }],
  httpVersion: [],
  ipv6isOn: [],
  functionFiles: [],
  tags: [],
  isOriginRequestPolicyNew: [],
  originRequestPolicyName: [{ validate: validateEmpty, errorText: 'Name is required.' }],
  cachePolicyName: [{ validate: validateEmpty, errorText: 'Name is required.' }],
  cachePolicy: [
    {
      validate: (selectedOption: SelectProps.Option) => validateEmpty(selectedOption?.value),
      errorText: 'Cache policy is required.',
    },
  ],
};

export default function validateField(
  attribute: FormDataValidationAttributesKeys,
  value: unknown,
  customValue?: unknown
) {
  const validations = validationConfig[attribute];

  for (const validation of validations) {
    const { validate, errorText, warningText } = validation;

    const isValid = validate(value);
    if (!isValid) {
      return {
        errorText: typeof errorText === 'function' ? errorText(String(customValue)) : errorText,
        warningText: typeof warningText === 'function' ? warningText(String(customValue)) : warningText,
      };
    }
  }

  return { errorText: undefined };
}
