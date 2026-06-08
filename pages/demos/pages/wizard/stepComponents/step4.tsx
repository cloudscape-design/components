// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { WizardState } from '../interfaces';
import { getEngineLabel, getEngineLicense } from './step1';

interface ReviewProps {
  info: WizardState;
  setActiveStepIndex: (step: number) => void;
}

const Review = ({ info: { engine, details, advanced }, setActiveStepIndex }: ReviewProps) => {
  return (
    <Box margin={{ bottom: 'l' }}>
      <SpaceBetween size="xxl">
        <SpaceBetween size="xs" className="step-1-review">
          <Header
            variant="h3"
            headingTagOverride="h2"
            actions={
              <Button className="edit-step-btn" onClick={() => setActiveStepIndex(0)}>
                Edit
              </Button>
            }
          >
            Step 1: Engine type
          </Header>
          <Container
            header={
              <Header variant="h2" headingTagOverride="h3">
                Engine options
              </Header>
            }
          >
            <KeyValuePairs
              columns={2}
              items={[
                {
                  label: 'Engine',
                  value: getEngineLabel(engine.engineOption),
                },
                {
                  label: 'License model',
                  value: getEngineLicense(engine.engineOption),
                },
                {
                  label: engine.engineOption === 'aurora' ? 'Edition' : 'Use case',
                  value: engine.engineOption === 'aurora' ? engine.edition : engine.usecase,
                },
                ...(engine.engineOption !== 'aurora'
                  ? [
                      {
                        label: 'Version',
                        value: engine.version.label,
                      },
                    ]
                  : []),
              ]}
            />
          </Container>
        </SpaceBetween>

        <SpaceBetween size="xs" className="step-2-review">
          <Header
            variant="h3"
            headingTagOverride="h2"
            actions={
              <Button className="edit-step-btn" onClick={() => setActiveStepIndex(1)}>
                Edit
              </Button>
            }
          >
            Step 2: Instance details
          </Header>

          <SpaceBetween size="l">
            <Container
              header={
                <Header variant="h2" headingTagOverride="h3">
                  Instance options
                </Header>
              }
              footer={
                <ExpandableSection headerText="Additional options" variant="footer">
                  <KeyValuePairs
                    columns={2}
                    items={[
                      {
                        label: 'Time zone',
                        value: details.timeZone.label,
                      },
                      {
                        label: 'Availability zone',
                        value: details.availabilityZone.label,
                      },

                      {
                        label: 'Database port',
                        value: details.port,
                      },

                      {
                        label: 'IAM DB authentication',
                        value: details.iamAuth,
                      },
                    ]}
                  />
                </ExpandableSection>
              }
            >
              <KeyValuePairs
                columns={2}
                items={[
                  {
                    label: 'Class',
                    value: details.instanceClass.label,
                  },
                  {
                    label: 'Storage type',
                    value: details.storageType,
                  },
                  {
                    label: 'Allocated storage',
                    value: <>{details.storage} GiB</>,
                  },
                ]}
              />
            </Container>

            <Container
              header={
                <Header variant="h2" headingTagOverride="h3">
                  Names and password
                </Header>
              }
            >
              <KeyValuePairs
                columns={2}
                items={[
                  {
                    label: 'DB instance identifier',
                    value: details.identifier || 'example-instance-identifier',
                  },
                  {
                    label: 'Primary username',
                    value: details.username || 'example-username',
                  },
                  {
                    label: 'Primary password',
                    value: 'example - password',
                  },
                ]}
              />
            </Container>
          </SpaceBetween>
        </SpaceBetween>

        <SpaceBetween size="xs" className="step-3-review">
          <Header
            variant="h3"
            headingTagOverride="h2"
            actions={
              <Button className="edit-step-btn" onClick={() => setActiveStepIndex(2)}>
                Edit
              </Button>
            }
          >
            Step 3: Settings
          </Header>
          <SpaceBetween size="l">
            <Container
              header={
                <Header variant="h2" headingTagOverride="h3">
                  Network and security
                </Header>
              }
            >
              <KeyValuePairs
                columns={2}
                items={[
                  {
                    label: 'Virtual Private Cloud (VPC)',
                    value: advanced.vpc.label,
                  },
                  {
                    label: 'Subnet group',
                    value: advanced.subnet.label,
                  },
                  {
                    label: 'VPC security groups',
                    value: advanced.securityGroups.label,
                  },
                  {
                    label: 'Public accessibility',
                    value: advanced.accessibility,
                  },
                  {
                    label: 'Encryption',
                    value: advanced.encryption,
                  },
                ]}
              />
            </Container>

            <Container
              header={
                <Header variant="h2" headingTagOverride="h3">
                  Maintenance and monitoring
                </Header>
              }
              footer={
                <ExpandableSection headerText="Additional options" variant="footer">
                  <KeyValuePairs
                    columns={2}
                    items={[
                      {
                        label: 'Failover priority',
                        value: advanced.failover.label,
                      },
                      {
                        label: 'Backtrack',
                        value: advanced.backtrack,
                      },
                    ]}
                  />
                </ExpandableSection>
              }
            >
              <KeyValuePairs
                columns={2}
                items={[
                  {
                    label: 'Auto minor version upgrades',
                    value: advanced.upgrades,
                  },
                  {
                    label: 'Backup retention period',
                    value: advanced.backup.label,
                  },
                  {
                    label: 'Enhanced monitoring',
                    value: advanced.monitoring,
                  },
                ]}
              />
            </Container>
          </SpaceBetween>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
};

export default Review;
