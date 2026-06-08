// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { TagsResource } from '../resources/types';
import fakeDelay from './utils/fake-delay';
import fetchJson from './utils/fetch-json';

// Mimic AWS SDK API method to return a similar shape to be used by the component
// @see https://docs.aws.amazon.com/resourcegroupstagging/latest/APIReference/API_GetResources.html
export async function GetResources() {
  const [{ resourceTags }] = await Promise.all([fetchJson<TagsResource>('./resources/tags.json'), fakeDelay()]);
  return {
    ResourceTagMappingList: [
      {
        Tags: resourceTags,
      },
    ],
  };
}

// @see https://docs.aws.amazon.com/resourcegroupstagging/latest/APIReference/API_GetTagValues.html
export async function GetTagValues(key: keyof TagsResource['valueMap']) {
  if (!key) {
    return Promise.reject();
  }
  const [{ valueMap }] = await Promise.all([fetchJson<TagsResource>('./resources/tags.json'), fakeDelay()]);
  return {
    TagValues: valueMap[key] || [],
  };
}

// @see https://docs.aws.amazon.com/resourcegroupstagging/latest/APIReference/API_GetTagKeys.html
export async function GetTagKeys() {
  const [{ valueMap }] = await Promise.all([fetchJson<TagsResource>('./resources/tags.json'), fakeDelay()]);
  return {
    TagKeys: Object.keys(valueMap),
  };
}
