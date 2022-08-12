// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Axe from 'axe-core';
import { HtmlValidate } from 'html-validate';
import { uniq } from 'lodash';
import { runOptions, spec } from './axe';

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace jest {
    /* eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars */
    interface Matchers<R, T = {}> {
      toValidateA11y(): Promise<R>;
    }
  }
}

Axe.configure(spec);

const htmlValidator = new HtmlValidate();

async function toValidateA11y(this: jest.MatcherUtils, element: HTMLElement) {
  // Disable color-contrast checks as unavailable in unit test environment.
  const axeResult = await Axe.run(element, { ...runOptions, rules: { 'color-contrast': { enabled: false } } });
  const htmlValidateResult = htmlValidator.validateString(element.outerHTML);

  const pass = axeResult.violations.length === 0 && axeResult.incomplete.length === 0 && htmlValidateResult.valid;
  if (pass) {
    return { pass, message: () => 'OK' };
  }

  const generateMessage = () => {
    const htmlViolations = (htmlValidateResult.results[0]?.messages || []).map(
      message => `${message.message} [${message.ruleId}]`
    );
    const axeViolations = axeResult.violations
      .concat(axeResult.incomplete)
      .flatMap(violation => violation.nodes.map(node => `${node.failureSummary} [${violation.id}]`));
    const allViolations = uniq([...htmlViolations, ...axeViolations]).map(
      (message, index) => `${index + 1}. ${message}`
    );
    return ['Expected HTML to be valid but had the following errors:', ''].concat(allViolations).join('\n');
  };

  return { pass, message: generateMessage };
}

expect.extend({
  toValidateA11y,
});
