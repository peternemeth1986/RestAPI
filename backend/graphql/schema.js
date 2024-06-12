const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }
    type routeQuery {
        hello: TestData!
    }
    schema {
        query: routeQuery
    }
`);