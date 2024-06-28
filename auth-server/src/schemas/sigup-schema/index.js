const signUpSchema = {
    schema: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
          role: { type: 'string' }
        },
        required: ['username', 'password', 'role']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          },
          required: ['message']
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          },
          required: ['error']
        }
      }
    }
  }
  
  module.exports = { signUpSchema }