// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MixedLineBarChartProps } from '~components/mixed-line-bar-chart';
import BarDataSeries = MixedLineBarChartProps.BarDataSeries;

export const months = [
  '2022-09',
  '2022-10',
  '2022-11',
  '2022-12',
  '2023-01',
  '2023-02',
  '2023-03',
  '2023-04',
  '2023-05',
  '2023-06',
  '2023-07',
  '2023-08',
];

export type ServiceId =
  | 'rds'
  | 'neptune'
  | 'quickSight'
  | 's3'
  | 'dax'
  | 'ecs'
  | 'openSearch'
  | 'cloudWatch'
  | 'kms'
  | 'dynamoDb'
  | 'athena'
  | 'lambda'
  | 'securityHub';

export const serviceNames: Record<ServiceId, string> = {
  rds: 'Relational Database Service',
  neptune: 'Neptune',
  quickSight: 'QuickSight',
  s3: 'S3',
  dax: 'DynamoDB Accelerator (DAX)',
  ecs: 'Elastic Container Service',
  openSearch: 'OpenSearch Service',
  cloudWatch: 'CloudWatch',
  kms: 'Key Management Service',
  dynamoDb: 'DynamoDB',
  athena: 'Athena',
  lambda: 'Lambda',
  securityHub: 'Security Hub',
};

