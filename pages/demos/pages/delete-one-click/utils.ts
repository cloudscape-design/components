// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { Tag, TagsResource } from '../../resources/types';

export async function loadTags() {
  const isUserTag = (tag: Tag) => tag.key.indexOf('aws:') !== 0;
  const mapExistingTag = (tag: Tag) => ({ ...tag, existing: true });

  const { ResourceTagMappingList } = await window.FakeServer.GetResources();
  const tags = ResourceTagMappingList.reduce(
    (allTags: { key: string; value: string }[], resourceTagMapping: { Tags: { key: string; value: string }[] }) => [
      ...allTags,
      ...resourceTagMapping.Tags,
    ],
    []
  )
    .filter(isUserTag)
    .map(mapExistingTag);

  return tags;
}

export async function loadTagKeys() {
  const { TagKeys } = await window.FakeServer.GetTagKeys();
  return TagKeys;
}

export async function loadTagValues(key: string) {
  const { TagValues } = await window.FakeServer.GetTagValues(key as keyof TagsResource['valueMap']);
  return TagValues;
}
