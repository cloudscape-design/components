// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useEffect, useRef } from 'react';

export default function useScrollSpy({ hrefs }: { hrefs: string[] }): [string | undefined] {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        let activeSlugTemp;
        let smallestIndexInViewport = Infinity;
        let largestIndexAboveViewport = -1;

        for (const entry of entries) {
          if (entry?.rootBounds && entry?.boundingClientRect && typeof entry.intersectionRatio === 'number') {
            const slug = entry.target.id;
            const index = hrefs.indexOf(`#${slug}`);
            const aboveHalfViewport =
              entry.boundingClientRect.y + entry.boundingClientRect.height <=
              entry.rootBounds.y + entry.rootBounds.height;
            const insideHalfViewport = entry.intersectionRatio > 0;

            // Check if the element is within the viewport and update the active slug if it's the smallest index seen
            if (insideHalfViewport && index < smallestIndexInViewport) {
              smallestIndexInViewport = index;
              activeSlugTemp = slug;
            }

            // If no entry is found within the viewport, find the entry with the largest index above the viewport
            if (smallestIndexInViewport === Infinity && aboveHalfViewport && index > largestIndexAboveViewport) {
              largestIndexAboveViewport = index;
              activeSlugTemp = slug;
            }
          }
        }
        if (activeSlugTemp !== undefined) {
          setActiveSlug(activeSlugTemp);
        }
      },
      {
        rootMargin: '0px 0px -50%',
        threshold: [0, 1],
      }
    );

    hrefs.forEach(href => {
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      hrefs.forEach(href => {
        const id = href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          observerRef.current?.unobserve(element);
        }
      });

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hrefs]);

  return [activeSlug];
}
