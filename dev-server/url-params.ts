// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * URL parameters interface for configuring demo page rendering
 */
export interface URLParams {
  visualRefresh: boolean;
  density: 'comfortable' | 'compact';
  motionDisabled: boolean;
  direction: 'ltr' | 'rtl';
  mode: 'light' | 'dark';
  appLayoutWidget: boolean;
  appLayoutToolbar: boolean;
}

/**
 * Default values for URL parameters
 * Note: visualRefresh defaults to true to match the behavior of the non-SSR dev server
 * when THEME === 'default' (which is the case for the built components)
 */
export const defaultURLParams: URLParams = {
  visualRefresh: true,
  density: 'comfortable',
  motionDisabled: false,
  direction: 'ltr',
  mode: 'light',
  appLayoutWidget: false,
  appLayoutToolbar: false,
};

/**
 * Parse a boolean value from a string or boolean
 */
function parseBoolean(value: string | boolean | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return value === 'true';
}

/**
 * Parse URL query parameters into URLParams object
 * @param query - Query string or URLSearchParams or plain object
 * @returns Parsed URL parameters with defaults applied
 */
export function parseURLParams(query: string | URLSearchParams | Record<string, string | undefined>): URLParams {
  let params: Record<string, string | undefined>;

  if (typeof query === 'string') {
    // Handle query string (with or without leading ?)
    const searchParams = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    params = Object.fromEntries(searchParams.entries());
  } else if (query instanceof URLSearchParams) {
    params = Object.fromEntries(query.entries());
  } else {
    params = query;
  }

  return {
    visualRefresh: parseBoolean(params.visualRefresh, defaultURLParams.visualRefresh),
    density: params.density === 'compact' ? 'compact' : defaultURLParams.density,
    motionDisabled: parseBoolean(params.motionDisabled, defaultURLParams.motionDisabled),
    direction: params.direction === 'rtl' ? 'rtl' : defaultURLParams.direction,
    mode: params.mode === 'dark' ? 'dark' : defaultURLParams.mode,
    appLayoutWidget: parseBoolean(params.appLayoutWidget, defaultURLParams.appLayoutWidget),
    appLayoutToolbar: parseBoolean(params.appLayoutToolbar, defaultURLParams.appLayoutToolbar),
  };
}

/**
 * Format URL parameters back to a query string
 * Only includes non-default values
 */
export function formatURLParams(params: Partial<URLParams>): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const defaultValue = defaultURLParams[key as keyof URLParams];
    if (value !== defaultValue && value !== undefined) {
      query.set(key, String(value));
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}
