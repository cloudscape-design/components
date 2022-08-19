// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { PropertyFilterProps } from '~components/property-filter';
import { DatePickerEmbedded } from '~components/date-picker/embedded';
import DateInput from '~components/internal/components/date-input';
import { FormField, SpaceBetween, TimeInput } from '~components';
import { padStart } from 'lodash';

export interface TableItem {
  order?: number;
  instanceid?: string;
  state?: string;
  instancetype?: string;
  averagelatency?: number;
  availablestorage?: number;
  owner?: string;
  privateipaddress?: string;
  publicdns?: string;
  ipv4publicip?: string;
  securitygroup?: string;
  launchdate?: string;
  lasteventat?: string;
}

export const allItems: TableItem[] = [
  {
    instanceid: 'i-2dc5ce28a0328391',
    state: 'Stopped',
    instancetype: 't3.small',
    averagelatency: 771,
    availablestorage: 8.9,
    owner: 'admin551',
    privateipaddress: '192.190.155.33',
    publicdns: 'ec2-29-10-26-56.us-west-2.compute.amazonaws.com',
    ipv4publicip: '66.67.16.87',
    securitygroup: 'sec4-71',
    launchdate: '2019-02-03',
    lasteventat: '2022-07-27T23:39:44',
  },
  {
    instanceid: 'i-d0312e022392efa0',
    state: 'Stopped',
    instancetype: 't2.small',
    averagelatency: 216,
    availablestorage: 7.99,
    owner: 'admin512',
    privateipaddress: '99.37.135.199',
    publicdns: 'ec2-23-50-59-84.us-west-1.compute.amazonaws.com',
    ipv4publicip: '22.20.15.84',
    securitygroup: 'sec4-60',
    launchdate: '2020-11-07',
    lasteventat: '2022-06-28T19:35:56',
  },
  {
    instanceid: 'i-070eef935c1301e6',
    state: 'Stopped',
    instancetype: 't3.nano',
    averagelatency: 352,
    availablestorage: 8.2,
    owner: 'admin0',
    privateipaddress: '210.31.166.129',
    publicdns: 'ec2-96-58-55-23.us-west-1.compute.amazonaws.com',
    ipv4publicip: '87.54.78.48',
    securitygroup: 'groupsec-6',
    launchdate: '2020-05-28',
    lasteventat: '2022-02-20T16:15:04',
  },
  {
    instanceid: 'i-0eeaae622e074e21',
    state: 'Stopped',
    instancetype: 't2.medium',
    averagelatency: 895,
    availablestorage: 4.23,
    owner: 'admin6621',
    privateipaddress: '116.198.231.86',
    publicdns: 'ec2-11-65-55-71.us-east-2.compute.amazonaws.com',
    ipv4publicip: '79.44.72.97',
    securitygroup: 'sec4-35',
    launchdate: '2019-06-04',
    lasteventat: '2022-06-27T13:42:00',
  },
  {
    instanceid: 'i-799860926d39b2a3',
    state: 'Stopped',
    instancetype: 't2.medium',
    averagelatency: 600,
    availablestorage: 1.71,
    owner: 'admin6621',
    privateipaddress: '83.77.138.251',
    publicdns: 'ec2-11-56-64-85.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '90.77.83.18',
    securitygroup: 'sec4-77',
    launchdate: '2020-02-24',
    lasteventat: '2022-01-13T21:49:37',
  },
  {
    instanceid: 'i-f64935677691848b',
    state: 'Stopped',
    instancetype: 't3.medium',
    averagelatency: 461,
    availablestorage: 2.71,
    owner: 'admin512',
    privateipaddress: '242.109.242.198',
    publicdns: 'ec2-51-17-96-95.us-east-2.compute.amazonaws.com',
    ipv4publicip: '51.66.90.25',
    securitygroup: 'launch-wizard-66',
    launchdate: '2019-10-10',
    lasteventat: '2022-04-23T23:23:32',
  },
  {
    instanceid: 'i-d5b5e73917af69a8',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 153,
    availablestorage: 9.56,
    owner: 'admin6621',
    privateipaddress: '184.25.133.209',
    publicdns: 'ec2-75-24-32-55.us-west-2.compute.amazonaws.com',
    ipv4publicip: '28.79.18.65',
    securitygroup: 'launch-wizard-52',
    launchdate: '2019-03-19',
    lasteventat: '2022-01-02T09:18:41',
  },
  {
    instanceid: 'i-2a5bdc6c48fa8e5c',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 107,
    availablestorage: 3.54,
    owner: 'admin0',
    privateipaddress: '129.65.2.81',
    publicdns: 'ec2-17-63-15-16.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '29.97.74.94',
    securitygroup: 'launch-wizard-75',
    launchdate: '2020-10-10',
    lasteventat: '2022-02-22T19:00:58',
  },
  {
    instanceid: 'i-393c4d4a25ca3dba',
    state: 'Stopped',
    instancetype: 't2.micro',
    averagelatency: 53,
    availablestorage: 3.27,
    owner: 'admin6621',
    privateipaddress: '105.18.240.67',
    publicdns: 'ec2-38-85-74-57.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '75.40.67.11',
    securitygroup: 'launch-wizard-77',
    launchdate: '2020-01-25',
    lasteventat: '2022-06-06T15:03:01',
  },
  {
    instanceid: 'i-c28fbdbb073ec4de',
    state: 'Stopped',
    instancetype: 't2.medium',
    averagelatency: 724,
    availablestorage: 5.2,
    owner: 'admin512',
    privateipaddress: '215.132.1.185',
    publicdns: 'ec2-23-88-62-85.us-east-2.compute.amazonaws.com',
    ipv4publicip: '79.72.46.64',
    securitygroup: 'groupsec-39',
    launchdate: '2019-08-24',
    lasteventat: '2022-02-19T13:20:26',
  },
  {
    instanceid: 'i-e876fb65dc771c53',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 981,
    availablestorage: 6.86,
    owner: 'admin6621',
    privateipaddress: '32.66.229.176',
    publicdns: 'ec2-34-68-67-64.us-west-2.compute.amazonaws.com',
    ipv4publicip: '25.16.51.62',
    securitygroup: 'launch-wizard-40',
    launchdate: '2019-07-21',
    lasteventat: '2022-04-21T22:36:45',
  },
  {
    instanceid: 'i-d92d0e29fa3a0eda',
    state: 'Stopped',
    instancetype: 't3.small',
    averagelatency: 303,
    availablestorage: 6.07,
    owner: 'admin551',
    privateipaddress: '4.137.140.152',
    publicdns: 'ec2-39-66-77-61.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '28.44.42.82',
    securitygroup: 'sec4-62',
    launchdate: '2020-02-18',
    lasteventat: '2022-07-07T16:48:49',
  },
  {
    instanceid: 'i-7911f4562405cb04',
    state: 'Stopped',
    instancetype: 't3.small',
    averagelatency: 718,
    availablestorage: 2.9,
    owner: 'admin73',
    privateipaddress: '42.153.105.188',
    publicdns: 'ec2-60-16-29-89.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '16.82.75.77',
    securitygroup: 'launch-wizard-86',
    launchdate: '2020-01-18',
    lasteventat: '2022-05-23T12:56:15',
  },
  {
    instanceid: 'i-d3e9e4c068d4df6a',
    state: 'Stopped',
    instancetype: 't3.large',
    averagelatency: 44,
    availablestorage: 6.1,
    owner: 'admin551',
    privateipaddress: '165.56.215.13',
    publicdns: 'ec2-34-39-98-70.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '54.72.35.67',
    securitygroup: 'groupsec-29',
    launchdate: '2020-09-11',
    lasteventat: '2022-04-27T14:26:05',
  },
  {
    instanceid: 'i-9966b9f79fc2afac',
    state: 'Stopped',
    instancetype: 't3.nano',
    averagelatency: 652,
    availablestorage: 0.31,
    owner: 'admin73',
    privateipaddress: '165.121.223.85',
    publicdns: 'ec2-79-15-33-95.us-west-1.compute.amazonaws.com',
    ipv4publicip: '61.87.44.39',
    securitygroup: 'groupsec-27',
    launchdate: '2020-07-16',
    lasteventat: '2022-05-28T19:43:53',
  },
  {
    instanceid: 'i-f202265d52b3d9b6',
    state: 'Stopping',
    instancetype: 't2.micro',
    averagelatency: 743,
    availablestorage: 3.69,
    owner: 'admin73',
    privateipaddress: '160.40.126.2',
    publicdns: 'ec2-45-55-83-39.us-west-2.compute.amazonaws.com',
    ipv4publicip: '76.11.47.15',
    securitygroup: 'groupsec-24',
    launchdate: '2019-09-27',
    lasteventat: '2022-05-16T08:02:08',
  },
  {
    instanceid: 'i-a6b569bc16be3756',
    state: 'Stopped',
    instancetype: 't2.micro',
    averagelatency: 304,
    availablestorage: 6.93,
    owner: 'admin1',
    privateipaddress: '185.69.53.254',
    publicdns: 'ec2-57-11-42-65.us-east-2.compute.amazonaws.com',
    ipv4publicip: '90.75.30.51',
    securitygroup: 'launch-wizard-31',
    launchdate: '2020-04-19',
    lasteventat: '2022-02-02T01:46:08',
  },
  {
    instanceid: 'i-f8e3d9fffd82bd62',
    state: 'Stopping',
    instancetype: 't2.large',
    averagelatency: 339,
    availablestorage: 0.68,
    owner: 'admin6621',
    privateipaddress: '185.4.175.135',
    publicdns: 'ec2-93-37-74-77.us-west-1.compute.amazonaws.com',
    ipv4publicip: '29.83.25.48',
    securitygroup: 'launch-wizard-22',
    launchdate: '2019-08-23',
    lasteventat: '2022-07-07T07:38:14',
  },
  {
    instanceid: 'i-d1f8d3023c360cb4',
    state: 'Stopping',
    instancetype: 't2.large',
    averagelatency: 945,
    availablestorage: 7.26,
    owner: 'admin1',
    privateipaddress: '119.245.140.59',
    publicdns: 'ec2-14-11-31-19.us-west-2.compute.amazonaws.com',
    ipv4publicip: '63.84.45.12',
    securitygroup: 'launch-wizard-56',
    launchdate: '2019-02-20',
    lasteventat: '2022-02-07T17:05:10',
  },
  {
    instanceid: 'i-64ed85f898d0a950',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 402,
    availablestorage: 4.17,
    owner: 'admin0',
    privateipaddress: '106.191.88.51',
    publicdns: 'ec2-83-68-74-61.us-west-1.compute.amazonaws.com',
    ipv4publicip: '26.56.98.76',
    securitygroup: 'sec4-55',
    launchdate: '2020-01-23',
    lasteventat: '2022-03-02T06:32:30',
  },
  {
    instanceid: 'i-6afd6b0ebae03bd6',
    state: 'Stopped',
    instancetype: 't2.small',
    averagelatency: 845,
    availablestorage: 9.73,
    owner: 'admin512',
    privateipaddress: '190.203.19.76',
    publicdns: 'ec2-23-13-92-98.us-west-2.compute.amazonaws.com',
    ipv4publicip: '76.68.23.89',
    securitygroup: 'launch-wizard-25',
    launchdate: '2020-04-27',
    lasteventat: '2022-03-01T12:00:40',
  },
  {
    instanceid: 'i-068993f1f76b09e1',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 184,
    availablestorage: 5.2,
    owner: 'admin0',
    privateipaddress: '88.84.199.47',
    publicdns: 'ec2-32-22-97-25.us-east-1.compute.amazonaws.com',
    ipv4publicip: '96.16.87.34',
    securitygroup: 'sec4-16',
    launchdate: '2019-10-09',
    lasteventat: '2022-07-28T07:33:14',
  },
  {
    instanceid: 'i-1cd4a64fc26a8fe9',
    state: 'Stopping',
    instancetype: 't3.nano',
    averagelatency: 995,
    availablestorage: 0.24,
    owner: 'admin0',
    privateipaddress: '245.141.29.143',
    publicdns: 'ec2-14-76-40-46.us-west-2.compute.amazonaws.com',
    ipv4publicip: '95.82.62.43',
    securitygroup: 'launch-wizard-28',
    launchdate: '2020-06-08',
    lasteventat: '2022-04-26T16:17:23',
  },
  {
    instanceid: 'i-835d004c46769aed',
    state: 'Stopped',
    instancetype: 't3.small',
    averagelatency: 800,
    availablestorage: 4.03,
    owner: 'admin551',
    privateipaddress: '91.141.101.76',
    publicdns: 'ec2-30-49-86-26.us-west-2.compute.amazonaws.com',
    ipv4publicip: '60.56.86.66',
    securitygroup: 'sec4-57',
    launchdate: '2019-11-14',
    lasteventat: '2022-06-12T12:09:41',
  },
  {
    instanceid: 'i-5441bf2e91565e24',
    state: 'Stopped',
    instancetype: 't3.medium',
    averagelatency: 283,
    availablestorage: 7.38,
    owner: 'admin551',
    privateipaddress: '172.55.75.233',
    publicdns: 'ec2-57-51-33-38.us-east-1.compute.amazonaws.com',
    ipv4publicip: '90.44.83.61',
    securitygroup: 'launch-wizard-36',
    launchdate: '2020-10-08',
    lasteventat: '2022-05-20T06:42:11',
  },
  {
    instanceid: 'i-a57d0a6a6d20d73b',
    state: 'Stopping',
    instancetype: 't2.small',
    averagelatency: 705,
    availablestorage: 6.78,
    owner: 'admin73',
    privateipaddress: '209.234.31.251',
    publicdns: 'ec2-89-80-48-78.us-west-1.compute.amazonaws.com',
    ipv4publicip: '20.26.12.31',
    securitygroup: 'groupsec-29',
    launchdate: '2020-08-30',
    lasteventat: '2022-05-28T00:07:52',
  },
  {
    instanceid: 'i-0b6646fde4598f8d',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 375,
    availablestorage: 3.41,
    owner: 'admin512',
    privateipaddress: '175.46.105.199',
    publicdns: 'ec2-67-68-46-72.us-east-2.compute.amazonaws.com',
    ipv4publicip: '73.16.96.37',
    securitygroup: 'sec4-76',
    launchdate: '2019-02-05',
    lasteventat: '2022-02-05T23:24:19',
  },
  {
    instanceid: 'i-5313687f75346895',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 219,
    availablestorage: 1.97,
    owner: 'admin0',
    privateipaddress: '38.127.7.142',
    publicdns: 'ec2-63-14-89-97.us-west-2.compute.amazonaws.com',
    ipv4publicip: '55.92.93.35',
    securitygroup: 'sec4-16',
    launchdate: '2019-04-02',
    lasteventat: '2022-05-06T09:25:22',
  },
  {
    instanceid: 'i-7173f776b4b30c05',
    state: 'Stopped',
    instancetype: 't3.large',
    averagelatency: 17,
    availablestorage: 8.63,
    owner: 'admin73',
    privateipaddress: '143.25.75.111',
    publicdns: 'ec2-28-54-22-35.us-west-1.compute.amazonaws.com',
    ipv4publicip: '23.73.49.79',
    securitygroup: 'groupsec-57',
    launchdate: '2019-06-14',
    lasteventat: '2022-01-04T05:56:57',
  },
  {
    instanceid: 'i-fcfc136cb96b30c4',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 835,
    availablestorage: 7.17,
    owner: 'admin0',
    privateipaddress: '246.187.87.52',
    publicdns: 'ec2-28-74-58-53.us-east-2.compute.amazonaws.com',
    ipv4publicip: '97.12.18.81',
    securitygroup: 'launch-wizard-61',
    launchdate: '2020-08-15',
    lasteventat: '2022-05-07T05:53:00',
  },
  {
    instanceid: 'i-8c6a328351a438ff',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 73,
    availablestorage: 6.02,
    owner: 'admin512',
    privateipaddress: '217.87.141.71',
    publicdns: 'ec2-83-80-72-12.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '88.32.49.28',
    securitygroup: 'launch-wizard-3',
    launchdate: '2020-12-11',
    lasteventat: '2022-04-24T05:27:40',
  },
  {
    instanceid: 'i-cd323ed6664c7dc5',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 875,
    availablestorage: 7.42,
    owner: 'admin6621',
    privateipaddress: '76.10.110.225',
    publicdns: 'ec2-97-10-90-78.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '20.15.84.33',
    securitygroup: 'groupsec-10',
    launchdate: '2020-11-20',
    lasteventat: '2022-03-15T15:27:25',
  },
  {
    instanceid: 'i-a7251b1805f9df3d',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 342,
    availablestorage: 9.64,
    owner: 'admin1',
    privateipaddress: '171.71.83.97',
    publicdns: 'ec2-74-30-11-67.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '91.86.20.30',
    securitygroup: 'launch-wizard-89',
    launchdate: '2019-07-28',
    lasteventat: '2022-02-07T03:56:03',
  },
  {
    instanceid: 'i-9f11e46b6c54a2a1',
    state: 'Stopped',
    instancetype: 't3.nano',
    averagelatency: 792,
    availablestorage: 6.99,
    owner: 'admin0',
    privateipaddress: '170.4.241.182',
    publicdns: 'ec2-35-46-98-22.us-east-2.compute.amazonaws.com',
    ipv4publicip: '30.56.30.63',
    securitygroup: 'sec4-68',
    launchdate: '2020-12-14',
    lasteventat: '2022-04-15T21:49:20',
  },
  {
    instanceid: 'i-6f733cc0de79c2cc',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 782,
    availablestorage: 7.1,
    owner: 'admin73',
    privateipaddress: '77.214.54.48',
    publicdns: 'ec2-14-68-19-57.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '18.32.43.84',
    securitygroup: 'groupsec-13',
    launchdate: '2020-12-05',
    lasteventat: '2022-06-25T05:57:54',
  },
  {
    instanceid: 'i-b994cfe3823d78b4',
    state: 'Stopped',
    instancetype: 't2.small',
    averagelatency: 242,
    availablestorage: 2.71,
    owner: 'admin6621',
    privateipaddress: '4.205.116.227',
    publicdns: 'ec2-40-76-19-71.us-east-1.compute.amazonaws.com',
    ipv4publicip: '16.51.16.73',
    securitygroup: 'launch-wizard-98',
    launchdate: '2019-07-18',
    lasteventat: '2022-05-01T03:55:40',
  },
  {
    instanceid: 'i-82b8f4ef5d25d17c',
    state: 'Pending',
    instancetype: 't2.large',
    averagelatency: 497,
    availablestorage: 2.03,
    owner: 'admin551',
    privateipaddress: '185.105.137.198',
    publicdns: 'ec2-36-71-20-13.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '93.32.37.10',
    securitygroup: 'launch-wizard-39',
    launchdate: '2020-02-08',
    lasteventat: '2022-06-24T03:58:57',
  },
  {
    instanceid: 'i-1d9468c0fdc6d337',
    state: 'Stopped',
    instancetype: 't3.large',
    averagelatency: 219,
    availablestorage: 2.34,
    owner: 'admin551',
    privateipaddress: '36.209.68.174',
    publicdns: 'ec2-61-66-68-47.us-west-2.compute.amazonaws.com',
    ipv4publicip: '38.77.56.31',
    securitygroup: 'launch-wizard-4',
    launchdate: '2020-10-10',
    lasteventat: '2022-03-27T20:19:30',
  },
  {
    instanceid: 'i-1d56f94cf858be59',
    state: 'Stopped',
    instancetype: 't3.micro',
    averagelatency: 45,
    availablestorage: 0.57,
    owner: 'admin0',
    privateipaddress: '63.156.27.219',
    publicdns: 'ec2-94-59-43-27.us-east-2.compute.amazonaws.com',
    ipv4publicip: '35.69.39.61',
    securitygroup: 'launch-wizard-79',
    launchdate: '2020-04-13',
    lasteventat: '2022-06-22T05:46:24',
  },
  {
    instanceid: 'i-59129472a88790c4',
    state: 'Stopped',
    instancetype: 't3.nano',
    averagelatency: 154,
    availablestorage: 3.45,
    owner: 'admin1',
    privateipaddress: '32.170.19.22',
    publicdns: 'ec2-27-50-22-43.us-east-1.compute.amazonaws.com',
    ipv4publicip: '22.82.77.95',
    securitygroup: 'groupsec-38',
    launchdate: '2020-08-13',
    lasteventat: '2022-06-15T21:52:28',
  },
  {
    instanceid: 'i-b761d2801b356d89',
    state: 'Stopping',
    instancetype: 't2.medium',
    averagelatency: 885,
    availablestorage: 4.06,
    owner: 'admin0',
    privateipaddress: '5.59.49.94',
    publicdns: 'ec2-35-27-47-55.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '92.34.58.25',
    securitygroup: 'groupsec-23',
    launchdate: '2019-02-02',
    lasteventat: '2022-07-28T23:57:26',
  },
  {
    instanceid: 'i-9b50eea20c1d2813',
    state: 'Stopped',
    instancetype: 't3.large',
    averagelatency: 458,
    availablestorage: 3.06,
    owner: 'admin512',
    privateipaddress: '131.161.87.127',
    publicdns: 'ec2-55-27-63-79.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '59.15.18.96',
    securitygroup: 'groupsec-19',
    launchdate: '2020-09-13',
    lasteventat: '2022-03-10T05:42:59',
  },
  {
    instanceid: 'i-a19a9633e1c5ba8f',
    state: 'Stopping',
    instancetype: 't2.nano',
    averagelatency: 30,
    availablestorage: 4.64,
    owner: 'admin73',
    privateipaddress: '131.144.53.98',
    publicdns: 'ec2-61-71-76-80.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '52.64.43.38',
    securitygroup: 'groupsec-12',
    launchdate: '2020-08-21',
    lasteventat: '2022-01-22T00:01:25',
  },
  {
    instanceid: 'i-85c31338cf96a6b9',
    state: 'Stopped',
    instancetype: 't3.medium',
    averagelatency: 420,
    availablestorage: 4.66,
    owner: 'admin512',
    privateipaddress: '229.210.58.248',
    publicdns: 'ec2-26-75-27-68.us-west-2.compute.amazonaws.com',
    ipv4publicip: '47.49.29.40',
    securitygroup: 'sec4-80',
    launchdate: '2020-12-11',
    lasteventat: '2022-04-18T16:50:36',
  },
  {
    instanceid: 'i-2a63773bd3bbc950',
    state: 'Stopping',
    instancetype: 't2.micro',
    averagelatency: 685,
    availablestorage: 9.49,
    owner: 'admin1',
    privateipaddress: '243.191.174.94',
    publicdns: 'ec2-56-14-56-12.us-east-2.compute.amazonaws.com',
    ipv4publicip: '84.54.89.41',
    securitygroup: 'sec4-33',
    launchdate: '2020-01-04',
    lasteventat: '2022-02-27T22:22:09',
  },
  {
    instanceid: 'i-c71adc85f62dc441',
    state: 'Stopped',
    instancetype: 't2.medium',
    averagelatency: 639,
    availablestorage: 9.37,
    owner: 'admin0',
    privateipaddress: '248.141.157.138',
    publicdns: 'ec2-13-58-52-10.us-west-2.compute.amazonaws.com',
    ipv4publicip: '43.10.70.14',
    securitygroup: 'groupsec-30',
    launchdate: '2020-04-14',
    lasteventat: '2022-07-23T08:41:35',
  },
  {
    instanceid: 'i-7d78145659f6edf8',
    state: 'Stopped',
    instancetype: 't2.micro',
    averagelatency: 141,
    availablestorage: 3.37,
    owner: 'admin1',
    privateipaddress: '95.209.163.10',
    publicdns: 'ec2-88-37-58-42.us-west-2.compute.amazonaws.com',
    ipv4publicip: '25.83.24.18',
    securitygroup: 'sec4-7',
    launchdate: '2020-02-22',
    lasteventat: '2022-07-20T03:35:11',
  },
  {
    instanceid: 'i-d64836cefed723f9',
    state: 'Stopped',
    instancetype: 't2.micro',
    averagelatency: 259,
    availablestorage: 2.31,
    owner: 'admin6621',
    privateipaddress: '116.67.145.0',
    publicdns: 'ec2-57-74-80-85.us-west-1.compute.amazonaws.com',
    ipv4publicip: '88.51.45.75',
    securitygroup: 'sec4-26',
    launchdate: '2020-06-16',
    lasteventat: '2022-06-29T01:32:12',
  },
  {
    instanceid: 'i-0854aa3ca406d6de',
    state: 'Stopped',
    instancetype: 't3.large',
    averagelatency: 672,
    availablestorage: 2.09,
    owner: 'admin0',
    privateipaddress: '73.173.119.94',
    publicdns: 'ec2-75-48-26-39.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '31.74.57.97',
    securitygroup: 'sec4-56',
    launchdate: '2020-03-05',
    lasteventat: '2022-07-16T01:31:42',
  },
  {
    instanceid: 'i-d50d96196e1da02f',
    state: 'Stopped',
    instancetype: 't3.medium',
    averagelatency: 636,
    availablestorage: 7.76,
    owner: 'admin73',
    privateipaddress: '54.231.149.143',
    publicdns: 'ec2-79-68-69-52.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '90.94.90.27',
    securitygroup: 'sec4-44',
    launchdate: '2020-09-18',
    lasteventat: '2022-06-29T05:41:03',
  },
  {
    instanceid: 'i-bf46a8fa4f894969',
    state: 'Stopping',
    instancetype: 't2.medium',
    averagelatency: 236,
    availablestorage: 9.14,
    owner: 'admin1',
    privateipaddress: '152.247.5.141',
    publicdns: 'ec2-94-63-80-76.us-east-2.compute.amazonaws.com',
    ipv4publicip: '37.37.10.67',
    securitygroup: 'groupsec-39',
    launchdate: '2020-09-17',
    lasteventat: '2022-05-20T21:35:06',
  },
  {
    instanceid: 'i-a3358a2493af65da',
    state: 'Stopped',
    instancetype: 't2.micro',
    averagelatency: 478,
    availablestorage: 8.13,
    owner: 'admin512',
    privateipaddress: '77.168.188.62',
    publicdns: 'ec2-77-17-64-91.us-west-2.compute.amazonaws.com',
    ipv4publicip: '46.11.71.61',
    securitygroup: 'groupsec-80',
    launchdate: '2019-12-31',
    lasteventat: '2022-04-13T21:35:21',
  },
  {
    instanceid: 'i-1ca6c551cd98b0bc',
    state: 'Stopped',
    instancetype: 't3.small',
    averagelatency: 29,
    availablestorage: 3.5,
    owner: 'admin551',
    privateipaddress: '243.153.95.173',
    publicdns: 'ec2-76-50-35-33.us-east-2.compute.amazonaws.com',
    ipv4publicip: '90.91.66.79',
    securitygroup: 'sec4-62',
    launchdate: '2019-09-05',
    lasteventat: '2022-04-02T01:57:21',
  },
  {
    instanceid: 'i-78363f3b35fe1638',
    state: 'Stopping',
    instancetype: 't2.nano',
    averagelatency: 74,
    availablestorage: 6.37,
    owner: 'admin6621',
    privateipaddress: '242.26.176.166',
    publicdns: 'ec2-78-83-62-28.us-west-2.compute.amazonaws.com',
    ipv4publicip: '65.38.84.34',
    securitygroup: 'sec4-10',
    launchdate: '2020-09-04',
    lasteventat: '2022-01-29T11:22:17',
  },
  {
    instanceid: 'i-36cb4d638866ef4b',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 819,
    availablestorage: 3.16,
    owner: 'admin6621',
    privateipaddress: '124.233.144.133',
    publicdns: 'ec2-24-97-48-41.us-west-1.compute.amazonaws.com',
    ipv4publicip: '51.59.35.67',
    securitygroup: 'launch-wizard-11',
    launchdate: '2019-12-21',
    lasteventat: '2022-01-24T23:35:13',
  },
  {
    instanceid: 'i-dde47b18e8183070',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 305,
    availablestorage: 8.34,
    owner: 'admin1',
    privateipaddress: '50.25.203.189',
    publicdns: 'ec2-76-87-26-25.us-east-1.compute.amazonaws.com',
    ipv4publicip: '21.93.32.44',
    securitygroup: 'launch-wizard-6',
    launchdate: '2020-11-07',
    lasteventat: '2022-05-17T10:39:00',
  },
  {
    instanceid: 'i-86f3902256c13e75',
    state: 'Stopped',
    instancetype: 't2.large',
    averagelatency: 521,
    availablestorage: 5.05,
    owner: 'admin6621',
    privateipaddress: '252.173.149.150',
    publicdns: 'ec2-19-95-24-44.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '86.71.93.66',
    securitygroup: 'sec4-20',
    launchdate: '2020-05-02',
    lasteventat: '2022-06-01T10:49:16',
  },
  {
    instanceid: 'i-64329dd06110114b',
    state: 'Stopped',
    instancetype: 't2.nano',
    averagelatency: 478,
    availablestorage: 7.33,
    owner: 'admin0',
    privateipaddress: '62.11.179.127',
    publicdns: 'ec2-95-28-18-29.eu-west-2.compute.amazonaws.com',
    ipv4publicip: '47.23.76.64',
    securitygroup: 'launch-wizard-49',
    launchdate: '2019-05-10',
    lasteventat: '2022-05-24T10:08:27',
  },
  {
    instanceid: 'i-36b91360e881739d',
    state: 'Stopped',
    instancetype: 't3.micro',
    averagelatency: 733,
    availablestorage: 3.26,
    owner: 'admin512',
    privateipaddress: '57.33.53.202',
    publicdns: 'ec2-14-41-71-94.us-west-1.compute.amazonaws.com',
    ipv4publicip: '38.54.37.89',
    securitygroup: 'groupsec-10',
    launchdate: '2019-02-13',
    lasteventat: '2022-03-28T03:39:42',
  },
  {
    instanceid: 'i-3b44795b1fea36ac',
    state: 'Stopped',
    instancetype: 't3.large',
    averagelatency: 636,
    availablestorage: 3.57,
    owner: 'admin512',
    privateipaddress: '97.34.33.202',
    publicdns: 'ec2-10-15-87-78.us-west-1.compute.amazonaws.com',
    ipv4publicip: '62.36.39.27',
    securitygroup: 'launch-wizard-26',
    launchdate: '2019-05-10',
    lasteventat: '2022-02-06T19:58:40',
  },
].map((item, indx) => ({ order: indx, ...item }));

