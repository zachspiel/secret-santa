import React, { useState } from 'react';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { RegisterPayload } from '../../common/types';
import { Dialog } from 'primereact/dialog';

interface Props {
  isVisible: boolean;
  renderLoginModal: () => void;
  onHide: () => void;
}

const RegisterModal = (props: Props): JSX.Element => {
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const [formData, setFormData] = useState<RegisterPayload>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const isDisabled =
    !isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid;

  const onSubmit = () => {
    if (!isDisabled) {
      // void registerUser(formData);
      console.log('IS VALID');
    }
  };
  /*
    React.useEffect(() => {
        if (!isError && data !== undefined) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("currentUser", data.data.currentUser);
            localStorage.setItem("isLightmode", "true");

            setTimeout(() => {
                history.push("/app");
            }, 3000);
        }
    }, [isError, data, history]);*/

  const updateFormData = (name: keyof RegisterPayload, value: string) => {
    const _formData = { ...formData };
    _formData[name] = value;
    setFormData(_formData);
  };

  const verifyFirstNameInput = (value: string) => {
    setIsFirstNameValid(value.length >= 3);
  };

  const verifyLastNameInput = (value: string) => {
    setIsLastNameValid(value.length >= 3);
  };

  const createErrorMessage = (isValid: boolean, message: string) => {
    if (!isValid) {
      return (
        <small id='email-help' className='p-error p-d-block'>
          {message}
        </small>
      );
    }
  };

  const verifyPassword = () => {
    setIsPasswordValid(formData.password.length > 6);
  };

  const verifyEmail = () => {
    const emailIsValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email);
    setIsEmailValid(emailIsValid);
  };

  return (
    <Dialog header='Register' onHide={() => props.onHide} visible={props.isVisible}>
      <div className='p-grid p-fluid col'>
        <div className='p-field'>
          <label htmlFor='name'>Email Address</label>
          <div className='p-inputgroup'>
            <InputText
              id='firstName'
              value={formData.firstName}
              placeholder='first name'
              onChange={(e) => {
                updateFormData('firstName', e.target.value);
                verifyFirstNameInput(e.target.value);
              }}
              required
              autoFocus
            />
          </div>
        </div>
        <div className='p-field mb-2'>
          <label htmlFor='lastName'>Last Name</label>
          <div className='p-inputgroup'>
            <InputText
              id='lastName'
              value={formData.lastName}
              placeholder='last name'
              onChange={(e) => {
                updateFormData('lastName', e.target.value);
                verifyLastNameInput(e.target.value);
              }}
              required
              autoFocus
            />
          </div>
          {createErrorMessage(
            isLastNameValid,
            'Last Name must be at least 3 characters long.'
          )}
        </div>

        <div className='p-field mb-2'>
          <label htmlFor='email'>Email Address</label>
          <div className='p-inputgroup'>
            <InputText
              id='email'
              value={formData.email}
              placeholder='email address'
              onChange={(e) => {
                updateFormData('email', e.target.value);
                verifyEmail();
              }}
              required
            />
          </div>
          {createErrorMessage(isEmailValid, 'Email is not valid.')}
        </div>
        <div className='p-field'>
          <label htmlFor='password'>Password</label>
          <div className='p-inputgroup'>
            <Password
              id='password'
              value={formData.password}
              placeholder='password'
              onChange={(e) => {
                updateFormData('password', e.target.value);
                verifyPassword();
              }}
              toggleMask
              required
            />
          </div>
          {createErrorMessage(
            isPasswordValid,
            'Password must be at least 6 characters long.'
          )}
        </div>
        <div className='d-flex align-items-center mt-2 mb-2'>
          <button className='btn btn-primary w-100' onClick={onSubmit}>
            Register
          </button>
        </div>

        <div>
          <p>
            Already have an account? Click
            <span
              className='text-primary register-link'
              onClick={() => props.renderLoginModal()}
            >
              {` here `}
            </span>
            here to login.
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default RegisterModal;
