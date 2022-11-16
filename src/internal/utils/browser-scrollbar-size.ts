/*
 * ** Detect scrollbar width (blog post); version N/A -- https://davidwalsh.name/detect-scrollbar-width
 *
 * MIT License
 *
 * Copyright (c) 2007-2021 David Walsh
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* eslint-disable header/header */
import { calculateOnce } from './calculate-once';

export const browserScrollbarSize = calculateOnce(() => {
  if (typeof document === 'undefined') {
    return { width: 0, height: 0 };
  }
  const scrollDiv = document.createElement('div');
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.height = '100px';
  scrollDiv.style.width = '100px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.left = '-9999px';
  document.body.appendChild(scrollDiv);

  const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  const height = scrollDiv.offsetHeight - scrollDiv.clientHeight;
  document.body.removeChild(scrollDiv);
  return { width, height };
});