export const columnDefinitions = [
  {
    id: 'instanceid',
    sortingField: 'instanceid',
    header: 'Instance ID',
    type: 'text',
    propertyLabel: 'Instance ID',
    cell: (item: TableItem) => item.instanceid,
  },
  {
    id: 'state',
    sortingField: 'state',
    header: 'State',
    type: 'text',
    propertyLabel: 'State',
    cell: (item: TableItem) => item.state,
  },
  {
    id: 'instancetype',
    sortingField: 'instancetype',
    header: 'Instance type',
    type: 'text',
    propertyLabel: 'Instance type',
    cell: (item: TableItem) => item.instancetype,
  },
  {
    id: 'averagelatency',
    sortingField: 'averagelatency',
    header: 'Average latency (mb/s)',
    type: 'number',
    propertyLabel: 'Average latency',
    cell: (item: TableItem) => item.averagelatency,
  },
  {
    id: 'availablestorage',
    sortingField: 'availablestorage',
    header: 'Available storage (GiB)',
    type: 'number',
    propertyLabel: 'Available storage',
    cell: (item: TableItem) => item.availablestorage,
  },
  {
    id: 'owner',
    sortingField: 'owner',
    header: 'Owner',
    type: 'text',
    propertyLabel: 'Owner',
    cell: (item: TableItem) => item.owner,
  },
  {
    id: 'privateipaddress',
    sortingField: 'privateipaddress',
    header: 'Private IP address',
    type: 'text',
    propertyLabel: 'Private IP address',
    cell: (item: TableItem) => item.privateipaddress,
  },
  {
    id: 'publicdns',
    sortingField: 'publicdns',
    header: 'Public DNS',
    type: 'text',
    propertyLabel: 'Public DNS',
    cell: (item: TableItem) => item.publicdns,
  },
  {
    id: 'ipv4publicip',
    sortingField: 'ipv4publicip',
    header: 'IPV4 public IP',
    type: 'text',
    propertyLabel: 'IPV4 public IP',
    cell: (item: TableItem) => item.ipv4publicip,
  },
  {
    id: 'securitygroup',
    sortingField: 'securitygroup',
    header: 'Security group',
    type: 'text',
    propertyLabel: 'Security group',
    cell: (item: TableItem) => item.securitygroup,
  },
  {
    id: 'launchdate',
    sortingField: 'launchdate',
    header: 'Launch date',
    type: 'date',
    propertyLabel: 'Launch date',
    cell: (item: TableItem) => item.launchdate,
  },
  {
    id: 'lasteventat',
    sortingField: 'lasteventat',
    header: 'Last event occurrence',
    type: 'datetime',
    propertyLabel: 'Last event occurrence',
    cell: (item: TableItem) => item.lasteventat,
  },
].map((item, ind) => ({ order: ind + 1, ...item }));

