// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import "@testing-library/jest-dom/vitest";

import axe from "axe-core";
import { expect } from "vitest";

// Registers the `toValidateA11y` matcher used by the a11y suites. It runs
// axe-core against a rendered container and fails with the collected
// violations, mirroring the Cloudscape components test setup.
expect.extend({
  async toValidateA11y(received: HTMLElement) {
    const results = await axe.run(received, {
      rules: {
        // Colour-contrast relies on real computed styles and is unreliable
        // under jsdom, so it is disabled for component-level checks.
        "color-contrast": { enabled: false },
      },
    });
    const pass = results.violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "expected the element to have accessibility violations"
          : "expected the element to have no accessibility violations, but found:\n" +
            results.violations
              .map(violation => `  - [${violation.id}] ${violation.help} (${violation.nodes.length} node(s))`)
              .join("\n"),
    };
  },
});
