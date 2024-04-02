// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import * as Axe from 'axe-core';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import tableStyles from '../../lib/components/table/styles.selectors.js';
import { spec, runOptions } from './axe';

declare const axe: typeof Axe;

export default class A11yPageObject extends BasePageObject {
  getUndefinedTexts() {
    return this.browser.execute(function findUndefinedNodes() {
      const result = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL, null);
      let node;
      while ((node = walker.nextNode())) {
        if (node instanceof Element) {
          for (const attrName of node.getAttributeNames()) {
            const content = node.getAttribute(attrName);
            if (content && content.indexOf('undefined') > -1) {
              result.push(`${attrName}: ${content}`);
            }
          }
        }
        if (node instanceof Text && node.textContent && node.textContent.indexOf('undefined') > -1) {
          result.push(node.parentElement!.innerHTML);
        }
      }
      return result;
    });
  }

  async getAxeResults() {
    await this.browser.execute(fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'));
    type AxeResult = { result: Axe.AxeResults } | { error: Error };

    const runAxe = (
      options: Axe.ContextObject,
      spec: Axe.Spec,
      runOptions: Axe.RunOptions,
      done: (result: AxeResult) => void
    ) => {
      // Adding parts of spec that are not serializable.
      if (spec.checks) {
        // Skip color contrast results where the contrast ratio couldn't be calculated
        // and skip color contrast results due to orange vs white (known violation)
        spec.checks.push({
          id: 'color-contrast',
          after: (results: Axe.CheckResult[]) =>
            results
              .filter(result => result.data && result.data.bgColor && result.data.fgColor)
              .filter(result => !(result.data.bgColor === '#ec7211' && result.data.fgColor === '#ffffff'))
              .filter(result => !(result.data.bgColor === '#ffffff' && result.data.fgColor === '#ec7211')),
        });
      }

      axe.configure(spec);

      return axe.run(options, runOptions).then(
        result => done({ result }),
        error => done(error)
      );
    };
    // executeAsync has incorrect typings: https://github.com/webdriverio/webdriverio/issues/6206
    const response = (await this.browser.executeAsync(
      runAxe as any,
      {
        exclude: [
          // Our custom header and footer
          ['#h'],
          ['#f'],
          // ace editor (third-party)
          ['.ace_editor'],
          // Duplicate table for sticky table header
          [`.${tableStyles['header-secondary']}`],
          // Element added by focus trap library has a tabindex=1, which is a critical violation
          ['[data-focus-guard=true]'],
        ],
      } as Axe.ContextObject,
      spec,
      runOptions
    )) as AxeResult;

    if ('error' in response) {
      throw response.error;
    }

    return response.result;
  }

  public async assertNoAxeViolations() {
    const result = await this.getAxeResults();
    const violations = result.violations;
    const incomplete = result.incomplete.filter(ariaLevelViolationsFilter);

    expect(violations).toHaveLength(0);
    expect(incomplete).toHaveLength(0);

    // Report if there are any occurrences of string "undefined" in HTML.
    await expect(this.getUndefinedTexts()).resolves.toHaveLength(0);
  }
}

// The message says: "aria-level values greater than 6 are not supported in all screenreader and browser combinations".
// However, that is relevant for heading roles but not for treegrid. In treegrid there can be more levels of nesting.
function ariaLevelViolationsFilter(violation: Axe.Result) {
  return !(
    violation.id === 'aria-valid-attr-value' &&
    violation.nodes.every(node => node.all.every(entry => entry.id === 'aria-level')) &&
    violation.nodes.every(node => node.html.startsWith('<tr'))
  );
}
