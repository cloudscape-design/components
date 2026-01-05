// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Pagination from '~components/pagination';
import Table from '~components/table';

import { generateItems, Instance } from './generate-data';

const PAGE_SIZE = 10;
const TOTAL_ITEMS = 100; // Simulated server-side total

export default function JumpToPageOpenEndExample() {
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [loadedPages, setLoadedPages] = useState<Record<number, Instance[]>>({ 1: generateItems(10) });
  const [jumpToPageError, setJumpToPageError] = useState(false);
  const [jumpToPageIsLoading, setJumpToPageIsLoading] = useState(false);
  const [maxKnownPage, setMaxKnownPage] = useState(1);
  const [openEnd, setOpenEnd] = useState(true);

  const currentItems = loadedPages[currentPageIndex] || [];

  const loadPage = (pageIndex: number) => {
    return new Promise<Instance[]>((resolve, reject) => {
      setTimeout(() => {
        const totalPages = Math.ceil(TOTAL_ITEMS / PAGE_SIZE);
        if (pageIndex > totalPages) {
          reject({
            message: `Page ${pageIndex} does not exist. Maximum page is ${totalPages}.`,
            maxPage: totalPages,
          });
        } else {
          const startIndex = (pageIndex - 1) * PAGE_SIZE;
          resolve(generateItems(10).map((item, i) => ({ ...item, id: `${startIndex + i + 1}` })));
        }
      }, 500);
    });
  };

  return (
    <Table
      header={
        <div>
          <h1>Jump to Page - Open End Pagination (100 items total, lazy loaded)</h1>
          <p>
            Current: Page {currentPageIndex}, Max Known: {maxKnownPage}, Mode: {openEnd ? 'Open-End' : 'Closed'}
          </p>
        </div>
      }
      columnDefinitions={[
        { header: 'ID', cell: (item: Instance) => item.id },
        { header: 'State', cell: (item: Instance) => item.state },
        { header: 'Type', cell: (item: Instance) => item.type },
        { header: 'DNS Name', cell: (item: Instance) => item.dnsName || '-' },
      ]}
      items={currentItems}
      pagination={
        <Pagination
          currentPageIndex={currentPageIndex}
          pagesCount={maxKnownPage}
          openEnd={openEnd}
          onChange={({ detail }) => {
            const requestedPage = detail.currentPageIndex;
            // If page already loaded, just navigate
            if (loadedPages[requestedPage]) {
              setCurrentPageIndex(requestedPage);
              setJumpToPageError(false);
              return;
            }
            // Otherwise, load the page
            setJumpToPageIsLoading(true);
            loadPage(requestedPage)
              .then(items => {
                setLoadedPages(prev => ({ ...prev, [requestedPage]: items }));
                setCurrentPageIndex(requestedPage);
                setMaxKnownPage(Math.max(maxKnownPage, requestedPage));
                setJumpToPageError(false);
                setJumpToPageIsLoading(false);
              })
              .catch((error: { message: string; maxPage?: number }) => {
                const newMaxPage = error.maxPage || maxKnownPage;
                setMaxKnownPage(newMaxPage);
                setOpenEnd(false);
                setJumpToPageError(true);
                // Load all pages from current to max
                const pagesToLoad = [];
                for (let i = 1; i <= newMaxPage; i++) {
                  if (!loadedPages[i]) {
                    pagesToLoad.push(loadPage(i).then(items => ({ page: i, items })));
                  }
                }

                Promise.all(pagesToLoad).then(results => {
                  setLoadedPages(prev => {
                    const updated = { ...prev };
                    results.forEach(({ page, items }) => {
                      updated[page] = items;
                    });
                    return updated;
                  });
                  setCurrentPageIndex(newMaxPage);
                  setJumpToPageIsLoading(false);
                });
              });
          }}
          onNextPageClick={({ detail }) => {
            // If page already loaded, just navigate
            if (loadedPages[detail.requestedPageIndex]) {
              setCurrentPageIndex(detail.requestedPageIndex);
              return;
            }
            // Load the next page
            setJumpToPageIsLoading(true);
            loadPage(detail.requestedPageIndex)
              .then(items => {
                setLoadedPages(prev => ({ ...prev, [detail.requestedPageIndex]: items }));
                setCurrentPageIndex(detail.requestedPageIndex);
                setMaxKnownPage(Math.max(maxKnownPage, detail.requestedPageIndex));
                setJumpToPageIsLoading(false);
              })
              .catch((error: { message: string; maxPage?: number }) => {
                // Discovered the end - switch to closed pagination and stay on current page
                if (error.maxPage) {
                  setMaxKnownPage(error.maxPage);
                  setOpenEnd(false);
                }
                // Reset to current page (undo the navigation that already happened)
                setCurrentPageIndex(currentPageIndex);
                setJumpToPageError(true);
                setJumpToPageIsLoading(false);
              });
          }}
          jumpToPage={{
            isLoading: jumpToPageIsLoading,
            hasError: jumpToPageError,
          }}
        />
      }
    />
  );
}
