import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

interface Props {  
    handleSignUp: (values: any) => void
}

export default function SignUp(props:Props) {
    return (
        <div className="w-full max-w-xs">
            <h1 className="text-2xl font-bold mb-2">Create an account</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Confirm Password
                    </label>
                    <Input id="password" type="password" placeholder="************" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <button className="w-full mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline" type="button">
                        Sign Up
                    </button>
                    <span className="text-sm">
                        Already have an account?
                        <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-1" to="/login">
                            Log In
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    );
}