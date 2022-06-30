// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel } = require('gulp');
const themes = require('../utils/themes');
const { copyTask } = require('../utils/gulp-utils');

const copyThirdPartyLicenses = (name, destination) => {
  return copyTask(`third-party-licenses:${name}`, ['THIRD-PARTY-LICENSES'], destination);
};

module.exports = parallel(themes.map(theme => copyThirdPartyLicenses(theme.name, theme.outputPath)));
module.exports.copyThirdPartyLicenses = copyThirdPartyLicenses;
