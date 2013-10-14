var _ = require('../lib/utils'),
  paramHelper = require('../lib/param_helper'),
  errors = require('../lib/errors'),
  q = require('q');

/**
 * Perform an elasticsearch [mget](http://elasticsearch.org/guide/reference/api/multi-get/) request
 *
 * @for Client
 * @method mget
 * @param {Object} params - An object with parameters used to carry out this action
 * @param {String|ArrayOfStrings|Boolean} params.fields - A comma-separated list of fields to return in the response
 * @param {string} params.preference - Specify the node or shard the operation should be performed on (default: random)
 * @param {boolean} params.realtime - Specify whether to perform the operation in realtime or search mode
 * @param {boolean} params.refresh - Refresh the shard containing the document before performing the operation
 * @param {String|ArrayOfStrings|Boolean} params._source - True or false to return the _source field or not, or a list of fields to return
 * @param {String|ArrayOfStrings|Boolean} params._source_exclude - A list of fields to exclude from the returned _source field
 * @param {String|ArrayOfStrings|Boolean} params._source_include - A list of fields to extract and return from the _source field
 */
function doMget(params, cb) {
  params = params || {};

  var request = {
      ignore: params.ignore,
      body: params.body || null
    }
    , parts = {}
    , query = {}
    , responseOpts = {};

  if (params.method = _.toUpperString(params.method)) {
    if (params.method === 'GET' || params.method === 'POST') {
      request.method = params.method;
    } else {
      throw new TypeError('Invalid method: should be one of GET, POST');
    }
  } else {
    request.method = params.body ? 'POST' : 'GET';
  }

  // find the paths's params
  if (typeof params.index !== 'undefined') {
    if (typeof params.index !== 'object' && params.index) {
      parts.index = '' + params.index;
    } else {
      throw new TypeError('Invalid index: ' + params.index + ' should be a string.');
    }
  }

  if (typeof params.type !== 'undefined') {
    if (typeof params.type !== 'object' && params.type) {
      parts.type = '' + params.type;
    } else {
      throw new TypeError('Invalid type: ' + params.type + ' should be a string.');
    }
  }


  // build the path
  if (parts.hasOwnProperty('index') && parts.hasOwnProperty('type')) {
    request.path = '/' + encodeURIComponent(parts.index) + '/' + encodeURIComponent(parts.type) + '/_mget';
  }
  else if (parts.hasOwnProperty('index')) {
    request.path = '/' + encodeURIComponent(parts.index) + '/_mget';
  }
  else {
    request.path = '/_mget';
  }


  // build the query string
  if (typeof params.fields !== 'undefined') {
    switch (typeof params.fields) {
    case 'string':
      query.fields = params.fields;
      break;
    case 'object':
      if (_.isArray(params.fields)) {
        query.fields = params.fields.join(',');
      } else {
        throw new TypeError('Invalid fields: ' + params.fields + ' should be a comma seperated list, array, or boolean.');
      }
      break;
    default:
      query.fields = !!params.fields;
    }
  }

  if (typeof params.preference !== 'undefined') {
    if (typeof params.preference !== 'object' && params.preference) {
      query.preference = '' + params.preference;
    } else {
      throw new TypeError('Invalid preference: ' + params.preference + ' should be a string.');
    }
  }

  if (typeof params.realtime !== 'undefined') {
    if (params.realtime.toLowerCase && (params.realtime = params.realtime.toLowerCase())
      && (params.realtime === 'no' || params.realtime === 'off')
    ) {
      query.realtime = false;
    } else {
      query.realtime = !!params.realtime;
    }
  }

  if (typeof params.refresh !== 'undefined') {
    if (params.refresh.toLowerCase && (params.refresh = params.refresh.toLowerCase())
      && (params.refresh === 'no' || params.refresh === 'off')
    ) {
      query.refresh = false;
    } else {
      query.refresh = !!params.refresh;
    }
  }

  if (typeof params._source !== 'undefined') {
    switch (typeof params._source) {
    case 'string':
      query._source = params._source;
      break;
    case 'object':
      if (_.isArray(params._source)) {
        query._source = params._source.join(',');
      } else {
        throw new TypeError('Invalid _source: ' + params._source + ' should be a comma seperated list, array, or boolean.');
      }
      break;
    default:
      query._source = !!params._source;
    }
  }

  if (typeof params._source_exclude !== 'undefined') {
    switch (typeof params._source_exclude) {
    case 'string':
      query._source_exclude = params._source_exclude;
      break;
    case 'object':
      if (_.isArray(params._source_exclude)) {
        query._source_exclude = params._source_exclude.join(',');
      } else {
        throw new TypeError('Invalid _source_exclude: ' + params._source_exclude + ' should be a comma seperated list, array, or boolean.');
      }
      break;
    default:
      query._source_exclude = !!params._source_exclude;
    }
  }

  if (typeof params._source_include !== 'undefined') {
    switch (typeof params._source_include) {
    case 'string':
      query._source_include = params._source_include;
      break;
    case 'object':
      if (_.isArray(params._source_include)) {
        query._source_include = params._source_include.join(',');
      } else {
        throw new TypeError('Invalid _source_include: ' + params._source_include + ' should be a comma seperated list, array, or boolean.');
      }
      break;
    default:
      query._source_include = !!params._source_include;
    }
  }

  request.path = request.path + _.makeQueryString(query);

  this.client.request(request, cb);
}

module.exports = doMget;
