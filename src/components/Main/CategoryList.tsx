import React, { FunctionComponent } from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

export type CategoryListProps = {
  selectedCategory: string
  categoryList: {
    [key: string]: number
  }
}

const CategoryItem = styled(Link)<{ active: boolean }>`
  margin-right: 20px;
  padding: 5px 0;
  font-size: 18px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? '800' : '400')};
  &:last-of-type {
    margin-right: 0;
  }
`

const CategoryListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 768px;
  margin: 100px auto 0;
`

const CategoryList: FunctionComponent<CategoryListProps> = function ({
  selectedCategory,
  categoryList,
}) {
  return (
    <CategoryListWrapper>
      {Object.entries(categoryList).map(([name, count]) => (
        <CategoryItem
          to={`/?category=${name}`}
          active={name === selectedCategory}
          key={name}
        >
          #{name}({count})
        </CategoryItem>
      ))}
    </CategoryListWrapper>
  )
}

export default CategoryList
