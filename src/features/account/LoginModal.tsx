import { useEffect, type ReactElement } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import type { LoginPayload } from "../../common/types";
import { useLoginUserMutation } from "../../redux/api";
import { useAppDispatch } from "../../redux/hooks";
import { setSignInStatus } from "../../appSlice";
import { type FormikProps, type FormikTouched, type FormikErrors, Formik } from "formik";
import { Button } from "primereact/button";
import { object, string } from "yup";

interface Props {
    isVisible: boolean;
    renderRegisterModal: () => void;
    onHide: () => void;
}

const initialValues: LoginPayload = {
    email: "",
    password: "",
};

export const loginValidationSchema = object().shape({
    email: string().trim().email().required("Email is required."),
    password: string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

type Key = keyof LoginPayload;
type FormProps = FormikProps<LoginPayload>;
type Touched = FormikTouched<LoginPayload>;
type Errors = FormikErrors<LoginPayload>;

const LoginModal = ({ isVisible, renderRegisterModal, onHide }: Props): ReactElement => {
    const dispatch = useAppDispatch();
    const [loginUser, { isError, data }] = useLoginUserMutation();

    useEffect(() => {
        if (!isError && data?.data !== undefined) {
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
        <Dialog
            header="Login"
            visible={isVisible}
            onHide={onHide}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "50vw" }}
        >
            <div className="p-grid p-fluid col">
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                        loginUser(values);
                    }}
                    validationSchema={loginValidationSchema}
                >
                    {(props) => (
                        <form onSubmit={props.handleSubmit}>
                            {createInputText("email", "Email Address", props)}
                            {createPasswordInput(
                                "password",
                                "Password",
                                "Enter password",
                                props,
                            )}

                            <Button className="w-100 mt-2" label="Login" type="submit" />
                        </form>
                    )}
                </Formik>
                <div>
                    <p>
                        {`Don't have an account? Click`}
                        <span
                            className="text-primary register-link"
                            onClick={renderRegisterModal}
                        >
                            {` here `}
                        </span>
                        to register.
                    </p>
                </div>
            </div>
        </Dialog>
    );
};

export default LoginModal;
