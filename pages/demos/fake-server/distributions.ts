// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { PropertyFilterProps } from '@cloudscape-design/components/property-filter';

import { isToken, isTokenGroup } from '../common/property-filter-type-guards';
import { Distribution } from './types';
import fetchJson from './utils/fetch-json';

// removes the readonly as we are trying to mask the Property Filter props
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type FilteringOptions = NonNullable<Mutable<PropertyFilterProps['filteringOptions']>>;
type FilteringProperties = Mutable<PropertyFilterProps['filteringProperties']>;

type TokenGroup = PropertyFilterProps.TokenGroup;
type Token = PropertyFilterProps.Token;
interface FetchDistributionOptions {
  currentPageIndex: number;
  filteringOperation: 'and' | 'or';
  filteringText: string;
  filteringTokens: {
    operator: string;
    value: string;
    propertyKey: string;
    operation?: 'and' | 'or';
    tokens: Token[];
  }[];
  pageSize: number;
  sortingColumn: string;
  sortingDescending: boolean;
  filteringPropertyKey?: string;
  filteringOptions: FilteringOptions;
}

let items: Distribution[] = [];
let filteringProperties: FilteringProperties = [];

function createComparator(options: FetchDistributionOptions) {
  const qualifier = options.sortingDescending ? -1 : 1;
  const field = options.sortingColumn as keyof Distribution;
  return (a: Distribution, b: Distribution) => (a[field] > b[field] ? qualifier : -qualifier);
}

const getComparatorForOperator = (operator: string) => (a: string, b: string) => {
  switch (operator) {
    case '=':
      // eslint-disable-next-line eqeqeq
      return a == b;
    case '!=':
      // eslint-disable-next-line eqeqeq
      return a != b;
    case ':':
      return (a + '').toLowerCase().indexOf((b + '').toLowerCase()) > -1;
    case '!:':
      return (a + '').toLowerCase().indexOf((b + '').toLowerCase()) === -1;
    case '^':
      return (a + '').toLowerCase().startsWith((b + '').toLowerCase());
    case '!^':
      return !(a + '').toLowerCase().startsWith((b + '').toLowerCase());
  }
  return false;
};

function filterItemsByProperty(options: FetchDistributionOptions) {
  const operationFn = <T>(operation: 'and' | 'or') => {
    switch (operation) {
      case 'or':
        return (value1: T, value2: T) => value1 || value2;
      case 'and':
      default:
        return (value1: T, value2: T) => value1 && value2;
    }
  };

  const match = (
    propertyKey: string,
    searchText: string,
    item: Distribution,
    compareFn: (tag: string, searchText: string) => boolean
  ) => {
    // specific tag
    if (propertyKey.startsWith('tag-indicator__')) {
      const tagKey = propertyKey.split('__')[1];

      if (item.tags[tagKey]) {
        return item.tags[tagKey].some((tag: string) => compareFn(tag, searchText));
      }

      return false;
    }

    return compareFn(item[propertyKey as keyof Distribution] as string, searchText);
  };

  const filteringFunction = function (item: Distribution, tokens: Token[], operation: 'and' | 'or') {
    function filterWithToken(
      include: boolean,
      opFn: (a: boolean, b: boolean) => void,
      tokenOrGroup: Token | TokenGroup
    ): boolean {
      if (isTokenGroup(tokenOrGroup)) {
        const nextOpFn = operationFn<boolean>(tokenOrGroup.operation!);
        return tokenOrGroup.tokens.reduce(
          (include: boolean, token: Token | TokenGroup) => filterWithToken(include, nextOpFn, token),
          operation === 'and'
        );
      }
      if (isToken(tokenOrGroup)) {
        const comparator = getComparatorForOperator(tokenOrGroup.operator);
        const searchableProps = tokenOrGroup.propertyKey ? [tokenOrGroup.propertyKey] : Object.keys(item);
        return searchableProps.some(propertyKey => {
          const matched = match(propertyKey, tokenOrGroup.value, item, comparator);
          return opFn(include, matched);
        });
      }
      throw new Error('Invariant violation: unexpected token shape.');
    }
    const opFn = operationFn<boolean>(operation);
    return tokens.reduce((include, token) => filterWithToken(include, opFn, token), operation === 'and');
  };

  return items.filter(item => filteringFunction(item, options.filteringTokens, options.filteringOperation));
}

