// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  ComparisonOperator,
  FilteringOption,
  FilteringProperty,
  GroupText,
  I18nStrings,
  JoinOperation,
  ParsedText,
  Query,
  Token,
} from './interfaces';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { AutosuggestProps } from '../autosuggest/interfaces';
import { matchFilteringProperty, matchOperator, matchOperatorPrefix, trimFirstSpace, trimStart } from './utils';
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

export const getAllowedOperators = (property: FilteringProperty): ComparisonOperator[] => {
  const { operators = [], defaultOperator } = property;
  const operatorOrder = ['=', '!=', ':', '!:', '>=', '<=', '<', '>'] as const;
  const operatorSet = new Set<ComparisonOperator>();
  operatorSet.add(defaultOperator ?? '=');
  operators.forEach(op => operatorSet.add(typeof op === 'string' ? op : op.operator));
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
  filteringProperties: readonly FilteringProperty[] = [],
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
    return {
      step: 'property',
      property,
      operator,
      // We need to remove the first leading space in case the user presses space
      // after the operator, for example: Owner: admin, will result in value of ` admin`
      // and we need to remove the first space, if the user added any more spaces only the
      // first one will be removed.
      value: trimFirstSpace(textWithoutPropertyAndOperator),
    };
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
  filteringProperty: FilteringProperty,
  filteringOptions: readonly FilteringOption[]
) => {
  return filteringOptions.filter(option => option.propertyKey === filteringProperty.key);
};

interface OptionGroup<T> {
  label: string;
  options: T[];
}

interface ExtendedAutosuggestOption extends AutosuggestProps.Option {
  tokenValue: string;
}

export const getAllValueSuggestions = (
  filteringOptions: readonly FilteringOption[],
  filteringProperties: readonly FilteringProperty[],
  operator: ComparisonOperator | undefined = '=',
  i18nStrings: I18nStrings,
  customGroupsText: readonly GroupText[]
) => {
  const defaultGroup: OptionGroup<ExtendedAutosuggestOption> = {
    label: i18nStrings.groupValuesText,
    options: [],
  };
  const customGroups: { [K in string]: OptionGroup<ExtendedAutosuggestOption> } = {};
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
    if (property.group && !customGroups[property.group]) {
      const label = customGroupsText.reduce<string>(
        (acc, customGroup) => (customGroup.group === property.group ? customGroup.values : acc),
        ''
      );
      customGroups[property.group] = {
        label,
        options: [],
      };
    }
    const propertyGroup = property.group ? customGroups[property.group] : defaultGroup;
    propertyGroup.options.push({
      tokenValue: property.propertyLabel + (operator || '=') + filteringOption.value,
      label: filteringOption.value,
      __labelPrefix: property.propertyLabel + ' ' + (operator || '='),
    });
  });
  return [defaultGroup, ...Object.keys(customGroups).map(group => customGroups[group])];
};

export const getPropertyByKey = (filteringProperties: readonly FilteringProperty[], key: string) => {
  const propertyMap = filteringProperties.reduce<{ [K: string]: FilteringProperty }>((acc, property) => {
    acc[property.key] = property;
    return acc;
  }, {});
  return propertyMap[key] as FilteringProperty | undefined;
};

const filteringPropertyToAutosuggestOption = (filteringProperty: FilteringProperty) => ({
  value: filteringProperty.propertyLabel,
  keepOpenOnSelect: true,
});

export function getPropertySuggestions<T>(
  filteringProperties: readonly FilteringProperty[],
  customGroupsText: readonly GroupText[],
  i18nStrings: I18nStrings,
  filteringPropertyToOption: (filteringProperty: FilteringProperty) => T
) {
  const defaultGroup: OptionGroup<T> = {
    label: i18nStrings.groupPropertiesText,
    options: [],
  };
  const customGroups: { [K in string]: OptionGroup<T> } = {};

  filteringProperties.forEach(filteringProperty => {
    const { group } = filteringProperty;
    let optionsGroup = defaultGroup;
    if (group) {
      if (!customGroups[group]) {
        const label = customGroupsText.reduce<string>(
          (acc, customGroup) => (customGroup.group === group ? customGroup.properties : acc),
          ''
        );
        customGroups[group] = { options: [], label };
      }
      optionsGroup = customGroups[group];
    }
    optionsGroup.options.push(filteringPropertyToOption(filteringProperty));
  });
  const defaultGroupArray = defaultGroup.options.length ? [defaultGroup] : [];
  const customGroupsArray = Object.keys(customGroups).map(groupKey => customGroups[groupKey]);
  return [...defaultGroupArray, ...customGroupsArray];
}

export const getAutosuggestOptions = (
  parsedText: ParsedText,
  filteringOptions: readonly FilteringOption[],
  filteringProperties: readonly FilteringProperty[],
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
            options: options.map(({ value }) => ({
              tokenValue: propertyLabel + parsedText.operator + value,
              label: value,
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

export const operatorToDescription = (operator: ComparisonOperator, i18nStrings: I18nStrings) => {
  const mapping: { [K in ComparisonOperator]: string } = {
    ['<']: i18nStrings.operatorLessText,
    ['<=']: i18nStrings.operatorLessOrEqualText,
    ['>']: i18nStrings.operatorGreaterText,
    ['>=']: i18nStrings.operatorGreaterOrEqualText,
    [':']: i18nStrings.operatorContainsText,
    ['!:']: i18nStrings.operatorDoesNotContainText,
    ['=']: i18nStrings.operatorEqualsText,
    ['!=']: i18nStrings.operatorDoesNotEqualText,
  };
  return mapping[operator];
};
