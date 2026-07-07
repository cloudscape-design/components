/**
 * @jest-environment node
 */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');

const rule = require('../no-internal-in-public-interfaces');

const ruleTester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2020, sourceType: 'module' },
});

// A public component interface file (the contract applies here).
const PUBLIC = 'src/foo/interfaces.ts';
const PUBLIC_TSX = 'src/foo/interfaces.tsx';
// Locations where internal types legitimately live (the rule must be a no-op).
const INTERNAL_INTERFACES = 'src/foo/internal-interfaces.ts';
const INTERNAL_DIR = 'src/internal/foo/interfaces.ts';
const NESTED_INTERFACES = 'src/app-layout/visual-refresh-toolbar/interfaces.ts';

ruleTester.run('no-internal-in-public-interfaces', rule, {
  valid: [
    // Public types declared in a public interface file are fine.
    { code: 'export interface FooProps { id: string; }', filename: PUBLIC },
    { code: 'export type Variant = "a" | "b";', filename: PUBLIC },
    { code: 'export type FooProps = { id: string };', filename: PUBLIC_TSX },
    // Allowed sources: another component's interfaces, src/types, and external packages.
    {
      code: "import { BarProps } from '../bar/interfaces';\nexport interface FooProps extends BarProps {}",
      filename: PUBLIC,
    },
    {
      code: "import { BaseComponentProps } from '../types/base-component';\nexport interface FooProps extends BaseComponentProps {}",
      filename: PUBLIC,
    },
    {
      code: "import { SomeRequired } from '../types/utils';\nexport type X = SomeRequired<{ a?: 1 }, 'a'>;",
      filename: PUBLIC,
    },
    { code: "import React from 'react';\nexport interface FooProps { node: React.ReactNode; }", filename: PUBLIC },
    { code: "import { Ace } from 'ace-builds';\nexport type X = Ace.Editor;", filename: PUBLIC },
    {
      code: "import { PortalProps } from '@cloudscape-design/component-toolkit/internal';\nexport interface FooProps { p: PortalProps; }",
      filename: PUBLIC,
    },
    // Re-exporting from an allowed source is fine.
    { code: "export { BarProps } from '../bar/interfaces';", filename: PUBLIC },
    { code: "export type { Breakpoint } from '../types/breakpoint';", filename: PUBLIC },
    // Aliasing a public imported type to a local Internal* name is fine (the declared/exported name is public).
    {
      code: "import { Breakpoint as InternalBreakpoint } from '../types/breakpoint';\nexport type Breakpoint = InternalBreakpoint;",
      filename: PUBLIC,
    },
    // The rule is a no-op outside public interface files.
    {
      code: "import { InternalBaseComponentProps } from '../internal/base-component';\nimport { ItemProps } from './internal-interfaces';\nexport interface InternalFooProps extends InternalBaseComponentProps {}",
      filename: INTERNAL_INTERFACES,
    },
    { code: "import { Foo } from './implementation';\nexport interface InternalThing {}", filename: INTERNAL_DIR },
    { code: "export interface InternalDrawer {}\nexport * from './x';", filename: NESTED_INTERFACES },
    { code: "import { x } from './ace-modes';\nexport type Y = typeof x;", filename: 'src/foo/internal.tsx' },
  ],

  invalid: [
    // Declaring an internal-named type in a public interface file.
    {
      code: 'export interface InternalFooProps { id: string; }',
      filename: PUBLIC,
      errors: [{ messageId: 'internalDeclaration', data: { name: 'InternalFooProps', component: 'foo' } }],
    },
    {
      code: 'interface InternalHelper { x: number; }\nexport interface FooProps { h: InternalHelper; }',
      filename: PUBLIC,
      errors: [{ messageId: 'internalDeclaration', data: { name: 'InternalHelper', component: 'foo' } }],
    },
    // Importing from a sibling internal-interfaces module.
    {
      code: "import { ItemProps } from './internal-interfaces';\nexport interface FooProps { item: ItemProps; }",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedImport', data: { source: './internal-interfaces' } }],
    },
    {
      code: "import { InternalToken } from '../property-filter/internal-interfaces';\nexport type X = InternalToken;",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedImport', data: { source: '../property-filter/internal-interfaces' } }],
    },
    // Importing from src/internal.
    {
      code: "import { SomeRequired } from '../internal/types';\nexport type X = SomeRequired<{ a?: 1 }, 'a'>;",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedImport', data: { source: '../internal/types' } }],
    },
    {
      code: "import { InternalBaseComponentProps } from '../internal/base-component';\nexport interface FooProps extends InternalBaseComponentProps {}",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedImport', data: { source: '../internal/base-component' } }],
    },
    // Importing a type from a non-interface implementation file in another component.
    {
      code: "import { BaseCheckboxProps } from '../checkbox/base-checkbox';\nexport interface FooProps extends BaseCheckboxProps {}",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedImport', data: { source: '../checkbox/base-checkbox' } }],
    },
    // Importing a type from a non-interface file in the same component.
    {
      code: "import { AceModes } from './ace-modes';\nexport type X = typeof AceModes;",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedImport', data: { source: './ace-modes' } }],
    },
    // Re-exporting from a disallowed source.
    {
      code: "export { InternalToken } from './internal-interfaces';",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedReexport', data: { source: './internal-interfaces' } }],
    },
    {
      code: "export * from '../internal/types';",
      filename: PUBLIC,
      errors: [{ messageId: 'disallowedReexport', data: { source: '../internal/types' } }],
    },
    // Re-exporting a binding under an internal name (allowed source, internal name).
    {
      code: "import { Foo } from '../bar/interfaces';\nexport { Foo as InternalFoo };",
      filename: PUBLIC,
      errors: [{ messageId: 'internalReexportName', data: { name: 'InternalFoo' } }],
    },
  ],
});
