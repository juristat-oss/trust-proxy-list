const awsIpRanges = require('aws-ip-ranges');

module.exports = (inputOptions = {}) => {
  const opts = Object.assign({}, {
    ranges: [],
    awsRanges: false,
    multicast: false,
    ipv4: true,
    ipv6: true,
  }, inputOptions);

  if (typeof opts.ranges === 'string') {
    opts.ranges = opts.ranges.split(/\s*,\s*/);
  }

  if (opts.multicast) {
    opts.ranges = opts.ranges.concat([
      '224/6',
      '228/7',
      'ff00::/8',
    ]);
  }

  function ipVersionOk(range) {
    const v6 = /:/.test(range);
    return (opts.ipv6 && v6) || (opts.ipv4 && !v6);
  }

  const result = [].concat(opts.ranges);

  if (opts.awsRanges) {
    return awsIpRanges(opts.awsRanges).then((awsRanges) => {
      result.concat(awsRanges).filter(ipVersionOk);
    });
  }

  return result.filter(ipVersionOk);
};