export const i18nStrings: PropertyFilterProps.I18nStrings = {
  filteringAriaLabel: 'your choice',
  dismissAriaLabel: 'Dismiss',

  filteringPlaceholder: 'Search',
  groupValuesText: 'Values',
  groupPropertiesText: 'Properties',
  operatorsText: 'Operators',

  operationAndText: 'and',
  operationOrText: 'or',

  operatorLessText: 'Less than',
  operatorLessOrEqualText: 'Less than or equal',
  operatorGreaterText: 'Greater than',
  operatorGreaterOrEqualText: 'Greater than or equal',
  operatorContainsText: 'Contains',
  operatorDoesNotContainText: 'Does not contain',
  operatorEqualsText: 'Equal',
  operatorDoesNotEqualText: 'Does not equal',

  editTokenHeader: 'Edit filter',
  propertyText: 'Property',
  operatorText: 'Operator',
  valueText: 'Value',
  cancelActionText: 'Cancel',
  applyActionText: 'Apply',
  allPropertiesLabel: 'All properties',

  tokenLimitShowMore: 'Show more',
  tokenLimitShowFewer: 'Show fewer',
  clearFiltersText: 'Clear filters',
  removeTokenButtonAriaLabel: () => 'Remove token',
  enteredTextLabel: (text: string) => `Use: "${text}"`,
};

