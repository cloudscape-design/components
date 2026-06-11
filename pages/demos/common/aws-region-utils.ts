// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export interface Region {
  name: string;
  code: string;
}

export const regionsByLocation = {
  'United States': [
    {
      name: 'N. Virginia',
      code: 'us-east-1',
    },
    {
      name: 'Ohio',
      code: 'us-east-2',
    },
    {
      name: 'N. California',
      code: 'us-west-1',
    },
    {
      name: 'Oregon',
      code: 'us-west-2',
    },
  ],
  'Asia Pacific': [
    {
      name: 'Mumbai',
      code: 'ap-south-1',
    },
    {
      name: 'Osaka',
      code: 'ap-northeast-3',
    },
    {
      name: 'Seoul',
      code: 'ap-northeast-2',
    },
    {
      name: 'Singapore',
      code: 'ap-southeast-1',
    },
    {
      name: 'Sydney',
      code: 'ap-southeast-2',
    },
    {
      name: 'Tokyo',
      code: 'ap-northeast-1',
    },
  ],
  Canada: [
    {
      name: 'Central',
      code: 'ca-central-1',
    },
  ],
  Europe: [
    {
      name: 'Frankfurt',
      code: 'eu-central-1',
    },
    {
      name: 'Ireland',
      code: 'eu-west-1',
    },
    {
      name: 'London',
      code: 'eu-west-2',
    },
    {
      name: 'Paris',
      code: 'eu-west-3',
    },
    {
      name: 'Stockholm',
      code: 'eu-north-1',
    },
  ],
  'Middle East': [
    {
      name: 'Bahrain',
      code: 'me-south-1',
    },
    {
      name: 'UAE',
      code: 'me-central-1',
    },
  ],
  'South America': [
    {
      name: 'São Paulo',
      code: 'sa-east-1',
    },
  ],
};

export function formatReadOnlyRegion(regionCode: Region['code']) {
  const region = Object.values(regionsByLocation)
    .flat()
    .filter((region: Region) => region.code === regionCode)[0];
  return region ? `${region.name} (${region.code})` : regionCode;
}
