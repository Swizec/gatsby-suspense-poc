import React, { Suspense } from "react"
import { graphql } from "gatsby"
import gql from "graphql-tag"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import { client } from "../apollo"

// Export static query for Gatsby
export const query = graphql`
  query {
    swapi {
      allStarships(last: 5) {
        name
      }
    }
  }
`

// Run query in browser on hydration
const BROWSER_QUERY = gql`
  query {
    swapi {
      allStarships {
        name
      }
    }
  }
`

function starshipQuery() {
  const promise = client.query({
    query: BROWSER_QUERY,
  })

  return wrapPromise(promise)
}

const starshipQuerySuspender = starshipQuery()

const StarshipsList = ({ list, title }) => (
  <>
    <h2>{title}</h2>
    <ul>
      {list.swapi.allStarships.map((ship, i) => (
        <li key={i}>{ship.name}</li>
      ))}
    </ul>
  </>
)

const Starships = ({ staticData }) => {
  const starships = starshipQuerySuspender.read()

  console.log(starships)

  return <Suspense fallback={<p>loading</p>}>Loaded</Suspense>
}

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>
      This is a proof of concept to show how we might use the new React Suspense
      with Gatsby.
    </p>
    <p>
      Initial data shows from compiled state. During hydration we kick off a new
      fetch for fresh data and replace when it's ready. Suspense makes the
      experience smooth and there is nary a flicker of old content or loading
      bars.
    </p>

    {/* <Suspense fallback={<p>loading</p>}>Loaded</Suspense> */}

    <Starships staticData={data} />

    {/* <Starships list={data} title="Statically compiled starships" /> */}

    {/* <Suspense fallback={"Loading"}> */}
    {/* <Starships list={starshipList} title="Dynamic starships" /> */}
    {/* </Suspense> */}

    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </Layout>
)

export default IndexPage

// Helper borrowed from React Concurrent docs
function wrapPromise(promise) {
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
