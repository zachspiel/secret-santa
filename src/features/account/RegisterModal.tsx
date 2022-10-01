import React from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import { RegisterPayload, useRegisterUserMutation } from "../../redux/api";
import { useAppDispatch } from "../../redux/hooks";
import { setSignInStatus } from "../../appSlice";
import { object, string, ref } from "yup";
import { Formik, FormikErrors, FormikProps, FormikTouched } from "formik";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

interface Props {
    isVisible: boolean;
    renderLoginModal: () => void;
    onHide: () => void;
}

type Key = keyof RegisterUserValues;
type FormProps = FormikProps<RegisterUserValues>;
type Touched = FormikTouched<RegisterUserValues>;
type Errors = FormikErrors<RegisterUserValues>;

interface RegisterUserValues extends RegisterPayload {
    passwordConfirmation: string;
}

const initialValues: RegisterUserValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
};

export const registerValidationSchema = object().shape({
    firstName: string()
        .trim()
        .min(3, "First name must be at least 3 characters long.")
        .max(20, "First name cannot be longer than 20 characters.")
        .required("First name is required."),
    lastName: string()
        .trim()
        .min(3, "Last name must be at least 3 characters long.")
        .max(20, "Last name cannot be longer than 20 characters.")
        .required("Last name is required."),
    email: string().trim().email().required("Email is required."),
    password: string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    passwordConfirmation: string()
        .trim()
        .oneOf([ref("password"), null], "Passwords must match"),
});

const RegisterModal = (props: Props): JSX.Element => {
    const dispatch = useAppDispatch();
    const [registerUser, { isError, data }] = useRegisterUserMutation();
    const { isVisible, renderLoginModal, onHide } = props;

    React.useEffect(() => {
        if (!isError && data?.data !== undefined) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("currentUser", data.data.currentUser);
            dispatch(setSignInStatus(true));
            onHide();
        }
    }, [dispatch, isError, data, onHide]);

    const createInputText = (key: Key, label: string, formProps: FormProps) => {
        const { handleChange, values, touched, errors } = formProps;
        return (
            <div className="p-field">
                <label htmlFor={key}>{label}</label>
                <div className="p-inputgroup">
                    <InputText
                        id={key}
                        value={values[key]}
                        placeholder={`Enter ${label.toLocaleLowerCase()}`}
                        onChange={handleChange}
                    />
                </div>
                {createError(key, errors, touched)}
            </div>
        );
    };

    const createPasswordInput = (
        key: Key,
        label: string,
        placeHolder: string,
        formProps: FormProps,
    ) => {
        const { handleChange, values, touched, errors } = formProps;
        return (
            <div className="p-field">
                <label htmlFor={key}>{label}</label>
                <div className="p-inputgroup">
                    <Password
                        inputId={key}
                        toggleMask
                        feedback={false}
                        value={values[key]}
                        placeholder={placeHolder}
                        onChange={handleChange}
                    />
                </div>
                {createError(key, errors, touched)}
            </div>
        );
    };

    const createError = (key: Key, errors: Errors, touched: Touched) => {
        return (
            <>
                {errors[key] && touched[key] && (
                    <small id={`${key}-help`} className="p-error p-d-block">
                        {errors[key]}
                    </small>
                )}
            </>
        );
    };
    return (
        <Dialog header="Register" onHide={() => onHide} visible={isVisible}>
            <div className="p-grid p-fluid col">
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        registerUser(values);
                    }}
                    validationSchema={registerValidationSchema}
                >
                    {(props) => (
                        <form onSubmit={props.handleSubmit}>
                            {createInputText("firstName", "First Name", props)}
                            {createInputText("lastName", "Last Name", props)}
                            {createInputText("email", "Email Address", props)}
                            {createPasswordInput(
                                "password",
                                "Password",
                                "Enter password",
                                props,
                            )}
                            {createPasswordInput(
                                "passwordConfirmation",
                                "Confirm Password",
                                "Confirm Password",
                                props,
                            )}

                            <Button
                                className="w-100 mt-2"
                                label="Register"
                                type="submit"
                            />
                        </form>
                    )}
                </Formik>

                {data?.error && (
                    <Message
                        severity="error"
                        className="mb-2 mt-2"
                        text={data?.error ?? "Error while registring user."}
                    />
                )}

                <div>
                    <p>
                        Already have an account? Click
                        <span
                            className="text-primary register-link"
                            onClick={() => renderLoginModal}
                        >
                            {` here `}
                        </span>
                        to login.
                    </p>
                </div>
            </div>
        </Dialog>
    );
};

export default RegisterModal;
