// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import selectors from '../../../rich-text-editor/styles.selectors.js';

export default class RichTextEditorWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.root;

  /**
   * Finds the editable (contenteditable) region.
   */
  findContent(): ElementWrapper<HTMLDivElement> {
    return this.find<HTMLDivElement>(`.${selectors.content}`)!;
  }

  /**
   * Finds the formatting toolbar. Returns `null` when the component is read-only.
   */
  findToolbar(): ElementWrapper | null {
    return this.findByClassName(selectors.toolbar);
  }

  /**
   * Finds all toolbar buttons.
   */
  findToolbarButtons(): Array<ElementWrapper<HTMLButtonElement>> {
    return this.findAllByClassName<HTMLButtonElement>(selectors['toolbar-button']);
  }

  /**
   * Finds a specific toolbar button by its control name (e.g. `"bold"`).
   */
  findToolbarButton(control: string): ElementWrapper<HTMLButtonElement> | null {
    return this.find<HTMLButtonElement>(`.${selectors['toolbar-button']}[data-control="${control}"]`);
  }

  /**
   * Returns the current value of the editor as an HTML string.
   */
  @usesDom getValue(): string {
    return this.findContent().getElement().innerHTML;
  }
}
