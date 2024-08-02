// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import AutosuggestWrapper from '../autosuggest';
import ButtonWrapper from '../button';
import FormFieldWrapper from '../form-field';
import SelectWrapper from '../select';

import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import popoverStyles from '../../../popover/styles.selectors.js';
import styles from '../../../property-filter/styles.selectors.js';
import testUtilStyles from '../../../property-filter/test-classes/styles.selectors.js';
import textFilterStyles from '../../../text-filter/styles.selectors.js';

export default class PropertyFilterWrapper extends AutosuggestWrapper {
  static rootSelector = styles.root;

  findResultsCount(): ElementWrapper {
    return this.findByClassName(textFilterStyles.results)!;
  }

  findTokens(): Array<FilteringTokenWrapper> {
    return this.findAllByClassName(FilteringTokenWrapper.rootSelector).map(
      (elementWrapper: ElementWrapper) => new FilteringTokenWrapper(elementWrapper.getElement())
    );
  }

  /**
   * Returns the button that toggles if the tokens above `tokenLimit` are visible.
   */
  findTokenToggle(): ElementWrapper | null {
    return this.findByClassName(tokenListSelectors.toggle);
  }

  /**
   * Returns the button that removes all current tokens.
   */
  findRemoveAllButton(): ElementWrapper | null {
    return this.findByClassName(styles['remove-all']);
  }

  /**
   * Returns the element containing the `customControl` slot.
   */
  findCustomControl(): ElementWrapper | null {
    return this.findByClassName(styles['custom-control']);
  }

  /**
   * Returns the element containing the `customFilterActions` slot.
   */
  findCustomFilterActions(): ElementWrapper | null {
    return this.findByClassName(styles['custom-filter-actions']);
  }

  /**
   * Returns the element containing the `filteringConstraintText` slot.
   */
  findConstraint(): ElementWrapper | null {
    return this.findByClassName(styles.constraint);
  }
}

export class FilteringTokenWrapper extends ComponentWrapper {
  static rootSelector = testUtilStyles['filtering-token'];

  findLabel(): ElementWrapper {
    return this.findByClassName(testUtilStyles['filtering-token-content'])!.findByClassName(popoverStyles.trigger)!;
  }

  findRemoveButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testUtilStyles['filtering-token-dismiss-button'])!;
  }

  findTokenOperation(): SelectWrapper | null {
    return this.findComponent(`.${testUtilStyles['filtering-token-select']}`, SelectWrapper);
  }

  /**
   * Returns dropdown content of editing token if opened or `null` otherwise.
   */
  findEditorDropdown(options = { expandToViewport: false }): null | PropertyFilterEditorDropdownWrapper {
    const root = options.expandToViewport ? createWrapper() : this;
    const popoverBody = root.findByClassName(popoverStyles.body);
    return popoverBody ? new PropertyFilterEditorDropdownWrapper(popoverBody.getElement()) : null;
  }
}

// The internal wrapper has two extra methods that are not available publicly
// until the property filter token grouping is supported.
export class InternalFilteringTokenWrapper extends FilteringTokenWrapper {
  findEditButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testUtilStyles['filtering-token-edit-button'])!;
  }

  findGroupTokens(): Array<FilteringGroupedTokenWrapper> {
    return this.findAllByClassName(testUtilStyles['filtering-token-inner']).map(
      w => new FilteringGroupedTokenWrapper(w.getElement())
    );
  }
}

export class FilteringGroupedTokenWrapper extends ComponentWrapper {
  static rootSelector = testUtilStyles['filtering-token-inner'];

  findLabel(): ElementWrapper {
    return this.findByClassName(testUtilStyles['filtering-token-inner-content'])!;
  }

  findRemoveButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(testUtilStyles['filtering-token-inner-dismiss-button'])!;
  }

  findTokenOperation(): SelectWrapper | null {
    return this.findComponent(`.${testUtilStyles['filtering-token-inner-select']}`, SelectWrapper);
  }
}

export class PropertyFilterEditorDropdownWrapper extends ComponentWrapper {
  findHeader(): ElementWrapper {
    return this.findByClassName(popoverStyles.header)!;
  }

  findDismissButton(): ButtonWrapper {
    return this.findComponent(`.${popoverStyles['dismiss-control']}`, ButtonWrapper)!;
  }

  findForm(): ElementWrapper {
    return this.findByClassName(styles['token-editor-form'])!;
  }

  findPropertyField(): FormFieldWrapper {
    return this.findComponent(`.${testUtilStyles['token-editor-field-property']}`, FormFieldWrapper)!;
  }

  findOperatorField(): FormFieldWrapper {
    return this.findComponent(`.${testUtilStyles['token-editor-field-operator']}`, FormFieldWrapper)!;
  }

  findValueField(): FormFieldWrapper {
    return this.findComponent(`.${testUtilStyles['token-editor-field-value']}`, FormFieldWrapper)!;
  }

  findCancelButton(): ButtonWrapper {
    return this.findComponent(`.${testUtilStyles['token-editor-cancel']}`, ButtonWrapper)!;
  }

  findSubmitButton(): ButtonWrapper {
    return this.findComponent(`.${testUtilStyles['token-editor-submit']}`, ButtonWrapper)!;
  }
}
