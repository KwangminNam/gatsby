import React, { FunctionComponent, useMemo } from "react"
import styled from "@emotion/styled"
import GlobalStyle from "components/Common/GlobalStyle"
import Footer from "components/Common/Footer"
import CategoryList, { CategoryListProps } from "components/Main/CategoryList"
import Introduction from "components/Main/Introduction"
import PostList from "components/Main/PostList"
import { graphql } from "gatsby"
import { PostListItemType } from "types/PostItem.type"
import queryString, { ParsedQuery } from "query-string"
import { IGatsbyImageData } from "gatsby-plugin-image"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

type IndexPageProps = {
  location: {
    search: string
  }
  data: {
    allMarkdownRemark: {
      edges: PostListItemType[]
    }
    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
}

const IndexPage: FunctionComponent<IndexPageProps> = function ({
  location: { search },
  data: {
    allMarkdownRemark: { edges },
    file: {
      childImageSharp: { gatsbyImageData },
    },
  },
}) {
  const parsed: ParsedQuery<string> = queryString.parse(search)
  const selectedCategory: string =
    typeof parsed.category !== "string" || !parsed.category
      ? "All"
      : parsed.category

  const categoryList = useMemo(
    () =>
      edges.reduce(
        (list: CategoryListProps["categoryList"], {
          node: {
              frontmatter: { categories },
            },
          }: PostListItemType
        ) => {
          categories.forEach(category => {
            if (list[category] === undefined) list[category] = 1
            else list[category]++
          })

          list["All"]++

          return list
        },
        { All: 0 }
      ),
    []
  )

  console.log(categoryList, "categoryList")

  return (
    <Container>
      <GlobalStyle />
      <Introduction profileImage={gatsbyImageData} />
      <CategoryList
        selectedCategory={selectedCategory}
        categoryList={categoryList}
      />
      <PostList posts={edges} />
      <Footer />
    </Container>
  )
}

export default IndexPage

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
    }
  }
`
