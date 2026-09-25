// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { render } from '@testing-library/react';

import InternalControlGroup from '../../../../../lib/components/internal/components/control-group';
import { useControlGroupContext } from '../../../../../lib/components/internal/context/control-group-context';

function PositionProbe({ id }: { id: string }) {
  const { position } = useControlGroupContext();
  return <div data-testid={id}>{String(position)}</div>;
}

describe('Control group', () => {
  describe('position context', () => {
    test('provides "only" to a single child', () => {
      const { getByTestId } = render(
        <InternalControlGroup>
          <PositionProbe id="a" />
        </InternalControlGroup>
      );
      expect(getByTestId('a')).toHaveTextContent('only');
    });

    test('provides "first" and "last" to two children', () => {
      const { getByTestId } = render(
        <InternalControlGroup>
          <PositionProbe id="a" />
          <PositionProbe id="b" />
        </InternalControlGroup>
      );
      expect(getByTestId('a')).toHaveTextContent('first');
      expect(getByTestId('b')).toHaveTextContent('last');
    });

    test('provides "first", "middle" and "last" across three or more children', () => {
      const { getByTestId } = render(
        <InternalControlGroup>
          <PositionProbe id="a" />
          <PositionProbe id="b" />
          <PositionProbe id="c" />
          <PositionProbe id="d" />
        </InternalControlGroup>
      );
      expect(getByTestId('a')).toHaveTextContent('first');
      expect(getByTestId('b')).toHaveTextContent('middle');
      expect(getByTestId('c')).toHaveTextContent('middle');
      expect(getByTestId('d')).toHaveTextContent('last');
    });
  });

  describe('key preservation', () => {
    // Reports how many times each instance mounted, keyed by id. Reordering
    // children while preserving keys must NOT remount them (which would drop
    // focus and internal state), so the mount count must stay at 1.
    function MountProbe({ id, onMount }: { id: string; onMount: (id: string) => void }) {
      useEffect(() => {
        onMount(id);
        // Mount-only effect; intentionally not re-running on prop change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return <div>{id}</div>;
    }

    test('preserves child keys so reordering does not remount them', () => {
      const mounts: Record<string, number> = {};
      const onMount = (id: string) => {
        mounts[id] = (mounts[id] ?? 0) + 1;
      };

      const first = <MountProbe key="alpha" id="alpha" onMount={onMount} />;
      const second = <MountProbe key="beta" id="beta" onMount={onMount} />;

      const { rerender } = render(<InternalControlGroup>{[first, second]}</InternalControlGroup>);

      expect(mounts).toEqual({ alpha: 1, beta: 1 });

      // Reorder the children. Because the control group threads each child's key
      // onto its wrapper, React matches them by key and preserves the instances
      // rather than remounting them at their new positions.
      rerender(<InternalControlGroup>{[second, first]}</InternalControlGroup>);

      expect(mounts).toEqual({ alpha: 1, beta: 1 });
    });
  });
});
