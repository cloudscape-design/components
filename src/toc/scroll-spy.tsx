// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useEffect, useRef } from 'react';

export default function useScrollSpy({ hrefs }: { hrefs: string[] }): [string | undefined] {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!observerRef.current) {
      console.log('observer being created');
      observerRef.current = new IntersectionObserver(
        entries => {
          let activeSlugTemp = '';
          let smallestIndexInViewport = Infinity;
          let largestIndexAboveViewport = -1;
          for (const entry of entries) {
            if (entry?.rootBounds) {
              const slug = entry.target.id;
              const index = hrefs.indexOf(slug);
              const aboveHalfViewport =
                entry.boundingClientRect.y + entry.boundingClientRect.height <=
                entry.rootBounds.y + entry.rootBounds.height;
              const insideHalfViewport = entry.intersectionRatio > 0;

              if (insideHalfViewport && index < smallestIndexInViewport) {
                smallestIndexInViewport = index;
                activeSlugTemp = slug;
              }
              if (smallestIndexInViewport === Infinity && aboveHalfViewport && index > largestIndexAboveViewport) {
                largestIndexAboveViewport = index;
                activeSlugTemp = slug;
              }
            }
            console.log(entry);
          }
          setActiveSlug(activeSlugTemp);
        },
        {
          rootMargin: '0px 0px -50%',
          threshold: [0, 1],
        }
      );

      hrefs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observerRef.current?.observe(element);
        }
      });
    }

    return () => {
      if (observerRef.current) {
        hrefs.forEach(id => {
          const element = document.getElementById(id);
          if (element) {
            observerRef.current?.unobserve(element);
          }
        });
      }
    };
  }, [hrefs]);

  return [activeSlug];
}
