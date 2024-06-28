const { getAllBookById,getValidation, deleteBookById,getBooks, updateBookById } = require("../schema/books/book");
const  jwt = process.env.JTW_SECRET

const bookRoutes = (fastify, options, done) => {
    fastify.decorate('authenticate', async (req, res) => {
        try {
          await req.jwtVerify();
        } catch (err) {
          res.code(401).send( {message: "This is a protected route and you dont have access to it"});
        }
      });

      fastify.decorate("authorize", function (roles) {
        return async function (request, reply) {
          const user = request.user;
          if (!roles.includes(user.role)) {
            return reply.code(403).send({ message: 'Forbidden' });
          }
        };
      });

    fastify.get("/getAllBooks",{ preValidation: [fastify.authenticate, fastify.authorize(['admin', 'user'])],  schema: getValidation }, async (req, res) => {
        const { author, publicationyear, sort } = req.query;
            let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    if (isNaN(page) || page < 1) {
      page = 1; 
    }

    if (isNaN(limit)) {
      limit = 10; 
    }
        let query = 'SELECT * FROM books';
        let conditions = [];
        let values = [];
    
        if (author) {
            conditions.push('author = $' + (conditions.length + 1));
            values.push(author);
        }
    
        if (publicationyear) {
            conditions.push('publicationyear = $' + (conditions.length + 1));
            values.push(publicationyear);
        }
    
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
    
        query += ' ORDER BY publicationyear ' + (sort && sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');
        query += ' LIMIT $' + (conditions.length + 1) + ' OFFSET $' + (conditions.length + 2);
        values.push(parseInt(limit));
        values.push((parseInt(page) - 1) * parseInt(limit));

        try {
            const result = await fastify.pg.query(query, values);
            res.send(result.rows);
        } catch (err) {
            res.code(500).send({ error: 'Failed to fetch books' });
        }
    });

    fastify.get("/getBooksByIsbn/:isbn", { preValidation: [fastify.authenticate, fastify.authorize(['admin', 'user'])], schema: getValidation }, async (req, res) => {
        try {
            const result = await fastify.pg.query('SELECT * FROM books WHERE isbn=$1', [req.params.isbn]);
            res.send(result.rows[0]);
        } catch (err) {
            res.code(500).send({ error: 'Failed to fetch book' });
        }
    });

    fastify.post("/createNewBook", { preValidation: [fastify.authenticate, fastify.authorize(['admin'])], schema: getValidation }, async (req, res) => {
        const { title, author, isbn, publicationYear } = req.body;
        try {
            await fastify.pg.query('INSERT INTO books (title, author, isbn, publicationyear) VALUES ($1, $2, $3, $4)', [title, author, isbn, publicationYear]);
            res.code(201).send({ message: 'Book created successfully' });
        } catch (err) {
            res.code(500).send({ error: 'Failed to create book' });
        }
    });

    fastify.put("/updateBookByIsbn/:isbn", { preValidation: [fastify.authenticate, fastify.authorize(['admin'])], schema: getValidation }, async (req, res) => {
        const { title, author, publicationYear } = req.body;
        try {
            const result = await fastify.pg.query('UPDATE books SET title=$1, author=$2, publicationyear=$3 WHERE isbn=$4', [title, author, publicationYear, req.params.isbn]);
            if (result.rowCount === 0) {
                res.code(404).send({ message: 'Book not found' });
            } else {
                res.code(200).send({ message: 'Book updated successfully' });
            }
        } catch (err) {
            res.code(500).send({ error: 'Failed to update book' });
        }
    });

    fastify.delete("/deleteBookByIsbn/:isbn", { preValidation: [fastify.authenticate, fastify.authorize(['admin'])], schema: getValidation }, async (req, res) => {
        try {
            const result = await fastify.pg.query('DELETE FROM books WHERE isbn=$1', [req.params.isbn]);
            if (result.rowCount === 0) {
                res.code(404).send({ message: 'Book not found' });
            } else {
                res.code(200).send({ message: 'Book deleted successfully' });
            }
        } catch (err) {
            res.code(500).send({ error: 'Failed to delete book' });
        }
    });



    done();
}

module.exports = { bookRoutes }