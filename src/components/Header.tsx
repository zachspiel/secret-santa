import React from 'react';
import { Avatar } from 'primereact/avatar';
import santaImage from '../images/santa.svg';
import { useHistory } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import AccountModals from '../features/account/AccountModals';
//import RegisterPage from '../features/account/RegisterPage';

const Header = (): JSX.Element => {
  const menu = React.useRef<Menu>(null);
  const history = useHistory();
  const [showModal, setShowModal] = React.useState(false);
  const currentUser = localStorage.getItem('currentUser');

  let items = [
    {
      label: 'Manage Groups',
      icon: 'pi pi-users',
      command: () => history.push('/groups'),
    },
    {
      label: 'Register',
      icon: 'pi pi-fw pi-trash',
      command: () => history.push('/register'),
    },
    // add logout conditionally {label: 'Register', icon: 'pi pi-fw pi-trash'}
  ];

  return (
    <>
      <div className='row justify-content-end'>
        <Menu model={items} popup ref={menu} id='popup-menu' />
        <Avatar
          icon='pi pi-user'
          className='m-2'
          size='large'
          shape='circle'
          onClick={(e) =>
            currentUser !== null ? menu.current?.toggle(e) : setShowModal(!showModal)
          }
          aria-controls='popup-menu'
          aria-haspopup
        />
      </div>
      <div className='row justify-content-center text-center'>
        <img src={santaImage} alt='Santa' style={{ width: '6rem', marginTop: '2rem' }} />
        <h3>
          <b>Secret Santa Generator</b>
        </h3>
      </div>
      <AccountModals isVisible={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};
export default Header;
