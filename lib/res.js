'use strict';

exports.ok = function(values, res) {
  var data = {
      'status': 200,
      'data': values
  };
  res.send(data);
};