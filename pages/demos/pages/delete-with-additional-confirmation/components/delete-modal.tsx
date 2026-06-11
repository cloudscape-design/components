// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { useEffect, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { EC2Instance } from '../../../resources/types';

interface DeleteModalProps {
  instances: EC2Instance[];
  visible: boolean;
  onDiscard: () => void;
  onDelete: () => void;
}
export function DeleteModal({ instances, visible, onDiscard, onDelete }: DeleteModalProps) {
  const deleteConsentText = 'confirm';

  const [deleteInputText, setDeleteInputText] = useState('');
  useEffect(() => {
    setDeleteInputText('');
  }, [visible]);

  const inputMatchesConsentText = deleteInputText.toLowerCase() === deleteConsentText;

  const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputMatchesConsentText) {
      onDelete();
    }
  };

  const isMultiple = instances.length > 1;
  return (
    <Modal
      visible={visible}
      onDismiss={onDiscard}
      header={isMultiple ? 'Delete instances' : 'Delete instance'}
      closeAriaLabel="Close dialog"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDiscard}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onDelete} disabled={!inputMatchesConsentText} data-testid="submit">
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      {instances.length > 0 && (
        <SpaceBetween size="m">
          {isMultiple ? (
            <Box variant="span">
              Permanently delete{' '}
              <Box variant="span" fontWeight="bold">
                {instances.length} instances
              </Box>
              ? You can’t undo this action.
            </Box>
          ) : (
            <Box variant="span">
              Permanently delete instance{' '}
              <Box variant="span" fontWeight="bold">
                {instances[0].id}
              </Box>
              ? You can’t undo this action.
            </Box>
          )}

          <Alert type="warning" statusIconAriaLabel="Warning">
            Proceeding with this action will delete the
            {isMultiple ? ' instances with all their content ' : ' instance with all its content'} and can affect
            related resources.{' '}
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
      )}
    </Modal>
  );
}
