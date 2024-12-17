// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

// Workaround until scrollbars are generally shown in tests (AWSUI-59983)

interface Options {
  width?: number;
  height?: number;
}

interface TestFunction {
  (browser: WebdriverIO.Browser): Promise<void> | void;
}

const flags = [
  // Same array as in
  // https://github.com/cloudscape-design/browser-test-tools/blob/4aaed9e410b13e05a7d5dbace17231776d250b97/src/browsers/capabilities.ts
  // but without --hide-scrollbar.
  '--disable-background-timer-throttling',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-cloud-import',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-gesture-typing',
  '--disable-hang-monitor',
  '--disable-infobars',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-offer-upload-credit-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--disable-tab-for-desktop-share',
  '--disable-translate',
  '--disable-voice-input',
  '--disable-wake-on-wifi',
  '--disk-cache-size=33554432',
  '--enable-async-dns',
  '--enable-simple-cache-backend',
  '--enable-tcp-fast-open',
  '--enable-webgl',
  '--ignore-gpu-blacklist',
  '--media-cache-size=33554432',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-zygote',
  '--password-store=basic',
  '--prerender-from-omnibox=disabled',
  '--no-sandbox',
  '--disable-gpu',
  '--headless=new',
];

// Based on browser-test-tools:
// https://github.com/cloudscape-design/browser-test-tools/blob/4aaed9e410b13e05a7d5dbace17231776d250b97/src/use-browser.ts#L35-L65
// These changes will be integrated in browser-test-tools and removed from here.
function useBrowserWithScrollbars(optionsOverride: Options, testFn: TestFunction): () => Promise<void>;
function useBrowserWithScrollbars(testFn: TestFunction): () => Promise<void>;
function useBrowserWithScrollbars(...args: [Options, TestFunction] | [TestFunction]) {
  const optionsOverride = args.length === 1 ? {} : args[0];
  const { width, height } = optionsOverride;
  const testFn = args.length === 1 ? args[0] : args[1];
  const options = {
    capabilities: {
      'goog:chromeOptions': {
        args: flags,
      },
    },
    width,
    height,
  };
  return useBrowser(options, testFn);
}

export const scrollbarThickness = 15;

export default useBrowserWithScrollbars;
