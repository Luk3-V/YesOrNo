import { SyntheticEvent, useCallback, useEffect, useInsertionEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { AppDispatch } from "../../store/store";
import { getError, getIsNewUser, getProfile, getStatus, googleSignIn, resetError, userSignUp } from "../../store/UserSlice";
import { debounce } from 'lodash';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { test } from "../../store/UserThunks";

export default function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector(getStatus);
    const error = useSelector(getError);
    const isNewUser = useSelector(getIsNewUser);

    // on mount
    useEffect(() => {
        if(status === 'fail')
            dispatch(resetError());
    }, []);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          form: {
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

        dispatch(userSignUp(info))
            .then((action) => {
                if(action.meta.requestStatus === 'fulfilled' && (action.payload as any).isNewUser) //quick fix to handle new user
                    navigate('/create');
            });
    }

    // have to call popup here or else redirects path
    const handleGoogleSignUp = (e: Event) => {
        e.preventDefault();
        dispatch(googleSignIn())
            .then((action) => {
                if(action.meta.requestStatus === 'fulfilled' && (action.payload as any).isNewUser) //quick fix to handle new user
                    navigate('/create');
            });
    }

    return (
        <div className="w-full max-w-sm">
            <>{console.log('sign render')}</>
            <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
            <Card>
                <form>
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
                        <Input id="confirmPassword" type="password" placeholder="************" />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Button className="w-full mb-2" disabled={status === 'loading'} onClick={handleSignUp} >
                            Sign Up
                        </Button>
                        <Button className="w-full mb-2" disabled={status === 'loading'} onClick={handleGoogleSignUp} type="outline">
                            <div className="inline-flex align-middle items-center">
                                <img src={require("../../assets/google-icon.png")} alt="" className="w-5 h-5 mr-3"/>
                                Sign Up with Google
                            </div>
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
            </Card>
        </div>
    );
}