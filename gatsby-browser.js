/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from "react"
import { ApolloProvider } from "react-apollo-hooks"

import { client } from "./src/apollo"
import { starshipQuery } from "./src/util"

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)

export const onRouteUpdate = ({ location, prevLocation }) => {
  // this feels brittle
  if (location.pathname === "/page-2") {
    // this works but data shows up in location prop _after_ the page is rendered
    location.dataSuspender = starshipQuery(15)
  }
}
