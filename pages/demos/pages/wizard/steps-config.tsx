// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { ReactNode } from 'react';

import Box from '@cloudscape-design/components/box';
import TextContent from '@cloudscape-design/components/text-content';

import { ExternalLink } from '../commons';
import { EngineType, ToolsContent, WizardState } from './interfaces';

interface Option {
  label: string;
  value: string;
  description?: string;
  tags?: string[];
  labelTag?: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface Engine {
  label: string;
  value: EngineType;
  image: ReactNode;
}

export const ENGINES: Engine[] = [
  {
    label: 'Amazon Aurora',
    value: 'aurora',
    image: <img height="150px" src="./resources/image-placeholder.png" alt="Amazon Aurora" aria-hidden="true" />,
  },
  {
    label: 'MySQL',
    value: 'mysql',
    image: <img height="150px" src="./resources/image-placeholder.png" alt="MySQL" aria-hidden="true" />,
  },
  {
    label: 'MariaDB',
    value: 'maria',
    image: <img height="150px" src="./resources/image-placeholder.png" alt="MariaDB" aria-hidden="true" />,
  },
  {
    label: 'PostgreSQL',
    value: 'postgres',
    image: <img height="150px" src="./resources/image-placeholder.png" alt="PostgreSQL" aria-hidden="true" />,
  },
  {
    label: 'Oracle',
    value: 'oracle',
    image: <img height="150px" src="./resources/image-placeholder.png" alt="Oracle" aria-hidden="true" />,
  },
  {
    label: 'Microsoft SQL Server',
    value: 'microsoft',
    image: <img height="150px" src="./resources/image-placeholder.png" alt="Microsoft SQL Server" aria-hidden="true" />,
  },
];

export const ENGINE_VERSIONS: Partial<Record<EngineType, Option[]>> = {
  mysql: [
    {
      label: 'MySQL 5.7.21',
      value: '1',
    },
    {
      label: 'MySQL 5.7.19',
      value: '2',
    },
    {
      label: 'MySQL 5.7.17',
      value: '3',
    },
    {
      label: 'MySQL 5.7.16',
      value: '4',
    },
    {
      label: 'MySQL 5.6.39',
      value: '5',
    },
    {
      label: 'MySQL 5.6.37',
      value: '6',
    },
    {
      label: 'MySQL 5.6.35',
      value: '7',
    },
    {
      label: 'MySQL 5.6.34',
      value: '8',
    },
    {
      label: 'MySQL 5.6.29',
      value: '9',
    },
    {
      label: 'MySQL 5.6.27',
      value: '10',
    },
    {
      label: 'MySQL 5.5.59',
      value: '11',
    },
    {
      label: 'MySQL 5.6.57',
      value: '12',
    },
  ],
  maria: [
    {
      label: 'MariaDB 10.2.12',
      value: '1',
    },
    {
      label: 'MariaDB 10.2.11',
      value: '2',
    },
    {
      label: 'MariaDB 10.1.31',
      value: '3',
    },
    {
      label: 'MariaDB 10.1.26',
      value: '4',
    },
    {
      label: 'MariaDB 10.1.23',
      value: '5',
    },
    {
      label: 'MariaDB 10.1.19',
      value: '6',
    },
    {
      label: 'MariaDB 10.1.14',
      value: '7',
    },
    {
      label: 'MariaDB 10.0.34',
      value: '8',
    },
    {
      label: 'MariaDB 10.0.32',
      value: '9',
    },
    {
      label: 'MariaDB 10.0.31',
      value: '10',
    },
  ],
  postgres: [
    {
      label: 'PostgreSQL 9.6.6-R1',
      value: '1',
    },
    {
      label: 'PostgreSQL 9.6.5-R1',
      value: '2',
    },
    {
      label: 'PostgreSQL 9.6.3-R1',
      value: '3',
    },
    {
      label: 'PostgreSQL 9.6.2-R1',
      value: '4',
    },
    {
      label: 'PostgreSQL 9.6.1-R1',
      value: '5',
    },
    {
      label: 'PostgreSQL 9.5.12-R1',
      value: '6',
    },
    {
      label: 'PostgreSQL 9.5.10-R1',
      value: '7',
    },
    {
      label: 'PostgreSQL 9.5.9-R1',
      value: '8',
    },
    {
      label: 'PostgreSQL 9.5.7-R1',
      value: '9',
    },
    {
      label: 'PostgreSQL 9.5.7-R1',
      value: '10',
    },
    {
      label: 'PostgreSQL 9.5.4-R1',
      value: '11',
    },
  ],
  oracle: [
    {
      label: 'Oracle 12.1.0.2.v12',
      value: '1',
    },
    {
      label: 'Oracle 12.1.0.2.v11',
      value: '2',
    },
    {
      label: 'Oracle 12.1.0.2.v10',
      value: '3',
    },
    {
      label: 'Oracle 12.1.0.2.v9',
      value: '4',
    },
    {
      label: 'Oracle 12.1.0.2.v8',
      value: '5',
    },
    {
      label: 'Oracle 12.1.0.2.v7',
      value: '6',
    },
    {
      label: 'Oracle 12.1.0.2.v6',
      value: '7',
    },
    {
      label: 'Oracle 12.1.0.2.v5',
      value: '8',
    },
    {
      label: 'Oracle 12.1.0.2.v4',
      value: '9',
    },
    {
      label: 'Oracle 12.1.0.2.v3',
      value: '10',
    },
    {
      label: 'Oracle 12.1.0.2.v2',
      value: '11',
    },
  ],
  microsoft: [
    {
      label: 'SQL Server 2017 14.00.3015.40.v1',
      value: '1',
    },
    {
      label: 'SQL Server 2017 14.00.1000.169.v1',
      value: '2',
    },
    {
      label: 'SQL Server 2017 13.00.4466.4.v1',
      value: '3',
    },
    {
      label: 'SQL Server 2017 13.00.4451.0.v1',
      value: '4',
    },
    {
      label: 'SQL Server 2017 13.00.4422.0.v1',
      value: '5',
    },
    {
      label: 'SQL Server 2017 13.00.2164.0.v1',
      value: '6',
    },
    {
      label: 'SQL Server 2017 12.00.5546.0.v1',
      value: '7',
    },
  ],
};

export const ENGINE_EDITIONS: Partial<Record<EngineType, Option[]>> = {
  aurora: [
    {
      value: 'MySQL 5.6-compatible',
      label: 'MySQL 5.6-compatible',
    },
    {
      value: 'MySQL 5.7-compatible',
      label: 'MySQL 5.7-compatible',
    },
    {
      value: 'PostgreSQL-compatible',
      label: 'PostgreSQL-compatible',
    },
  ],
  microsoft: [
    {
      value: 'SQL Server Express Edition',
      label: 'SQL Server Express Edition',
      description: 'Affordable database management system that supports database sizes up to 10 GiB.',
    },
    {
      value: 'SQL Server Web Edition',
      label: 'SQL Server Web Edition',
      description:
        "In accordance with Microsoft's licensing policies, it can only be used to support public and Internet-accessible webpages, websites, web applications, and web services.",
    },
    {
      value: 'SQL Server Standard Edition',
      label: 'SQL Server Standard Edition',
      description:
        'Core data management and business intelligence capabilities for mission-critical applications and mixed workloads.',
    },
    {
      value: 'SQL Server Enterprise Edition',
      label: 'SQL Server Enterprise Edition',
      description:
        'Comprehensive high-end capabilities for mission-critical applications with demanding database workloads and business intelligence requirements.',
    },
  ],
};

export const ENGINE_USECASES: Option[] = [
  {
    value: 'Production',
    label: 'Production',
    description:
      'Use Multi-AZ deployment and provisioned IOPS storage as defaults for high availability and fast, consistent performance.',
  },
  {
    value: 'Dev/test',
    label: 'Dev/test',
    description: 'This instance is intended for use outside of production or under the RDS Free Usage Tier',
  },
];

export const ENGINE_DETAILS: Record<EngineType, ReactNode> = {
  aurora: (
    <TextContent>
      <h3>Amazon Aurora</h3>
      <div>
        <Box variant="p" color="text-body-secondary">
          Amazon Aurora is a MySQL- and PostgreSQL-compatible enterprise-class database, starting at &lt;$1/day.
        </Box>
        <ul>
          <li>Up to 5 times the throughput of MySQL and 3 times the throughput of PostgreSQL</li>
          <li>Up to 64TB of auto-scaling SSD storage</li>
          <li>6-way replication across three Availability Zones</li>
          <li className="custom-screenshot-hide">Up to 15 Read Replicas with sub-10ms replica lag</li>
          <li className="custom-screenshot-hide">Automatic monitoring and failover in less than 30 seconds</li>
        </ul>
      </div>
    </TextContent>
  ),
  mysql: (
    <TextContent>
      <h3>MySQL</h3>
      <Box variant="p" color="text-body-secondary">
        MySQL is the most popular open source database in the world. MySQL on RDS offers the rich features of the MySQL
        community edition with the flexibility to easily scale compute resources or storage capacity for your database.
      </Box>
      <ul>
        <li>Supports database size up to 16 TB.</li>
        <li>Instances offer up to 32 vCPUs and 244 GiB Memory.</li>
        <li>Supports automated backup and point-in-time recovery.</li>
        <li>Supports cross-Region read replicas.</li>
      </ul>
    </TextContent>
  ),
  maria: (
    <TextContent>
      <h3>MariaDB</h3>
      <Box variant="p" color="text-body-secondary">
        MariaDB Community Edition is a MySQL-compatible database with strong support from the open source community, and
        extra features and performance optimizations.{' '}
      </Box>
      <ul>
        <li>Supports database size up to 16 TB.</li>
        <li>Instances offer up to 32 vCPUs and 244 GiB Memory.</li>
        <li>Supports automated backup and point-in-time recovery.</li>
        <li>Supports cross-Region read replicas.</li>
        <li>Supports global transaction ID (GTID) and thread pooling.</li>
        <li>Developed and supported by the MariaDB open source community.</li>
      </ul>
    </TextContent>
  ),
  postgres: (
    <TextContent>
      <h3>PostgreSQL</h3>
      <Box variant="p" color="text-body-secondary">
        PostgreSQL is a powerful, open-source object-relational database system with a strong reputation of reliability,
        stability, and correctness.
      </Box>
      <ul>
        <li>High reliability and stability in a variety of workloads.</li>
        <li>Advanced features to perform in high-volume environments.</li>
        <li>Vibrant open-source community that releases new features multiple times per year.</li>
        <li>Supports multiple extensions that add even more functionality to the database.</li>
        <li>The most Oracle-compatible open-source database.</li>
      </ul>
    </TextContent>
  ),
  oracle: (
    <TextContent>
      <h3>Oracle</h3>
      <Box variant="p" color="text-body-secondary">
        Efficient, reliable, and secure database management system that delivers comprehensive high-end capabilities for
        mission-critical applications and demanding database workloads.
      </Box>
      <ul>
        <li>Deploy multiple editions of Oracle Database in minutes.</li>
        <li>Provides backup and recovery resources like automatic backups and DB snapshots.</li>
        <li>Use automatic host replacement in the event of a hardware failure.</li>
      </ul>
    </TextContent>
  ),
  microsoft: (
    <TextContent>
      <h3>Microsoft SQL Server</h3>
      <Box variant="p" color="text-body-secondary">
        Amazon RDS for SQL Server is a managed service that is designed for developers who require the features and
        capabilities of SQL Server for building a new application.
      </Box>
      <ul>
        <li>
          Deploy multiple editions of SQL Server (2008 R2, 2012, 2014, 2016, and 2017) including Express, Web, Standard
          and Enterprise, in minutes.
        </li>
        <li>Provides backup and recovery resources like automatic backups and DB snapshots.</li>
        <li>
          You can now create Amazon RDS for SQL Server database instances with up to 16TB of storage, up from 4TB.
        </li>
      </ul>
    </TextContent>
  ),
};

export const LICENSES: Partial<Record<EngineType, string>> = {
  aurora: 'Bring your own license',
  mysql: 'General public license',
  maria: 'General public license',
  postgres: 'Postgresql license',
};

export const CLASS_OPTIONS: OptionGroup[] = [
  {
    label: 'Current generation burstable performance instance classes',
    options: [
      { value: '1', label: 'db.t2.micro', tags: ['1 vCPU', '1 GiB RAM'], labelTag: 'Free tier eligible' },
      { value: '2', label: 'db.t2.small', tags: ['1 vCPU', '2 GiB RAM'] },
      { value: '3', label: 'db.t2.medium', tags: ['2 vCPU', '4 GiB RAM'] },
    ],
  },
  {
    label: 'Latest generation standard instance classes',
    options: [
      { value: '4', label: 'db.m4.large', tags: ['2 vCPU', '8 GiB RAM'] },
      { value: '5', label: 'db.m4.xlarge', tags: ['4 vCPU', '16 GiB RAM'] },
      { value: '6', label: 'db.m4.2xlarge', tags: ['8 vCPU', '32 GiB RAM'] },
      { value: '7', label: 'db.m4.4xlarge', tags: ['16 vCPU', '64 GiB RAM'] },
    ],
  },
  {
    label: 'Current generation memory optimized instance classes',
    options: [
      { value: '8', label: 'db.r4.large', tags: ['2 vCPU', '15.25 GiB RAM'] },
      { value: '9', label: 'db.r4.xlarge', tags: ['4 vCPU', '30.5 GiB RAM'] },
      { value: '10', label: 'db.r4.2xlarge', tags: ['8 vCPU', '61 GiB RAM'] },
    ],
  },
];

export const STORAGE_TYPES: Option[] = [
  {
    value: 'General Purpose (SSD)',
    label: 'General Purpose (SSD)',
    description:
      'Suitable for a broad range of database workloads. Provides baseline of 3 IOPS/GiB and ability to burst to 3,000 IOPS.',
  },
  {
    value: 'Provisioned IOPS (SSD)',
    label: 'Provisioned IOPS (SSD)',
    description:
      'Suitable for I/O-intensive database workloads. Provides flexibility to provision I/O ranging from 1,000 to 20,000 IOPS.',
  },
  {
    value: 'Magnetic',
    label: 'Magnetic',
    description:
      'Suitable for backward compatibility. The maximum amount of storage allowed for DB instances on magnetic storage is less than that of the other storage types.',
  },
];

export const TIME_ZONES: Option[] = [
  {
    label: 'No preference',
    value: '1',
  },
  {
    label: 'AUS Central Standard Time',
    value: '2',
  },
  {
    label: 'AUS Eastern Standard Time',
    value: '3',
  },
  {
    label: 'Afghanistan Standard Time',
    value: '4',
  },
  {
    label: 'Alaskan Standard Time',
    value: '5',
  },
  {
    label: 'Atlantic Standard Time',
    value: '6',
  },
  {
    label: 'Belarus Standard Time',
    value: '7',
  },
  {
    label: 'Cananda Central Standard Time',
    value: '8',
  },
  {
    label: 'Cananda Eastern Standard Time',
    value: '9',
  },
];

export const AVAILABILITY_ZONES: Option[] = [
  { value: 'none', label: 'No preference' },
  { value: 'a', label: 'us-east-1a' },
  { value: 'c', label: 'us-east-1c' },
  { value: 'd', label: 'us-east-1d' },
  { value: 'e', label: 'us-east-1e' },
];

export const VPC_OPTIONS: Option[] = [
  {
    label: 'vpc-28937451985',
    value: '1',
  },
  {
    label: 'vpc-5375a085',
    value: '2',
  },
  {
    label: 'vpc-0q94684390',
    value: '3',
  },
  {
    label: 'vpc-928375h923',
    value: '4',
  },
  {
    label: 'vpc-ad93nkdu3',
    value: '5',
  },
  {
    label: 'vpc-bcld983bn29',
    value: '6',
  },
  {
    label: 'vpc-910384753bjka',
    value: '7',
  },
  {
    label: 'vpc-aq9j49n9wsoi2mp',
    value: '8',
  },
  {
    label: 'vpc-kd290adg203hwe923',
    value: '9',
  },
];

export const SUBNET_OPTIONS: Option[] = [
  {
    label: 'default-vpc-28937451985',
    value: '1',
  },
  {
    label: 'vpc-5375a085',
    value: '2',
  },
  {
    label: 'vpc-0q94684390',
    value: '3',
  },
  {
    label: 'vpc-928375h923',
    value: '4',
  },
];

export const SECURITY_GROUPS: Option[] = [
  {
    label: 'rds-launch-wizard-1',
    value: '1',
  },
  {
    label: 'rds-launch-wizard-2',
    value: '2',
  },
  {
    label: 'rds-launch-wizard-3',
    value: '3',
  },
  {
    label: 'rds-launch-wizard-4',
    value: '4',
  },
  {
    label: 'rds-launch-wizard-5',
    value: '5',
  },
  {
    label: 'rds-launch-wizard-6',
    value: '6',
  },
  {
    label: 'rds-launch-wizard-7',
    value: '7',
  },
  {
    label: 'rds-launch-wizard-8',
    value: '8',
  },
  {
    label: 'rds-launch-wizard-9',
    value: '9',
  },
];

export const FAILOVER_PRIORITIES: Option[] = [
  { value: 'none', label: 'No preference' },
  { value: '0', label: 'tier-0' },
  { value: '1', label: 'tier-1' },
  { value: '2', label: 'tier-2' },
  { value: '3', label: 'tier-3' },
];

export const BACKUP_PERIODS: Option[] = [
  { value: 'none', label: 'Turn off automatic backups' },
  { value: '1', label: '1 day' },
  { value: '2', label: '2 days' },
  { value: '3', label: '3 days' },
  { value: '4', label: '4 days' },
  { value: '5', label: '5 days' },
];

export const DEFAULT_STEP_INFO: WizardState = {
  engine: {
    engineOption: ENGINES[0].value,
    version: ENGINE_VERSIONS[ENGINES[1].value]![0],
    edition: ENGINE_EDITIONS[ENGINES[0].value]![0].value!,
    usecase: ENGINE_USECASES[0].value!,
  },
  details: {
    instanceClass: CLASS_OPTIONS[0].options[0],
    storageType: STORAGE_TYPES[0].value!,
    storage: '20',
    timeZone: TIME_ZONES[0],
    availabilityZone: AVAILABILITY_ZONES[0],
    port: '3306',
    iamAuth: 'off',
    identifier: '',
    username: '',
    password: '',
    confirmPassword: '',
  },
  advanced: {
    vpc: VPC_OPTIONS[0],
    subnet: SUBNET_OPTIONS[0],
    securityGroups: SECURITY_GROUPS[0],
    accessibility: 'on',
    encryption: 'off',
    upgrades: 'off',
    backup: BACKUP_PERIODS[0],
    monitoring: 'off',
    failover: FAILOVER_PRIORITIES[0],
    backtrack: 'on',
  },
  review: undefined,
};

export const TOOLS_CONTENT: Record<string, Record<string, ToolsContent>> = {
  engine: {
    default: {
      title: 'Select engine type',
      content: (
        <div>
          <p>
            With Amazon RDS, you can create a <i>DB instance</i>, an isolated database environment in the AWS Cloud. A
            DB instance can contain multiple user-created databases. You can access your instance by using the same
            tools and applications that you might use with a standalone database instance.
          </p>
          <p>
            <b>Note</b>
            <br />
            Before you can create a DB instance, you must complete the tasks in{' '}
            <ExternalLink href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_SettingUp.html">
              Setting up for Amazon RDS
            </ExternalLink>
            .
          </p>
          <p>
            Each DB instance runs a <i>DB engine</i>. Amazon RDS supports several engine types: Amazon Aurora, MySQL,
            MariaDB, PostgreSQL, Oracle, and Microsoft SQL Server. Each DB engine has its own supported features, and
            each version of a DB engine might include specific features. Additionally, each DB engine has a set of
            parameters in a DB parameter group that control the behavior of the databases that it manages.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html',
          text: 'What is Amazon RDS?',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.html',
          text: 'Getting started with Amazon RDS',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.html',
          text: 'Amazon RDS database instances',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html',
          text: 'What is Amazon Aurora?',
        },
      ],
    },
  },
  details: {
    default: {
      title: 'Specify instance details',
      content: (
        <p>
          After you select an engine for your DB instance, you're ready to specify the details for the instance, such as
          the instance class and storage type.
        </p>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.html',
          text: 'Amazon RDS database instances',
        },
      ],
    },
    instanceClass: {
      title: 'Class',
      content: (
        <div>
          <p>
            Amazon RDS supports three types of instance classes: Standard, Memory Optimized, and Burstable Performance.
          </p>
          <h3>Standard</h3>
          <p>
            Provides a balance of compute, memory, and network resources. This class is a good choice for many
            applications.
          </p>
          <h3>Memory Optimized</h3>
          <p>Designed for memory-intensive applications. This class offers a low price per GiB of RAM.</p>
          <h3>Burstable Performance</h3>
          <p>Provides a baseline performance level, with the ability to burst to full CPU usage.</p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html',
          text: 'Choosing the DB instance class',
        },
      ],
    },
    storageType: {
      title: 'Storage type',
      content: (
        <div>
          <p>
            When you launch an instance, the instance class that you specify determines the hardware of the host
            computer used for your instance. Each instance class offers different compute, memory, and storage
            capabilities. Choose an instance class based on the requirements of the application or software that you
            plan to run on your instance. Amazon RDS supports three types of instance classes:
          </p>
          <ul>
            <li>
              <b>General Purpose SSD</b> – General Purpose SSD volumes offer cost-effective storage that is ideal for a
              broad range of workloads. These volumes deliver single-digit millisecond latencies and the ability to
              burst to 3,000 IOPS for extended periods of time. Baseline performance for these volumes is determined by
              the volume's size.
            </li>
            <li>
              <b>Provisioned IOPS SSD</b> – Provisioned IOPS storage is designed to meet the needs of I/O-intensive
              workloads, particularly database workloads, that require low I/O latency and consistent I/O throughput.
            </li>
            <li>
              <b>Magnetic</b> – Amazon RDS also supports magnetic storage for backward compatibility. We recommend that
              you use General Purpose SSD or Provisioned IOPS for any new storage needs. The maximum amount of storage
              allowed for DB instances on magnetic storage is less than that of the other storage types.
            </li>
          </ul>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html#Concepts.Storage.GeneralSSD',
          text: 'General Purpose SSD storage',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html#USER_PIOPS',
          text: 'Provisioned IOPS SSD storage',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html#CHAP_Storage.Magnetic',
          text: 'Magnetic storage',
        },
      ],
    },
    iamAuth: {
      title: 'IAM DB authentication',
      content: (
        <div>
          <p>
            With IAM database authentication, you use an <i>authentication token</i> when you connect to your DB
            instance. An authentication token is a string of characters that you use instead of a password. After you
            generate an authentication token, it's valid for 15 minutes before it expires. If you try to connect using
            an expired token, the connection request is denied.
          </p>

          <p>
            Every authentication token must be accompanied by a valid signature, using AWS signature version 4. You can
            use an authentication token when you connect to Amazon RDS from another AWS service, such as AWS Lambda. By
            using a token, you can avoid placing a password in your code.
          </p>
          <p>After you have a signed IAM authentication token, you can connect to an Amazon RDS DB instance.</p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Enabling.html',
          text: 'Enabling and Disabling IAM Database Authentication',
        },
        {
          href: 'https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html',
          text: 'Signature Version 4 Signing Process',
        },
      ],
    },
    identifier: {
      title: 'DB instance identifier',
      content: (
        <div>
          <p>
            Create an identifier (a name) for your DB instance. The DB instance identifier must be unique among other DB
            instances in your AWS account in an AWS Region.
          </p>
          <p>
            A DB instance identifier is case insensitive, but stored as all lowercase, as in <code>mydbinstance</code>.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.html',
          text: 'Amazon RDS database instances',
        },
      ],
    },
    username: {
      title: 'Primary user name',
      content: (
        <div>
          <p>
            As part of the creation process, Amazon RDS creates a <i>primary user</i> for your DB instance. This primary
            user has permissions to create databases and to perform create, delete, select, update, and insert
            operations on tables that the primary user creates.
          </p>
          <p>
            Specify an alphanumeric string that defines the login ID (the name) for the primary user. The name must
            start with a letter, as in "awsuser".
          </p>
          <p>
            <b>Important</b> <br />
            We strongly recommend that you don't use the primary user credentials directly in your applications.
            Instead, follow the best practice of using a database user created with the minimal privileges required for
            your application.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.MasterAccounts.html',
          text: 'Primary user account privileges',
        },
      ],
    },
    password: {
      title: 'Primary password',
      content: (
        <div>
          <p>
            You must set a primary user password when you create a DB instance. You can change the password later at any
            time using the AWS command line tools, Amazon RDS API actions, or the Amazon RDS console. You can also use
            standard SQL commands to change the password.
          </p>
          <p>
            <b>Note</b> <br />
            If you accidentally delete the permissions for the primary user, you can restore them by modifying the DB
            instance and setting a new primary user password.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.MasterAccounts.html',
          text: 'Primary user account privileges',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html',
          text: 'Modifying an Amazon RDS DB instance',
        },
      ],
    },
  },
  advanced: {
    default: {
      title: 'Configure settings',
      content: (
        <p>
          Now you are ready to configure your settings for your DB instance. You can choose to run your DB instance in a
          VPC, enable encryption, and set up monitoring.
        </p>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.html',
          text: 'Getting started with Amazon RDS',
        },
      ],
    },
    vpc: {
      title: 'Virtual Private Cloud (VPC)',
      content: (
        <div>
          <p>
            You can choose to launch your DB instance into a VPC that you've created with Amazon Virtual Private Cloud
            (Amazon VPC). The dropdown list shows your existing VPCs that have a corresponding DB subnet group.
          </p>
          <p>
            If you want to use a new VPC instead of an existing one, you can open the Amazon VPC console, create a VPC,
            and then return to this page. Your new VPC should be listed and available for you to choose.
          </p>
          <h3>Benefits</h3>
          <p>
            Amazon VPC lets you launch AWS resources, such as Amazon RDS DB instances, into a VPC. A virtual private
            cloud (VPC) is a virtual network dedicated to your AWS account. It is logically isolated from other virtual
            networks in the AWS Cloud.
          </p>
          <p>
            When you use a VPC, you have control over your virtual networking environment. You can choose your own IP
            address range, create subnets, and configure routing and access control lists. The basic functionality of
            Amazon RDS is the same whether your DB instance is running in a VPC or not: Amazon RDS manages backups,
            software patching, automatic failure detection, and recovery. There is no additional cost to run your DB
            instance in a VPC.
          </p>
          <p>All new DB instances are created in a default VPC unless you specify otherwise.</p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.html',
          text: 'Amazon VPC and Amazon RDS',
        },
      ],
    },
    subnet: {
      title: 'Subnet group',
      content: (
        <div>
          <p>
            A <i>subnet</i> is a segment of a VPC's IP address range that you designate to group your resources based on
            security and operational needs. A DB <i>subnet group</i> is a collection of subnets (typically private) that
            you create in a VPC and that you then designate for your DB instances.
          </p>
          <p>
            Each DB subnet group must have subnets in at least two Availability Zones in a specified AWS Region. If you
            have a default VPC, the service automatically creates a subnet for you in each Availability Zone in the
            Region.
          </p>
          <p>
            When creating a DB instance in a VPC, you must choose a DB subnet group. Amazon RDS uses that DB subnet
            group and your preferred Availability Zone to select a subnet and an IP address within that subnet to
            associate with your DB instance. If the primary DB instance of a Multi-AZ deployment fails, Amazon RDS can
            promote the corresponding standby and subsequently create a new standby using an IP address of the subnet in
            one of the other Availability Zones.
          </p>
          <p>
            <b>Note</b>
            <br />
            For each DB instance that you run in a VPC, you should reserve at least one IP address in each subnet in the
            DB subnet group for use by Amazon RDS for recovery actions.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html',
          text: 'Working with an Amazon RDS DB instance in a VPC',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_Tutorials.WebServerDB.CreateVPC.html',
          text: 'Tutorial: Create an Amazon VPC for use with an Amazon RDS DB instance',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_VPC.Scenarios.html',
          text: 'Scenarios for accessing a DB instance in a VPC',
        },
      ],
    },
    securityGroups: {
      title: 'VPC security groups',
      content: (
        <div>
          <p>
            A <i>VPC security group</i> controls access to DB instances (and EC2 instances) inside a VPC. The security
            groups acts as a firewall for the associated DB instance, controlling both inbound and outbound traffic at
            the instance level. By default, the service creates a DB instance with a firewall and a security group that
            protect the DB instance.
          </p>
          <p>
            VPC security groups can have rules that govern both inbound and outbound traffic, although the outbound
            traffic rules typically don't apply to DB instances. Outbound traffic rules apply only if the DB instance
            acts as a client. For example, outbound traffic rules apply to an Oracle DB instance with outbound database
            links.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html',
          text: 'Security groups',
        },
      ],
    },
    accessibility: {
      title: 'Public accessibility',
      content: (
        <div>
          <p>
            If you enable a public connection, EC2 instances and devices outside of the VPC that host the DB instance
            can connect to the DB instance. If you don't enable a public connection, Amazon RDS doesn't assign a public
            IP address to the DB instance, and no EC2 instance or devices outside of the VPC can connect.
          </p>
          <p>
            If you enable a public connection, you must choose one or more VPC security groups that specify which EC2
            instances and devices can connect to the DB instance.
          </p>
          <p>
            <b>Note</b>
            <br />
            For a DB instance to be publicly accessible, the subnets in the DB subnet group must have an internet
            gateway.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.html#USER_VPC.Hiding',
          text: 'Amazon VPC and Amazon RDS',
        },
      ],
    },
    encryption: {
      title: 'Encryption',
      content: (
        <div>
          <p>
            You can encrypt your Amazon RDS DB instances and snapshots at rest by enabling the encryption option. Data
            that is encrypted at rest includes the underlying storage for a DB instance and its automated backups, read
            replicas, and snapshots.
          </p>
          <p>
            Amazon RDS encrypted DB instances use the industry standard AES-256 encryption algorithm to encrypt your
            data on the server that hosts your instances. After your data is encrypted, Amazon RDS handles
            authentication of access and decryption of your data transparently, with a minimal effect on performance.
            You don't need to modify your database client applications to use encryption.
          </p>
          <p>
            <b>Note</b>
            <br />
            For encrypted and unencrypted DB instances with cross-Region read replicas, data that is in transit between
            the source and the read replicas is encrypted.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html',
          text: 'Encrypting Amazon RDS resources',
        },
      ],
    },
    monitoring: {
      title: 'Enhanced monitoring',
      content: (
        <div>
          <p>Amazon RDS provides metrics in real time for the operating system (OS) that your DB instance runs on.</p>
          <p>The cost for using enhanced monitoring depends on several factors:</p>
          <ul>
            <li>
              You are charged only for enhanced monitoring that exceeds the free tier provided by Amazon CloudWatch
              Logs.
            </li>
            <li>
              A smaller monitoring interval results in more frequent reporting of OS metrics and increases your
              monitoring cost.
            </li>
            <li>
              Usage costs for enhanced monitoring are applied for each DB instance that enhanced monitoring is enabled
              for. Monitoring a large number of DB instances is more expensive than monitoring only a few.
            </li>
            <li>
              DB instances that support a more compute-intensive workload have more OS process activity to report and
              higher costs for enhanced monitoring.
            </li>
          </ul>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html',
          text: 'Enhanced monitoring',
        },
        {
          href: 'https://aws.amazon.com/cloudwatch/pricing/',
          text: 'Amazon CloudWatch pricing',
        },
      ],
    },
    failover: {
      title: 'Failover priority',
      content: (
        <div>
          <p>
            In the event of a planned or unplanned outage of your DB instance, Amazon RDS automatically switches to a
            standby replica in another Availability Zone. Each read replica is associated with a priority tier (0-3).
            Amazon RDS promotes the read replica that has the highest priority (the lowest numbered tier). If two or
            more replicas have the same priority, RDS promotes the one that is the same size as the previous primary
            instance.{' '}
          </p>
          <p>
            The primary DB instance switches over automatically to the standby replica if any of the following
            conditions occur:
          </p>
          <ul>
            <li>An Availability Zone outage</li>
            <li>The primary DB instance fails</li>
            <li>The DB instance's server type is changed</li>
            <li>The operating system of the DB instance is undergoing software patching</li>
            <li>
              A manual failover of the DB instance was initiated using <b>Reboot with failover</b>
            </li>
          </ul>
          <p>
            The failover mechanism automatically changes the DNS record of the DB instance to point to the standby DB
            instance. As a result, you need to re-establish any existing connections to your DB instance.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html',
          text: 'High availability for Amazon RDS',
        },
      ],
    },
    backtrack: {
      title: 'Backtrack',
      content: (
        <div>
          <p>
            <i>Backtracking</i> lets you quickly recover from a user error. Backtracking "rewinds" the DB instance to a
            time that you specify. For example, if you accidentally delete an important record at 10:00 AM, you could
            use backtracking to move a database back to its state at 9:59 AM, before the error.
          </p>
          <p>
            Backtracking is not a replacement for backing up your DB instance so that you can restore it to a point in
            time. However, backtracking provides the following advantages over traditional backup and restore:
          </p>
          <ul>
            <li>
              You can easily undo mistakes. If you mistakenly perform a destructive action, such as a DELETE without a
              WHERE clause, you can backtrack the DB instance to a time before the destructive action, with minimal
              interruption of service.
            </li>
            <li>
              You can backtrack a DB instance quickly. Restoring a DB instance to a point in time launches a new DB
              instance and restores it from backup data or a DB instance snapshot, which can take hours. Backtracking a
              DB instance doesn't require a new DB instance and rewinds the DB instance in minutes.
            </li>
            <li>
              You can explore earlier data changes. You can repeatedly backtrack a DB instance back and forth in time to
              help determine when a particular data change occurred. For example, you can backtrack a DB instance three
              hours and then backtrack forward in time one hour. In this case, the backtrack time is two hours before
              the original time.
            </li>
          </ul>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html',
          text: 'Restoring a DB instance to a specified time',
        },
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html',
          text: 'Backtracking an Aurora DB cluster',
        },
      ],
    },
  },
  review: {
    default: {
      title: 'Review and create',
      content: (
        <div>
          <p>
            Verify your settings for your DB instance, and edit the settings as needed. When you are satisfied with your
            settings, choose <b>Create DB instance</b>.
          </p>
          <p>
            After Amazon RDS creates your instance, the new instance appears in the list of DB instances on the console.
            The DB instance has a status of <b>Creating</b> until the instance is ready to use. When the state changes
            to <b>Available</b>, you can connect to the instance.
          </p>
          <p>
            Depending on the instance class and the amount of storage, it can take up to 20 minutes before the new
            instance is available.
          </p>
        </div>
      ),
      links: [
        {
          href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.html',
          text: 'Amazon RDS DB instances',
        },
      ],
    },
  },
};
