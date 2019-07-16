const Company = require('../models/company');

exports.create = ((req, res, next) => {

});

exports.retrieve = ((req, res, next) => {
    // Check request for required parameters 
    const body = req.body;
    const allowedAttrs = ['fields', 'query', 'limit', 'offset'];

    if (body.fields && !Array.isArray(body.fields)) {
        const response = {
            error: `Property 'fields' must be an array.`
        }

        return res.status(400).send(response);
    }
    
    try {
        Object.keys(req.body).some((key) => {
            if(!allowedAttrs.includes(key)) {
                const response = {
                    status: 400,
                    error: `Company has no attribute '${key}'`
                }

                throw response; 
            }
        })
    } catch(response) {
        return res.status(response.status).send(response.error)
    }
    
    Company.find(body.query || {}, body.fields || null).limit(body.limit || 10).skip(body.offset || 0)
        .then((companies) => {
            var response = {
                status: 200,
                data: companies
            }

            if (companies.length === 0) {
                response = {
                    status: 404,
                    data: { error: 'There are no results that match your query.' }
                }
            }

            if(body.fields) {
                body.fields.forEach((field) => {
                    if (!Company.schema.path(`${field}`)) {
                        response = {
                            status: 400,
                            data: { error: `No matching fields for '${field}'` }
                        }
                        return;
                    }
                });
            }

            res.status(response.status).send(response.data);

        }).catch((err) => {
            console.log('error: ',err);
            response = {
                response: 500,
                data: { error: 'There are no results that match your query. Please check your query and try again.' }
            }
            res.status(500).send(response.data);
        })
});

exports.update = ((req, res, next) => {

});

exports.delete = ((req, res, next) => {

});