function parseValue(originalValue: null | string, defaultTime = '00:00:00'): { dateValue: string; timeValue: string } {
  const [datePart = '', timePart = ''] = (originalValue ?? '').split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  let dateValue = '';
  if (!isNaN(Number(year)) && Number(year) > 1970) {
    dateValue += year + '-';
    if (!isNaN(Number(month)) && Number(month) > 0) {
      dateValue += padStart(month, 2, '0') + '-';
      if (!isNaN(Number(day)) && Number(day) > 0) {
        dateValue += padStart(day, 2, '0');
      }
    }
  }

  let timeValue = '';
  if (!isNaN(Number(hours)) && Number(hours) > 0) {
    timeValue += hours + ':';
  } else {
    timeValue += '00:';
  }
  if (!isNaN(Number(minutes)) && Number(minutes) > 0) {
    timeValue += padStart(minutes, 2, '0') + ':';
  } else {
    timeValue += '00:';
  }
  if (!isNaN(Number(seconds)) && Number(seconds) > 0) {
    timeValue += padStart(seconds, 2, '0');
  } else {
    timeValue += '00';
  }

  if (timeValue === '00:00:00') {
    timeValue = defaultTime;
  }

  return { dateValue, timeValue };
}

const DateTimeForm: PropertyFilterProps.CustomOperatorForm<string> = ({ filter, operator, value, onChange }) => {
  const defaultTime = operator === '<' || operator === '>=' ? '00:00:00' : '23:59:59';
  const parsedFilter = parseValue(filter, defaultTime);
  const parsedValue = parseValue(value, defaultTime);

  const onChangeDate = (dateValue: string) => {
    if (!dateValue) {
      onChange(null);
    } else {
      const timeValue = value ? parsedValue.timeValue : parsedFilter.timeValue;
      onChange(dateValue + 'T' + timeValue);
    }
  };

  const onChangeTime = (timeValue: string) => {
    const dateValue = value ? parsedValue.dateValue : parsedFilter.dateValue;
    if (!timeValue) {
      onChange(dateValue + 'T' + '00:00:00');
    } else {
      onChange(dateValue + 'T' + timeValue);
    }
  };

  return (
    <SpaceBetween direction="horizontal" size="s">
      <DatePickerEmbedded
        value={value ? parsedValue.dateValue : parsedFilter.dateValue}
        locale={'en-EN'}
        previousMonthAriaLabel={'Previous month'}
        nextMonthAriaLabel={'Next month'}
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />

      <SpaceBetween direction="vertical" size="s">
        <FormField label="Date">
          <DateInput
            name="date"
            ariaLabel="Enter the date in YYYY/MM/DD"
            placeholder="YYYY/MM/DD"
            onChange={event => onChangeDate(event.detail.value)}
            value={value ? parsedValue.dateValue : parsedFilter.dateValue}
            disableAutocompleteOnBlur={true}
          />
        </FormField>

        <FormField label="Time">
          <TimeInput
            format="hh:mm:ss"
            placeholder="hh:mm:ss"
            ariaLabel="time-input"
            value={value ? parsedValue.timeValue : parsedFilter.timeValue}
            onChange={event => onChangeTime(event.detail.value)}
          />
        </FormField>
      </SpaceBetween>
    </SpaceBetween>
  );
};

