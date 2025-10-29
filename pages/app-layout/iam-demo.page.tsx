// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import {
  AppLayoutToolbar,
  BreadcrumbGroup,
  Button,
  Checkbox,
  Container,
  CopyToClipboard,
  Drawer,
  ExpandableSection,
  Form,
  FormField,
  Header,
  Input,
  KeyValuePairs,
  Link,
  Multiselect,
  ProgressBar,
  Select,
  SideNavigation,
  SpaceBetween,
  StatusIndicator,
  Textarea,
} from '~components';
import Box from '~components/box';
import { registerBottomDrawer, updateDrawer } from '~components/internal/plugins/widget/index';
import { mount, unmount } from '~mount';

import './utils/external-sidecar-widget-demo';
import './utils/external-global-left-panel-widget';

// Separate component for the IAM role creation form
interface CreateIamRoleFormProps {
  onRoleCreated?: (roleData: any) => void;
}

function CreateIamRoleForm({ onRoleCreated }: CreateIamRoleFormProps) {
  // Create new IAM role settings - moved from parent component
  const [newRoleName, setNewRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedTrustedEntity, setSelectedTrustedEntity] = useState({
    label: 'AWS service',
    value: 'service',
  });
  const [selectedUseCase, setSelectedUseCase] = useState({
    label: 'EC2',
    value: 'ec2',
  });
  const [selectedPermissionsPolicies, setSelectedPermissionsPolicies] = useState([]);
  const [rolePath, setRolePath] = useState('/');
  const [roleNameError, setRoleNameError] = useState('');

  // Validate IAM role name
  const validateRoleName = (name: string) => {
    if (name && !/^[a-zA-Z0-9+=,.@\-_]{1,64}$/.test(name)) {
      setRoleNameError(
        'Role name can only contain alphanumeric characters and these symbols: + = , . @ - _. Maximum 64 characters.'
      );
      return false;
    }
    setRoleNameError('');
    return true;
  };

  const handleCreateRole = () => {
    const isRoleNameValid = validateRoleName(newRoleName);

    if (!isRoleNameValid || !newRoleName.trim()) {
      if (!newRoleName.trim()) {
        setRoleNameError('Role name is required.');
      }
      return;
    }

    const roleData = {
      name: newRoleName,
      description: roleDescription,
      trustedEntity: selectedTrustedEntity,
      useCase: selectedUseCase,
      permissionsPolicies: selectedPermissionsPolicies,
      path: rolePath,
    };

    console.log('Creating IAM role with data:', roleData);

    // Call the callback if provided
    if (onRoleCreated) {
      onRoleCreated(roleData);
    }
  };

  return (
    <Box padding={{ right: 'xl', left: 'xl', bottom: 'xxl' }}>
      <SpaceBetween size="l">
        <Header
          description="Create a new IAM role to define permissions for your EC2 instance to access AWS services and resources."
          variant="h2"
        >
          Create new IAM role
        </Header>
        <FormField
          constraintText="Use letters, numbers, plus (+), equal (=), comma (,), period (.), at (@), and hyphen (-). Maximum 64 characters."
          description="Enter a unique name for the role. The name must be unique within your AWS account."
          label="Role name"
          errorText={roleNameError}
        >
          <Input
            placeholder="EC2-MyApplication-Role"
            value={newRoleName}
            onChange={({ detail }) => {
              setNewRoleName(detail.value);
              validateRoleName(detail.value);
            }}
          />
        </FormField>
        <FormField
          constraintText="Maximum 1000 characters."
          description="Provide a brief description of the role's purpose and the permissions it grants."
          label="Description"
        >
          <Input
            placeholder="Role for EC2 instances to access S3 and CloudWatch"
            value={roleDescription}
            onChange={({ detail }) => setRoleDescription(detail.value)}
          />
        </FormField>
        <FormField description="Select the type of entity that can assume this role." label="Trusted entity type">
          <Select
            options={[
              {
                description: 'Allow AWS services like EC2, Lambda to assume this role',
                label: 'AWS service',
                value: 'service',
              },
              {
                description: 'Allow entities in other AWS accounts to assume this role',
                label: 'AWS account',
                value: 'account',
              },
              {
                description: 'Allow users from web identity providers to assume this role',
                label: 'Web identity',
                value: 'web-identity',
              },
              {
                description: 'Allow SAML identity providers to assume this role',
                label: 'SAML 2.0 federation',
                value: 'saml',
              },
            ]}
            placeholder="Choose trusted entity type"
            selectedOption={selectedTrustedEntity}
            onChange={({ detail }) => setSelectedTrustedEntity(detail.selectedOption as any)}
          />
        </FormField>
        <FormField description="Select the AWS service that will use this role." label="Use case">
          <Select
            options={[
              {
                description: 'Allows EC2 instances to call AWS services on your behalf',
                label: 'EC2',
                value: 'ec2',
              },
              {
                description: 'Allows Lambda functions to call AWS services on your behalf',
                label: 'Lambda',
                value: 'lambda',
              },
              {
                description: 'Allows ECS tasks to call AWS services on your behalf',
                label: 'ECS Task',
                value: 'ecs-tasks',
              },
              {
                description: 'Allows Systems Manager to perform actions on your behalf',
                label: 'Systems Manager',
                value: 'ssm',
              },
            ]}
            placeholder="Choose a service"
            selectedOption={selectedUseCase}
            onChange={({ detail }) => setSelectedUseCase(detail.selectedOption as any)}
          />
        </FormField>
        <FormField
          constraintText="You can attach up to 20 managed policies per role. Additional inline policies can be added later."
          description="Select one or more policies to attach to this role. These policies define what actions the role can perform."
          label="Permissions policies"
        >
          <Multiselect
            options={[
              {
                label: 'AWS managed policies',
                options: [
                  {
                    description: 'Provides read-only access to Amazon S3',
                    label: 'AmazonS3ReadOnlyAccess',
                    value: 'arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess',
                  },
                  {
                    description: 'Provides full access to Amazon S3',
                    label: 'AmazonS3FullAccess',
                    value: 'arn:aws:iam::aws:policy/AmazonS3FullAccess',
                  },
                  {
                    description: 'Permissions for CloudWatch agent to run on EC2 instances',
                    label: 'CloudWatchAgentServerPolicy',
                    value: 'arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy',
                  },
                  {
                    description: 'Policy for Systems Manager service core functionality',
                    label: 'AmazonSSMManagedInstanceCore',
                    value: 'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore',
                  },
                  {
                    description: 'Provides read-only access to Amazon EC2',
                    label: 'AmazonEC2ReadOnlyAccess',
                    value: 'arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess',
                  },
                  {
                    description: 'Provides read-only access to Amazon RDS',
                    label: 'AmazonRDSReadOnlyAccess',
                    value: 'arn:aws:iam::aws:policy/AmazonRDSReadOnlyAccess',
                  },
                ],
              },
              {
                label: 'Customer managed policies',
                options: [
                  {
                    description: 'Custom policy for specific S3 bucket access',
                    label: 'CustomS3BucketAccess',
                    value: 'arn:aws:iam::123456789012:policy/CustomS3BucketAccess',
                  },
                  {
                    description: 'Custom policy for application-specific logging',
                    label: 'ApplicationLoggingPolicy',
                    value: 'arn:aws:iam::123456789012:policy/ApplicationLoggingPolicy',
                  },
                ],
              },
            ]}
            placeholder="Choose policies"
            selectedOptions={selectedPermissionsPolicies}
            onChange={({ detail }) => setSelectedPermissionsPolicies(detail.selectedOptions as any)}
          />
        </FormField>
        <FormField
          constraintText="Path must begin and end with a forward slash (/). Use alphanumeric characters and these symbols: + = , . @ - _"
          description="Optionally specify a path for the role to help organize roles in your account."
          label="Path"
        >
          <Input
            placeholder="/application-roles/"
            value={rolePath}
            onChange={({ detail }) => setRolePath(detail.value)}
          />
        </FormField>
        <Button variant="primary" onClick={handleCreateRole}>
          Create
        </Button>
      </SpaceBetween>
    </Box>
  );
}

