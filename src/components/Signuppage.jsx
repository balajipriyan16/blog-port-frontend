import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Homepage.css";
import "./Authpage.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

function Signuppage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = () => {
        if (!email || !password) {
            setError("error: credentials required");
            return;
        }

        setLoading(true);
        setError("");

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User registered:", userCredential.user);
                navigate("/");
            })
            .catch((err) => {
                console.log("Signup Error:", err);
                if (err.code === "auth/email-already-in-use") {
                    setError("error: email is already registered");
                } else if (err.code === "auth/weak-password") {
                    setError("error: password should be at least 6 characters");
                } else if (err.code === "auth/invalid-email") {
                    setError("error: invalid email address");
                } else {
                    setError("error: " + err.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSignup();
        }
    };

    return (
        <div className="font-jetbrains min-h-screen bg-[#060608] text-[#eef0f5] relative overflow-x-hidden">
            <div className="scanlines pointer-events-none fixed inset-0 z-40" aria-hidden="true"></div>
            <div className="bg-grid pointer-events-none fixed inset-0 -z-10" aria-hidden="true"></div>
            <div className="blob blob-cyan pointer-events-none -z-10" aria-hidden="true"></div>
            <div className="blob blob-magenta pointer-events-none -z-10" aria-hidden="true"></div>

            <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6 text-xs sm:text-sm">
                <Link to="/" className="text-[#6f7086] hover:text-[#00e5ff] transition-colors">
                    balaji@dev<span className="text-[#00e5ff]">:~$</span>
                </Link>
                <nav className="flex items-center gap-5 sm:gap-7">
                    <Link to="/" className="nav-link">home</Link>
                    <Link to="/login" className="nav-link nav-link--cta">login</Link>
                </nav>
            </header>

            <main className="relative z-10 flex items-center justify-center px-6 py-16 sm:py-24">
                <div className="auth-card w-full max-w-md">
                    <p className="terminal-line font-medium text-sm text-[#00e5ff] mb-6">
                        <span className="opacity-60">$</span> auth --signup
                    </p>

                    <h1 className="auth-title">create account</h1>
                    <p className="auth-sub">// initialize a new user</p>

                    <div className="auth-form mt-8">
                        <label className="auth-field">
                            <span className="auth-label"><span className="text-[#6f7086]">$</span> email</span>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="you@domain.com"
                                autoComplete="email"
                                className="auth-input"
                            />
                        </label>

                        <label className="auth-field">
                            <span className="auth-label"><span className="text-[#6f7086]">$</span> password</span>
                            <div className="auth-input-wrap">
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="auth-input"
                                />
                                <button
                                    type="button"
                                    className="auth-toggle"
                                    onClick={() => setShowPass((s) => !s)}
                                    aria-label={showPass ? "hide password" : "show password"}
                                >
                                    {showPass ? "hide" : "show"}
                                </button>
                            </div>
                        </label>

                        {error && <p className="auth-error">{error}</p>}

                        <button
                            type="button"
                            onClick={handleSignup}
                            disabled={loading}
                            className="auth-submit mt-2"
                        >
                            {loading && <span className="auth-spinner" aria-hidden="true"></span>}
                            <span>{loading ? "./creating-account..." : "./create-account"}</span>
                            {!loading && <span className="auth-submit__arrow">→</span>}
                        </button>
                    </div>

                    <p className="auth-foot mt-8">
                        already have one?{" "}
                        <Link to="/login" className="auth-link">./login</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Signuppage;