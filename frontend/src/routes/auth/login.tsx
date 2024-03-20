import { Link, Navigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import InputButtonComponent from "components/input/input.button.component";
import InputTextComponent from "components/input/input.text.component";
import { useAuth } from "api/auth.context";

export default function Login() {
    const { authenticate, isAuthenticated } = useAuth();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    if(isAuthenticated){
        return <Navigate to="/"/>
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        authenticate(credentials.email, credentials.password);
    }

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (<>
        <div className="max-w-[400px] m-auto mt-16">
            <form className="my-4" onSubmit={ handleSubmit }>
                <div>
                    <InputTextComponent name="email" placeholder="email address..." onChange={ handleInput }  />
                </div>    
                <div className="my-4">
                    <InputTextComponent name="password" type="password" placeholder="password..."  onChange={ handleInput } />
                </div>
                <InputButtonComponent className="bg-transparent font-bold">
                    login
                </InputButtonComponent>
            </form>
            <Link to="/auth/register">register instead</Link>
        </div>
    </>);
}
