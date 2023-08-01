// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useEffect, useRef } from 'react';

export default function useScrollSpy({ hrefs }: { hrefs: string[] }): [string | undefined] {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLastItem = useRef<boolean>(false);

  // Only run on mount and unmount
  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        entries => {
          console.log({ isLastItem });

          let activeSlugTemp = '';
          if (isLastItem.current) {
            activeSlugTemp = hrefs[hrefs.length - 1];
          } else {
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
            }
          }
          setActiveSlug(activeSlugTemp);
        },
        {
          rootMargin: '0px 0px -50%',
          threshold: [0, 1],
        }
      );
    }

    // const checkScrollBottom = () => {
    //   const scrollPos = window.innerHeight + window.scrollY;
    //   if (scrollPos >= document.documentElement.scrollHeight) {
    //     isLastItem.current = true;
    //     setActiveSlug(hrefs[hrefs.length - 1]);
    //   } else if (activeSlug === hrefs[hrefs.length - 1]) {
    //     const lastElement = document.getElementById(hrefs[hrefs.length - 1]);
    //     if (lastElement) {
    //       const rect = lastElement.getBoundingClientRect();
    //       if (
    //         rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    //         activeSlug === hrefs[hrefs.length - 1]
    //       ) {
    //         setActiveSlug(hrefs[hrefs.length - 2]);
    //         isLastItem.current = false;
    //       }
    //     }
    //   } else {
    //     setActiveSlug(hrefs[hrefs.length - 2]);
    //     isLastItem.current = false;
    //   }
    // };

    // window.addEventListener('scroll', checkScrollBottom);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      //  window.removeEventListener('scroll', checkScrollBottom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Run whenever hrefs changes
  useEffect(() => {
    hrefs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      hrefs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observerRef.current?.unobserve(element);
        }
      });
    };
  }, [hrefs]);

  return [activeSlug];
}