function filterItemsByText({ filteringText, filteringOptions }: FetchDistributionOptions) {
  return items.filter(item => {
    for (const prop in item) {
      if (typeof item[prop as keyof Distribution] !== 'string') {
        // we search only in string properties;
        continue;
      }

      const matchesText =
        item[prop as keyof Distribution] &&
        (item[prop as keyof Distribution] as string).toLowerCase().indexOf(filteringText.toLowerCase()) !== -1;
      let matchesProp = false;

      if (filteringOptions) {
        matchesProp =
          Object.prototype.hasOwnProperty.call(item, prop) &&
          prop.toLowerCase().indexOf(filteringText.toLowerCase()) !== -1;
      }

      if (matchesText || matchesProp) {
        return true;
      }
    }
    return false;
  });
}

function filterItems(options: FetchDistributionOptions) {
  return options.filteringTokens ? filterItemsByProperty(options) : filterItemsByText(options);
}

interface PrepareResponseReturnType {
  filteringProperties: FilteringProperties;
  items: Distribution[];
  filteringOptions: FilteringOptions;
  pagesCount: number;
  currentPageIndex: number;
}

function prepareResponse(options: FetchDistributionOptions): PrepareResponseReturnType {
  const output: {
    filteringProperties: FilteringProperties;
    items: Distribution[];
    filteringOptions: FilteringOptions;
    pagesCount: number;
    currentPageIndex: number;
  } = {
    currentPageIndex: 0,
    items: [],
    pagesCount: 0,
    filteringProperties,
    filteringOptions: [],
  };
  const shouldFilter =
    (options.filteringText && !options.filteringTokens) || (options.filteringTokens && options.filteringTokens.length);

  output.items = shouldFilter ? filterItems(options) : items.slice();

  if (filteringProperties) {
    const filteringOptions: FilteringOptions = [];
    const filteredPropertyKeys = options.filteringPropertyKey
      ? [options.filteringPropertyKey]
      : filteringProperties.map(property => property.key);
    // an object used as a set to ensure uniqueness of the generated filtering options
    const addedFilteringOptions: Record<string, boolean> = {};
    // TODO: will fix in a follow up CR

    const addFilteringOption = (propertyKey: string, value: any) => {
      const id = propertyKey + '#' + value;
      if (!addedFilteringOptions[id]) {
        filteringOptions.push({ propertyKey, value });
      }
      addedFilteringOptions[id] = true;
    };
    items.forEach(item => {
      filteredPropertyKeys.forEach(propertyKey => {
        if (propertyKey.startsWith('tag-indicator__')) {
          const tagKey = propertyKey.split('__')[1];
          if (item.tags[tagKey]) {
            item.tags[tagKey].forEach((tagValue: string) => {
              addFilteringOption(propertyKey, tagValue);
            });
          }
        } else {
          addFilteringOption(propertyKey, item[propertyKey as keyof Distribution]);
        }
      });
    });

    output.filteringOptions = filteringOptions;
  } else {
    output.filteringOptions = [];
  }

  if (options.sortingColumn) {
    output.items.sort(createComparator(options));
  }

  if (options.pageSize && options.currentPageIndex) {
    const pageSize = options.pageSize;
    const currentItems = output.items;
    let currentPageIndex = options.currentPageIndex;
    if ((currentPageIndex - 1) * pageSize >= currentItems.length) {
      currentPageIndex = 1;
    }

    output.pagesCount = Math.ceil(currentItems.length / pageSize);
    output.currentPageIndex = currentPageIndex;
    output.items = currentItems.slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize);
  } else {
    output.pagesCount = 1;
    output.currentPageIndex = 1;
  }

  return output;
}

export function fetchDistributionFilteringOptions(
  options: FetchDistributionOptions,
  callback: (data: PrepareResponseReturnType) => void
) {
  fetchJson<NonNullable<PropertyFilterProps.FilteringProperty[]>>(
    './resources/distributionsFilteringProperties.json'
  ).then(response => {
    filteringProperties = response;
    setTimeout(() => callback(prepareResponse(options)), 500);
  });
}

export function fetchDistributions(
  options: FetchDistributionOptions,
  callback: (data: PrepareResponseReturnType) => void
) {
  if (items.length === 0) {
    fetchJson<Distribution[]>('./resources/distributions.json').then(response => {
      items = response;
      if (options.filteringOptions) {
        fetchDistributionFilteringOptions(options, callback);
      } else {
        setTimeout(() => callback(prepareResponse(options)), 500);
      }
    });
  } else {
    setTimeout(() => callback(prepareResponse(options)), 500);
  }
}
