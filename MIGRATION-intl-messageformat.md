# Migration: Removing `intl-messageformat` runtime dependency

## Summary

`intl-messageformat` (~50 kB gzipped) has been removed as a runtime dependency.
Cloudscape now ships a zero-dependency, inline ICU-subset parser that covers
every pattern used in the built-in message catalogues.

## What changed

| Before | After |
|---|---|
| `"intl-messageformat": "^10.3.1"` in `package.json` | Removed |
| `I18nMessages` values accepted `string \| MessageFormatElement[]` | Values must be plain `string` |
| `@formatjs/icu-messageformat-parser` pulled in transitively | No longer installed |

## Impact on consumers

### Most consumers: no action required

If you pass plain ICU strings to `I18nProvider` (the documented usage), nothing
changes. Your existing message files continue to work exactly as before.

### Pre-parsed `MessageFormatElement[]` arrays

If you were passing pre-parsed `MessageFormatElement[]` values (from
`@formatjs/icu-messageformat-parser`) as message values, you must switch to
plain ICU strings:

```ts
// Before (no longer accepted at the type level)
import { parse } from '@formatjs/icu-messageformat-parser';
const messages = {
  'my-ns': { en: { 'my-comp': { myKey: parse('{count, plural, one {item} other {items}}') } } }
};

// After
const messages = {
  'my-ns': { en: { 'my-comp': { myKey: '{count, plural, one {item} other {items}}' } } }
};
```

### Supported ICU subset

The built-in parser supports:

- **Simple substitution** — `{varName}`
- **Select** — `{varName, select, caseA {…} other {…}}`
- **Plural** — `{varName, plural, zero {…} one {…} other {…}}`
- **Nested constructs** — any combination of the above, arbitrarily nested

This covers 100 % of the ICU patterns present in the Cloudscape message
catalogues. Advanced ICU features (number/date formatting, ordinal plural
rules, offset, etc.) are not used by Cloudscape and are not supported.

### Bundle size

Removing `intl-messageformat` and its `@formatjs` transitive dependencies saves
approximately **50 kB gzipped** from the production bundle of any application
that imports `@cloudscape-design/components`.
