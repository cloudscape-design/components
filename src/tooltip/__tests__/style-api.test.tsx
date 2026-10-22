// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Tooltip from '../../../lib/components/tooltip';

import popoverStyles from '../../../lib/components/popover/styles.css.js';

function renderTooltip(props: Record<string, unknown>) {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  return render(<Tooltip content="Content" getTrack={() => trigger} {...props} />);
}

describe('Tooltip Style API v2', () => {
  test('applies styleClassNames to the tooltip container', () => {
    renderTooltip({ styleClassNames: { tooltip: 'a', unknown: 'b' } });
    expect(document.body.querySelector(`.${popoverStyles.container}`)).toHaveClass('a');
    expect(document.body.querySelector('.b')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    renderTooltip({ styleClassNames: { tooltip: 'a' } });
    expect(document.body.querySelector('[styleClassNames]')).toBeNull();
  });
});
