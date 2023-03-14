// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FileUploadProps } from './interfaces';

export function getBaseMetadata(customMetadata: FileUploadProps.FileMetadata = {}): FileUploadProps.FileMetadata {
  return {
    type: false,
    size: 'BYTES',
    lastModified: false,
    thumbnail: false,
    ...customMetadata,
  };
}

export function isImageFile(file: File): boolean {
  return !!file.type && file.type.split('/')[0] === 'image';
}

// TODO: use i18n
export function formatFileSize(size: number, metadata: FileUploadProps.FileMetadata): React.ReactNode {
  if (!metadata.size || !size) {
    return null;
  }
  const convertedSize = bytesToUnit(metadata.size, size).toFixed(2);
  return `${convertedSize} ${metadata.size}`;
}

function getBrowserLocale() {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}

function checkLocale(locale: string | null | undefined): string {
  if (!locale || locale === '') {
    return '';
  }
  locale = locale && locale.replace(/^([a-z]{2})_/, '$1-');
  if (locale && !/^[a-z]{2}(-[A-Z]{2})?$/.exec(locale)) {
    locale = '';
  }
  return locale;
}

function mergeLocales(locale: string, fullLocale: string): string {
  const isShort = locale.length === 2;
  if (isShort && fullLocale.indexOf(locale) === 0) {
    return fullLocale;
  }
  return locale;
}

function normalizeLocale(locale: string | undefined): string {
  locale = checkLocale(locale);
  const browserLocale = getBrowserLocale();
  if (locale) {
    return mergeLocales(locale, browserLocale);
  }
  let htmlLocale;
  const html = document ? document.querySelector('html') : null;
  if (html) {
    htmlLocale = checkLocale(html.getAttribute('lang'));
  }
  if (htmlLocale) {
    return mergeLocales(htmlLocale, browserLocale);
  }
  return browserLocale;
}

export function formatFileLastModified(rawDate: number, metadata: FileUploadProps.FileMetadata): React.ReactNode {
  if (!metadata.lastModified || !rawDate) {
    return null;
  }
  const date = new Date(rawDate);
  const locale = normalizeLocale(metadata.lastModifiedLocale);
  const dateStr = date.toLocaleDateString(locale, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    hour12: false,
  });
  return `${dateStr} ${timeStr}`;
}

function bytesToUnit(unit: FileUploadProps.FileSize, bytes: number): number {
  switch (unit) {
    // Decimal
    case 'KB': {
      return bytes / 1000;
    }
    case 'MB': {
      return bytes / 1000 ** 2;
    }
    case 'GB': {
      return bytes / 1000 ** 3;
    }
    // Binary
    case 'KIB': {
      return bytes / 1024;
    }
    case 'MIB': {
      return bytes / 1024 ** 2;
    }
    case 'GIB': {
      return bytes / 1024 ** 3;
    }
    // Default
    case 'BYTES':
    default: {
      return bytes;
    }
  }
}
