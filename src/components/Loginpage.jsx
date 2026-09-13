import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Homepage.css";
import "./Authpage.css";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./config";

function Loginpage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!email || !password) {
            setError("error: credentials required");
            return;
        }

        setLoading(true);
        setError("");

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setError("");
                navigate("/");
            })
            .catch((err) => {
                console.log("ERROR : ", err);
                if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                    setError("error: invalid email or password");
                } else {
                    setError("error: " + err.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleGoogleLogin = () => {
        setError("");
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Google login success:", result.user);
                navigate("/");
            })
            .catch((err) => {
                console.log("Google Login Error:", err);
                if (err.code === "auth/popup-closed-by-user") {
                    setError("error: login popup closed");
                } else if (err.code === "auth/popup-blocked") {
                    setError("error: login popup blocked by browser");
                } else {
                    setError("error: " + err.message);
                }
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
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
                    <Link to="/signup" className="nav-link nav-link--cta">signup</Link>
                </nav>
            </header>

            <main className="relative z-10 flex items-center justify-center px-6 py-16 sm:py-24">
                <div className="auth-card w-full max-w-md">
                    <p className="terminal-line font-medium text-sm text-[#00e5ff] mb-6">
                        <span className="opacity-60">$</span> auth --login
                    </p>

                    <h1 className="auth-title">welcome back</h1>
                    <p className="auth-sub">// authenticate to continue</p>

                    <div className="auth-form mt-8">
                        <label className="auth-field">
                            <span className="auth-label">
                                <span className="text-[#6f7086]">$</span> email
                            </span>
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
                            <span className="auth-label">
                                <span className="text-[#6f7086]">$</span> password
                            </span>
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
                                    autoComplete="current-password"
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
                            onClick={handleLogin}
                            disabled={loading}
                            className="auth-submit mt-2"
                        >
                            {loading && <span className="auth-spinner" aria-hidden="true"></span>}
                            <span>{loading ? "./logging-in..." : "./login"}</span>
                            {!loading && <span className="auth-submit__arrow">→</span>}
                        </button>

                        <div className="auth-divider">
                            <span>// or</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="auth-google-btn"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    fill="#EA4335"
                                    d="M12 5c1.56 0 2.98.54 4.1 1.6l3.08-3.08C17.3 1.7 14.84 1 12 1 7.37 1 3.48 3.75 1.57 7.74l3.69 2.87C6.18 7.32 8.87 5 12 5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-2 3.71-4.94 3.71-8.7z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.26 14.61c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.57 7.16C.57 9.15 0 11.37 0 13.68s.57 4.53 1.57 6.52l3.69-2.87z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.45 1.16-4.22 1.16-3.13 0-5.82-2.32-6.74-5.61L1.57 15.63C3.48 19.62 7.37 23 12 23z"
                                />
                            </svg>
                            <span>continue with google</span>
                        </button>
                    </div>

                    <p className="auth-foot mt-8">
                        no account?{" "}
                        <Link to="/signup" className="auth-link">
                            ./signup
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Loginpage;