function Component() {
  // Main instance settings
  const [instanceName, setInstanceName] = useState('');
  const [selectedAmi, setSelectedAmi] = useState({
    description: 'Amazon Linux 2023 AMI 2023.3.20231218.0 x86_64 HVM gp3',
    label: 'Amazon Linux 2023 AMI',
    value: 'ami-0c02fb55956c7d316',
  });
  const [selectedInstanceType, setSelectedInstanceType] = useState({
    description: '1 vCPU, 1 GiB Memory',
    label: 't3.micro',
    tags: ['Free tier eligible'],
    value: 't3.micro',
  });

  // Network settings
  const [selectedVpc, setSelectedVpc] = useState({
    description: '172.31.0.0/16',
    label: 'vpc-12345678 (default)',
    value: 'vpc-12345678',
  });
  const [selectedSubnet, setSelectedSubnet] = useState({
    description: 'us-east-1a | 172.31.32.0/20',
    label: 'subnet-12345678',
    value: 'subnet-12345678',
  });
  const [selectedPublicIp, setSelectedPublicIp] = useState({
    label: 'Enable',
    value: 'enable',
  });
  const [selectedSecurityGroups, setSelectedSecurityGroups] = useState([
    {
      description: 'Default VPC security group - allows all outbound traffic, inbound from same group',
      label: 'default',
      value: 'sg-12345678',
    },
  ]);
  const [selectedKeyPair, setSelectedKeyPair] = useState(null);

  // IAM settings
  const [selectedIamRole, setSelectedIamRole] = useState(null);
  const [iamRoles, setIamRoles] = useState([
    {
      description: 'AWS managed role for Systems Manager access, patching, and remote management',
      label: 'AmazonEC2RoleForSSM',
      value: 'AmazonEC2RoleForSSM',
    },
    {
      description: 'Custom role with S3 read access, CloudWatch logs, and Parameter Store permissions',
      label: 'EC2-WebServer-Role',
      value: 'EC2-WebServer-Role',
    },
    {
      description: 'Role for database instances with RDS monitoring, CloudWatch metrics, and backup permissions',
      label: 'EC2-Database-Role',
      value: 'EC2-Database-Role',
    },
    {
      description: 'Role with CodeDeploy agent permissions, CodeCommit access, and artifact retrieval',
      label: 'EC2-DevOps-Pipeline-Role',
      value: 'EC2-DevOps-Pipeline-Role',
    },
    {
      description: 'Role for log aggregation with CloudWatch Logs, X-Ray tracing, and metric publishing',
      label: 'EC2-Logging-Analytics-Role',
      value: 'EC2-Logging-Analytics-Role',
    },
    {
      description: 'Role with full S3 access for data processing, backup, and content serving workloads',
      label: 'EC2-S3-FullAccess-Role',
      value: 'EC2-S3-FullAccess-Role',
    },
    {
      description: 'Limited permissions for monitoring and observability tools with read-only AWS access',
      label: 'EC2-ReadOnly-Monitoring-Role',
      value: 'EC2-ReadOnly-Monitoring-Role',
    },
    {
      description: 'Role for container workloads with ECR access, ECS task permissions, and Docker operations',
      label: 'EC2-Container-Registry-Role',
      value: 'EC2-Container-Registry-Role',
    },
  ]);

  // Storage settings
  const [rootVolumeSize, setRootVolumeSize] = useState('8');
  const [encryptVolume, setEncryptVolume] = useState(false);
  const [deleteOnTermination, setDeleteOnTermination] = useState(true);
  const [userData, setUserData] = useState('');

  // Advanced settings
  const [detailedMonitoring, setDetailedMonitoring] = useState(false);
  const [terminationProtection, setTerminationProtection] = useState(false);
  const [stopOnShutdown, setStopOnShutdown] = useState(true);
  const [placementGroup, setPlacementGroup] = useState('');

  // Form validation state
  const [instanceNameError, setInstanceNameError] = useState('');
  const [keyPairError, setKeyPairError] = useState('');
  const [rootVolumeSizeError, setRootVolumeSizeError] = useState('');

  // Validate instance name
  const validateInstanceName = (name: string) => {
    if (name && !/^[a-zA-Z0-9._\- ]{1,255}$/.test(name)) {
      setInstanceNameError(
        'Name can only contain letters, numbers, spaces, periods, hyphens, and underscores. Maximum 255 characters.'
      );
      return false;
    }
    setInstanceNameError('');
    return true;
  };

  // Validate key pair selection
  const validateKeyPair = () => {
    if (!selectedKeyPair && selectedAmi) {
      setKeyPairError('A key pair is required to connect to your instance.');
      return false;
    }
    setKeyPairError('');
    return true;
  };

  // Validate root volume size
  const validateRootVolumeSize = (size: string) => {
    const sizeNum = parseInt(size, 10);
    if (isNaN(sizeNum) || sizeNum < 8 || sizeNum > 16384) {
      setRootVolumeSizeError('Volume size must be between 8 and 16384 GiB.');
      return false;
    }
    setRootVolumeSizeError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Validate form
    const isNameValid = validateInstanceName(instanceName);
    const isKeyPairValid = validateKeyPair();
    const isVolumeSizeValid = validateRootVolumeSize(rootVolumeSize);

    // Log validation errors
    if (!isNameValid || !isKeyPairValid || !isVolumeSizeValid) {
      console.log('Validation errors:', {
        instanceName: instanceNameError,
        keyPair: keyPairError,
        rootVolumeSize: rootVolumeSizeError,
      });
      return;
    }

    // If valid, proceed with form submission
    console.log('Launching instance with configuration:', {
      instanceName,
      ami: selectedAmi,
      instanceType: selectedInstanceType,
      vpc: selectedVpc,
      subnet: selectedSubnet,
      publicIp: selectedPublicIp,
      securityGroups: selectedSecurityGroups,
      keyPair: selectedKeyPair,
      iamRole: selectedIamRole,
      storage: {
        rootVolumeSize,
        encryptVolume,
        deleteOnTermination,
      },
      userData,
      advancedSettings: {
        detailedMonitoring,
        terminationProtection,
        stopOnShutdown,
        placementGroup,
      },
    });
  };

  useEffect(() => {
    registerBottomDrawer({
      id: 'create-iam-role',
      position: 'bottom',
      defaultActive: false,
      resizable: true,
      defaultSize: 800,
      preserveInactiveContent: true,

      isExpandable: true,

      ariaLabels: {
        closeButton: 'Close button',
        content: 'Content bottom',
        triggerButton: 'Trigger button',
        resizeHandle: 'Resize handle',
        expandedModeButton: 'Expanded mode button',
      },
      onToggle: event => {
        console.log('circle-global drawer on toggle', event.detail);
      },

      onResize: event => {
        console.log('resize', event.detail);
      },

      mountContent: container => {
        mount(
          <CreateIamRoleForm
            onRoleCreated={roleData => {
              const value = { value: roleData.name, label: roleData.name, description: roleData.description };
              setIamRoles(existingIamRoles => [...existingIamRoles, value]);
              setSelectedIamRole(value as any);
              updateDrawer({ type: 'closeDrawer', payload: { id: 'create-iam-role' } });
            }}
          />,
          container
        );
      },
      unmountContent: container => unmount(container),
    });
  }, []);

  return (
    <AppLayoutToolbar
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { href: '/ec2', text: 'EC2' },
            { href: '/ec2/instances', text: 'Instances' },
            { href: '/ec2/instances/launch', text: 'Launch instance' },
          ]}
        />
      }
      navigation={
        <SideNavigation
          // activeHref={}
          header={{ text: 'Navigation', href: '#/' }}
          items={[
            { type: 'link', text: 'Side nav menu A', href: '#/menu-a' },
            { type: 'link', text: 'Side nav menu B', href: '#/menu-b' },
            { type: 'link', text: 'Side nav menu C', href: '#/menu-c' },
          ]}
        />
      }
      tools={
        <Drawer header="Overview">
          <SpaceBetween size="m">
            <Box>
              Receive real-time data insights to build process improvements, track key performance indicators, and
              predict future business outcomes. Create a new Cloud Data Solution account to receive a 30 day free trial
              of all Cloud Data Solution services.
            </Box>
            <KeyValuePairs
              columns={2}
              items={[
                {
                  type: 'group',
                  items: [
                    {
                      label: 'Distribution ID',
                      value: 'E1WG1ZNPRXT0D4',
                    },
                    {
                      label: 'ARN',
                      value: (
                        <CopyToClipboard
                          copyButtonAriaLabel="Copy ARN"
                          copyErrorText="ARN failed to copy"
                          copySuccessText="ARN copied"
                          textToCopy="arn:service23G24::111122223333:distribution/23E1WG1ZNPRXT0D4"
                          variant="inline"
                        />
                      ),
                    },
                    {
                      label: 'Status',
                      value: <StatusIndicator>Available</StatusIndicator>,
                    },
                  ],
                },

                {
                  type: 'group',
                  items: [
                    {
                      label: 'SSL Certificate',
                      id: 'ssl-certificate-id',
                      value: (
                        <ProgressBar
                          value={30}
                          additionalInfo="Additional information"
                          description="Progress bar description"
                          ariaLabelledby="ssl-certificate-id"
                        />
                      ),
                    },
                    {
                      label: 'Price class',
                      value: 'Use only US, Canada, Europe',
                    },
                    {
                      label: 'CNAMEs',
                      value: (
                        <Link external={true} href="#">
                          abc.service23G24.xyz
                        </Link>
                      ),
                    },
                  ],
                },
              ]}
            />
          </SpaceBetween>
        </Drawer>
      }
      content={
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link">Cancel</Button>
              <Button variant="primary" onClick={handleSubmit}>
                Launch instance
              </Button>
            </SpaceBetween>
          }
          header={
            <Header description="Create and configure a new EC2 instance with your preferred settings." variant="h1">
              Launch instance
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Application and OS Images (Amazon Machine Image)</Header>}>
              <SpaceBetween size="l">
                <FormField
                  constraintText="Use letters, numbers, spaces, periods, hyphens, and underscores. Maximum 255 characters."
                  description="A name can help you identify the instance."
                  label="Name"
                  errorText={instanceNameError}
                >
                  <Input
                    placeholder="my-web-server"
                    value={instanceName}
                    onChange={({ detail }) => {
                      setInstanceName(detail.value);
                      validateInstanceName(detail.value);
                    }}
                  />
                </FormField>
                <FormField
                  description="An AMI is a template that contains the software configuration required to launch your instance."
                  label="Amazon Machine Image (AMI)"
                >
                  <Select
                    options={[
                      {
                        description: 'Amazon Linux 2023 AMI 2023.3.20231218.0 x86_64 HVM gp3',
                        label: 'Amazon Linux 2023 AMI',
                        value: 'ami-0c02fb55956c7d316',
                      },
                      {
                        description: 'Ubuntu Server 22.04 LTS (HVM), SSD Volume Type',
                        label: 'Ubuntu Server 22.04 LTS',
                        value: 'ami-0c7217cdde317cfec',
                      },
                      {
                        description: 'Microsoft Windows Server 2022 Base',
                        label: 'Windows Server 2022 Base',
                        value: 'ami-0c94855ba95b798c7',
                      },
                      {
                        description: 'Red Hat Enterprise Linux 9 (HVM), SSD Volume Type',
                        label: 'Red Hat Enterprise Linux 9',
                        value: 'ami-026ebd4cfe2c043b2',
                      },
                    ]}
                    placeholder="Choose an AMI"
                    selectedOption={selectedAmi}
                    onChange={({ detail }) => setSelectedAmi(detail.selectedOption as any)}
                  />
                </FormField>
                <FormField
                  description="Each instance type offers different compute, memory, and networking capabilities."
                  label="Instance type"
                >
                  <Select
                    options={[
                      {
                        label: 'General Purpose',
                        options: [
                          {
                            description: '1 vCPU, 1 GiB Memory',
                            label: 't3.micro',
                            tags: ['Free tier eligible'],
                            value: 't3.micro',
                          },
                          { description: '1 vCPU, 2 GiB Memory', label: 't3.small', value: 't3.small' },
                          { description: '2 vCPU, 4 GiB Memory', label: 't3.medium', value: 't3.medium' },
                          { description: '2 vCPU, 8 GiB Memory', label: 'm5.large', value: 'm5.large' },
                        ],
                      },
                      {
                        label: 'Compute Optimized',
                        options: [
                          { description: '2 vCPU, 4 GiB Memory', label: 'c5.large', value: 'c5.large' },
                          { description: '4 vCPU, 8 GiB Memory', label: 'c5.xlarge', value: 'c5.xlarge' },
                        ],
                      },
                      {
                        label: 'Memory Optimized',
                        options: [
                          { description: '2 vCPU, 16 GiB Memory', label: 'r5.large', value: 'r5.large' },
                          { description: '4 vCPU, 32 GiB Memory', label: 'r5.xlarge', value: 'r5.xlarge' },
                        ],
                      },
                    ]}
                    placeholder="Choose an instance type"
                    selectedOption={selectedInstanceType}
                    onChange={({ detail }) => setSelectedInstanceType(detail.selectedOption as any)}
                  />
                </FormField>
              </SpaceBetween>
            </Container>

            <Container
              header={
                <Header
                  description="Configure network settings to control how your instance connects to other resources."
                  variant="h2"
                >
                  Network settings
                </Header>
              }
            >
              <SpaceBetween size="l">
                <FormField description="Choose the VPC in which to launch your instance." label="VPC">
                  <Select
                    options={[
                      { description: '172.31.0.0/16', label: 'vpc-12345678 (default)', value: 'vpc-12345678' },
                      { description: '10.0.0.0/16', label: 'vpc-87654321', value: 'vpc-87654321' },
                      { description: '192.168.0.0/16', label: 'vpc-abcdef12', value: 'vpc-abcdef12' },
                    ]}
                    placeholder="Choose a VPC"
                    selectedOption={selectedVpc}
                    onChange={({ detail }) => setSelectedVpc(detail.selectedOption as any)}
                  />
                </FormField>
                <FormField description="Choose the subnet in which to launch your instance." label="Subnet">
                  <Select
                    options={[
                      {
                        description: 'us-east-1a | 172.31.32.0/20',
                        label: 'subnet-12345678',
                        value: 'subnet-12345678',
                      },
                      { description: 'us-east-1b | 172.31.0.0/20', label: 'subnet-87654321', value: 'subnet-87654321' },
                      {
                        description: 'us-east-1c | 172.31.16.0/20',
                        label: 'subnet-abcdef12',
                        value: 'subnet-abcdef12',
                      },
                    ]}
                    placeholder="Choose a subnet"
                    selectedOption={selectedSubnet}
                    onChange={({ detail }) => setSelectedSubnet(detail.selectedOption as any)}
                  />
                </FormField>
                <FormField
                  description="Automatically assign a public IP address to your instance."
                  label="Auto-assign public IP"
                >
                  <Select
                    options={[
                      { label: 'Enable', value: 'enable' },
                      { label: 'Disable', value: 'disable' },
                      { label: 'Use subnet setting (Enable)', value: 'subnet-default' },
                    ]}
                    placeholder="Choose auto-assign public IP setting"
                    selectedOption={selectedPublicIp}
                    onChange={({ detail }) => setSelectedPublicIp(detail.selectedOption as any)}
                  />
                </FormField>
                <FormField
                  constraintText="Select security groups that allow the necessary traffic for your application. Review inbound rules carefully."
                  description="Select one or more security groups to control network access to your instance."
                  label="Security groups"
                >
                  <Multiselect
                    options={[
                      {
                        description:
                          'Default VPC security group - allows all outbound traffic, inbound from same group',
                        label: 'default',
                        value: 'sg-12345678',
                      },
                      {
                        description: 'HTTP (80) and HTTPS (443) from anywhere, SSH (22) from bastion hosts',
                        label: 'web-server-public-http-https',
                        value: 'sg-87654321',
                      },
                      {
                        description: 'MySQL/Aurora (3306) from web server security groups only',
                        label: 'database-mysql-private',
                        value: 'sg-abcdef12',
                      },
                      {
                        description: 'HTTP (80) and HTTPS (443) from internet, health checks enabled',
                        label: 'application-load-balancer',
                        value: 'sg-fedcba98',
                      },
                      {
                        description: 'SSH (22) from specific IP ranges for secure remote access',
                        label: 'bastion-host-ssh-access',
                        value: 'sg-13579bdf',
                      },
                      {
                        description: 'Custom ports (8080, 9000) from internal application security groups',
                        label: 'internal-api-microservices',
                        value: 'sg-2468ace0',
                      },
                      {
                        description: 'Redis (6379) from application tier, restricted to VPC subnets',
                        label: 'cache-redis-cluster',
                        value: 'sg-97531eca',
                      },
                      {
                        description: 'Prometheus (9090), Grafana (3000) from monitoring subnet ranges',
                        label: 'monitoring-prometheus-grafana',
                        value: 'sg-86420fdb',
                      },
                    ]}
                    placeholder="Choose security groups"
                    selectedOptions={selectedSecurityGroups}
                    onChange={({ detail }) => setSelectedSecurityGroups(detail.selectedOptions as any)}
                  />
                </FormField>
                <FormField
                  constraintText="Select a key pair to securely access your instance via SSH or RDP. Without a key pair, you won't be able to connect."
                  description="Select an existing key pair or create a new one to securely connect to your instance."
                  label="Key pair (login)"
                  errorText={keyPairError}
                >
                  <Select
                    options={[
                      { label: 'my-key-pair', value: 'my-key-pair' },
                      { label: 'production-key', value: 'production-key' },
                      { label: 'development-key', value: 'development-key' },
                      { label: 'Create new key pair', value: 'create-new' },
                      { label: 'Proceed without a key pair (Not recommended)', value: 'none' },
                    ]}
                    placeholder="Choose a key pair"
                    selectedOption={selectedKeyPair}
                    onChange={({ detail }) => {
                      setSelectedKeyPair(detail.selectedOption as any);
                      if (detail.selectedOption) {
                        setKeyPairError('');
                      }
                    }}
                  />
                </FormField>
              </SpaceBetween>
            </Container>

            <Container
              header={
                <Header
                  description="Configure IAM settings to control what your instance can access within AWS."
                  variant="h2"
                >
                  Identity and Access Management (IAM)
                </Header>
              }
            >
              <SpaceBetween size="l">
                <FormField
                  constraintText="IAM roles define what AWS services your instance can access. Choose a role with minimum required permissions."
                  description="Select an existing IAM role to attach to your instance, or create a new one. The role defines what AWS services and resources your instance can access."
                  label="IAM instance profile"
                  secondaryControl={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        variant="normal"
                        onClick={() => updateDrawer({ type: 'openDrawer', payload: { id: 'create-iam-role' } })}
                      >
                        Create new IAM role
                      </Button>
                    </SpaceBetween>
                  }
                >
                  <Select
                    empty="No IAM roles found. Create a role first to attach to your instance."
                    options={iamRoles}
                    placeholder="Choose an IAM role"
                    selectedOption={selectedIamRole}
                    onChange={({ detail }) => setSelectedIamRole(detail.selectedOption as any)}
                  />
                </FormField>
              </SpaceBetween>
            </Container>

            <Container
              footer={
                <ExpandableSection headerText="Advanced details" variant="footer">
                  <SpaceBetween size="l">
                    <FormField
                      description="Enable detailed monitoring to get additional metrics for your instance."
                      label="Detailed monitoring"
                    >
                      <Checkbox
                        checked={detailedMonitoring}
                        onChange={({ detail }) => setDetailedMonitoring(detail.checked)}
                      >
                        Enable
                      </Checkbox>
                    </FormField>
                    <FormField
                      description="Protect your instance from accidental termination."
                      label="Termination protection"
                    >
                      <Checkbox
                        checked={terminationProtection}
                        onChange={({ detail }) => setTerminationProtection(detail.checked)}
                      >
                        Enable
                      </Checkbox>
                    </FormField>
                    <FormField
                      description="Specify what happens when the operating system initiates a shutdown."
                      label="Shutdown behavior"
                    >
                      <Checkbox checked={stopOnShutdown} onChange={({ detail }) => setStopOnShutdown(detail.checked)}>
                        Stop (default: stop)
                      </Checkbox>
                    </FormField>
                    <FormField
                      constraintText="Leave blank to not use a placement group."
                      description="Specify a placement group to influence where your instances run."
                      label="Placement group name"
                    >
                      <Input
                        placeholder="my-placement-group"
                        value={placementGroup}
                        onChange={({ detail }) => setPlacementGroup(detail.value)}
                      />
                    </FormField>
                  </SpaceBetween>
                </ExpandableSection>
              }
              header={
                <Header description="Configure storage settings and advanced options for your instance." variant="h2">
                  Configure storage
                </Header>
              }
            >
              <SpaceBetween size="l">
                <FormField
                  description="Choose the EBS volume type based on your performance and cost requirements. gp3 offers the best balance of price and performance for most workloads."
                  label="Root volume type"
                >
                  <Input readOnly={true} value="gp3" />
                </FormField>
                <FormField
                  constraintText="Enter a value between 8-16384 GiB. Free tier accounts are limited to 30 GiB total EBS storage."
                  description="Specify the size of the root EBS volume. Larger volumes provide more storage space and baseline performance for gp3 and gp2 volumes."
                  label="Root volume size (GiB)"
                  errorText={rootVolumeSizeError}
                >
                  <Input
                    placeholder="8"
                    type="number"
                    value={rootVolumeSize}
                    onChange={({ detail }) => {
                      setRootVolumeSize(detail.value);
                      validateRootVolumeSize(detail.value);
                    }}
                  />
                </FormField>
                <FormField
                  description="Enable EBS encryption to protect data at rest. Encrypted volumes and snapshots are protected using AWS KMS keys with minimal performance impact."
                  label="Encryption"
                >
                  <Checkbox checked={encryptVolume} onChange={({ detail }) => setEncryptVolume(detail.checked)}>
                    Encrypt this volume
                  </Checkbox>
                </FormField>
                <FormField
                  description="When enabled, the root volume will be automatically deleted when the instance is terminated. Disable this for persistent data storage."
                  label="Delete on termination"
                >
                  <Checkbox
                    checked={deleteOnTermination}
                    onChange={({ detail }) => setDeleteOnTermination(detail.checked)}
                  >
                    Delete on termination
                  </Checkbox>
                </FormField>
                <FormField
                  constraintText="User data is limited to 16 KB."
                  description="Specify user data to configure your instance during launch, or to run a configuration script."
                  label="User data"
                  stretch={true}
                >
                  <Textarea
                    placeholder="#!/bin/bash
yum update -y
# Add your startup commands here"
                    rows={8}
                    value={userData}
                    onChange={({ detail }) => setUserData(detail.value)}
                  />
                </FormField>
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        </Form>
      }
      contentType="form"
    />
  );
}

export default Component;
