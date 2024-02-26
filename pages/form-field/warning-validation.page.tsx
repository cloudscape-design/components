// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import FormField from '~components/form-field';
import Input from '~components/input';
import TextFilter from '~components/text-filter';
import DateRangePicker from '~components/date-range-picker';
import SpaceBetween from '~components/space-between';
import Box from '~components/box';
import FileUpload from '~components/file-upload';
import Checkbox from '~components/checkbox';
import TextArea from '~components/textarea';
import AttributeEditor from '~components/attribute-editor';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

interface InputValue {
  value: string;
}

interface Input {
  detail: InputValue;
}

interface TextFilterInputValue {
  filteringText: string;
}

interface TextFilterInput {
  detail: TextFilterInputValue;
}

function TextFilterFormField() {
  const [filteringText, setFilteringText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [warningText, setWarningText] = useState('');

  const onValueChange = (props: Required<TextFilterInput>) => {
    const { filteringText } = props.detail;
    setFilteringText(filteringText);

    if (filteringText.includes('error')) {
      setErrorText('Invalid input');
    } else if (filteringText.includes('warning')) {
      setWarningText('Warning text');
    } else {
      setErrorText('');
      setWarningText('');
    }
  };

  return (
    <FormField
      label="Form field label with text filter"
      errorText={errorText}
      warningText={warningText}
      constraintText="Requirements and constraints for the field."
    >
      <TextFilter
        filteringText={filteringText}
        filteringPlaceholder="Find instances"
        filteringAriaLabel="Filter instances"
        onChange={onValueChange}
      />
    </FormField>
  );
}

function DateRangePickerFormFieldWarning() {
  return (
    <FormField
      label="Form field label with date range picker in warning state"
      warningText="Warning text"
      constraintText="Requirements and constraints for the field."
    >
      <DateRangePicker
        onChange={() => {}}
        value={null}
        relativeOptions={[
          {
            key: 'previous-5-minutes',
            amount: 5,
            unit: 'minute',
            type: 'relative',
          },
          {
            key: 'previous-30-minutes',
            amount: 30,
            unit: 'minute',
            type: 'relative',
          },
          {
            key: 'previous-1-hour',
            amount: 1,
            unit: 'hour',
            type: 'relative',
          },
          {
            key: 'previous-6-hours',
            amount: 6,
            unit: 'hour',
            type: 'relative',
          },
        ]}
        isValidRange={range => {
          if (range?.type === 'absolute') {
            const [startDateWithoutTime] = range.startDate.split('T');
            const [endDateWithoutTime] = range.endDate.split('T');
            if (!startDateWithoutTime || !endDateWithoutTime) {
              return {
                valid: false,
                errorMessage: 'The selected date range is incomplete. Select a start and end date for the date range.',
              };
            }
          }
          return { valid: true };
        }}
        i18nStrings={{}}
        placeholder="Filter by a date and time range"
      />
    </FormField>
  );
}

function DateRangePickerFormFieldError() {
  return (
    <FormField
      label="Form field label with date range picker in error state"
      errorText="Invalid input"
      constraintText="Requirements and constraints for the field."
    >
      <DateRangePicker
        onChange={() => {}}
        value={null}
        relativeOptions={[
          {
            key: 'previous-5-minutes',
            amount: 5,
            unit: 'minute',
            type: 'relative',
          },
          {
            key: 'previous-30-minutes',
            amount: 30,
            unit: 'minute',
            type: 'relative',
          },
          {
            key: 'previous-1-hour',
            amount: 1,
            unit: 'hour',
            type: 'relative',
          },
          {
            key: 'previous-6-hours',
            amount: 6,
            unit: 'hour',
            type: 'relative',
          },
        ]}
        isValidRange={range => {
          if (range?.type === 'absolute') {
            const [startDateWithoutTime] = range.startDate.split('T');
            const [endDateWithoutTime] = range.endDate.split('T');
            if (!startDateWithoutTime || !endDateWithoutTime) {
              return {
                valid: false,
                errorMessage: 'The selected date range is incomplete. Select a start and end date for the date range.',
              };
            }
          }
          return { valid: true };
        }}
        i18nStrings={{}}
        placeholder="Filter by a date and time range"
      />
    </FormField>
  );
}

function BasicFormField() {
  const [value, setValue] = useState('');
  const [errorText, setErrorText] = useState('');
  const [warningText, setWarningText] = useState('');

  const onValueChange = (props: Required<Input>) => {
    const { value } = props.detail;
    setValue(props.detail.value);

    if (value.includes('error')) {
      setErrorText('Invalid input');
    } else if (value.includes('warning')) {
      setErrorText('');
      setWarningText('Warning text');
    } else {
      setErrorText('');
      setWarningText('');
    }
  };

  return (
    <FormField
      label="Form field label"
      description="Behavior TBD when both error and warning msg exist"
      constraintText="Type warning for warning state and error for error state."
      i18nStrings={{ errorIconAriaLabel: 'Test error', warningIconAriaLabel: 'Test warning' }}
      errorText={errorText}
      warningText={warningText}
    >
      <Input value={value} onChange={onValueChange} />
    </FormField>
  );
}

function NumberFormField() {
  const [numberValue, setNumberValue] = useState('');
  const [numberErrorText, setNumberErrorText] = useState('');
  const [numberWarningText, setNumberWarningText] = useState('');

  const onNumberValueChange = (props: Required<Input>) => {
    const { value } = props.detail;
    setNumberValue(props.detail.value);

    console.log('number value: ', value);
    if (value === '3') {
      setNumberErrorText('Invalid input');
    } else if (value === '2') {
      setNumberErrorText('');
      setNumberWarningText('Warning text');
    } else {
      setNumberErrorText('');
      setNumberWarningText('');
    }
  };

  return (
    <FormField
      label="Second form field label with number input"
      constraintText="2 = warning state, 3 = error state"
      description="Behavior TBD when both error and warning msg exist"
      errorText={numberErrorText}
      warningText={numberWarningText}
    >
      <Input value={numberValue} type="number" onChange={onNumberValueChange} />
    </FormField>
  );
}

function FileUploadValidation() {
  return (
    <FormField label="Form field with file upload">
      <FileUpload
        multiple={true}
        value={[
          new File([new Blob(['Test content'])], 'file-1.pdf', {
            type: 'application/pdf',
            lastModified: 1590962400000,
          }),
          new File([new Blob(['Test content'])], 'file-2.pdf', {
            type: 'application/pdf',
            lastModified: 1590962400000,
          }),
          new File([new Blob(['Test content'])], 'file-3.pdf', {
            type: 'application/pdf',
            lastModified: 1590962400000,
          }),
          new File([new Blob(['Test content'])], 'file-4.pdf', {
            type: 'application/pdf',
            lastModified: 1590962400000,
          }),
        ]}
        onChange={() => {}}
        i18nStrings={{
          uploadButtonText: () => 'Choose file',
          dropzoneText: () => 'Drop files to upload',
          removeFileAriaLabel: () => `Remove file`,
          limitShowFewer: 'Show fewer files',
          limitShowMore: 'Show more files',
        }}
        constraintText="Hint text for file requirements"
        fileWarnings={['Warning message', null, 'Warning message']}
        fileErrors={[null, 'Error message', 'Error message']}
        warningText="Warning file"
      />
    </FormField>
  );
}

export default function FormFieldWarningTest() {
  return (
    <I18nProvider messages={[messages]} locale="en">
      <Box margin="m">
        <SpaceBetween size="m" direction="vertical">
          <BasicFormField />
          <BasicFormField />
          <NumberFormField />
          <FormField>
            <Input value="" onChange={() => {}} warning={true} placeholder="Enter value" />
          </FormField>
          <FormField>
            <Input value="" onChange={() => {}} invalid={true} placeholder="Enter value" />
          </FormField>
          <TextFilterFormField />
          <DateRangePickerFormFieldWarning />
          <DateRangePickerFormFieldError />

          <FormField label="Form field with file upload" warningText="Invalid file">
            <FileUpload
              value={[]}
              onChange={() => {}}
              invalid={true}
              i18nStrings={{
                uploadButtonText: () => 'Choose file',
                dropzoneText: () => 'Drop files to upload',
                removeFileAriaLabel: () => `Remove file`,
                limitShowFewer: 'Show fewer files',
                limitShowMore: 'Show more files',
              }}
              constraintText="Hint text for file requirements"
            />
          </FormField>
          <FormField label="Form field with file upload" errorText="Invalid file">
            <FileUpload
              value={[]}
              onChange={() => {}}
              invalid={true}
              i18nStrings={{
                uploadButtonText: () => 'Choose file',
                dropzoneText: () => 'Drop files to upload',
                removeFileAriaLabel: () => `Remove file`,
                limitShowFewer: 'Show fewer files',
                limitShowMore: 'Show more files',
              }}
              constraintText="Hint text for file requirements"
            />
          </FormField>
          <FileUploadValidation />

          <FormField label="Form field with checkbox" warningText="Warned checkbox">
            <Checkbox checked={true}>Expired</Checkbox>
          </FormField>
          <FormField label="Form field with checkbox" errorText="Invalid checkbox">
            <Checkbox checked={false}>Expired</Checkbox>
          </FormField>

          <FormField label="Form field with textarea" warningText="Warned textarea">
            <TextArea value="" />
          </FormField>
          <FormField label="Form field with textarea" errorText="Invalid textarea">
            <TextArea value="" />
          </FormField>

          <AttributeEditor
            items={[
              {
                key: 'some-key-1',
                value: 'some-value-1',
                type: { label: 'Type 1', value: '0' },
              },
              {
                key: 'some-key-2',
                value: 'some-value-2',
                type: { label: 'Type 2', value: '1' },
              },
            ]}
            addButtonText="Add new item"
            definition={[
              {
                label: 'Key',
                control: item => <Input value={item.key} placeholder="Enter key" />,
              },
              {
                label: 'Value',
                control: item => <Input value={item.value} placeholder="Enter value" />,
              },
              {
                label: 'Type',
                control: item => <Input value={item.value} placeholder="Enter type" />,
                warningText: (item, index) => (index === 0 ? 'Warning input' : null),
                errorText: (item, index) => (index === 1 ? 'Invalid input' : null),
              },
            ]}
          />
        </SpaceBetween>
      </Box>
    </I18nProvider>
  );
}
