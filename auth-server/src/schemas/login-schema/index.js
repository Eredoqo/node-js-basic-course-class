const logInSchema = {
    schema: {
        body: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' }
            },
            required: ['username', 'password']
          },
        response: {
             200: {   
                type: 'object',
                properties: {
                  token: { type: 'string' }
                },
                required: ['token']
              },401: {
                type: 'object',
                properties: {
                  error: { type: 'string' }
                },
                required: ['error']
              },
              500: {
                type: 'object',
                properties: {
                  error: { type: 'string' }
                },
                required: ['error']
              }
        },
    }
}

module.exports={logInSchema}