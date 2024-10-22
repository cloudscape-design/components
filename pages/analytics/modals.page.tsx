// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { AppLayout, BreadcrumbGroup, Button, Container, ContentLayout, Header, SpaceBetween } from '~components';

import {
  DeleteWithAdditionalConfirmationModal,
  DeleteWithSimpleConfirmationModal,
  FeedbackModal,
} from './components/modals';

function Content() {
  const [simpleDeleteModalVisible, setSimpleDeleteModalVisible] = useState(false);
  const [additionalDeleteModalVisible, setAdditionalDeleteModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  const handleSimpleDeleteModalClose = () => {
    setSimpleDeleteModalVisible(false);
  };

  const handleAdditionalDeleteModalClose = () => {
    setAdditionalDeleteModalVisible(false);
  };

  const handleFeedbackModalClose = () => {
    setFeedbackModalVisible(false);
  };

  return (
    <ContentLayout>
      <Container header={<Header>Section 1</Header>}>
        <SpaceBetween size="xs" direction="horizontal">
          <Button
            onClick={() => {
              setSimpleDeleteModalVisible(true);
            }}
          >
            Delete with simple confirmation - Modal
          </Button>
          <Button
            onClick={() => {
              setAdditionalDeleteModalVisible(true);
            }}
          >
            Delete with additional confirmation - Modal
          </Button>
          <Button
            onClick={() => {
              setFeedbackModalVisible(true);
            }}
          >
            Feedback flow - Modal
          </Button>
        </SpaceBetween>
        <DeleteWithSimpleConfirmationModal
          visible={simpleDeleteModalVisible}
          onConfirm={handleSimpleDeleteModalClose}
          onCancel={handleSimpleDeleteModalClose}
          onDismiss={handleSimpleDeleteModalClose}
        />
      </Container>

      <DeleteWithAdditionalConfirmationModal
        visible={additionalDeleteModalVisible}
        onConfirm={handleAdditionalDeleteModalClose}
        onCancel={handleAdditionalDeleteModalClose}
        onDismiss={handleAdditionalDeleteModalClose}
      />

      <FeedbackModal
        visible={feedbackModalVisible}
        onCancel={handleFeedbackModalClose}
        onConfirm={handleFeedbackModalClose}
        onDismiss={handleFeedbackModalClose}
      />
    </ContentLayout>
  );
}

function App() {
  return (
    <AppLayout
      contentType="form"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'System', href: '#' },
            { text: 'Components', href: '#components' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={<Content />}
    />
  );
}

export default App;
