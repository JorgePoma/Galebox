module.exports = ({ env }) => ({
    // ...
    upload: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('cuarteto-dinamico'),
        api_key: env('912639123142587'),
        api_secret: env('X8dFJvvbfP2vaYxJBU9Kr-Fswqo'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
    // ...
  });