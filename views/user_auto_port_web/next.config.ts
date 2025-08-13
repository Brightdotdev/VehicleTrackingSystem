module.exports = {
  // Remove the rewrites() and headers() configuration entirely
  // We'll handle CORS at the API Gateway level instead
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Or your specific frontend URL
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' }
        ]
      }
    ]
  }
}