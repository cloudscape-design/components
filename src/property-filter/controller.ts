// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  ComparisonOperator,
  ExtendedOperatorForm,
  GroupText,
  I18nStrings,
  InternalFilteringOption,
  InternalFilteringProperty,
  JoinOperation,
  ParsedText,
  Query,
  SupportedOperator,
  Token,
} from './interfaces';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { AutosuggestProps } from '../autosuggest/interfaces';
import {
  getPropertyByKey,
  matchFilteringProperty,
  matchOperator,
  matchOperatorPrefix,
  trimFirstSpace,
  trimStart,
} from './utils';
import { AutosuggestInputRef } from '../internal/components/autosuggest-input';

export const getQueryActions = (
  query: Query,
  onChange: NonCancelableEventHandler<Query>,
  inputRef: React.RefObject<AutosuggestInputRef>
) => {
  const { tokens, operation } = query;
  const fireOnChange = (tokens: readonly Token[], operation: JoinOperation) =>
    fireNonCancelableEvent(onChange, { tokens, operation });
  const setToken = (index: number, newToken: Token) => {
    const newTokens = [...tokens];
    if (newTokens && index < newTokens.length) {
      newTokens[index] = newToken;
    }
    fireOnChange(newTokens, operation);
  };
  const removeToken = (index: number) => {
    const newTokens = tokens.filter((_, i) => i !== index);
    fireOnChange(newTokens, operation);
    inputRef.current?.focus({ preventDropdown: true });
  };
  const removeAllTokens = () => {
    fireOnChange([], operation);
    inputRef.current?.focus({ preventDropdown: true });
  };
  const addToken = (newToken: Token) => {
    const newTokens = [...tokens];
    newTokens.push(newToken);
    fireOnChange(newTokens, operation);
  };
  const setOperation = (newOperation: JoinOperation) => {
    fireOnChange(tokens, newOperation);
  };
  return {
    setToken,
    removeToken,
    removeAllTokens,
    addToken,
    setOperation,
  };
};

export const getAllowedOperators = (property: InternalFilteringProperty): ComparisonOperator[] => {
  const { operators = [], defaultOperator } = property;
  const operatorOrder = ['=', '!=', ':', '!:', '>=', '<=', '<', '>'] as const;
  const operatorSet = new Set([defaultOperator, ...operators]);
  return operatorOrder.filter(op => operatorSet.has(op));
};

/*
 * parses the value of the filtering input to figure out the current step of entering the token:
 * - "property": means that a filter on a particular column is being added, with operator already finalized
 * - "operator": means that a filter on a particular column is being added, with operator not yet finalized
 * - "free-text": means that a "free text" token is being added
 */
export const parseText = (
  filteringText: string,
  filteringProperties: readonly InternalFilteringProperty[] = [],
  disableFreeTextFiltering: boolean
): ParsedText => {
  const negatedGlobalQuery = /^(!:|!)(.*)/.exec(filteringText);
  if (!disableFreeTextFiltering && negatedGlobalQuery) {
    return {
      step: 'free-text',
      operator: '!:',
      value: negatedGlobalQuery[2],
    };
  }

  const property = matchFilteringProperty(filteringProperties, filteringText);
  if (!property) {
    return {
      step: 'free-text',
      value: filteringText,
    };
  }

  const allowedOps = getAllowedOperators(property);

  const textWithoutProperty = filteringText.substring(property.propertyLabel.length);
  const operator = matchOperator(allowedOps, trimStart(textWithoutProperty));
  if (operator) {
    const operatorLastIndex = textWithoutProperty.indexOf(operator) + operator.length;
    const textWithoutPropertyAndOperator = textWithoutProperty.slice(operatorLastIndex);
    // We need to remove the first leading space in case the user presses space
    // after the operator, for example: Owner: admin, will result in value of ` admin`
    // and we need to remove the first space, if the user added any more spaces only the
    // first one will be removed.
    const value = trimFirstSpace(textWithoutPropertyAndOperator);
    return { step: 'property', property, operator, value };
  }

  const operatorPrefix = matchOperatorPrefix(allowedOps, trimStart(textWithoutProperty));
  if (operatorPrefix !== null) {
    return { step: 'operator', property, operatorPrefix };
  }

  return {
    step: 'free-text',
    value: filteringText,
  };
};

