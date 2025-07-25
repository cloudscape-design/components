// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Axe from 'axe-core';
import { HtmlValidate } from 'html-validate';
import { compact, uniq } from 'lodash';

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
    'prefer-native-element': ['error', { exclude: ['listbox', 'button', 'region'] }],
    // innerHTML normalizes attribute values
    // https://stackoverflow.com/questions/48092293/javascript-innerhtml-messing-with-html-attributes
    'attribute-boolean-style': 'off',
  },
});

// Polyfill for Array.prototype.flatMap
function flatMap<Input, Output>(arr: ReadonlyArray<Input>, fn: (t: Input) => Output[]) {
  return arr.reduce((acc: Output[], item: Input) => {
    for (const flatItem of fn(item)) {
      acc.push(flatItem);
    }
    return acc;
  }, []);
}

function formatMessages(prefix: string, messages: Array<string>) {
  if (messages.length === 0) {
    return '';
  }
  return (
    prefix +
    '\n' +
    uniq(messages)
      .map((message, index) => `${index + 1}. ${message}`)
      .join('\n')
  );
}

async function toValidateA11y(this: jest.MatcherUtils, element: HTMLElement) {
  if (!(element instanceof HTMLElement)) {
    // Improve default Axe.run parameters check
    throw new Error('Provided value is not a valid HTMLElement');
  }
  // Disable color-contrast checks as unavailable in unit test environment.
  const axeResult = await Axe.run(element, { ...runOptions, rules: { 'color-contrast': { enabled: false } } });

  const htmlValidateResult = htmlValidator.validateString(element.outerHTML);

  const axeViolations = getAxeViolations(axeResult);
  const pass = axeViolations.length === 0 && htmlValidateResult.valid;
  if (pass) {
    return { pass, message: () => 'OK' };
  }

  const generateMessage = () => {
    const htmlViolations = (htmlValidateResult.results[0]?.messages || []).map(
      message => `${message.message} [${message.ruleId}]`
    );
    // TODO: remove polyfill with es2019 support
    const flattenAxeViolations = flatMap(axeViolations, violation =>
      violation.nodes.map(node => `[${violation.id}] ${node.failureSummary} Selector: ${node.target}`)
    );

    return compact(
      ['Expected HTML to be valid but had the following errors:'].concat(
        formatMessages('HTML validation', htmlViolations),
        formatMessages('Axe checks', flattenAxeViolations)
      )
    ).join('\n');
  };

  return { pass, message: generateMessage };
}

function getAxeViolations(result: Axe.AxeResults) {
  return ignoreAriaRequiredChildren([...result.violations, ...result.incomplete]);
}

// As per https://accessibilityinsights.io/info-examples/web/aria-required-children,
// some roles require children. For example, a role="listbox" requires "group" or "option" children.
// However, we are currently using empty list elements with aria-description pointing to the footer status text.
function ignoreAriaRequiredChildren(axeViolations: Axe.Result[]) {
  return axeViolations.filter(result => result.id !== 'aria-required-children');
}

expect.extend({
  toValidateA11y,
});
