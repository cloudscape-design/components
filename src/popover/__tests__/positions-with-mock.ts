// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import positions from '../../../lib/components/popover/utils/positions';

jest.mock('../../../lib/components/popover/utils/positions', () => ({
  ...jest.requireActual('../../../lib/components/popover/utils/positions'),
  getOffsetDimensions: () => ({ offsetWidth: 200, offsetHeight: 300 }), // Approximate mock value for the popover dimensions
}));

export default positions;