export const getPropertyOptions = (
  filteringProperty: InternalFilteringProperty,
  filteringOptions: readonly InternalFilteringOption[]
) => {
  return filteringOptions.filter(option => option.propertyKey === filteringProperty.propertyKey);
};

interface OptionGroup<T> {
  label: string;
  options: T[];
}

export const getAllValueSuggestions = (
  filteringOptions: readonly InternalFilteringOption[],
  filteringProperties: readonly InternalFilteringProperty[],
  operator: ComparisonOperator | undefined = '=',
  i18nStrings: I18nStrings,
  customGroupsText: readonly GroupText[]
) => {
  const defaultGroup: OptionGroup<AutosuggestProps.Option> = {
    label: i18nStrings.groupValuesText ?? '',
    options: [],
  };
  const customGroups: { [K in string]: OptionGroup<AutosuggestProps.Option> } = {};
  filteringOptions.forEach(filteringOption => {
    const property = getPropertyByKey(filteringProperties, filteringOption.propertyKey);
    // given option refers to a non-existent filtering property
    if (!property) {
      return;
    }
    // this option's filtering property does not support current operator
    if (getAllowedOperators(property).indexOf(operator) === -1) {
      return;
    }
    if (property.propertyGroup && !customGroups[property.propertyGroup]) {
      const label = customGroupsText.reduce<string>(
        (acc, customGroup) => (customGroup.group === property.propertyGroup ? customGroup.values : acc),
        ''
      );
      customGroups[property.propertyGroup] = {
        label,
        options: [],
      };
    }
    const propertyGroup = property.propertyGroup ? customGroups[property.propertyGroup] : defaultGroup;
    propertyGroup.options.push({
      value: property.propertyLabel + ' ' + (operator || '=') + ' ' + filteringOption.value,
      label: filteringOption.label,
      __labelPrefix: property.propertyLabel + ' ' + (operator || '='),
    });
  });
  return [defaultGroup, ...Object.keys(customGroups).map(group => customGroups[group])];
};

export function createPropertiesCompatibilityMap(
  filteringProperties: readonly InternalFilteringProperty[]
): (propertyA: string, propertyB: string) => boolean {
  const lookup: {
    [propertyKey: string]: { operator: string; form: ExtendedOperatorForm<any> | null }[];
  } = {};

  for (const property of filteringProperties) {
    lookup[property.propertyKey] = (property.operators || [])
      .map(operator => ({ operator, form: property.getValueFormRenderer(operator) }))
      .sort((a, b) => a.operator.localeCompare(b.operator));
  }

  return (propertyA: string, propertyB: string) => {
    if (lookup[propertyA].length !== lookup[propertyB].length) {
      return false;
    }
    for (let i = 0; i < lookup[propertyA].length; i++) {
      if (lookup[propertyA][i].operator !== lookup[propertyB][i].operator) {
        return false;
      }
      if (lookup[propertyA][i].form !== lookup[propertyB][i].form) {
        return false;
      }
    }
    return true;
  };
}

const filteringPropertyToAutosuggestOption = (filteringProperty: InternalFilteringProperty) => ({
  value: filteringProperty.propertyLabel,
  label: filteringProperty.propertyLabel,
  keepOpenOnSelect: true,
});

