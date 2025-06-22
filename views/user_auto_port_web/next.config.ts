module.exports = {
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: process.env.BASE_URL + '/v1/:path*'
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/v1/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.BASE_URL },
          { key: 'Access-Control-Allow-Credentials', value: 'true' }
        ]
      }
    ];
  }
};