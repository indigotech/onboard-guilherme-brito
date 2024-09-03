const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
 
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello() {
    return "Hello world!"
  },
};

var app = express();

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.listen(4000);
console.log("Server started in port 4000");
