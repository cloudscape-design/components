// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ExpandableSection from '~components/expandable-section';
import SpaceBetween from '~components/space-between';
import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';
import Container from '~components/container';
import Header from '~components/header';

export default function SimpleContainers() {
  return (
    <article>
      <h1>Will be supported</h1>
      <ScreenshotArea>
        <h2>Default with Actions Security Groups inline-link (recommended)</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups primary</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="primary">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="primary">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="primary">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups normal</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Volumes</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={false}
            headerText="Volume 1 (AMI Root) (Custom) (8 GiB, EBS)"
            headerActions={
              <Button disabled={true} variant="inline-link">
                Remove
              </Button>
            }
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Volume 2 (Custom) (8 GiB, EBS)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Volume 3 (Custom) (16 GiB, EBS)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Volume 4 (Custom) (64 GiB, EBS, General Purpose SSD (gp3))"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Inside a Container with a footer</h2>
        <SpaceBetween size="xs">
          <Container
            footer="Container footer"
            header={
              <Header variant="h2" description="Container description">
                Container title
              </Header>
            }
          >
            Container content
            <ExpandableSection
              headerText="Volume 1 (AMI Root) (Custom) (8 GiB, EBS)"
              headerActions={
                <Button disabled={true} variant="inline-link">
                  Remove
                </Button>
              }
            >
              Configuration Form here
            </ExpandableSection>
            <ExpandableSection
              headerText="Volume 2 (Custom) (8 GiB, EBS)"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
            <ExpandableSection
              headerText="Volume 3 (Custom) (16 GiB, EBS)"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
            <ExpandableSection
              headerText="Volume 4 (Custom) (64 GiB, EBS, General Purpose SSD (gp3))"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
          </Container>
        </SpaceBetween>

        <h2>Default with Actions Inside a Container without a footer</h2>
        <SpaceBetween size="xs">
          <Container
            header={
              <Header variant="h2" description="Container description">
                Container title
              </Header>
            }
          >
            Container content
            <ExpandableSection
              disableLine={false}
              headerText="Volume 1 (AMI Root) (Custom) (8 GiB, EBS)"
              headerActions={
                <Button disabled={false} variant="inline-link">
                  Remove
                </Button>
              }
            >
              Configuration Form here
            </ExpandableSection>
          </Container>
        </SpaceBetween>
      </ScreenshotArea>

      <h1>Will not be Supported</h1>
      <ScreenshotArea>
        <h2>Default with Actions Security Groups mixed</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 4 (UDP, 22)"
            headerActions={
              <Button iconName="copy" variant="inline-icon">
                Remove
              </Button>
            }
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups mixed actions and no actions</h2>
        <SpaceBetween size="xs">
          <ExpandableSection disableLine={false} headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)">
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection disableLine={false} headerText="Security group rule 3 (TCP, 22)">
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 4 (UDP, 22)"
            headerActions={
              <Button iconName="copy" variant="inline-icon">
                Remove
              </Button>
            }
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups 1 action and no actions</h2>
        <SpaceBetween size="xs">
          <ExpandableSection disableLine={false} headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)">
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection disableLine={false} headerText="Security group rule 2 (TCP, 0)">
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection disableLine={false} headerText="Security group rule 3 (TCP, 22)">
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={false}
            headerText="Security group rule 4 (UDP, 22)"
            headerActions={
              <Button iconName="copy" variant="inline-icon">
                Remove
              </Button>
            }
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
