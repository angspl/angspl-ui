import gql from 'graphql-tag';

export const ADD_COMPANY = gql`
  mutation addCompany(
    $company_code: String
    $company_name: String!
    $company_type: String
    $email: String
    $phone_no: String
    $address: String
    $status: String
  ) {
    addCompany(
      addCompanyInput: {
        company_code: $company_code
        company_name: $company_name
        company_type: $company_type
        email: $email
        phone_no: $phone_no
        address: $address
        status: $status
      }
    )
  }
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompany(
    $id: Int!
    $company_code: String
    $company_name: String!
    $company_type: String
    $email: String
    $phone_no: String
    $address: String
    $status: String
  ) {
    updateCompany(
      updateCompanyInput: {
        id: $id
        company_code: $company_code
        company_name: $company_name
        company_type: $company_type
        email: $email
        phone_no: $phone_no
        address: $address
        status: $status
      }
    )
  }
`;

export const DELETE_COMPANY = gql`
  mutation deleteCompany($ids: [Int]!) {
    deleteCompany(deleteCompanyInput: { ids: $ids })
  }
`;

export const COMPANY_LOOKUP = gql`
  query getCompanyLookup {
    getCompanyLookup {
      id
      text
    }
  }
`;

export const COMPANY_LIST = gql`
  query getCompanyList($filter_text: String, $sort_direction: String, $sort_field: String, $offset: Int, $limit: Int) {
    getCompanyList(
      getCompanyListInput: {
        filter_text: $filter_text
        sort_direction: $sort_direction
        sort_field: $sort_field
        offset: $offset
        limit: $limit
      }
    ) {
      total_records
      companies {
        id
        company_code
        company_name
        company_type
        email
        phone_no
        address
        status
        created_by
        created_by_first_name
        created_by_last_name
        created_by_user_name
        created_at
        modified_by
        modified_by_first_name
        modified_by_last_name
        modified_by_user_name
        modified_at
      }
    }
  }
`;

export const GET_COMPANY = gql`
  query getCompany($id: Int!) {
    getCompany(getCompanyInput: { id: $id }) {
      id
      company_code
      company_name
      company_type
      email
      phone_no
      address
      status
      created_by
      created_by_first_name
      created_by_last_name
      created_by_user_name
      created_at
      modified_by
      modified_by_first_name
      modified_by_last_name
      modified_by_user_name
      modified_at
    }
  }
`;

export const GET_COMPANY_ALL = gql`
  query getCompanyAll {
    getCompanyAll {
      id
      company_code
      company_name
      company_type
      email
      phone_no
      address
      status
    }
  }
`;

// export const GET_COMPANY_NAME_EXIST = gql`
//   query getCompanyNameExist($id: Int!, $role_name: String!) {
//     getCompanyNameExist(id: $id, role_name: $role_name)
//   }
// `;
