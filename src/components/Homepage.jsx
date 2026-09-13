import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Homepage.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config";

function IconReact({ className = "" }) {
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
                <ellipse cx="20" cy="20" rx="17" ry="7" />
                <ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(60 20 20)" />
                <ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(120 20 20)" />
            </g>
        </svg>
    );
}

function IconNode({ className = "" }) {
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            <polygon
                points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <text
                x="20"
                y="25"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="currentColor"
                fontFamily="'JetBrains Mono', monospace"
            >
                N
            </text>
        </svg>
    );
}

function IconExpress({ className = "" }) {
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            <rect x="4" y="4" width="32" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <text
                x="20"
                y="26"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="currentColor"
                fontFamily="'JetBrains Mono', monospace"
            >
                {"</>"}
            </text>
        </svg>
    );
}

function IconMongo({ className = "" }) {
    return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
            <path
                d="M20 4C27 11 29.5 18 20 36C10.5 18 13 11 20 4Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <line x1="20" y1="4" x2="20" y2="33" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    );
}

const skills = [
    {
        perm: "drwxr-xr-x",
        name: "frontend/",
        desc: "React · Tailwind CSS · JavaScript (ES6+)",
    },
    {
        perm: "drwxr-xr-x",
        name: "backend/",
        desc: "Node.js · Express · REST APIs",
    },
    {
        perm: "drwxr-xr-x",
        name: "database/",
        desc: "MongoDB · Mongoose",
    },
    {
        perm: "drwxr-xr-x",
        name: "tooling/",
        desc: "Git · Auth · Deployment · AI-assisted dev",
    },
];

const projects = [
    {
        title: "devblog.api",
        tag: "backend",
        desc: "REST API with JWT auth, rate limiting, and MongoDB aggregation pipelines.",
        stack: ["Node", "Express", "MongoDB"],
    },
    {
        title: "taskflow.ui",
        tag: "frontend",
        desc: "Drag-and-drop kanban board with optimistic updates and offline sync.",
        stack: ["React", "Tailwind"],
    },
    {
        title: "ping.chat",
        tag: "fullstack",
        desc: "Real-time chat with socket rooms, typing indicators, and presence.",
        stack: ["MERN", "Socket.io"],
    },
    {
        title: "authkit",
        tag: "tooling",
        desc: "Drop-in auth scaffold with OAuth, magic links, and 2FA support.",
        stack: ["Node", "JWT"],
    },
];

