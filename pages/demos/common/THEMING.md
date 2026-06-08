# Cloudscape Runtime Theming Implementation

This project implements Cloudscape's runtime theming capability to customize the visual appearance of components.

## Files

- `theme-core.ts` - Theme definition with custom design tokens
- `apply-theme.ts` - Utility function to apply the theme (optional helper)

## Theme Structure

The theme is defined in `theme-core.ts` and follows Cloudscape's theming API:

```typescript
export const themeCoreConfig = {
  tokens: {
    // Global token overrides for light and dark modes
    colorBorderButtonNormalDefault: {
      light: '#232f3e',
      dark: '#e9ebed',
    },
    // ... more tokens
  },
  contexts: {
    // Context-specific overrides
    header: {
      tokens: {
        // Tokens specific to header context
      },
    },
    'app-layout-toolbar': {
      // Tokens for app layout toolbar
    },
    flashbar: {
      // Tokens for flashbar notifications
    },
  },
};
```

## Usage

The theme is applied in each demo page's `index.tsx` file before rendering:

```typescript
import { applyTheme } from '@cloudscape-design/components/theming';
import { themeCoreConfig } from '../../common/theme-core';

applyTheme({ theme: themeCoreConfig });

createRoot(document.getElementById('app')!).render(<App />);
```

## Customization

To customize the theme:

1. Edit `src/common/theme-core.ts`
2. Modify token values for light/dark modes
3. Add or remove context-specific overrides
4. Changes will apply to all demo pages

## Available Contexts

- `header` - Dark header area (high contrast header variant)
- `top-navigation` - Top navigation component
- `app-layout-toolbar` - App layout toolbar area
- `flashbar` - Flashbar notifications
- `alert` - Alert components

## Token Categories

- **Color tokens** - Can have light/dark mode values
- **Border radius tokens** - Applied globally (e.g., `borderRadiusButton`)
- **Typography tokens** - Font families applied globally

## Resources

- [Cloudscape Theming Documentation](https://cloudscape.design/foundation/visual-foundation/theming/)
- [Design Tokens Reference](https://cloudscape.design/foundation/visual-foundation/design-tokens/)