export const dollarFormatter = (e: number) =>
  `$${e.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const monthlySeriesByService: Record<string, BarDataSeries<string>> = {
  rds: {
    title: serviceNames.rds,
    type: 'bar',
    data: [
      { x: months[6], y: 120 },
      { x: months[7], y: 295 },
      { x: months[8], y: 300 },
      { x: months[9], y: 290 },
      { x: months[10], y: 295 },
      { x: months[11], y: 295 },
    ],
    valueFormatter: dollarFormatter,
  },
  neptune: {
    title: serviceNames.neptune,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 251 })),
    valueFormatter: dollarFormatter,
  },
  quickSight: {
    title: serviceNames.quickSight,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 120 })),
    valueFormatter: dollarFormatter,
  },
  s3: {
    title: serviceNames.s3,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 117 })),
    valueFormatter: dollarFormatter,
  },
  dax: {
    title: serviceNames.dax,
    type: 'bar',
    data: [
      { x: months[4], y: 650 },
      { x: months[5], y: 100 },
    ],
    valueFormatter: dollarFormatter,
  },
  ecs: {
    title: serviceNames.ecs,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 10 })),
    valueFormatter: dollarFormatter,
  },
  openSearch: {
    title: serviceNames.openSearch,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 27 })),
    valueFormatter: dollarFormatter,
  },
  cloudWatch: {
    title: serviceNames.cloudWatch,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 22 })),
    valueFormatter: dollarFormatter,
  },
  kms: {
    title: serviceNames.kms,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 19 })),
    valueFormatter: dollarFormatter,
  },
  dynamoDb: {
    title: serviceNames.dynamoDb,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 10 })),
    valueFormatter: dollarFormatter,
  },
  athena: {
    title: serviceNames.athena,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 60 })),
    valueFormatter: dollarFormatter,
  },
  lambda: {
    title: serviceNames.lambda,
    type: 'bar',
    data: months.map((month, index) => ({ x: month, y: index === 8 ? 2200 : 60 })),
    valueFormatter: dollarFormatter,
  },
  securityHub: {
    title: serviceNames.securityHub,
    type: 'bar',
    data: months.map(month => ({ x: month, y: 30 })),
    valueFormatter: dollarFormatter,
  },
};

export const monthlySeries: ReadonlyArray<BarDataSeries<string>> = [
  monthlySeriesByService.rds,
  monthlySeriesByService.neptune,
  monthlySeriesByService.quickSight,
  monthlySeriesByService.s3,
  monthlySeriesByService.dax,
  monthlySeriesByService.ecs,
  monthlySeriesByService.openSearch,
  monthlySeriesByService.kms,
  {
    title: 'Other',
    type: 'bar',
    data: [
      { x: months[0], y: 10 },
      { x: months[1], y: 10 },
      { x: months[2], y: 30 },
      { x: months[3], y: 35 },
      { x: months[4], y: 35 },
      { x: months[5], y: 60 },
      { x: months[6], y: 25 },
      { x: months[7], y: 20 },
      {
        x: months[8],
        y: 2300,
        details: [
          {
            key: monthlySeriesByService.dynamoDb.title,
            value: monthlySeriesByService.dynamoDb.data[8].y,
          },
          {
            key: monthlySeriesByService.athena.title,
            value: monthlySeriesByService.athena.data[8].y,
          },
          {
            key: monthlySeriesByService.lambda.title,
            value: monthlySeriesByService.lambda.data[8].y,
          },
          {
            key: monthlySeriesByService.securityHub.title,
            value: monthlySeriesByService.securityHub.data[8].y,
          },
        ],
      },
      { x: months[9], y: 35 },
      { x: months[10], y: 120 },
      { x: months[11], y: 120 },
    ],
    valueFormatter: dollarFormatter,
  },
];

const baseDailySampleData = [
  { x: '2023-5-1', y: 80 },

  { x: '2023-5-2', y: 22 },
  { x: '2023-5-3', y: 40 },

  { x: '2023-5-4', y: 80 },

  { x: '2023-5-5', y: 56 },
  { x: '2023-5-6', y: 56 },

  { x: '2023-5-7', y: 80 },

  { x: '2023-5-8', y: 135 },
  { x: '2023-5-9', y: 135 },
  { x: '2023-5-10', y: 135 },
  { x: '2023-5-11', y: 84 },
  { x: '2023-5-12', y: 81 },
  { x: '2023-5-13', y: 78 },

  { x: '2023-5-14', y: 78 },

  { x: '2023-5-15', y: 118 },
  { x: '2023-5-16', y: 135 },
  {
    x: '2023-5-17',
    y: 100,
  },
  { x: '2023-5-18', y: 84 },
  { x: '2023-5-19', y: 81 },
  { x: '2023-5-20', y: 78 },

  { x: '2023-5-21', y: 80 },

  { x: '2023-5-22', y: 135 },
  { x: '2023-5-23', y: 81 },
  { x: '2023-5-24', y: 84 },
  { x: '2023-5-25', y: 89 },

  { x: '2023-5-26', y: 80 },
  { x: '2023-5-27', y: 80 },
  { x: '2023-5-28', y: 80 },
  { x: '2023-5-29', y: 80 },
  { x: '2023-5-30', y: 80 },
  { x: '2023-5-31', y: 80 },
];

function getBaseDailySampleData(n: number) {
  return baseDailySampleData.map(item => ({ x: item.x, y: (item.y * n) / (3000 - 393) }));
}

function getDailyData(serviceId: ServiceId): BarDataSeries<string> {
  return {
    title: serviceNames[serviceId],
    type: 'bar',
    data: getBaseDailySampleData(monthlySeriesByService[serviceId].data.find(({ x }) => x === months[8])?.y || 100),
  };
}

export const dailySeriesByService: Record<string, BarDataSeries<string>> = {
  rds: getDailyData('rds'),
  neptune: getDailyData('neptune'),
  quickSight: getDailyData('quickSight'),
  s3: getDailyData('s3'),
  dax: getDailyData('dax'),
  ecs: getDailyData('ecs'),
  openSearch: getDailyData('openSearch'),
  cloudWatch: getDailyData('cloudWatch'),
  kms: getDailyData('kms'),
  dynamoDb: getDailyData('dynamoDb'),
  athena: getDailyData('athena'),
  securityHub: getDailyData('securityHub'),
  lambda: {
    title: 'All accounts',
    type: 'bar',
    data: [
      { x: '2023-5-2', y: 22 },
      { x: '2023-5-3', y: 40 },
      { x: '2023-5-5', y: 56 },
      { x: '2023-5-6', y: 56 },
      { x: '2023-5-8', y: 135 },
      { x: '2023-5-9', y: 135 },
      { x: '2023-5-10', y: 135 },
      { x: '2023-5-11', y: 84 },
      { x: '2023-5-12', y: 81 },
      { x: '2023-5-13', y: 78 },
      { x: '2023-5-15', y: 118 },
      { x: '2023-5-16', y: 135 },
      {
        x: '2023-5-17',
        y: 493,
        link: { href: '#/light/mixed-line-bar-chart/bills/?' + window.location.href.split('?')[1], external: true },
        details: [
          {
            key: 'FEJIHWPCAEHW',
            value: 10,
          },
          {
            key: 'LKMSQWOCAWOP',
            value: 60,
          },
          {
            key: 'OQWRIJXCKJVN',
            value: 1100,
          },
          {
            key: 'SPFOAIEWJFAS',
            value: 130,
          },
        ],
        detailsOpen: true,
      },
      { x: '2023-5-18', y: 84 },
      { x: '2023-5-19', y: 81 },
      { x: '2023-5-20', y: 78 },
      { x: '2023-5-22', y: 135 },
      { x: '2023-5-23', y: 81 },
      { x: '2023-5-24', y: 84 },
      { x: '2023-5-25', y: 89 },
    ],
    valueFormatter: dollarFormatter,
  },
};

export const dailyMaySeries = [
  dailySeriesByService.rds,
  dailySeriesByService.neptune,
  dailySeriesByService.quickSight,
  dailySeriesByService.s3,
  dailySeriesByService.dax,
  dailySeriesByService.ecs,
  dailySeriesByService.openSearch,
  dailySeriesByService.kms,
  dailySeriesByService.lambda,
];