const DateForm: PropertyFilterProps.CustomOperatorForm<string> = ({ filter, value, onChange }) => {
  const parsedFilter = parseValue(filter);
  const parsedValue = parseValue(value);

  const onChangeDate = (dateValue: string) => {
    onChange(dateValue || null);
  };

  return (
    <SpaceBetween direction="horizontal" size="s">
      <DatePickerEmbedded
        value={value ? parsedValue.dateValue : parsedFilter.dateValue}
        locale={'en-EN'}
        previousMonthAriaLabel={'Previous month'}
        nextMonthAriaLabel={'Next month'}
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />

      <FormField label="Date">
        <DateInput
          name="date"
          ariaLabel="Enter the date in YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          onChange={event => onChangeDate(event.detail.value)}
          value={value ? parsedValue.dateValue : parsedFilter.dateValue}
          disableAutocompleteOnBlur={true}
        />
      </FormField>
    </SpaceBetween>
  );
};

export const filteringProperties: readonly any[] = columnDefinitions.map(def => {
  let operators: any[] = [];
  let defaultOperator: PropertyFilterProps.ComparisonOperator = '=';

  if (def.type === 'text') {
    operators = ['=', '!=', ':', '!:'];
  }

  if (def.type === 'number') {
    operators = ['=', '!=', '>', '<', '<=', '>='];
  }

  if (def.type === 'date') {
    operators = [
      {
        value: '=',
        form: DateForm,
        match: 'date',
      },
      {
        value: '!=',
        form: DateForm,
        match: 'date',
      },
      {
        value: '>',
        form: DateForm,
        match: 'date',
      },
      {
        value: '<',
        form: DateForm,
        match: 'date',
      },
      {
        value: '<=',
        form: DateForm,
        match: 'date',
      },
      {
        value: '>=',
        form: DateForm,
        match: 'date',
      },
    ];
  }

  if (def.type === 'datetime') {
    defaultOperator = '>';
    operators = [
      {
        value: '>',
        form: DateTimeForm,
        match: 'date',
      },
      {
        value: '<',
        form: DateTimeForm,
        match: 'date',
      },
      {
        value: '<=',
        form: DateTimeForm,
        match: 'date',
      },
      {
        value: '>=',
        form: DateTimeForm,
        match: 'date',
      },
    ];
  }

  return {
    key: def.id,
    operators: operators,
    defaultOperator,
    propertyLabel: def.propertyLabel,
    groupValuesLabel: `${def.propertyLabel} values`,
  };
});
