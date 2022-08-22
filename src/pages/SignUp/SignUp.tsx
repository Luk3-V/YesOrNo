import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { AppDispatch } from "../../store/store";
import { getError, getProfile, getStatus, resetError, userSignUp } from "../../store/UserSlice";

interface Props {  
   
}

export default function SignUp(props:Props) {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector(getStatus);
    const error = useSelector(getError);

    useEffect(() => {
        if(status === 'fail')
            dispatch(resetError());
    }, []);

    const handleSignUp = (e:React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          form: HTMLFormElement & {
            email: { value: string },
            password: { value:string },
            confirmPassword: { value:string }
          }
        };
        const info = {
            email: target.form.email.value,
            password: target.form.password.value,
            confirmPassword: target.form.confirmPassword.value
        };

        dispatch(userSignUp(info));
    }

    return (
        <div className="w-full max-w-xs">
            <h1 className="text-2xl font-bold mb-2">Create an account</h1>
            <form className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <Input id="email" type="email" placeholder="example@gmail.com" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <Input id="password" type="password" placeholder="************" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <Input id="confirmPassword" type="confirmPassword" placeholder="************" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Button className="w-full mb-2" disabled={status === 'loading'} onClick={handleSignUp}>
                        Sign Up
                    </Button>
                    <span className="text-sm">
                        Already have an account?
                        <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-1" to="/login">
                            Log In
                        </Link>
                    </span>
                    {status === 'fail' && <span className="w-full text-sm text-center p-2 mt-2 border border-solid rounded-md border-red-300 bg-red-100">{error}</span>}
                </div>
            </form>
        </div>
    );
    //"w-full mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline"
}