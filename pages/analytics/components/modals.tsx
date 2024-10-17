// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FormEvent, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  ColumnLayout,
  FileUpload,
  FileUploadProps,
  Form,
  FormField,
  Header,
  Input,
  Link,
  Modal,
  ModalProps,
  RadioGroup,
  Select,
  SelectProps,
  SpaceBetween,
  Textarea,
} from '~components';

export const DeleteWithSimpleConfirmationModal = (
  props: ModalProps & { onCancel: () => void; onConfirm: () => void }
) => {
  return (
    <Modal
      {...props}
      visible={props.visible}
      header="Delete distributions"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={props.onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={props.onConfirm}>
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form header={<Header>Inner Form Header</Header>}>
        <SpaceBetween size="m">
          <Box variant="span">
            Permanently delete Permanently delete instance{' '}
            <Box variant="span" fontWeight="bold">
              5 distributions
            </Box>
            ? You can’t undo this action.
          </Box>

          <Alert type="info" statusIconAriaLabel="Warning">
            Proceeding with this action will delete the instance with all its content and can affect related resources.{' '}
            <Link external={true} href="#" ariaLabel="Learn more about resource management, opens in new tab">
              Learn more
            </Link>
          </Alert>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};

const deleteConsentText = 'confirm';
export const DeleteWithAdditionalConfirmationModal = (
  props: ModalProps & { onCancel: () => void; onConfirm: () => void }
) => {
  const [deleteInputText, setDeleteInputText] = useState('');
  const inputMatchesConsentText = deleteInputText.toLowerCase() === deleteConsentText;

  const handleDeleteSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (inputMatchesConsentText) {
      props.onConfirm();
    }
  };

  return (
    <Modal
      {...props}
      visible={props.visible}
      header="Delete instance"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={props.onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={props.onConfirm} disabled={!inputMatchesConsentText}>
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Box variant="span">
          Permanently delete instance{' '}
          <Box variant="span" fontWeight="bold">
            1234567890
          </Box>
          ? You can’t undo this action.
        </Box>

        <Alert type="warning" statusIconAriaLabel="Warning">
          Proceeding with this action will delete the instance with all its content and can affect related resources.{' '}
          <Link external={true} href="#" ariaLabel="Learn more about resource management, opens in new tab">
            Learn more
          </Link>
        </Alert>

        <Box>To avoid accidental deletions, we ask you to provide additional written consent.</Box>

        <form onSubmit={handleDeleteSubmit}>
          <FormField label={`To confirm this deletion, type "${deleteConsentText}".`}>
            <ColumnLayout columns={2}>
              <Input
                placeholder={deleteConsentText}
                onChange={event => setDeleteInputText(event.detail.value)}
                value={deleteInputText}
                ariaRequired={true}
              />
            </ColumnLayout>
          </FormField>
        </form>
      </SpaceBetween>
    </Modal>
  );
};

export const FeedbackModal = (props: ModalProps & { onCancel: () => void; onConfirm: () => void }) => {
  const [selectedOption, setSelectedOption] = useState<SelectProps['selectedOption']>({
    label: 'General feedback',
    value: '1',
  });
  const [satisifedValue, setSatisifedValue] = useState<string | null>(null);
  const [fileValue, setFileValue] = useState<FileUploadProps['value']>([]);

  const handleDeleteSubmit = (event: FormEvent) => {
    event.preventDefault();
    props.onConfirm();
  };

  return (
    <Modal
      {...props}
      header="Feedback for Console Home"
      visible={props.visible}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={props.onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={props.onConfirm}>
              Submit
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <form onSubmit={handleDeleteSubmit}>
        <Form>
          <SpaceBetween size="s" direction="vertical">
            <Box>Thank you for taking time to provide feedback.</Box>
            <FormField label="Type" description="Choose the type of feedback you are submitting">
              <Select
                selectedOption={selectedOption}
                onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
                options={[
                  { label: 'General feedback', value: '1' },
                  { label: 'Feature request', value: '2' },
                  { label: 'Report an issue', value: '3' },
                  { label: 'Support/Account/Billing', value: '4' },
                  { label: 'UI feedback', value: '5' },
                ]}
              />
            </FormField>
            <FormField
              label="Enter your message below"
              constraintText="1000 character(s) available. Do not disclose any personal, commercially sensitive, or confidential information."
            >
              <Textarea value="" />
            </FormField>
            <FormField label="Are you satisfied with your experience?">
              <RadioGroup
                onChange={({ detail }) => setSatisifedValue(detail.value)}
                value={satisifedValue}
                items={[
                  { value: 'first', label: 'Yes' },
                  { value: 'second', label: 'No' },
                ]}
              />
            </FormField>
            <FormField
              label={
                <>
                  We may want to contact you about your feedback. If you agree, provide your email address.
                  <i> - optional</i>
                </>
              }
              constraintText="Personal information you provide to us will be handled in accordance with the AWS Privacy Notice (https://aws.amazon.com/privacy/)."
            >
              <Input value="" />
            </FormField>
            <FormField label="File attachment">
              <FileUpload
                onChange={({ detail }) => setFileValue(detail.value)}
                value={fileValue}
                i18nStrings={{
                  uploadButtonText: e => (e ? 'Choose files' : 'Choose file'),
                  dropzoneText: e => (e ? 'Drop files to upload' : 'Drop file to upload'),
                  removeFileAriaLabel: e => `Remove file ${e + 1}`,
                  limitShowFewer: 'Show fewer files',
                  limitShowMore: 'Show more files',
                  errorIconAriaLabel: 'Error',
                }}
                showFileLastModified={true}
                showFileSize={true}
                showFileThumbnail={true}
                tokenLimit={3}
                constraintText="Please don't attach images with PII information"
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </form>
    </Modal>
  );
};