export function getPropertySuggestions<T>(
  filteringProperties: readonly InternalFilteringProperty[],
  customGroupsText: readonly GroupText[],
  i18nStrings: I18nStrings,
  filteringPropertyToOption: (filteringProperty: InternalFilteringProperty) => T
) {
  const defaultGroup: OptionGroup<T> = {
    label: i18nStrings.groupPropertiesText ?? '',
    options: [],
  };
  const customGroups: { [K in string]: OptionGroup<T> } = {};

  filteringProperties.forEach(filteringProperty => {
    const { propertyGroup } = filteringProperty;
    let optionsGroup = defaultGroup;
    if (propertyGroup) {
      if (!customGroups[propertyGroup]) {
        const label = customGroupsText.reduce<string>(
          (acc, customGroup) => (customGroup.group === propertyGroup ? customGroup.properties : acc),
          ''
        );
        customGroups[propertyGroup] = { options: [], label };
      }
      optionsGroup = customGroups[propertyGroup];
    }
    optionsGroup.options.push(filteringPropertyToOption(filteringProperty));
  });
  const defaultGroupArray = defaultGroup.options.length ? [defaultGroup] : [];
  const customGroupsArray = Object.keys(customGroups).map(groupKey => customGroups[groupKey]);
  return [...defaultGroupArray, ...customGroupsArray];
}

export const getAutosuggestOptions = (
  parsedText: ParsedText,
  filteringOptions: readonly InternalFilteringOption[],
  filteringProperties: readonly InternalFilteringProperty[],
  customGroupsText: readonly GroupText[],
  i18nStrings: I18nStrings
) => {
  switch (parsedText.step) {
    case 'property': {
      const { propertyLabel, groupValuesLabel } = parsedText.property;
      const options = getPropertyOptions(parsedText.property, filteringOptions);
      return {
        filterText: parsedText.value,
        options: [
          {
            options: options.map(({ label, value }) => ({
              value: propertyLabel + ' ' + parsedText.operator + ' ' + value,
              label: label,
              __labelPrefix: propertyLabel + ' ' + parsedText.operator,
            })),
            label: groupValuesLabel,
          },
        ],
      };
    }
    case 'operator': {
      return {
        filterText: parsedText.property.propertyLabel + ' ' + parsedText.operatorPrefix,
        options: [
          ...getPropertySuggestions(
            filteringProperties,
            customGroupsText,
            i18nStrings,
            filteringPropertyToAutosuggestOption
          ),
          {
            options: getAllowedOperators(parsedText.property).map(value => ({
              value: parsedText.property.propertyLabel + ' ' + value + ' ',
              label: parsedText.property.propertyLabel + ' ' + value,
              description: operatorToDescription(value, i18nStrings),
              keepOpenOnSelect: true,
            })),
            label: i18nStrings.operatorsText,
          },
        ],
      };
    }
    case 'free-text': {
      const needsValueSuggestions = !!parsedText.value;
      const needsPropertySuggestions = !(parsedText.step === 'free-text' && parsedText.operator === '!:');
      return {
        filterText: parsedText.value,
        options: [
          ...(needsPropertySuggestions
            ? getPropertySuggestions(
                filteringProperties,
                customGroupsText,
                i18nStrings,
                filteringPropertyToAutosuggestOption
              )
            : []),
          ...(needsValueSuggestions
            ? getAllValueSuggestions(
                filteringOptions,
                filteringProperties,
                parsedText.operator,
                i18nStrings,
                customGroupsText
              )
            : []),
        ],
      };
    }
  }
};

export const operatorToDescription = (operator: SupportedOperator, i18nStrings: I18nStrings) => {
  switch (operator) {
    case '<':
      return i18nStrings.operatorLessText;
    case '<=':
      return i18nStrings.operatorLessOrEqualText;
    case '>':
      return i18nStrings.operatorGreaterText;
    case '>=':
      return i18nStrings.operatorGreaterOrEqualText;
    case ':':
      return i18nStrings.operatorContainsText;
    case '!:':
      return i18nStrings.operatorDoesNotContainText;
    case '=':
      return i18nStrings.operatorEqualsText;
    case '!=':
      return i18nStrings.operatorDoesNotEqualText;
    // The line is ignored from coverage because it is not reachable.
    // The purpose of it is to prevent TS errors if ComparisonOperator type gets extended.
    /* istanbul ignore next */
    default:
      return '';
  }
};
