// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect, useRef } from 'react';

export default function useScrollSpy({
  hrefs,
}: {
  hrefs: string[];
}): [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>, (disableTracking: boolean) => void] {
  const [activeId, setActiveId] = useState(hrefs[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const isEntryBelowViewport = entry.boundingClientRect.bottom < 0;
          if (entry.isIntersecting && !isEntryBelowViewport) {
            setActiveId(entry.target.id);
          } else if (isEntryBelowViewport) {
            const currentIdIndex = hrefs.indexOf(entry.target.id);
            if (currentIdIndex > 0) {
              setActiveId(hrefs[currentIdIndex - 1]);
            }
          }
        });
      },
      { threshold: 0 }
    );

    hrefs.forEach(href => {
      const element = document.getElementById(href);
      element && observer.observe(element);
    });

    return () => {
      hrefs.forEach(href => {
        const element = document.getElementById(href);
        element && observer.unobserve(element);
      });
    };
  }, [hrefs]);

  return [activeId];
}
