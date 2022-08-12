// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Axe from 'axe-core';
import { HtmlValidate } from 'html-validate';
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

  const pass = axeResult.passes && htmlValidateResult.valid;

  return { pass, message: () => (pass ? 'OK' : 'NOK') };
}

expect.extend({
  toValidateA11y,
});
