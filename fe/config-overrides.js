/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addLessLoader,
  useBabelRc,
} = require('customize-cra');

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: override(
    useBabelRc(),
    addDecoratorsLegacy(),
    disableEsLint(),
    addLessLoader({
      javascriptEnabled: true,
    }),
  ),
};
