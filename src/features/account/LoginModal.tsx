import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';

interface Props {
  isVisible: boolean;
  renderRegisterModal: () => void;
  onHide: () => void;
}

const LoginModal = (props: Props) => {
  const [hasError, setError] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSubmit = () => {
    console.log('Submitted');
    setError(false);
  };

  return (
    <Dialog header='Login' visible={props.isVisible} onHide={props.onHide}>
      <>
        {hasError && (
          <small id='name-help' className='p-error p-d-block'>
            The email or password you entered is incorrect.
          </small>
        )}
        <div className='p-grid p-fluid col'>
          <div className='p-field'>
            <label htmlFor='name'>Email Address</label>
            <div className='p-inputgroup'>
              <InputText
                id='name'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className='p-field'>
            <label htmlFor='password'>Password</label>
            <div className='p-inputgroup'>
              <Password
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
                required
                feedback={false}
              />
            </div>
          </div>

          <div className='d-flex align-items-center mt-2 mb-2'>
            <button className='btn btn-primary w-100' onClick={onSubmit}>
              Login
            </button>
          </div>

          <div>
            <p>
              Don't have an account? Click
              <span
                className='text-primary register-link'
                onClick={() => props.renderRegisterModal()}
              >
                {` here `}
              </span>
              to register.
            </p>
          </div>
        </div>
      </>
    </Dialog>
  );
};

export default LoginModal;
