import React, { Suspense } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
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

const dataSuspender = starshipQuery(15)

// const Starships = ({ dataSuspender }) => {
const Starships = () => {
  const starships = dataSuspender.read()

  return <StarshipsList list={starships} title="15 Dynamically loaded ships" />
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

const SecondPage = ({ data, location }) => {
  //   const { dataSuspender } = location

  return (
    <Layout>
      <SEO title="Page two" />
      <h1>Hi from the second page</h1>
      <p>
        Here we use the same load-on-hydration approach as before, but Gatsby's
        router called our top level queries while routing. Did you see the short
        starship list at all?
      </p>
      <Link to="/">Go back to the homepage</Link>
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
          {/* <Starships dataSuspender={dataSuspender} /> */}
          <Starships />
        </ErrorBoundary>
      </Suspense>
    </Layout>
  )
}

export default SecondPage
