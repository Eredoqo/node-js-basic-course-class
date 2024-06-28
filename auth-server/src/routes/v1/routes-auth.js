const bcrypt = require('bcrypt');
const logInSchema = require("../../schemas/login-schema/index")
const signUpSchema = require("../../schemas/sigup-schema/index")

const authRoutes = (fastify, options, done) => {

  fastify.post('/signup',signUpSchema, async (req, reply) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rowCount } = await fastify.pg.query(
      'INSERT INTO users(username, password, role) VALUES($1, $2, $3)',
      [username, hashedPassword, role]
    );

    if (rowCount === 0) {
      return reply.code(500).send({ error: 'Failed to create user' });
    }

    reply.send({ message: 'User created successfully' });
  });

  fastify.post('/login', logInSchema,async (req, reply) => {
    const { username, password } = req.body;

    const { rows } = await fastify.pg.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = rows[0];
    if (!user) {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }

    const token = fastify.jwt.sign({ id: user.id, role: user.role });

    reply.send({ token });
  });

  done();
}

module.exports = { authRoutes };