import { gql } from "@apollo/client";

export const GET_CARD = gql`
  query GetCard($id: ID!) {
    card(id: $id) {
      id
      title
      timestamp
      description
      list {
        name
      }
    }
  }
`;

export const CREATE_CARD = gql`
  mutation CreateCard($title: String!) {
    createCard(title: $title) {
      card {
        id
        title
        timestamp
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $title: String, $description: String, $estimate: Int) {
    updateCard(id: $id, title: $title, description: $description, estimate: $estimate) {
      success
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      success
    }
  }
`; 
