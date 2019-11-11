import React, { Suspense } from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import { starshipQuery, ErrorBoundary } from "../util"

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

// Run query on browser hydration
const starshipQuerySuspender = starshipQuery(10)

const Starships = () => {
  const starships = starshipQuerySuspender.read()

  return <StarshipsList list={starships} title="10 Dynamically loaded ships" />
}

const StarshipsList = ({ list, title }) => (
  <>
    <h2>{title}</h2>
    <ul>
      {list.allStarships.map((ship, i) => (
        <li key={i}>{ship.name}</li>
      ))}
    </ul>
  </>
)

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
    <p>Try going "offline" in DevTools and reload the page.</p>

    <p>
      <big>
        Click{" "}
        <Link
          to="/page-2"
          state={
            {
              // starshipQuerySuspender: () => starshipQuery(15), didn't work either
            }
          }
        >
          page 2
        </Link>{" "}
        for an almost true fetch-as-you-load experience
      </big>
    </p>

    <p>
      Read full article for details 👉 <a href="">swizec.com/blog</a>
    </p>

    <Suspense
      fallback={
        <StarshipsList
          list={data.swapi}
          title="Statically compiled starships"
        />
      }
    >
      <ErrorBoundary
        fallback={
          <StarshipsList
            list={data.swapi}
            title="Failed to fetch, these are static"
          />
        }
      >
        <Starships />
      </ErrorBoundary>
    </Suspense>

    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </Layout>
)

export default IndexPage
