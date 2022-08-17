// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Axe from 'axe-core';
import { HtmlValidate } from 'html-validate';
import { uniq } from 'lodash';
import { runOptions, spec } from './axe';

declare global {
  namespace jest {
    interface Matchers<R> {
      toValidateA11y(): Promise<R>;
    }
  }
}

Axe.configure(spec);

const htmlValidator = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    // set relaxed to exclude error that id does not begin with letter
    'valid-id': ['error', { relaxed: true }],
    'no-inline-style': 'off',
    'prefer-native-element': ['error', { exclude: ['listbox'] }],
    //TODO: enable 'no-redundant-for' and 'element-permitted-content' after fixing Toggle
    'no-redundant-for': 'off',
    'element-permitted-content': 'off',
  },
});

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
    return ['Expected HTML to be valid but had the following errors:'].concat(allViolations).join('\n');
  };

  return { pass, message: generateMessage };
}

expect.extend({
  toValidateA11y,
});
