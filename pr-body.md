## Description

Removes the `@awsuiSystem core` restriction from the `renderItem` prop on `ButtonDropdown`, making it available across all Cloudscape systems (not just Core).

## Motivation

This addresses [AWSUI-61530](https://sim.amazon.com/issues/AWSUI-61530) — a contribution request to support the "Announcing new features" pattern in button dropdowns. Teams like Amazon Bedrock and EC2 ([AWSUI-60642](https://sim.amazon.com/issues/AWSUI-60642)) need to add italicized "- *New*" labels to dropdown items to surface new options.

With `renderItem` available on all systems, consumers can customize item rendering to include these labels without requiring any new component API surface.

## Changes

- Removed `@awsuiSystem core` JSDoc tag from `renderItem` in `src/button-dropdown/interfaces.ts`

## Testing

No behavioral changes — this only removes a system restriction tag. All existing tests continue to pass.
