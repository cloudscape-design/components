// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) {
          k2 = k;
        }
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) {
          k2 = k;
        }
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m) {
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p)) {
        __createBinding(exports, m, p);
      }
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.documentTestUtils = exports.writeComponentsDocumentation = exports.documentComponents = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
__exportStar(require('./components/interfaces'), exports);
var components_1 = require('./components');
Object.defineProperty(exports, 'documentComponents', {
  enumerable: true,
  get: function () {
    return components_1.documentComponents;
  },
});
Object.defineProperty(exports, 'writeComponentsDocumentation', {
  enumerable: true,
  get: function () {
    return components_1.writeComponentsDocumentation;
  },
});
var test_utils_1 = require('./test-utils');
Object.defineProperty(exports, 'documentTestUtils', {
  enumerable: true,
  get: function () {
    return test_utils_1.documentTestUtils;
  },
});
//# sourceMappingURL=index.js.map
