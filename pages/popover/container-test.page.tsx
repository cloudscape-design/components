// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo, useRef, useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import PopoverContainer from '~components/popover/container';
import { isRtl } from '~components/internal/direction';
import clsx from 'clsx';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import popoverStyles from '~components/popover/styles.css.js';

const points = [
  { id: 'p1', x: 20, y: 20 },
  { id: 'p2', x: 40, y: 20 },
  { id: 'p3', x: 60, y: 20 },
  { id: 'p4', x: 80, y: 20 },
  { id: 'p5', x: 100, y: 20 },
];

export default function () {
  const hoverRef = useRef<SVGCircleElement>(null);
  const [hoverId, setHoverId] = useState<null | string>(null);

  const onMouseOver = useCallback((event: React.MouseEvent<Element>) => {
    if (event.target instanceof SVGCircleElement) {
      setHoverId(event.target.id);
    }
  }, []);

  const hoveredPoint = useMemo(() => points.filter(it => it.id === hoverId)[0], [hoverId]);

  return (
    <article>
      <h1>Popover container test</h1>
      <ScreenshotArea>
        <svg width={500} height={500} style={{ margin: '20px', transform: isRtl(document.body) ? 'scaleX(-1)' : '' }}>
          {points.map(point => (
            <circle
              key={point.id}
              id={point.id}
              cx={point.x}
              cy={point.y}
              r={6}
              stroke="green"
              fill="white"
              onMouseOver={onMouseOver}
            />
          ))}

          <circle
            ref={hoverRef}
            cx={hoveredPoint?.x || 0}
            cy={hoveredPoint?.y || 0}
            r={6}
            stroke="green"
            fill="green"
            style={{
              visibility: hoveredPoint ? 'visible' : 'hidden',
            }}
          />
        </svg>

        {hoverId ? (
          <PopoverContainer
            size="small"
            fixedWidth={false}
            position="bottom"
            trackRef={hoverRef}
            trackKey={hoverId}
            arrow={position => (
              <div className={clsx(popoverStyles.arrow, popoverStyles[`arrow-position-${position}`])}>
                <div className={popoverStyles['arrow-outer']} />
                <div className={popoverStyles['arrow-inner']} />
              </div>
            )}
          >
            <div id={`content-${hoverId}`}>Content {hoverId}</div>
          </PopoverContainer>
        ) : null}
      </ScreenshotArea>
    </article>
  );
}
