// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { FormEvent, useState } from 'react';

import { Alert, Box, Button, ColumnLayout, Container, FormField, Input, Link, Modal, SpaceBetween } from '~components';
import { setFunnelMetrics } from '~components/internal/analytics';

import { MockedFunnelMetrics } from './mock-funnel';
setFunnelMetrics(MockedFunnelMetrics);

const deleteConsentText = 'confirm';
export default function ModalFunnelPage() {
  const [visible, setVisible] = useState(false);

  const [deleteInputText, setDeleteInputText] = useState('');
  const [additionalInputText, setAdditionalInputText] = useState('');
  const inputMatchesConsentText = deleteInputText.toLowerCase() === deleteConsentText;

  const onDiscard = () => {
    setVisible(false);
  };

  const onConfirm = () => {
    setVisible(false);
  };

  const handleDeleteSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (inputMatchesConsentText) {
      onConfirm();
    }
  };

  return (
    <>
      <h1>Modal Funnel</h1>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      {visible && (
        <Modal
          analyticsMetadata={{
            flowType: 'delete',
            instanceIdentifier: 'delete-flow',
            resourceType: 'instance',
          }}
          onDismiss={() => setVisible(false)}
          visible={true}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={onDiscard}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={onConfirm} disabled={!inputMatchesConsentText} data-testid="submit">
                  Delete
                </Button>
              </SpaceBetween>
            </Box>
          }
          header="Modal title"
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
              Proceeding with this action will delete the instance with all its content and can affect related
              resources.{' '}
              <Link external={true} href="#" ariaLabel="Learn more about resource management, opens in new tab">
                Learn more
              </Link>
            </Alert>

            <Box>To avoid accidental deletions, we ask you to provide additional written consent.</Box>
            <Container>
              <FormField label="Nested input">
                <Input
                  placeholder="Additional nested input"
                  onChange={event => setAdditionalInputText(event.detail.value)}
                  value={additionalInputText}
                />
              </FormField>
            </Container>
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
      )}
    </>
  );
}
