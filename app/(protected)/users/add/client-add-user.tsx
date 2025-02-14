'use client';
import { memo } from 'react';
import eq from 'lodash/eq';
import MyBreadcrumbs from '@/app/custom-components/MyBreadcrumbs';
import UserEntry from '../user-entry';
import useAddUser from './useAddUser';
import { USER } from '@/app/types/UserDTO';
import LookupDTO from '@/app/types/LookupDTO';
type Props = { arrRoleLookup: LookupDTO[] };
const ClientAddUser = ({ arrRoleLookup }: Props) => {
  const { state } = useAddUser();
  return (
    <>
      <MyBreadcrumbs items={state.breadcrumbsItems}></MyBreadcrumbs>
      <UserEntry dtoUser={USER} arrRoleLookup={arrRoleLookup} />
    </>
  );
};

export default memo(ClientAddUser, (prevProps, nextProps) => {
  return eq(prevProps, nextProps); // Don't re-render!
});
