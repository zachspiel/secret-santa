import React from 'react';
import { Button } from 'primereact/button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSantasList } from '../../redux/membersSlice';

interface Props {
  setError: (error: string) => void;
}

const GenerateList = (props: Props) => {
  const members = useAppSelector((state) => state.members.membersList);
  const dispatch = useAppDispatch();

  const shuffleArray = () => {
    const _members = [...members];
    for (let index = _members.length - 1; index > 0; index--) {
      const innerIndex = Math.floor(Math.random() * index);
      const temp = _members[index];
      _members[index] = _members[innerIndex];
      _members[innerIndex] = temp;
    }

    dispatch(setSantasList(_members));
  };

  const generateList = () => {
    if (members.length < 3) {
      props.setError('There must be at least three members in a group. ');
    } else {
      props.setError('');
      shuffleArray();
    }
  };

  return (
    <div className='row justify-content-center'>
      <div className='col-md-3 col-sm-6 mt-3'>
        <Button
          label='Generate List'
          icon='pi pi-refresh'
          className='p-button-success w-100'
          onClick={() => generateList()}
        />
      </div>
    </div>
  );
};

export default GenerateList;
