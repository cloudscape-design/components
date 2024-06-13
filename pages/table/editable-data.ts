// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TagOption {
  label: string;
  value: string;
}

export interface DistributionInfo {
  Id: string;
  ARN: string;
  Status: string;
  LastModifiedTime: string;
  DomainName: string;
  Origin: string;
  CertificateMinVersion: string;
  Tags: TagOption[];
}

export const originSuggestions = [
  { value: 'aws-ui.s3.amazonaws.com' },
  { value: 'aws-ui-browserstack.s3.amazonaws.com' },
  { value: 'aws-ui-performance-testing.s3.amazonaws.com' },
  { value: 'polaris.corp.amazon.com.s3.amazonaws.com' },
];

export const tlsVersions = [
  { label: 'TLS 1.0', value: 'TLS 1.0' },
  { label: 'TLS 1.1', value: 'TLS 1.1' },
  { label: 'TLS 1.2', value: 'TLS 1.2' },
  { label: 'TLS 1.3', value: 'TLS 1.3' },
  { label: 'TLS 1.4 (The newest and the greatest of them all)', value: 'TLS 1.4' },
];

export const tagOptions = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
  {
    label: 'Option 3',
    value: '3',
  },
  {
    label: 'Option 4',
    value: '4',
  },
  {
    label: 'Option 5',
    value: '5',
  },
];

export const initialItems: DistributionInfo[] = [
  {
    Id: 'EKXAM4L45YPC8',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/EKXAM4L45YPC8',
    Status: 'Deployed',
    LastModifiedTime: '2016-12-05T14:52:34.332Z',
    DomainName: 'd2nwo6agzqjpi5.cloudfront.net',
    Origin: 'aws-ui.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E2SH67AF9QONDI',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E2SH67AF9QONDI',
    Status: 'Deployed',
    LastModifiedTime: '2019-11-05T13:26:30.958Z',
    DomainName: 'd3tjwveh3exj5p.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [tagOptions[0]],
  },
  {
    Id: 'E1DSU9EZHK1EFT',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E1DSU9EZHK1EFT',
    Status: 'Deployed',
    LastModifiedTime: '2019-11-05T13:26:48.998Z',
    DomainName: 'd2l92xs4awobp2.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [tagOptions[1]],
  },
  {
    Id: 'E3FD25X9M22KQW',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E3FD25X9M22KQW',
    Status: 'Deployed',
    LastModifiedTime: '2019-03-28T14:01:59.134Z',
    DomainName: 'df2e9lsq5eg3f.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E2XULKFU2T6A3N',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E2XULKFU2T6A3N',
    Status: 'Deployed',
    LastModifiedTime: '2019-03-28T14:02:09.607Z',
    DomainName: 'd37ojh3f70e9ly.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E1KO77AQWA7TOF',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E1KO77AQWA7TOF',
    Status: 'Deployed',
    LastModifiedTime: '2019-11-05T13:27:02.160Z',
    DomainName: 'dikexib0qpmpu.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E1AD6J6WB9DBQL',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E1AD6J6WB9DBQL',
    Status: 'Deployed',
    LastModifiedTime: '2019-11-05T13:27:12.012Z',
    DomainName: 'd20bq7uc02g87g.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E1QS6YZC9T0JTD',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E1QS6YZC9T0JTD',
    Status: 'Deployed',
    LastModifiedTime: '2019-11-05T13:27:21.017Z',
    DomainName: 'd1nr2qeg20fxwo.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E3T55WLRRILQSF',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E3T55WLRRILQSF',
    Status: 'Deployed',
    LastModifiedTime: '2019-11-05T13:25:14.277Z',
    DomainName: 'd2dtcwy61csefe.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E30T1S83X14FVG',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E30T1S83X14FVG',
    Status: 'Deployed',
    LastModifiedTime: '2019-09-13T16:09:25.398Z',
    DomainName: 'd3f1vm4iawzl4h.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E2ZXFXK3PEWUEX',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E2ZXFXK3PEWUEX',
    Status: 'Deployed',
    LastModifiedTime: '2019-09-18T01:14:45.995Z',
    DomainName: 'd3z8wfq2yxdb6.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'EUJXHSTJWEP1I',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/EUJXHSTJWEP1I',
    Status: 'Deployed',
    LastModifiedTime: '2019-10-24T08:06:30.175Z',
    DomainName: 'd12l1zncg92pjt.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'EP9HH29HEFFJN',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/EP9HH29HEFFJN',
    Status: 'Deployed',
    LastModifiedTime: '2019-12-09T12:03:00.351Z',
    DomainName: 'd102648o8sh00f.cloudfront.net',
    Origin: 'aws-ui-performance-testing.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E1VSYI8LJ837IZ',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E1VSYI8LJ837IZ',
    Status: 'Deployed',
    LastModifiedTime: '2019-12-10T11:56:40.474Z',
    DomainName: 'd2gxuxbgmog6e6.cloudfront.net',
    Origin: 'aws-ui-performance-testing.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E2W4EMV0NYKJ3A',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E2W4EMV0NYKJ3A',
    Status: 'Deployed',
    LastModifiedTime: '2019-12-09T12:04:11.314Z',
    DomainName: 'd1m0brbl2pnxzt.cloudfront.net',
    Origin: 'aws-ui-performance-testing.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'EO7WQXJVTM1ZK',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/EO7WQXJVTM1ZK',
    Status: 'Deployed',
    LastModifiedTime: '2019-12-09T12:04:43.701Z',
    DomainName: 'dlmh1440dha1a.cloudfront.net',
    Origin: 'aws-ui-performance-testing.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E1NHT41698KCSA',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E1NHT41698KCSA',
    Status: 'Deployed',
    LastModifiedTime: '2019-12-04T10:29:11.944Z',
    DomainName: 'ds6krf2a9jh8h.cloudfront.net',
    Origin: 'aws-ui-performance-testing.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'EAR97EDHDJM3Q',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/EAR97EDHDJM3Q',
    Status: 'Deployed',
    LastModifiedTime: '2020-05-25T16:15:18.456Z',
    DomainName: 'd20kr5jeroe2r9.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E1H3C2KSX7G7GH',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E1H3C2KSX7G7GH',
    Status: 'Deployed',
    LastModifiedTime: '2019-12-14T11:08:33.882Z',
    DomainName: 'd2w44xc1hxiel9.cloudfront.net',
    Origin: 'aws-ui-performance-testing.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'E3T0B2OABO7PQN',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/E3T0B2OABO7PQN',
    Status: 'Deployed',
    LastModifiedTime: '2020-01-06T09:53:44.650Z',
    DomainName: 'd27banjocfuo3h.cloudfront.net',
    Origin: 'aws-ui-browserstack.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
  {
    Id: 'ECXBLT0NPVL3',
    ARN: 'arn:aws:cloudfront::982970425367:distribution/ECXBLT0NPVL3',
    Status: 'Deployed',
    LastModifiedTime: '2020-03-11T16:36:03.384Z',
    DomainName: 'd3ocvvlf9b34fa.cloudfront.net',
    Origin: 'polaris.corp.amazon.com.s3.amazonaws.com',
    CertificateMinVersion: 'TLS 1.0',
    Tags: [],
  },
];
