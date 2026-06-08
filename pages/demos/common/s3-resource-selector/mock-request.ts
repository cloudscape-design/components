// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { S3ResourceSelectorProps } from '@cloudscape-design/components/s3-resource-selector';

import { amazonS3Data, S3Error, S3ErrorType, S3Resource } from './mock-data';

type ResourceType = 'buckets' | 'objects' | 'versions';
type ChildResourceKeys = '__objects' | '__versions' | '__folders';

export class S3FetchError extends Error {
  constructor(error: S3Error) {
    super(error.content);
    this.type = error.type;
    this.header = error.header;
  }

  type: S3ErrorType;
  header: string | undefined;
}

amazonS3Data.map(bucket => {
  bucket.__objects = [...(bucket.__folders ?? []), ...(bucket.__objects ?? [])];
});
const randomDelay = (min = 500) => ~~(Math.random() * 500) + min;

const findItem = (items: S3Resource[], name: string, itemsType: S3ResourceSelectorProps.SelectableItems) => {
  const item = items.filter(item => item.Name === name || item.Key === name)[0];
  if (!item) {
    throw `"${name}" ${itemsType.substring(0, itemsType.length - 1)} doesn't exist`;
  }
  return item;
};

const getItemsType = (item: S3Resource): ResourceType => {
  return Object.keys(item)
    .filter(key => key === '__objects' || key === '__versions')[0]
    .replace('__', '') as ResourceType;
};

export const getItems = (bucket?: string, path?: string): Promise<S3Resource[]> => {
  const entities: string[] = [];
  if (bucket) {
    entities.push(bucket);
  }
  if (path && path.length > 0) {
    entities.push(...path.split('/'));
  }

  let items: S3Resource[] = amazonS3Data;
  let itemsType: ResourceType = 'buckets';
  let item: S3Resource;

  for (const entity of entities) {
    try {
      item = findItem(items, entity, itemsType);
    } catch (e) {
      throw new S3FetchError({
        content: `Resource "s3://${bucket}/${path}" cannot be found: ${e}`,
        type: 'error',
      });
    }
    itemsType = getItemsType(item);
    if (item.__error) {
      const error = new S3FetchError(item.__error);
      error.type = item.__error.type;
      error.header = item.__error.header;
      throw error;
    }
    items = item[('__' + itemsType) as ChildResourceKeys] ?? [];
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(items);
    }, randomDelay());
  });
};

export const requestAsyncRegions = (item: S3Resource): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      item.Region = item.__region;
      resolve();
    }, randomDelay(1000));
  });
};
