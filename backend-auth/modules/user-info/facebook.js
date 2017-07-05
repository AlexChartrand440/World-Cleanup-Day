"use strict";
const graph = require('fbgraph');
graph.setVersion('2.9');

module.exports = token => {
    graph.setAccessToken(token);
    return new Promise((resolve, reject) => {
        graph.get('/me?fields=id,name,email', (err, res) => {
            if (err) {
                return reject(new Error(err));
            }
            return resolve({
                id: res.id,
                email: res.email,
                name: res.name,
            });
        });
    })
};
