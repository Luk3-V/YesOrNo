import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { AppDispatch } from "../../store/store";
import { getError, getStatus, resetError, userSignIn } from "../../store/UserSlice";
import { useNavigate } from 'react-router-dom';
import Card from "../../components/Card";

interface Props {  
    
}

export default function LogIn(props:Props) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector(getStatus);
    const error = useSelector(getError);

    // on mount
    useEffect(() => {
        if(status === 'fail')
            dispatch(resetError());
    }, []);

    const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          form: {
            email: { value: string },
            password: { value:string },
          }
        };
        const info = {
            email: target.form.email.value,
            password: target.form.password.value,
        };

        await dispatch(userSignIn(info));
        navigate('/');
    }

    const handleGoogleLogIn = () => {
        
    }

    return (
        <div className="w-full max-w-xs">
            <h1 className="text-2xl font-bold mb-2">Log In</h1>
            <Card>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <Input id="email" type="email" placeholder="example@gmail.com" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <Input id="password" type="password" placeholder="************" />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Button onClick={handleLogIn} className="w-full mb-2" disabled={status === 'loading'}>
                            Log In
                        </Button>
                        <Button className="w-full mb-2" disabled={status === 'loading'} onClick={handleGoogleLogIn} type="outline">
                            <div className="inline-flex align-middle items-center">
                                <img src={require("../../assets/google-icon.png")} alt="" className="w-5 h-5 mr-3"/>
                                Log In with Google
                            </div>
                        </Button>
                        <span className="text-sm">
                            Dont have an account?
                            <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-1" to="/signup">
                                Sign Up
                            </Link>
                        </span>
                        {status === 'fail' && <span className="w-full text-sm text-center p-2 mt-2 border border-solid rounded-md border-red-300 bg-red-100">{error}</span>}
                    </div>
                </form>
            </Card>
        </div>
    );
}