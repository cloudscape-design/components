// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Registers the `toValidateA11y` matcher for the BasicTable a11y tests.
// This re-exports the repo's shared matcher registration which calls expect.extend() at module scope.
import '../../../__a11y__/to-validate-a11y';
