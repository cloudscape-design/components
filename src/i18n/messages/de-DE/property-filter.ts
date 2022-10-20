// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PropertyFilterI18n } from '../../interfaces';

const messages: PropertyFilterI18n = {
  i18nStrings: {
    allPropertiesLabel: 'Alle Immobilien',
    applyActionText: 'Anwenden',
    cancelActionText: 'Abbrechen',
    clearFiltersText: 'Filter löschen',
    dismissAriaLabel: 'Verwerfen',
    editTokenHeader: 'Token bearbeiten',
    enteredTextLabel: ({ text }) => `Verwenden: "${text}"`,
    filteringAriaLabel: 'Deine Wahl',
    groupPropertiesText: 'Eigenschaften',
    groupValuesText: 'Werte',
    operationAndText: 'und',
    operationOrText: 'oder',
    operatorContainsText: 'Enthält',
    operatorDoesNotContainText: 'Enthält keine',
    operatorDoesNotEqualText: 'nicht gleich',
    operatorEqualsText: 'Gleich',
    operatorGreaterOrEqualText: 'größer als oder gleich',
    operatorGreaterText: 'Größer als',
    operatorLessOrEqualText: 'kleiner als oder gleich',
    operatorLessText: 'Kleiner als',
    operatorText: 'Operator',
    operatorsText: 'Betreiber',
    propertyText: 'Eigenschaft',
    removeTokenButtonAriaLabel: 'Token entfernen',
    tokenLimitShowFewer: 'Zeige weniger',
    tokenLimitShowMore: 'Mehr zeigen',
    valueText: 'Wert',
  },
  filteringPlaceholder: 'Suchen',
};

export default messages;
