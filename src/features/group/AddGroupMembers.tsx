import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import Header from '../../components/Header';
import AddPersonForm from './AddPersonForm';
import MembersList from './MembersList';
import GenerateList from './GenerateList';
import Snowfall from 'react-snowfall';

const AddGroupMembers = () => {
  const members = useAppSelector((state) => state.members.membersList);
  const [error, setError] = React.useState('');

  return (
    <div className='container-fluid text-center'>
      <Header />
      <div>
        <AddPersonForm members={members} error={error} />

        <GenerateList setError={setError} />
        {members.length > 0 && <MembersList />}
      </div>
      <Snowfall color='white' />
    </div>
  );
};

export default AddGroupMembers;
