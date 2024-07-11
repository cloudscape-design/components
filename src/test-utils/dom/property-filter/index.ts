// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../property-filter/styles.selectors.js';
import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import textFilterStyles from '../../../text-filter/styles.selectors.js';
import AutosuggestWrapper from '../autosuggest';
import FilteringTokenWrapper from '../internal/filtering-token';
import ButtonWrapper from '../button';
import FormFieldWrapper from '../form-field';

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

  findEditorDropdown(): null | PropertyFilterEditorDropdownWrapper {
    return this.findComponent(`.${styles['token-editor']}`, PropertyFilterEditorDropdownWrapper);
  }
}

export class PropertyFilterEditorDropdownWrapper extends ComponentWrapper {
  static rootSelector = styles['token-editor'];

  findPropertyField(): FormFieldWrapper {
    return this.findComponent(`.${styles['token-editor-field-property']}`, FormFieldWrapper)!;
  }

  findOperatorField(): FormFieldWrapper {
    return this.findComponent(`.${styles['token-editor-field-operator']}`, FormFieldWrapper)!;
  }

  findValueField(): FormFieldWrapper {
    return this.findComponent(`.${styles['token-editor-field-operator']}`, FormFieldWrapper)!;
  }

  findCancelButton(): ButtonWrapper {
    return this.findComponent(`.${styles['token-editor-cancel']}`, ButtonWrapper)!;
  }

  findSubmitButton(): ButtonWrapper {
    return this.findComponent(`.${styles['token-editor-submit']}`, ButtonWrapper)!;
  }
}