function Homepage() {
    const navigate = useNavigate();
    const [IsLoggedIn, setLogIn] = useState(false);

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, user => {
            if (user) {
                setLogIn(true);
            }
            else {
                setLogIn(false);
            }
        })
        return unSub;
    }, [])

    return (
        <div className="font-jetbrains min-h-screen bg-[#060608] text-[#eef0f5] relative overflow-x-hidden">
            <div className="scanlines pointer-events-none fixed inset-0 z-40" aria-hidden="true"></div>
            <div className="bg-grid pointer-events-none fixed inset-0 -z-10" aria-hidden="true"></div>
            <div className="blob blob-cyan pointer-events-none -z-10" aria-hidden="true"></div>
            <div className="blob blob-magenta pointer-events-none -z-10" aria-hidden="true"></div>

            <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6 text-xs sm:text-sm">
                <span className="text-[#6f7086]">
                    balaji@dev<span className="text-[#00e5ff]">:~$</span>
                </span>

                <nav className="flex items-center gap-5 sm:gap-7">
                    <Link to="/" className="nav-link">
                        about
                    </Link>
                    <Link to="/blog" className="nav-link">
                        blog
                    </Link>
                    {
                        (!IsLoggedIn ? (<Link to="/login" className="nav-link nav-link--cta">login</Link>) :
                            (<button onClick={() => {
                                signOut(auth).then(() => {
                                    setLogIn(false);
                                    console.log("User Logged Out Successfully");
                                    navigate("/");
                                });
                            }} className="nav-link nav-link--cta">LogOut</button>))
                    }

                </nav>
            </header>

            <main className="relative z-10">
                <section className="flex flex-col items-center text-center px-6 pt-14 sm:pt-20 pb-24">
                    <p className="terminal-line font-medium text-sm text-[#00e5ff] mb-7">
                        <span className="opacity-60">$</span> whoami
                    </p>

                    <h1 className="hero-name reveal" style={{ animationDelay: "1.1s" }}>
                        BALAAJI
                        <br />
                        PRIYAN
                    </h1>

                    <p className="hero-role reveal mt-5" style={{ animationDelay: "1.35s" }}>
                        <span className="text-[#6f7086]">&gt;</span> MERN Stack Developer
                        <span className="cursor">_</span>
                    </p>

                    <p
                        className="reveal mt-6 max-w-xl text-[#9a9bb0] leading-relaxed text-sm sm:text-base"
                        style={{ animationDelay: "1.55s" }}
                    >
                        I build full-stack web apps with React, Express, MongoDB and Node —
                        then break them on purpose, just to fix them better.
                    </p>

                    <div
                        className="stack-row reveal mt-11 flex flex-wrap justify-center gap-6 sm:gap-8"
                        style={{ animationDelay: "1.75s" }}
                    >
                        <div className="stack-chip flex flex-col items-center gap-2">
                            <IconReact className="stack-icon w-9 h-9 text-[#61dafb]" />
                            <span className="text-[11px] text-[#6f7086]">React</span>
                        </div>

                        <div className="stack-chip flex flex-col items-center gap-2">
                            <IconExpress className="stack-icon w-9 h-9 text-[#e8e8f0]" />
                            <span className="text-[11px] text-[#6f7086]">Express</span>
                        </div>

                        <div className="stack-chip flex flex-col items-center gap-2">
                            <IconMongo className="stack-icon w-9 h-9 text-[#47a248]" />
                            <span className="text-[11px] text-[#6f7086]">MongoDB</span>
                        </div>

                        <div className="stack-chip flex flex-col items-center gap-2">
                            <IconNode className="stack-icon w-9 h-9 text-[#83cd29]" />
                            <span className="text-[11px] text-[#6f7086]">Node.js</span>
                        </div>
                    </div>

                    <div
                        className="reveal mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-sm"
                        style={{ animationDelay: "1.95s" }}
                    >
                        <Link to="/" className="cta-link">
                            ./explore-work
                        </Link>
                        <Link to="/blog" className="cta-link cta-link--ghost">
                            ./read-blog
                        </Link>
                    </div>

                    <div
                        className="reveal mt-14 inline-flex items-center gap-2 text-xs text-[#6f7086]"
                        style={{ animationDelay: "2.15s" }}
                    >

                    </div>
                </section>


                <section className="border-t border-white/8 px-6 py-20">
                    <div className="max-w-2xl mx-auto">
                        <p className="section-kicker">$ ls -la ./skills</p>

                        <div className="mt-8">
                            {skills.map((skill) => (
                                <div className="skill-row" key={skill.name}>
                                    <span className="skill-perm">{skill.perm}</span>
                                    <span className="skill-name">{skill.name}</span>
                                    <span className="skill-desc">{skill.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-t border-white/8 px-6 py-20 text-center">
                    <p className="section-kicker">// currently</p>
                    <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-[#e8e8f0] leading-relaxed">
                        Building Full Stack Applications
                    </p>
                </section>

                <footer className="border-t border-white/8 px-6 py-24 text-center">
                    <p className="section-kicker">$ cat contact.txt</p>
                    <h2 className="contact-heading mt-4">Let's build something.</h2>

                    <div className="mt-10 flex flex-col items-center gap-4 text-sm sm:text-base">
                        <a href="mailto:balajipriyan162005@gmail.com" className="contact-link">
                            <span className="text-[#6f7086]">mail</span>
                            balajipriyan162005@gmail.com
                        </a>

                        <a
                            href="https://github.com/balajipriyan16"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <span className="text-[#6f7086]">github</span>
                            github.com/balajipriyan16
                        </a>

                        <a
                            href="https://linkedin.com/in/balaajipriyan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <span className="text-[#6f7086]">linkedin</span>
                            linkedin.com/in/balaajipriyan
                        </a>
                    </div>

                    <p className="mt-16 text-xs text-[#6f7086]">
                        © 2026 Balaji Priyan — built with React, Tailwind &amp; a lot of console.log().
                    </p>
                </footer>
            </main>
        </div>
    );
}

export default Homepage;