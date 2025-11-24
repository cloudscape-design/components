// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Tooltip from '~components/tooltip';

export default function TooltipCustomStyling() {
  return (
    <div style={{ padding: '50px' }}>
      <h1>Custom Styled Tooltips</h1>

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Dark Theme Tooltip</Header>}>
          <Tooltip
            content="Dark mode activated - Optimal for low-light environments"
            trigger="hover-focus"
            style={{
              content: {
                backgroundColor: '#16191f',
                color: '#f0f0f0',
                borderColor: '#0d1117',
                borderWidth: '2px',
                borderRadius: '10px',
                padding: '14px 18px',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '280px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <Button variant="primary">Dark Theme Tooltip</Button>
          </Tooltip>
        </Container>

        <Container header={<Header variant="h2">Success Theme Tooltip</Header>}>
          <Tooltip
            content="Operation completed successfully! All changes have been saved."
            trigger="hover-focus"
            style={{
              content: {
                backgroundColor: '#00ff4cff',
                color: '#ffffff',
                borderColor: '#0a3d1a',
                borderWidth: '2px',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                maxWidth: '300px',
                boxShadow: '0 6px 16px rgba(15, 83, 35, 0.3)',
              },
            }}
          >
            <Button iconName="status-positive">Success Tooltip</Button>
          </Tooltip>
        </Container>

        <Container header={<Header variant="h2">Warning Theme Tooltip</Header>}>
          <Tooltip
            content="Caution: Review all settings carefully before proceeding with this action"
            trigger="hover-focus"
            style={{
              content: {
                backgroundColor: '#ffac30ff',
                color: '#1a1a1a',
                borderColor: '#cc7a00',
                borderWidth: '2px',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '700',
                maxWidth: '320px',
                boxShadow: '0 6px 16px rgba(255, 153, 0, 0.35)',
              },
            }}
          >
            <Button iconName="status-warning">Warning Tooltip</Button>
          </Tooltip>
        </Container>

        <Container header={<Header variant="h2">Error Theme Tooltip</Header>}>
          <Tooltip
            content="Error: Unable to complete this action. Please check your settings and try again."
            trigger="hover-focus"
            style={{
              content: {
                backgroundColor: '#ff0909ff',
                color: '#ffffff',
                borderColor: '#900000',
                borderWidth: '2px',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                maxWidth: '320px',
                boxShadow: '0 6px 16px rgba(201, 21, 21, 0.4)',
              },
            }}
          >
            <Button iconName="status-negative">Error Tooltip</Button>
          </Tooltip>
        </Container>

        <Container header={<Header variant="h2">Large Text Tooltip</Header>}>
          <Tooltip
            content="This tooltip has larger text for better readability and a wider max width to accommodate more content"
            trigger="hover-focus"
            style={{
              content: {
                backgroundColor: '#ffffff',
                borderColor: 'black',
                borderWidth: '2px',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                maxWidth: '320px',
              },
            }}
          >
            <Button>Large Text Tooltip</Button>
          </Tooltip>
        </Container>

        <Container header={<Header variant="h2">Minimal Style Tooltip</Header>}>
          <Tooltip
            content="Minimalist design with subtle borders"
            trigger="hover-focus"
            style={{
              content: {
                backgroundColor: '#ffffff',
                color: '#333333',
                borderColor: '#e0e0e0',
                borderWidth: '1px',
                borderRadius: '2px',
                padding: '6px 10px',
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Button variant="normal">Minimal Tooltip</Button>
          </Tooltip>
        </Container>

        <Container header={<Header variant="h2">Interactive Demo</Header>}>
          <SpaceBetween size="m">
            <Tooltip
              content={
                <>
                  This tooltip changes style dynamically.{' '}
                  <Link href="#" variant="primary">
                    Learn more
                  </Link>
                </>
              }
              trigger="hover-focus"
              disableHoverableContent={false}
              style={{
                content: {
                  backgroundColor: '#ffffff',
                  color: '#1a1a1a',
                  borderColor: '#d5dbdb',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                },
              }}
            >
              <Button>Hover to see more</Button>
            </Tooltip>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </div>
  );
}
