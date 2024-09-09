import { describe, it } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { LOCAL_SERVER_URL } from './index.js';

describe('#hello query', () => {
  it('should receive Hello World from hello query', async () => {
    const graphqlQuery = {
      operationName: 'Hello',
      query: 'query Hello { hello }',
      variables: {},
    };
    const res = await axios.post(LOCAL_SERVER_URL, graphqlQuery);
    expect(res.data.data.hello).to.be.equal('Hello World');
  });
});
