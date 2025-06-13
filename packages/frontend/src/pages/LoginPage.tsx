import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface FormState {
    error?: string;
}

interface LoginPageProps {
    isRegistering?: boolean;
    onAuthSuccess?: (token: string) => void;
}

async function makeAuthRequest(endpoint: string, username: string, password: string, email?: string) {
    const body = email ? { username, password, email } : { username, password };
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return response.json();
}

async function handleRegister(username: string, password: string, email: string) {
    const data = await makeAuthRequest("/auth/register", username, password, email);
    console.log("Successfully created account");
    return data.token;
}

async function handleLogin(username: string, password: string) {
    const data = await makeAuthRequest("/auth/login", username, password);
    return data.token;
}

export function LoginPage({ isRegistering = false, onAuthSuccess }: LoginPageProps) {
    const usernameInputId = React.useId();
    const emailInputId = React.useId();
    const passwordInputId = React.useId();
    const navigate = useNavigate();
    const [shouldClearError, setShouldClearError] = React.useState(false);

    const [state, formAction, isPending] = React.useActionState(
        async (_previousState: FormState, formData: FormData): Promise<FormState> => {
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;
            const email = formData.get("email") as string;

            if (shouldClearError) {
                setShouldClearError(false);
                return {};
            }

            try {
                const token = isRegistering 
                    ? await handleRegister(username, password, email)
                    : await handleLogin(username, password);
                if (onAuthSuccess) {
                    onAuthSuccess(token);
                }
                navigate("/");
                return {};
            } catch (error) {
                return { 
                    error: error instanceof Error ? error.message : "Failed to connect to server. Please try again." 
                };
            }
        },
        {}
    );

    React.useEffect(() => {
        if (state.error) {
            setShouldClearError(true);
            formAction(new FormData());
        }
    }, [isRegistering]);

    return (
        <main className="container">
            <div className="auth-container">
                <h1>{isRegistering ? "Register a new account" : "Login"}</h1>
                <form className="auth-form" action={formAction}>
                    <div className="form-group">
                        <label htmlFor={usernameInputId}>Username</label>
                        <input 
                            id={usernameInputId} 
                            name="username"
                            type="text"
                            required 
                            disabled={isPending}
                            placeholder="Enter your username"
                        />
                    </div>

                    {isRegistering && (
                        <div className="form-group">
                            <label htmlFor={emailInputId}>Email</label>
                            <input 
                                id={emailInputId} 
                                name="email"
                                type="email"
                                required 
                                disabled={isPending}
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor={passwordInputId}>Password</label>
                        <input 
                            id={passwordInputId} 
                            name="password"
                            type="password" 
                            required 
                            disabled={isPending}
                            placeholder={isRegistering ? "Create a password" : "Enter your password"}
                        />
                    </div>

                    <input 
                        type="submit" 
                        value="Submit" 
                        disabled={isPending}
                        className="auth-button"
                    />
                    {state.error && (
                        <p 
                            style={{ color: "red" }} 
                            aria-live="polite"
                        >
                            {state.error}
                        </p>
                    )}
                </form>
                {!isRegistering && (
                    <p className="auth-link">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                )}
                {isRegistering && (
                    <p className="auth-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                )}
            </div>
        </main>
    );
}