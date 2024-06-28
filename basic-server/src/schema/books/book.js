const getValidation = {
    schema: {
        querystring: {
                    type: 'object',
                    properties: {
                        author: { type: 'string' },
                        publicationyear: { type: 'number' },
        
                        sort: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },

                        limit : {type : "number", default: 5},
                        page: {type: "number", default: 1}
        
                    },
        
                    additionalProperties: false
        
                },
        response: {
             200: {   
                type: "array",
                properties: {
                    title: {
                        type : "string"
                    },
                    author: {
                        type: "string"
                    },
                    isbn: {
                        type: "number"
                    },
                    publicationyear: { 
                        type: "number"
                    }
                },
                required: ["title","author","isbn", "publicationyear"]  
            }
        },
    }
}

const getBooks = {
    schema: {
        params: {
            isbn: { type: "number"},
        },
        response: {
             200: {   
                type: "object",
                properties: {
                    title: {
                        type : "string"
                    },
                    author: {
                        type: "string"
                    },
                    isbn: {
                        type: "number"
                    },
                    publicationyear: { 
                        type: "number"
                    }
                },
                required: ["title","author","isbn", "publicationyear"]  
            }
        },
    }
}

const getAllBookById = {
    schema: {
        params: {
            type: 'object',
            properties: {
                isbn: { type: "string" }
            },
            required: ['isbn']
        },
        response: {
            200: {   
                type: "object",
                properties: {
                    title: {
                        type : "string"
                    },
                    author: {
                        type: "string"
                    },
                    isbn: {
                        type: "number"
                    },
                    publicationyear: { 
                        type: "number"
                    }
                },
                required: ["title","author","isbn", "publicationyear"]  
            }
        }
    }
}

const updateBookById = {
    schema: {
        params: {
            isbn: { type: "string"}
        }
    }
}

const deleteBookById = {
    schema: {
        params: {
            isbn: { type: "string"}
        }
    }
}
module.exports={getValidation,getAllBookById,getBooks, updateBookById, deleteBookById}