// src/pages/About/About.jsx
import { useNavigate } from "react-router-dom";

const skills = [
  { name: "React.js",      icon: "⚛️",  color: "#61dafb" },
  { name: "Node.js",       icon: "🟢",  color: "#68a063" },
  { name: "Express.js",    icon: "🚀",  color: "#ae7aff" },
  { name: "MongoDB",       icon: "🍃",  color: "#4db33d" },
  { name: "Python",        icon: "🐍",  color: "#ffd43b" },
  { name: "AI / ML",       icon: "🤖",  color: "#ff6b6b" },
  { name: "REST APIs",     icon: "🔗",  color: "#ae7aff" },
  { name: "Tailwind CSS",  icon: "🎨",  color: "#38bdf8" },
  { name: "Git & GitHub",  icon: "🐙",  color: "#f0f0f0" },
  { name: "Cloudinary",    icon: "☁️",  color: "#3448c5" },
];

const socialLinks = [
  {
    name: "Portfolio",
    url: "https://portfolio-lake-iota-8y4ffd2uch.vercel.app/",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    color: "#ae7aff",
    bg: "rgba(174,122,255,0.1)",
  },
  {
    name: "GitHub",
    url: "https://github.com/smbilal1409",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    color: "#f0f0f0",
    bg: "rgba(255,255,255,0.06)",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/bilalsheikhmuhammad",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: "#0077b5",
    bg: "rgba(0,119,181,0.1)",
  },
];

const stats = [
  { label: "Technologies",  value: "10+", icon: "⚡" },
  { label: "Projects Built", value: "5+",  icon: "🚀" },
  { label: "Backend APIs",   value: "20+", icon: "🔗" },
  { label: "University",     value: "PUCIT", icon: "🎓" },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-8
                      border border-white/[0.06] bg-[#1a1a1a]">

        {/* Purple gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ae7aff]/10 via-transparent to-[#7c3aed]/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ae7aff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7c3aed]/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
          {/* Photo */}
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ae7aff] to-[#7c3aed]
                              scale-110 blur-md opacity-40" />
              <img
                src="/Bilalimage.png"
                alt="Muhammad Bilal Sheikh"
                className="relative h-44 w-44 rounded-full object-cover object-top
                           border-4 border-[#ae7aff]/50 shadow-2xl shadow-[#ae7aff]/20"
              />
              {/* Online indicator */}
              <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-green-400
                              border-2 border-[#1a1a1a] shadow-lg" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-center md:self-start
                            rounded-full border border-[#ae7aff]/30 bg-[#ae7aff]/10
                            px-3 py-1 text-xs font-medium text-[#ae7aff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ae7aff] animate-pulse" />
              Open to Opportunities
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Muhammad Bilal Sheikh
              </h1>
              <p className="text-[#ae7aff] font-semibold mt-1 text-lg">
                Full Stack Developer & AI/ML Engineer
              </p>
              <p className="text-gray-400 text-sm mt-0.5 flex items-center gap-1 justify-center md:justify-start">
                <span>🎓</span> Punjab University College of Information Technology (PUCIT)
              </p>
            </div>

            {/* Bio */}
            <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
              A passionate Full Stack Software Developer and AI/ML enthusiast with expertise in
              the <span className="text-[#ae7aff] font-medium">MERN stack</span> and
              <span className="text-[#ae7aff] font-medium"> Python</span>. I specialize in
              building scalable, production-ready web applications with clean architecture and
              intuitive user experiences. Currently exploring the intersection of
              <span className="text-[#ae7aff] font-medium"> Artificial Intelligence</span> and
              modern web development to craft intelligent, data-driven solutions.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: link.bg, color: link.color }}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                             border border-white/[0.06] hover:scale-105 transition-transform"
                >
                  {link.icon}
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06]
                       bg-[#1a1a1a] p-5 text-center hover:border-[#ae7aff]/30 transition"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6 mb-8">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
          <span>⚡</span> Skills & Technologies
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill.name}
              style={{ borderColor: `${skill.color}30`, background: `${skill.color}10` }}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                         border hover:scale-105 transition-transform cursor-default"
            >
              <span>{skill.icon}</span>
              <span style={{ color: skill.color }}>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About FusionMedia */}
      <div className="rounded-2xl border border-[#ae7aff]/20 bg-gradient-to-br
                      from-[#ae7aff]/5 to-transparent p-6 mb-8">
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <span>🎬</span> About FusionMedia
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          <span className="text-[#ae7aff] font-semibold">FusionMedia</span> is a full-stack
          social media platform that combines the best of YouTube and Twitter — allowing users
          to upload and watch videos, post tweets, comment, like, subscribe to channels, and
          manage playlists. Built entirely from scratch using the
          <span className="text-[#ae7aff]"> MERN stack</span> with
          <span className="text-[#ae7aff]"> JWT authentication</span>,
          <span className="text-[#ae7aff]"> Cloudinary</span> for media storage,
          and a clean, modern dark UI.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {["MongoDB", "Express.js", "React.js", "Node.js", "JWT Auth", "Cloudinary", "Tailwind CSS"].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-[#ae7aff]/10 border border-[#ae7aff]/20
                         px-3 py-1 text-xs text-[#ae7aff] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pb-8">
        <a
          href="https://portfolio-lake-iota-8y4ffd2uch.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ae7aff] to-[#9b63e5]
                     px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition
                     shadow-lg shadow-[#ae7aff]/25 hover:-translate-y-px"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
          </svg>
          View Portfolio
        </a>
        <a
          href="https://github.com/smbilal1409"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5
                     px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition
                     hover:-translate-y-px"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub Profile
        </a>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5
                     px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition
                     hover:-translate-y-px"
        >
          🎬 Explore FusionMedia
        </button>
      </div>
    </div>
  );
}