import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import "./Blogpage.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config";
import axios from "axios"



const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = RAW_API_URL.replace(/\/+$/, "");

function Blogpage() {
    const [isAdmin,setIsAdmin] = useState(false);
    const [initialPosts, setBlogs] = useState([]);
    const [likes, setLikes] = useState({});
    const [liked, setLiked] = useState({});

    const [IsLoggedIn, setLogIn] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
    const [actionError, setActionError] = useState("");
    const errorTimerRef = useRef(null);

    const triggerError = (msg) => {
        if (errorTimerRef.current) {
            clearTimeout(errorTimerRef.current);
        }
        setActionError(msg);
        errorTimerRef.current = setTimeout(() => {
            setActionError("");
        }, 4500);
    };

    useEffect(() => {
        return () => {
            if (errorTimerRef.current) {
                clearTimeout(errorTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, user => {
            if (user) {
                const adminUid = import.meta.env.VITE_ADMIN_UID;
                console.log(user.uid === adminUid);
                setIsAdmin(user.uid === adminUid);
                setLogIn(true);
            }
            else {
                setIsAdmin(false);
                setLogIn(false);
            }
        })
        return unSub;
    }, [])

    useEffect(() => {
        axios.get(`${API_URL}/data`)
            .then((res) => {
                const data = res.data.data || [];
                setBlogs(data);
                const initialLikes = {};
                const initialLiked = {};
                const currentUid = auth.currentUser?.uid;
                data.forEach((p) => {
                    const postLikes = Array.isArray(p.likes) ? p.likes : [];
                    initialLikes[p._id] = postLikes.length;
                    if (currentUid) {
                        initialLiked[p._id] = postLikes.includes(currentUid);
                    }
                });
                setLikes(initialLikes);
                setLiked(initialLiked);
            })
            .catch((err) => {
                console.log(err);
                triggerError("Failed to load blog posts from database");
            })
            .finally(() => {
                setIsLoadingBlogs(false);
            });
    }, [IsLoggedIn]);

    function SetLike(pid) {
        if (!auth.currentUser) {
            triggerError("Please login to like posts!");
            return;
        }

        const currentUid = auth.currentUser.uid;
        const isCurrentlyLiked = Boolean(liked[pid]);
        const currentCount = likes[pid] !== undefined ? likes[pid] : 0;
        const nextLiked = !isCurrentlyLiked;
        const nextCount = isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

        // 1. Immediately update UI state (optimistic)
        setLiked((prev) => ({
            ...prev,
            [pid]: nextLiked
        }));
        setLikes((prev) => ({
            ...prev,
            [pid]: nextCount
        }));

        // 2. Send background update to backend
        axios.patch(`${API_URL}/data/${pid}/like`, {
            uid: currentUid
        })
            .then((response) => {
                const updatedLikes = response.data?.data?.likes || [];
                setLikes((prev) => ({
                    ...prev,
                    [pid]: updatedLikes.length
                }));
                setLiked((prev) => ({
                    ...prev,
                    [pid]: updatedLikes.includes(currentUid)
                }));
            })
            .catch((error) => {
                console.log("Like Error:", error);
                // Roll back if request fails
                setLiked((prev) => ({
                    ...prev,
                    [pid]: isCurrentlyLiked
                }));
                setLikes((prev) => ({
                    ...prev,
                    [pid]: currentCount
                }));
                triggerError(error.response?.data?.message || "Failed to update like. Please try again.");
            });
    }

    const handleCreateBlog = (e) => {
        if (e) e.preventDefault();
        if (!newTitle.trim() || !newDescription.trim()) {
            setCreateError("error: Title and description are required");
            return;
        }

        setIsSubmitting(true);
        setCreateError("");
        setCreateSuccess("");

        axios.post(`${API_URL}/data`, {
            title: newTitle.trim(),
            description: newDescription.trim()
        })
            .then((res) => {
                const created = res.data?.data;
                if (created) {
                    setBlogs((prev) => [created, ...prev]);
                    setLikes((prev) => ({ ...prev, [created._id]: 0 }));
                    setLiked((prev) => ({ ...prev, [created._id]: false }));
                    setNewTitle("");
                    setNewDescription("");
                    setCreateSuccess("blog published successfully");
                    setTimeout(() => setCreateSuccess(""), 4000);
                }
            })
            .catch((err) => {
                console.log("Create Blog Error:", err);
                setCreateError(err.response?.data?.message || "error publishing blog");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
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
                    <Link to="/" className="nav-link">
                        about
                    </Link>
                    <Link to="/blog" className="nav-link">
                        blog
                    </Link>
                    {
                        (!IsLoggedIn ? (<Link to="/login" className="nav-link nav-link--cta">login</Link>)
                            : (<button onClick={() => {
                                signOut(auth).then(() => {
                                    setLogIn(false);
                                    console.log("User Logged Out Successfully");
                                    window.location.href = '/blog';
                                });
                            }} className="nav-link nav-link--cta">LogOut</button>))
                    }

                </nav>
            </header>

            <main className="relative z-10 px-6 sm:px-10 pb-24">
                {/* ---------- page header ---------- */}
                <section className="pt-10 sm:pt-16 pb-10 max-w-4xl mx-auto">
                    <p className="terminal-line font-medium text-sm text-[#00e5ff] mb-7">
                        <span className="opacity-60">$</span> cat ./blog
                    </p>

                    <h1 className="blog-title reveal" style={{ animationDelay: "0.2s" }}>
                        My Blogs<span className="text-[#00e5ff]">_</span>
                    </h1>
                </section>

                {/* ---------- admin blog creation panel ---------- */}
                {isAdmin && (
                    <section className="max-w-4xl mx-auto">
                        <div className="admin-create-card">
                            <div className="admin-create-card__header">
                                <p className="terminal-line font-medium text-sm text-[#00e5ff]">
                                    <span className="opacity-60">$</span> blog --new
                                </p>
                                <span className="admin-badge">admin access</span>
                            </div>

                            <form onSubmit={handleCreateBlog} className="admin-form">
                                <div className="admin-field">
                                    <label className="admin-label">
                                        <span className="text-[#6f7086]">$</span> Blog Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => {
                                            setNewTitle(e.target.value);
                                            setCreateError("");
                                        }}
                                        placeholder="Enter blog title..."
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-field">
                                    <label className="admin-label">
                                        <span className="text-[#6f7086]">$</span> Blog Description
                                    </label>
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => {
                                            setNewDescription(e.target.value);
                                            setCreateError("");
                                        }}
                                        placeholder="Enter blog description..."
                                        className="admin-textarea"
                                        rows={3}
                                    />
                                </div>

                                {createError && <p className="admin-msg-error">{createError}</p>}
                                {createSuccess && <p className="admin-msg-success">{createSuccess}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="admin-submit-btn"
                                >
                                    {isSubmitting && <span className="btn-spinner" aria-hidden="true"></span>}
                                    <span>{isSubmitting ? "./publishing..." : "./publish-blog"}</span>
                                    {!isSubmitting && <span aria-hidden="true">→</span>}
                                </button>
                            </form>
                        </div>
                    </section>
                )}

                {/* ---------- post grid ---------- */}
                <section className="max-w-4xl mx-auto">
                    {isLoadingBlogs ? (
                        <div className="blog-loader-wrap">
                            <div className="cyber-spinner" role="status" aria-label="Loading blog posts"></div>
                            <p className="blog-loader-text">
                                <span className="text-[#00e5ff]">$</span> querying database<span className="blog-loader-dots">...</span>
                            </p>
                            <p className="blog-loader-sub">fetching posts from MongoDB</p>
                        </div>
                    ) : initialPosts.length === 0 ? (
                        <div className="blog-empty">
                            <p className="text-sm text-[#00e5ff] mb-2 font-medium">
                                <span className="opacity-60">$</span> ls ./posts
                            </p>
                            <p className="text-sm text-[#6f7086]">0 blog posts found in database.</p>
                        </div>
                    ) : (
                        <div className="blog-grid">
                            {initialPosts.map((p, i) => (
                                <article
                                    key={p._id}
                                    className="blog-card"
                                    style={{ animationDelay: `${0.05 * i}s` }}
                                >
                                    <div className="blog-card__body">
                                        <h2 className="blog-card__title">{p.title}</h2>
                                        <p className="blog-card__description">{p.description}</p>
                                        <div className="blog-card__likes">
                                            <button
                                                type="button"
                                                onClick={() => SetLike(p._id)}
                                                className={`blog-like-btn ${liked[p._id] ? "is-liked" : ""}`}
                                                aria-label={`Like ${p.title}`}
                                            >
                                                <span className="blog-like-icon" aria-hidden="true">♥</span>
                                                <span className="blog-like-count">
                                                    {likes[p._id] !== undefined
                                                        ? likes[p._id]
                                                        : (Array.isArray(p.likes) ? p.likes.length : (p.likes || 0))}
                                                </span>
                                                <span className="blog-like-label">likes</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer className="relative z-10 border-t border-white/8 px-6 py-10 text-center">
                <p className="text-xs text-[#6f7086]">
                    © 2026 Balaji Priyan —{" "}
                    <Link to="/" className="hover:text-[#00e5ff] transition-colors">
                        back to home
                    </Link>
                </p>
            </footer>

            {actionError && (
                <aside className="blog-toast" role="alert" aria-live="polite">
                    <span className="blog-toast__icon" aria-hidden="true">!</span>
                    <div className="blog-toast__msg">
                        <span>{actionError}</span>
                        {!auth.currentUser && (
                            <Link to="/login" className="blog-toast__link">
                                [login →]
                            </Link>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setActionError("")}
                        className="blog-toast__close"
                        aria-label="Dismiss error"
                    >
                        ✕
                    </button>
                </aside>
            )}
        </div>
    );
}

export default Blogpage;