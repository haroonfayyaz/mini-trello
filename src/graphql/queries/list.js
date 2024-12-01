import { gql } from "@apollo/client";

export const GET_LISTS = gql`
  query {
    lists {
      id
      name
      cards {
        id
        title
        timestamp
      }
    }
  }
`;

export const CREATE_LIST = gql`
  mutation CreateList($name: String!) {
    createList(name: $name) {
      list {
        id
        name
      }
    }
  }
`;

export const DELETE_LIST = gql`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id) {
      success
    }
  }
`;

export const ADD_CARD_TO_LIST = gql`
  mutation AddCardToList($listId: ID!, $cardId: ID!) {
    addCardToList(listId: $listId, cardId: $cardId) {
      list {
        id
        name
      }
    }
  }
`;

export const MANAGE_CARD_IN_LIST = gql`
  mutation ManageCardInList(
    $sourceListId: ID!
    $destinationListId: ID!
    $cardId: ID!
  ) {
    manageCardInList(
      sourceListId: $sourceListId
      destinationListId: $destinationListId
      cardId: $cardId
    ) {
      sourceList {
        id
        name
      }
      destinationList {
        id
        name
      }
    }
  }
`; 
