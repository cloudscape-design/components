// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ExpandableSection from '~components/expandable-section';
import SpaceBetween from '~components/space-between';
import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';
import Container from '~components/container';
import Header from '~components/header';

export default function SimpleContainers() {
  const [expanded, setExpanded] = useState(false);
  return (
    <article>
      <h1>Expandable Default Variants Section with interactive elements & guideline</h1>
      <ScreenshotArea>
        <h2>Default - unchanged</h2>
        <SpaceBetween size="xs">
          <ExpandableSection headerText="Static website hosting">
            After you enable your S3 bucket for static website hosting, web browsers can access your content through the
            Amazon S3 website endpoint for the bucket.
          </ExpandableSection>
          <ExpandableSection
            headerText="Static website hosting (controlled)"
            expanded={expanded}
            onChange={({ detail }) => setExpanded(detail.expanded)}
          >
            After you enable your S3 bucket for static website hosting, web browsers can access your content through the
            Amazon S3 website endpoint for the bucket.
          </ExpandableSection>
          <ExpandableSection headerText="Static website hosting" defaultExpanded={true}>
            After you enable your S3 bucket for static website hosting, web browsers can access your content through the
            Amazon S3 website endpoint for the bucket.
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups inline-link</h2>
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
          </Container>
        </SpaceBetween>
      </ScreenshotArea>

      <h1>Expandable Default Variants Section with interactive elements & guideline</h1>
      <ScreenshotArea>
        <h2>Default with Actions Security Groups inline-link</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups primary</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="primary">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="primary">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="primary">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups normal</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
        </SpaceBetween>

        <h2>Default with Actions Security Groups mixed</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 1 (TCP, 22, 0.0.0.0/0)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 2 (TCP, 0)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Security group rule 3 (TCP, 22)"
            headerActions={<Button variant="normal">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
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

        <h2>Default with Actions Volumes</h2>
        <SpaceBetween size="xs">
          <ExpandableSection
            disableLine={true}
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
            disableLine={true}
            headerText="Volume 2 (Custom) (8 GiB, EBS)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
            headerText="Volume 3 (Custom) (16 GiB, EBS)"
            headerActions={<Button variant="inline-link">Remove</Button>}
          >
            Configuration Form here
          </ExpandableSection>
          <ExpandableSection
            disableLine={true}
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
              disableLine={true}
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
              disableLine={true}
              headerText="Volume 2 (Custom) (8 GiB, EBS)"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
            <ExpandableSection
              disableLine={true}
              headerText="Volume 3 (Custom) (16 GiB, EBS)"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
            <ExpandableSection
              disableLine={true}
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
              disableLine={true}
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
              disableLine={true}
              headerText="Volume 2 (Custom) (8 GiB, EBS)"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
            <ExpandableSection
              disableLine={true}
              headerText="Volume 3 (Custom) (16 GiB, EBS)"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
            <ExpandableSection
              disableLine={true}
              headerText="Volume 4 (Custom) (64 GiB, EBS, General Purpose SSD (gp3))"
              headerActions={<Button variant="inline-link">Remove</Button>}
            >
              Configuration Form here
            </ExpandableSection>
          </Container>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
