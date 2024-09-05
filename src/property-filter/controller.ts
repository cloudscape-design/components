// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AutosuggestProps } from '../autosuggest/interfaces';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { I18nStringsOperators, operatorToDescription } from './i18n-utils';
import {
  ComparisonOperator,
  GroupText,
  I18nStrings,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  InternalQuery,
  InternalToken,
  InternalTokenGroup,
  JoinOperation,
  ParsedText,
  Query,
  Token,
  TokenGroup,
} from './interfaces';
import {
  matchFilteringProperty,
  matchOperator,
  matchOperatorPrefix,
  matchTokenValue,
  removeOperator,
  tokenGroupToTokens,
  trimStart,
} from './utils';

type I18nStringsController = I18nStringsOperators &
  Pick<I18nStrings, 'operatorsText' | 'groupPropertiesText' | 'groupValuesText'>;

export const getQueryActions = ({
  query,
  onChange,
  filteringOptions,
  enableTokenGroups,
}: {
  query: InternalQuery;
  onChange: NonCancelableEventHandler<Query>;
  filteringOptions: readonly InternalFilteringOption[];
  enableTokenGroups: boolean;
}) => {
  const setQuery = (query: InternalQuery) => {
    function transformToken(token: InternalToken | InternalTokenGroup): Token | TokenGroup {
      if ('operator' in token) {
        return matchTokenValue(token, filteringOptions);
      }
      return { ...token, tokens: token.tokens.map(transformToken) };
    }
    const tokens = query.tokens.map(transformToken);

    if (enableTokenGroups) {
      fireNonCancelableEvent(onChange, { tokens: [], operation: query.operation, tokenGroups: tokens });
    } else {
      fireNonCancelableEvent(onChange, { tokens: tokenGroupToTokens<Token>(tokens), operation: query.operation });
    }
  };

  const addToken = (token: InternalToken) => {
    setQuery({ ...query, tokens: [...query.tokens, token] });
  };

  const updateToken = (
    updateIndex: number,
    updatedToken: InternalToken | InternalTokenGroup,
    releasedTokens: InternalToken[]
  ) => {
    const nestedTokens = tokenGroupToTokens<InternalToken>([updatedToken]);
    const capturedTokenIndices = nestedTokens.map(token => token.standaloneIndex).filter(index => index !== undefined);
    const tokens = query.tokens
      .map((token, index) => (index === updateIndex ? updatedToken : token))
      .filter((_, index) => index === updateIndex || !capturedTokenIndices.includes(index));
    tokens.push(...releasedTokens);
    setQuery({ ...query, tokens });
  };

  const removeToken = (removeIndex: number) => {
    setQuery({ ...query, tokens: query.tokens.filter((_, index) => index !== removeIndex) });
  };

  const removeAllTokens = () => {
    setQuery({ ...query, tokens: [] });
  };

  const updateOperation = (operation: JoinOperation) => {
    setQuery({ ...query, operation });
  };

  return { addToken, updateToken, updateOperation, removeToken, removeAllTokens };
};

export const getAllowedOperators = (property: InternalFilteringProperty): ComparisonOperator[] => {
  const { operators = [], defaultOperator } = property;
  const operatorOrder = ['=', '!=', ':', '!:', '^', '!^', '>=', '<=', '<', '>'] as const;
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
  filteringProperties: readonly InternalFilteringProperty[],
  freeTextFiltering: InternalFreeTextFiltering
): ParsedText => {
  const property = matchFilteringProperty(filteringProperties, filteringText);
  if (!property) {
    if (!freeTextFiltering.disabled) {
      // For free text filtering, we allow ! as a shortcut for !:
      const freeTextOperators =
        freeTextFiltering.operators.indexOf('!:') >= 0
          ? ['!', ...freeTextFiltering.operators]
          : freeTextFiltering.operators;
      const operator = matchOperator(freeTextOperators, filteringText);
      if (operator) {
        return {
          step: 'free-text',
          operator: operator === '!' ? '!:' : operator,
          value: removeOperator(filteringText, operator),
        };
      }
    }

    return {
      step: 'free-text',
      value: filteringText,
    };
  }

  const allowedOps = getAllowedOperators(property);

  const textWithoutProperty = filteringText.substring(property.propertyLabel.length);
  const operator = matchOperator(allowedOps, trimStart(textWithoutProperty));
  if (operator) {
    return {
      step: 'property',
      property,
      operator,
      value: removeOperator(textWithoutProperty, operator),
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

interface OptionGroup<T> {
  label: string;
  options: T[];
}

export const getAllValueSuggestions = (
  filteringOptions: readonly InternalFilteringOption[],
  operator: ComparisonOperator | undefined = '=',
  i18nStrings: I18nStringsController,
  customGroupsText: readonly GroupText[]
) => {
  const defaultGroup: OptionGroup<AutosuggestProps.Option> = {
    label: i18nStrings.groupValuesText ?? '',
    options: [],
  };
  const customGroups: { [K in string]: OptionGroup<AutosuggestProps.Option> } = {};
  filteringOptions.forEach(filteringOption => {
    const property = filteringOption.property;
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

const filteringPropertyToAutosuggestOption = (filteringProperty: InternalFilteringProperty) => ({
  value: filteringProperty.propertyLabel,
  label: filteringProperty.propertyLabel,
  keepOpenOnSelect: true,
});

export function getPropertySuggestions<T>(
  filteringProperties: readonly InternalFilteringProperty[],
  customGroupsText: readonly GroupText[],
  i18nStrings: I18nStringsController,
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
  filteringProperties: readonly InternalFilteringProperty[],
  filteringOptions: readonly InternalFilteringOption[],
  customGroupsText: readonly GroupText[],
  i18nStrings: I18nStringsController
) => {
  switch (parsedText.step) {
    case 'property': {
      const { propertyLabel, groupValuesLabel } = parsedText.property;
      const options = filteringOptions.filter(o => o.property === parsedText.property);
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
            ? getAllValueSuggestions(filteringOptions, parsedText.operator, i18nStrings, customGroupsText)
            : []),
        ],
      };
    }
  }
};
