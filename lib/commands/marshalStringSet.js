'use strict';

var _ = require('lodash');

module.exports = function(item) {
  if (!_.isArray(item)) {
    return undefined;
  }

  if(item.length === 0) {
  	return undefined;
  }

  if (!_.every(item, _.isString)) {
    return undefined;
  }

  return {SS: item};
};
