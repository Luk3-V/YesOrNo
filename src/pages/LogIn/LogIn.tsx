import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

interface Props {  
    handleLogIn: (values: any) => void
}

export default function LogIn(props:Props) {
    return (
        <div className="w-full max-w-xs">
            <h1 className="text-2xl font-bold mb-2">Log In</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                    <Button onClick={props.handleLogIn} className="w-full mb-2" type="button">
                        Log In
                    </Button>
                    <span className="text-sm">
                        Dont have an account?
                        <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-1" to="/signup">
                            Sign Up
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    );
}