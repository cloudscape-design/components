// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { formatReadOnlyRegion } from '../aws-region-utils';

export type S3ErrorType = 'success' | 'error' | 'warning' | 'info';

export interface S3Error {
  type: S3ErrorType;
  content: string;
  header?: string;
}

export interface S3Resource {
  Key?: string;
  VersionId?: string;
  IsFolder?: boolean;
  LastModified?: string;
  Name?: string;
  CreationDate?: string;
  Size?: number;
  Region?: string;
  __error?: S3Error;
  __region?: string;
  __versions?: S3Resource[];
  __folders?: S3Resource[];
  __objects?: S3Resource[];
}

export const amazonS3Data: S3Resource[] = [
  {
    Name: 'bucket-enim',
    CreationDate: 'May 02, 2019, 21:03:21 (UTC+02:00)',
    __region: formatReadOnlyRegion('me-south-1'),
    __folders: [],
    __objects: [
      {
        Key: 'neutrino-8ms.sim',
        LastModified: 'January 16, 2020, 08:31:37 (UTC+01:00)',
        Size: 37920746064365,
        IsFolder: false,
        __versions: [
          {
            VersionId: 'a58deb0e-c9c1-4636-90e9-d63161ec95b8',
            LastModified: 'June 27, 2019, 08:35:46 (UTC+02:00)',
            Size: 73435821489602,
          },
          {
            VersionId: '0143a158-9c66-41f0-9111-31fa86db04c0',
            LastModified: 'July 03, 2019, 11:55:42 (UTC+02:00)',
            Size: 89834263902093,
          },
        ],
      },
      {
        Key: 'neutrino-7ms.sim',
        LastModified: 'July 27, 2019, 00:15:08 (UTC+02:00)',
        Size: 52174744931208,
        IsFolder: false,
        __versions: [
          {
            VersionId: '07be0720-44e9-4782-bb5b-a42a922bc900',
            LastModified: 'June 13, 2019, 16:31:06 (UTC+02:00)',
            Size: 66667698917012,
          },
          {
            VersionId: '3b94af6c-e7e7-4f10-b191-ad561c1a8ed9',
            LastModified: 'May 28, 2019, 10:37:48 (UTC+02:00)',
            Size: 109156784411653,
          },
          {
            VersionId: 'd0632c33-bb49-43cd-9c56-4369fba6704e',
            LastModified: 'February 03, 2020, 21:49:36 (UTC+01:00)',
            Size: 68883654768899,
          },
        ],
      },
      {
        Key: 'quarks-3h.sim',
        LastModified: 'January 06, 2020, 07:03:51 (UTC+01:00)',
        Size: 105933574826161,
        IsFolder: false,
        __versions: [
          {
            VersionId: '9217a7e9-ac01-4a5f-93d2-32e6cc4ea1f8',
            LastModified: 'April 30, 2019, 01:49:01 (UTC+02:00)',
            Size: 46528196001797,
          },
          {
            VersionId: '03cd823b-065c-4fa5-af2d-eda7909978ca',
            LastModified: 'August 03, 2019, 10:31:39 (UTC+02:00)',
            Size: 86297690115515,
          },
          {
            VersionId: 'eb1c4dc5-d832-4003-a936-8e33530d46f0',
            LastModified: 'July 05, 2019, 13:18:17 (UTC+02:00)',
            Size: 60075512470480,
          },
        ],
      },
    ],
  },
  {
    Name: 'bucket-ex',
    CreationDate: 'September 07, 2019, 17:24:10 (UTC+02:00)',
    __region: formatReadOnlyRegion('ca-central-1'),
    __folders: [
      {
        Key: 'simulation-nano-2019',
        IsFolder: true,
        __objects: [
          {
            Key: 'quarks-8ms.sim',
            LastModified: 'July 19, 2019, 03:59:07 (UTC+02:00)',
            Size: 19939311060117,
            IsFolder: false,
            __versions: [
              {
                VersionId: '5a089d13-f87a-45f3-8d7b-1117865b0aa0',
                LastModified: 'February 19, 2020, 15:37:19 (UTC+01:00)',
                Size: 94746267790554,
              },
            ],
          },
        ],
      },
    ],
    __objects: [],
  },
  {
    Name: 'bucket-qui',
    CreationDate: 'February 06, 2020, 19:53:08 (UTC+01:00)',
    __region: formatReadOnlyRegion('us-east-2'),
    __folders: [
      {
        Key: 'simulation-micro-2020',
        IsFolder: true,
        __objects: [
          {
            Key: 'universe-5ms.sim',
            LastModified: 'August 03, 2019, 00:16:17 (UTC+02:00)',
            Size: 90011556476108,
            IsFolder: false,
            __versions: [
              {
                VersionId: '64766fa1-5add-4a97-a8b5-c41f1f815ce4',
                LastModified: 'June 18, 2019, 04:27:46 (UTC+02:00)',
                Size: 20556208373429,
              },
              {
                VersionId: '762c4e1b-1f27-4596-b39d-e3b0effc96d1',
                LastModified: 'May 24, 2019, 00:00:15 (UTC+02:00)',
                Size: 95989434446720,
              },
            ],
          },
          {
            Key: 'neutrino-6ns.sim',
            LastModified: 'February 13, 2020, 08:20:34 (UTC+01:00)',
            Size: 78630822188422,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'e4fb9005-9694-47f3-9fdf-b59f1a472193',
                LastModified: 'January 22, 2020, 15:00:05 (UTC+01:00)',
                Size: 8996181899790,
              },
              {
                VersionId: '34bbc574-9a26-4442-b537-805862c334d2',
                LastModified: 'September 14, 2019, 23:40:33 (UTC+02:00)',
                Size: 41235829117335,
              },
            ],
            __error: {
              type: 'warning',
              header: 'Object versions were not retrieved',
              content:
                'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
            },
          },
        ],
      },
      {
        Key: 'simulation-macro-2018',
        IsFolder: true,
        __objects: [
          {
            Key: 'collision-3ms.sim',
            LastModified: 'May 09, 2019, 00:34:13 (UTC+02:00)',
            Size: 26142214013937,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'c3030b2a-82d0-46d0-92a0-4d5769004bd3',
                LastModified: 'February 02, 2020, 04:43:04 (UTC+01:00)',
                Size: 18678967047565,
              },
              {
                VersionId: '65882de2-b096-4db7-99cf-33517f4523c9',
                LastModified: 'February 06, 2020, 06:29:59 (UTC+01:00)',
                Size: 2855180158320,
              },
            ],
          },
          {
            Key: 'particle-3ns.sim',
            LastModified: 'January 26, 2020, 04:32:00 (UTC+01:00)',
            Size: 47778118171289,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'd49b5f7d-5c00-4a68-8e2c-9d99725d0041',
                LastModified: 'February 26, 2020, 13:39:51 (UTC+01:00)',
                Size: 72290590842305,
              },
            ],
          },
        ],
      },
    ],
    __objects: [
      {
        Key: 'galaxy-7s.sim',
        LastModified: 'September 22, 2019, 06:26:54 (UTC+02:00)',
        Size: 6308938201246,
        IsFolder: false,
        __versions: [
          {
            VersionId: '256e42c1-69fc-4bbd-918d-bd91d24bf914',
            LastModified: 'July 09, 2019, 04:29:47 (UTC+02:00)',
            Size: 41098527276714,
          },
        ],
      },
      {
        Key: 'black-hole-9h.sim',
        LastModified: 'August 27, 2019, 02:41:44 (UTC+02:00)',
        Size: 10634751861734,
        IsFolder: false,
        __versions: [
          {
            VersionId: '683e5f24-fec0-4f75-bde5-590d5400fd48',
            LastModified: 'August 28, 2019, 13:29:03 (UTC+02:00)',
            Size: 30369384279742,
          },
        ],
        __error: {
          type: 'warning',
          header: 'Object versions were not retrieved',
          content:
            'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
        },
      },
      {
        Key: 'neutrino-3h.sim',
        LastModified: 'October 03, 2019, 22:07:50 (UTC+02:00)',
        Size: 103565543291848,
        IsFolder: false,
        __versions: [
          {
            VersionId: 'de9ff369-3794-49a3-84ef-e60e4d72c84f',
            LastModified: 'November 24, 2019, 22:56:50 (UTC+01:00)',
            Size: 5825470398596,
          },
          {
            VersionId: '799345ac-0d07-4ad7-8dc8-e5d3bbc04d94',
            LastModified: 'February 20, 2020, 03:14:34 (UTC+01:00)',
            Size: 21962938052707,
          },
        ],
      },
      {
        Key: 'collision-9h.sim',
        LastModified: 'December 26, 2019, 20:22:14 (UTC+01:00)',
        Size: 52109667471797,
        IsFolder: false,
        __versions: [
          {
            VersionId: '2219502a-dd02-4130-bc7e-ea497a2207b4',
            LastModified: 'November 23, 2019, 17:57:05 (UTC+01:00)',
            Size: 69041957033697,
          },
          {
            VersionId: '49c6aa4c-fadc-4fb6-a926-474b3546b67c',
            LastModified: 'April 05, 2019, 17:46:34 (UTC+02:00)',
            Size: 2822516626484,
          },
          {
            VersionId: '0f4db3ee-3774-4558-a358-797f2aa7b0dc',
            LastModified: 'October 07, 2019, 13:18:01 (UTC+02:00)',
            Size: 23417942110251,
          },
        ],
      },
    ],
  },
  {
    Name: 'bucket-officia',
    CreationDate: 'August 28, 2019, 01:56:08 (UTC+02:00)',
    __region: formatReadOnlyRegion('ca-central-1'),
    __folders: [],
    __objects: [
      {
        Key: 'particle-1ns.sim',
        LastModified: 'June 16, 2019, 00:43:28 (UTC+02:00)',
        Size: 10829014115157,
        IsFolder: false,
        __versions: [
          {
            VersionId: 'b61170ef-702e-46f2-b37f-f61d587b6165',
            LastModified: 'October 31, 2019, 22:00:46 (UTC+01:00)',
            Size: 64668978309605,
          },
        ],
        __error: {
          type: 'warning',
          header: 'Object versions were not retrieved',
          content:
            'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
        },
      },
      {
        Key: 'particle-6h.sim',
        LastModified: 'September 28, 2019, 02:18:52 (UTC+02:00)',
        Size: 94614592401063,
        IsFolder: false,
        __versions: [
          {
            VersionId: 'd90913ca-1980-4939-bd8e-c0781b5eee38',
            LastModified: 'September 14, 2019, 06:56:25 (UTC+02:00)',
            Size: 85676438589901,
          },
        ],
      },
      {
        Key: 'wave-function-4ns.sim',
        LastModified: 'May 30, 2019, 08:04:33 (UTC+02:00)',
        Size: 34812060078660,
        IsFolder: false,
        __versions: [
          {
            VersionId: '4e5ba8cb-fbf7-4b16-b983-5e1b8ef753f7',
            LastModified: 'October 28, 2019, 06:51:49 (UTC+01:00)',
            Size: 54315002078159,
          },
        ],
        __error: {
          type: 'warning',
          header: 'Object versions were not retrieved',
          content:
            'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
        },
      },
    ],
  },
  {
    Name: 'bucket-sunt',
    CreationDate: 'April 27, 2019, 21:43:48 (UTC+02:00)',
    __region: formatReadOnlyRegion('ca-central-1'),
    __folders: [
      {
        Key: 'simulation-micro-2020',
        IsFolder: true,
        __objects: [
          {
            Key: 'quarks-6h.sim',
            LastModified: 'November 18, 2019, 10:46:29 (UTC+01:00)',
            Size: 106359271956497,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'f1c027d3-4715-4e25-86bf-48ec8824a914',
                LastModified: 'February 07, 2020, 02:49:03 (UTC+01:00)',
                Size: 39554506575775,
              },
              {
                VersionId: '9e26c00f-f1a5-423b-b700-25db0eec1790',
                LastModified: 'November 25, 2019, 04:43:14 (UTC+01:00)',
                Size: 84434803342481,
              },
            ],
          },
          {
            Key: 'galaxy-3ns.sim',
            LastModified: 'May 23, 2019, 00:53:38 (UTC+02:00)',
            Size: 70986901548844,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'c4c7b2fa-a7ed-4f85-a5ee-8d9bdc35bf50',
                LastModified: 'September 07, 2019, 14:37:54 (UTC+02:00)',
                Size: 51792527139512,
              },
              {
                VersionId: 'c54fe983-88a0-477b-94fc-3f6b0c989ece',
                LastModified: 'December 23, 2019, 08:02:46 (UTC+01:00)',
                Size: 100133529814935,
              },
              {
                VersionId: '9324110b-df4f-4554-9411-f93b7bb0205f',
                LastModified: 'January 15, 2020, 05:31:14 (UTC+01:00)',
                Size: 46554585862931,
              },
            ],
          },
          {
            Key: 'proton-9ms.sim',
            LastModified: 'September 23, 2019, 12:10:34 (UTC+02:00)',
            Size: 108282301250860,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'c57acd0c-cc6c-47d1-9de2-41e2298c72be',
                LastModified: 'May 13, 2019, 22:14:40 (UTC+02:00)',
                Size: 80122783667995,
              },
              {
                VersionId: 'a6df4373-1f4d-49d0-afd8-020ed90e91a2',
                LastModified: 'April 06, 2019, 12:03:06 (UTC+02:00)',
                Size: 25188698091128,
              },
            ],
          },
          {
            Key: 'universe-4ns.sim',
            LastModified: 'November 28, 2019, 15:50:44 (UTC+01:00)',
            Size: 76504142446230,
            IsFolder: false,
            __versions: [
              {
                VersionId: '4b83a878-2188-4ca3-acd0-46a05d883cec',
                LastModified: 'July 19, 2019, 22:59:21 (UTC+02:00)',
                Size: 15103208117551,
              },
              {
                VersionId: '0f723d37-c389-4cb0-b79f-e1f019f6c022',
                LastModified: 'September 07, 2019, 18:58:14 (UTC+02:00)',
                Size: 86319635397237,
              },
              {
                VersionId: '12fba0eb-a319-4f8b-9599-2046d7fd2e4c',
                LastModified: 'May 24, 2019, 03:10:49 (UTC+02:00)',
                Size: 39502808503195,
              },
            ],
            __error: {
              type: 'warning',
              header: 'Object versions were not retrieved',
              content:
                'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
            },
          },
          {
            Key: 'quarks-8s.sim',
            LastModified: 'October 26, 2019, 15:13:14 (UTC+02:00)',
            Size: 93225230902384,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'c8187dd9-3cc5-4223-a1b2-2f16bd79f9f0',
                LastModified: 'April 15, 2019, 18:55:05 (UTC+02:00)',
                Size: 99875918538659,
              },
            ],
          },
          {
            Key: 'electron-4ms.sim',
            LastModified: 'February 21, 2020, 13:51:47 (UTC+01:00)',
            Size: 21040657606167,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'e3a13d94-ea2d-44d9-a7b2-5c7d76afba64',
                LastModified: 'February 02, 2020, 01:04:32 (UTC+01:00)',
                Size: 76861688060038,
              },
            ],
          },
        ],
      },
      {
        Key: 'simulation-earth-2017',
        IsFolder: true,
        __objects: [
          {
            Key: 'planet-7h.sim',
            LastModified: 'September 09, 2019, 12:29:46 (UTC+02:00)',
            Size: 59078463273866,
            IsFolder: false,
            __versions: [
              {
                VersionId: 'e811222b-16c9-434b-b0ae-7a31b8573e27',
                LastModified: 'June 14, 2019, 01:09:03 (UTC+02:00)',
                Size: 102409007876807,
              },
              {
                VersionId: '93eb8f09-feef-46c9-8804-9aae1dc99059',
                LastModified: 'July 02, 2019, 05:05:51 (UTC+02:00)',
                Size: 57767169670664,
              },
            ],
            __error: {
              type: 'warning',
              header: 'Object versions were not retrieved',
              content:
                'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
            },
          },
          {
            Key: 'electron-4s.sim',
            LastModified: 'May 01, 2019, 18:00:39 (UTC+02:00)',
            Size: 32661570516706,
            IsFolder: false,
            __versions: [
              {
                VersionId: '83c431f4-058f-423a-82c6-91ac1e71b095',
                LastModified: 'September 10, 2019, 14:11:58 (UTC+02:00)',
                Size: 43752364458694,
              },
              {
                VersionId: '7d827c3d-b8cd-40a0-977e-a41a1a32693d',
                LastModified: 'June 01, 2019, 08:25:36 (UTC+02:00)',
                Size: 19349202804892,
              },
              {
                VersionId: '4cd67a3f-7c4e-4548-b2be-920e0d43c7ce',
                LastModified: 'May 27, 2019, 19:09:29 (UTC+02:00)',
                Size: 91897348630517,
              },
            ],
          },
          {
            Key: 'universe-8ms.sim',
            LastModified: 'December 28, 2019, 22:07:30 (UTC+01:00)',
            Size: 106162635791268,
            IsFolder: false,
            __versions: [
              {
                VersionId: '4ab60e02-6b0f-4439-a543-c33f0c0dedb8',
                LastModified: 'December 06, 2019, 12:00:27 (UTC+01:00)',
                Size: 63268847079353,
              },
              {
                VersionId: '47236b20-63c7-4454-b771-d206db2dc4dd',
                LastModified: 'February 01, 2020, 16:02:17 (UTC+01:00)',
                Size: 31160155834069,
              },
              {
                VersionId: '80ff9b1d-6ca4-4360-b381-829bbe70bf68',
                LastModified: 'October 23, 2019, 23:01:07 (UTC+02:00)',
                Size: 20034922977201,
              },
            ],
            __error: {
              type: 'warning',
              header: 'Object versions were not retrieved',
              content:
                'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
            },
          },
        ],
      },
      {
        Key: 'simulation-micro-2017',
        IsFolder: true,
        __objects: [
          {
            Key: 'wave-function-4s.sim',
            LastModified: 'September 20, 2019, 08:25:42 (UTC+02:00)',
            Size: 4635095260666,
            IsFolder: false,
            __versions: [
              {
                VersionId: '370c7ded-762e-481c-8158-6041d556cb79',
                LastModified: 'April 09, 2019, 15:10:52 (UTC+02:00)',
                Size: 77800301868954,
              },
              {
                VersionId: '07308409-c9bb-43e5-bf00-94b82ddb39cf',
                LastModified: 'March 21, 2020, 14:14:59 (UTC+01:00)',
                Size: 39993963705939,
              },
              {
                VersionId: '4e97a35b-9793-49e4-be31-5eb8bc4e51ec',
                LastModified: 'May 27, 2019, 05:58:51 (UTC+02:00)',
                Size: 8105428507553,
              },
            ],
            __error: {
              type: 'warning',
              header: 'Object versions were not retrieved',
              content:
                'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
            },
          },
          {
            Key: 'collision-2ns.sim',
            LastModified: 'November 02, 2019, 04:45:55 (UTC+01:00)',
            Size: 97994481320612,
            IsFolder: false,
            __versions: [
              {
                VersionId: '260f4d5f-5ab9-47e3-a7c4-9e84333476fa',
                LastModified: 'December 31, 2019, 19:06:34 (UTC+01:00)',
                Size: 37689275136622,
              },
            ],
          },
          {
            Key: 'quarks-9s.sim',
            LastModified: 'March 30, 2019, 19:22:12 (UTC+01:00)',
            Size: 85647494511064,
            IsFolder: false,
            __versions: [
              {
                VersionId: '6a51fe83-c08c-445b-9f29-6adf048bdaa2',
                LastModified: 'January 15, 2020, 22:56:02 (UTC+01:00)',
                Size: 30781616068019,
              },
            ],
          },
          {
            Key: 'quarks-6ns.sim',
            LastModified: 'August 16, 2019, 07:59:32 (UTC+02:00)',
            Size: 52765301613036,
            IsFolder: false,
            __versions: [
              {
                VersionId: '501ab6dd-189d-4735-99fd-363f3aeb180e',
                LastModified: 'January 15, 2020, 07:14:24 (UTC+01:00)',
                Size: 95634361641682,
              },
              {
                VersionId: 'f0ad7796-8179-468b-ad33-bd0e8a2cd65f',
                LastModified: 'May 26, 2019, 18:38:37 (UTC+02:00)',
                Size: 69215336625306,
              },
            ],
          },
        ],
      },
    ],
    __objects: [
      {
        Key: 'galaxy-5ms.sim',
        LastModified: 'May 05, 2019, 12:13:50 (UTC+02:00)',
        Size: 38047378251541,
        IsFolder: false,
        __versions: [
          {
            VersionId: 'd27bf6aa-1474-4c45-829f-2e35514b8d14',
            LastModified: 'November 10, 2019, 03:25:21 (UTC+01:00)',
            Size: 13258208343015,
          },
          {
            VersionId: 'df069dff-1850-4f45-ae88-5302e2b52f0d',
            LastModified: 'October 15, 2019, 20:43:37 (UTC+02:00)',
            Size: 95859176772021,
          },
        ],
        __error: {
          type: 'warning',
          header: 'Object versions were not retrieved',
          content:
            'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
        },
      },
      {
        Key: 'electron-8ms.sim',
        LastModified: 'June 21, 2019, 02:09:14 (UTC+02:00)',
        Size: 89360510446416,
        IsFolder: false,
        __versions: [
          {
            VersionId: 'b49d5c24-fde0-440a-83f6-66bd12fef1dc',
            LastModified: 'March 12, 2020, 01:40:00 (UTC+01:00)',
            Size: 51834954407082,
          },
          {
            VersionId: 'ce3f70e5-a9ac-4a3f-b8ea-8413c919dcf6',
            LastModified: 'August 05, 2019, 12:31:32 (UTC+02:00)',
            Size: 40834130158910,
          },
          {
            VersionId: '8411a60c-68dd-4654-a0fe-228130bfe8c9',
            LastModified: 'November 08, 2019, 17:58:08 (UTC+01:00)',
            Size: 1809958398426,
          },
        ],
      },
    ],
  },
  {
    Name: 'bucket-et',
    CreationDate: 'May 06, 2019, 21:59:30 (UTC+02:00)',
    __region: formatReadOnlyRegion('us-east-2'),
    __folders: [],
    __objects: [
      {
        Key: 'proton-2s.sim',
        LastModified: 'November 13, 2019, 12:08:29 (UTC+01:00)',
        Size: 37182367396013,
        IsFolder: false,
        __versions: [
          {
            VersionId: '779e2995-b0d6-413e-994d-1d433bfbbc53',
            LastModified: 'October 28, 2019, 22:58:18 (UTC+01:00)',
            Size: 16335174262801,
          },
          {
            VersionId: 'da80349e-3491-4613-a639-3baa8bf53dfe',
            LastModified: 'September 29, 2019, 03:34:14 (UTC+02:00)',
            Size: 87535838805693,
          },
        ],
      },
      {
        Key: 'black-hole-2ms.sim',
        LastModified: 'June 20, 2019, 16:47:27 (UTC+02:00)',
        Size: 42601316313128,
        IsFolder: false,
        __versions: [
          {
            VersionId: '2d090a95-88d7-4dc6-8763-e94851fd1073',
            LastModified: 'July 28, 2019, 05:35:51 (UTC+02:00)',
            Size: 13713137607672,
          },
        ],
      },
      {
        Key: 'black-hole-2h.sim',
        LastModified: 'February 11, 2020, 02:57:53 (UTC+01:00)',
        Size: 7133938953874,
        IsFolder: false,
        __versions: [
          {
            VersionId: '034e9a82-6816-40c6-a43a-a74a92e22b45',
            LastModified: 'June 23, 2019, 03:48:48 (UTC+02:00)',
            Size: 32064198673433,
          },
        ],
        __error: {
          type: 'warning',
          header: 'Object versions were not retrieved',
          content:
            'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
        },
      },
      {
        Key: 'planet-2ns.sim',
        LastModified: 'January 13, 2020, 05:04:08 (UTC+01:00)',
        Size: 55560768156458,
        IsFolder: false,
        __versions: [
          {
            VersionId: '32425748-90c2-4b3f-9594-381525d49c5d',
            LastModified: 'June 21, 2019, 12:47:54 (UTC+02:00)',
            Size: 54042968807744,
          },
          {
            VersionId: '786e16c4-279c-44f7-9b45-c5c68fa6a1b3',
            LastModified: 'April 12, 2019, 13:05:03 (UTC+02:00)',
            Size: 21411431351739,
          },
        ],
      },
      {
        Key: 'proton-2ms.sim',
        LastModified: 'September 09, 2019, 06:06:40 (UTC+02:00)',
        Size: 46813371522926,
        IsFolder: false,
        __versions: [
          {
            VersionId: '56b02bd7-5ffe-4f29-a8ee-fea8779f2ff0',
            LastModified: 'December 26, 2019, 05:59:39 (UTC+01:00)',
            Size: 59437872996459,
          },
        ],
        __error: {
          type: 'warning',
          header: 'Object versions were not retrieved',
          content:
            'You might not have permissions to retrieve object versions. Contact your account administrator. If no version ID is specified, the most recent version of the object is used.',
        },
      },
    ],
  },
];
