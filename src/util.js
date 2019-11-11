import React from "react"
import gql from "graphql-tag"

import { client } from "./apollo"

// Error boundaries currently have to be classes.
export class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Helper borrowed from React Concurrent docs
export function wrapPromise(promise) {
  let status = "pending"
  let result
  let suspender = promise.then(
    r => {
      status = "success"
      result = r
    },
    e => {
      status = "error"
      result = e
    }
  )
  return {
    read() {
      if (status === "pending") {
        throw suspender
      } else if (status === "error") {
        throw result
      } else if (status === "success") {
        return result
      }
    },
  }
}

// GraphQL query for the browser
const STARSHIP_QUERY = gql`
  query starships($count: Int) {
    allStarships(last: $count) {
      name
    }
  }
`

// Pokes GraphQL server, returns wrapped promise
export function starshipQuery(count) {
  const promise = client
    .query({
      query: STARSHIP_QUERY,
      variables: {
        count,
      },
    })
    .then(response => {
      return response.data
    })

  return wrapPromise(promise)
}
