// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

test(
  'contains version info',
  useBrowser(async browser => {
    // Navigate to the root URL of the application
    await browser.url('/');

    // Execute a script in the browser to retrieve awsuiVersions
    const awsuiVersions = await browser.execute(() => (window as any).awsuiVersions);

    // Check that awsuiVersions is defined
    expect(awsuiVersions).toBeDefined();

    // Check that awsuiVersions has a components property
    expect(awsuiVersions).toHaveProperty('components');
    
    // Check that components is an array with at least one string
    expect(Array.isArray(awsuiVersions.components)).toBe(true);
    expect(awsuiVersions.components.length).toBeGreaterThan(0);
    expect(typeof awsuiVersions.components[0]).toBe('string');
  })
);