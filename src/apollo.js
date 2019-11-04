import ApolloClient from "apollo-boost"
import fetch from "isomorphic-fetch"

const SERVER_URI =
    "https://api.graphcms.com/simple/v1/swapi"

export const client = new ApolloClient({
    uri: SERVER_URI,
    fetch,
})