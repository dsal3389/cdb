import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "api/auth.context";
import InputButtonComponent from "components/input/input.button.component";
import InputTextComponent from "components/input/input.text.component";
import CardMessageComponent from "components/card/card.message.component";

type LoginInput = {
    email: string,
    password: string
}

export default function Login() {
    const { authenticate, isAuthenticated } = useAuth();
    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<LoginInput>();

    if(isAuthenticated){
        return <Navigate to="/"/>
    }

    const login = (data: LoginInput) => {
        authenticate(data.email, data.password).catch((error: Error) => {
            setError("root", {message: error.message})
        });
    }

    return (<>
        <div className="max-w-[400px] m-auto mt-16">
            {Object.keys(errors).length ? 
                <CardMessageComponent type="alert">
                    <ul>
                        {Object.values(errors).map((error, i) => (
                            <li key={ i }>{error.message}</li>
                        ))}
                    </ul>    
                </CardMessageComponent>
            : null }
            <form className="my-4" onSubmit={ handleSubmit(login) }>
                <div>
                    <InputTextComponent {...register("email", {required: "email is required", pattern: {value: /^\w+\@\w+(\.\w+)+$/, message: "invalid email format"}})} placeholder="email address..."/>
                </div>    
                <div className="my-4">
                    <InputTextComponent {...register("password", {required: "password is required"})} type="password" placeholder="password..."/>
                </div>
                <InputButtonComponent className="bg-transparent font-bold">
                    login
                </InputButtonComponent>
            </form>
            <Link to="/auth/register" className="text-blue-300 underline">
                register instead
            </Link>
        </div>
    </>);
}
