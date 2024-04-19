import { useState } from "react";
import { useForm } from "react-hook-form";
import { authRegister } from "api/auth.http";
import CardMessageComponent from "components/card/card.message.component";
import InputButtonComponent from "components/input/input.button.component";
import InputTextComponent from "components/input/input.text.component";
import LoaderComponent from "components/loader/loader.component";

type CreateUserInput = {
    email: string,
    username: string,
    password: string,
}

export default function Register() {
    const [loading, setLoading] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<CreateUserInput>();
    const hasError = Object.keys(errors).length !== 0;

    const createUser = (data: CreateUserInput) => {
        setLoading(true);
        authRegister(data.username, data.email, data.password);
    }

    return <div className="min-h-screen max-w-2xl border-neutral-700 m-auto">
        <div className="p-4 border-neutral-700">
            <h2 className="text-2xl font-bold">create new user</h2>
        </div>
        <div className="relative p-4">
            {hasError ? 
                <CardMessageComponent title="errors creating user" type="alert">
                    <ul className="list-disc pl-6 italic">
                        {Object.values(errors).map((error, i) => {
                            return <li key={ i }>{error.message!}</li>
                        })}
                    </ul>
                </CardMessageComponent>
            : null }

            <form onSubmit={handleSubmit(createUser)}>
                <div className="space-y-4 my-4 border-neutral-700">
                    <InputTextComponent 
                        {...register("username", {required: "username field is required", maxLength: {value: 12, message: "username is too long"}})} 
                        label="username" 
                        placeholder="username..."
                    />
                    <InputTextComponent 
                        {...register("email", {required: "email field is required", pattern: {value: /^\w+\@\w+(\.\w+)+$/, message: "invalid email format"}})} 
                        label="email" 
                        placeholder="email@example.com..."
                    />
                    <InputTextComponent 
                        {...register("password", {required: "password field is required", minLength: {value: 6, message: "password is too short"}})} 
                        placeholder="password..." 
                        type="password"
                    />
                </div>
                <InputButtonComponent type="submit" disabled={ hasError }>
                    create
                </InputButtonComponent>
            </form>
            { loading ?
                <div className="absolute left-0 right-0 top-0 bottom-0 bg-neutral-600/50">
                    <div className="m-auto w-min mt-8">
                        <LoaderComponent/>
                    </div>    
                </div>
            : null }
        </div>
    </div>
}
