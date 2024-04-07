import { authRegister } from "api/auth.http";
import CardMessageComponent from "components/card/card.message.component";
import InputButtonComponent from "components/input/input.button.component";
import InputTextComponent from "components/input/input.text.component";
import LoaderComponent from "components/loader/loader.component";
import { ChangeEvent, FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

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
    const hasError = Object.keys(errors).length !== 0

    const createUser = (data: CreateUserInput) => {
        setLoading(true);

        authRegister(data.username, data.email, data.password);
    }

    console.log(errors)

    return <div className="min-h-screen border-x max-w-2xl border-neutral-700 m-auto">
        <div className="border-b p-4 border-neutral-700">
            <h2 className="text-2xl font-bold">create new user</h2>
        </div>
        <div className="relative">
            {hasError ? 
                <CardMessageComponent className=" border-x-0 border-t-0" title="errors creating user" type="alert">
                    <ul className="list-disc pl-6 italic">
                        {Object.entries(errors).map(value => {
                            const [fieldName, errorInfo] = value;
                            
                            if(errorInfo.type === "required") {
                                return <li>{fieldName} is required</li>
                            } else if(errorInfo.type === "pattern") {
                                return <li>{fieldName} is invalid</li>
                            } else if (errorInfo.type === "minLength") {
                                return <li>{fieldName} is too short</li>
                            }
                        })}
                    </ul>
                </CardMessageComponent>
            : null }

            <form onSubmit={handleSubmit(createUser)}>
                <div className="border-b p-4 space-y-4 border-neutral-700">
                    <InputTextComponent 
                        {...register("username", {required: true, maxLength: 12})} 
                        label="username" 
                        placeholder="username..."
                    />
                    <InputTextComponent 
                        {...register("email", {required: true, pattern: /^\w[\w\d]*\@\w[\w\d]*.\w*$/})} 
                        label="email" 
                        placeholder="email@example.com..."
                    />
                    <InputTextComponent 
                        {...register("password", {required: true, minLength: 6})} 
                        placeholder="password..." 
                        type="password"
                    />
                </div>
                <div className="p-4">
                    <InputButtonComponent type="submit" disabled={ hasError }>
                        create
                    </InputButtonComponent>
                </div>
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
