
const bcrypt = require('bcrypt');



const adminRoutes = (fastify, options, done) => {
    fastify.decorate("authenticate", async function (request, reply) {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      });
      
      
      fastify.decorate("authorizeAdmin", async function (request, reply) {
        const user = request.user;
        if (user.role !== 'admin') {
          return reply.code(403).send({ message: 'Forbidden' });
        }
      });

  fastify.post('/users', { preValidation: [fastify.authenticate, fastify.authorizeAdmin] }, async (request, reply) => {
    const { username, password, role } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, role]
      );
      reply.send({ message: 'User created successfully', user: rows[0] });
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });


  fastify.get('/users', { preValidation: [fastify.authenticate, fastify.authorizeAdmin] }, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query('SELECT * FROM users');
      reply.send(rows);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });


  fastify.patch('/users/:username', { preValidation: [fastify.authenticate, fastify.authorizeAdmin] }, async (request, reply) => {
    const { username } = request.params;
    const { password, role } = request.body;
    const client = await fastify.pg.connect();
  
    try {
      const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = rows[0];
  
      if (user) {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        const newRole = role ? role : user.role;
  
        const { rows } = await client.query(
          'UPDATE users SET password = $1, role = $2 WHERE username = $3 RETURNING *',
          [hashedPassword, newRole, username]
        );
        reply.send({ message: 'User updated successfully', user: rows[0] });
      } else {
        reply.code(404).send({ message: 'User not found' });
      }
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });


  fastify.delete('/users/:username', { preValidation: [fastify.authenticate, fastify.authorizeAdmin] }, async (request, reply) => {
    const { username } = request.params;
    const client = await fastify.pg.connect();
  
    try {
      const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = rows[0];
  
      if (user) {
        await client.query('DELETE FROM users WHERE username = $1', [username]);
        reply.send({ message: 'User deleted successfully' });
      } else {
        reply.code(404).send({ message: 'User not found' });
      }
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });

  done();
}

module.exports={adminRoutes}