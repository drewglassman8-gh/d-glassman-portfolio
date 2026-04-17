import { useState, useEffect } from "react";

const PROJ_KEY = "sports-portfolio-v2";
const ABOUT_KEY = "sports-portfolio-about-v1";

const GRADIENTS = [
  "linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%)",
  "linear-gradient(135deg, #1b1b2f 0%, #3a0ca3 100%)",
  "linear-gradient(135deg, #0d1117 0%, #21262d 100%)",
  "linear-gradient(135deg, #1a0a2e 0%, #3d1d72 100%)",
  "linear-gradient(135deg, #0b132b 0%, #1c2541 100%)",
  "linear-gradient(135deg, #10002b 0%, #240046 100%)",
  "linear-gradient(135deg, #001219 0%, #005f73 100%)",
  "linear-gradient(135deg, #1b0a00 0%, #6b2500 100%)",
];

const CATEGORY_META = {
  Baseball:        { icon: "⚾", gradient: "linear-gradient(135deg, #1a1a3b 0%, #3730a3 100%)", accent: "#818cf8" },
  Basketball:      { icon: "🏀", gradient: "linear-gradient(135deg, #3b1a00 0%, #c2410c 100%)", accent: "#fb923c" },
  Golf:            { icon: "⛳", gradient: "linear-gradient(135deg, #0a2618 0%, #15803d 100%)", accent: "#86efac" },
  Football:        { icon: "🏈", gradient: "linear-gradient(135deg, #1a3a1a 0%, #2d6a2d 100%)", accent: "#4ade80" },
  General:         { icon: "📊", gradient: "linear-gradient(135deg, #1a0a2e 0%, #6d28d9 100%)", accent: "#a78bfa" },
  Other:           { icon: "🔹", gradient: "linear-gradient(135deg, #1a1a1a 0%, #404040 100%)", accent: "#a1a1aa" },
};

const DEFAULT_CATEGORIES = Object.keys(CATEGORY_META);

function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 6); }

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.error(e); }
}

const DEFAULT_ABOUT = {
  name: "Drew Glassman", headline: "Analytics Portfolio", bio: "",
  email: "", location: "", github: "", linkedin: "", twitter: "", website: "",
  skills: [], avatarUrl: "",
};

/* ════════════════════════ Modal ════════════════════════ */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={S.modalBackdrop} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <button style={S.modalClose} onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════ Project Form ════════════════════════ */
function ProjectForm({ project, onSave, onCancel, existingCategories }) {
  const [form, setForm] = useState({
    title: project?.title || "", description: project?.description || "",
    category: project?.category || "", tags: project?.tags?.join(", ") || "",
    link: project?.link || "", imageUrl: project?.imageUrl || "",
    date: project?.date || new Date().toISOString().slice(0, 10),
  });
  const [customCat, setCustomCat] = useState(false);
  const allCats = [...new Set([...DEFAULT_CATEGORIES, ...existingCategories])];

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave({
      id: project?.id || genId(), title: form.title.trim(),
      description: form.description.trim(), category: form.category.trim() || "Other",
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      link: form.link.trim(), imageUrl: form.imageUrl.trim(), date: form.date,
    });
  };

  const field = (label, key, placeholder, multiline) => (
    <div style={S.fieldGroup}>
      <label style={S.label}>{label}</label>
      {multiline ? (
        <textarea style={{ ...S.input, height: 80, resize: "vertical", fontFamily: "inherit" }}
          value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
      ) : (
        <input style={S.input} value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <div>
      <h2 style={S.formTitle}>{project ? "Edit Project" : "Add New Project"}</h2>
      {field("Title *", "title", "e.g. NFL Win Probability Model")}
      {field("Description", "description", "Brief description of the project…", true)}
      <div style={S.fieldGroup}>
        <label style={S.label}>Category</label>
        {!customCat ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {allCats.map(c => (
              <button key={c} style={{ ...S.catPill, ...(form.category === c ? S.catPillActive : {}) }}
                onClick={() => setForm({ ...form, category: c })}>
                {CATEGORY_META[c]?.icon || "🔹"} {c}
              </button>
            ))}
            <button style={S.catPill} onClick={() => setCustomCat(true)}>+ Custom</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...S.input, flex: 1 }} value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              placeholder="Type a custom category…" autoFocus />
            <button style={{ ...S.catPill, ...S.catPillActive }} onClick={() => setCustomCat(false)}>Pick</button>
          </div>
        )}
      </div>
      {field("Tags", "tags", "comma-separated, e.g. Python, xG, Statcast")}
      {field("Link / URL", "link", "https://github.com/…")}
      <div style={S.fieldGroup}>
        <label style={S.label}>Cover Image (optional)</label>
        {form.imageUrl && (
          <div style={{ position: "relative", marginBottom: 8, borderRadius: 8, overflow: "hidden", height: 120, background: `url(${form.imageUrl}) center/cover no-repeat` }}>
            <button onClick={() => setForm({ ...form, imageUrl: "" })}
              style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
          </div>
        )}
        <label style={{ ...S.input, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", padding: "14px", color: "#71717a", borderStyle: "dashed" }}>
          <span style={{ fontSize: 18 }}>📷</span>
          <span>{form.imageUrl ? "Replace image" : "Click to upload"}</span>
          <input type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setForm({ ...form, imageUrl: reader.result });
              reader.readAsDataURL(file);
              e.target.value = "";
            }} />
        </label>
      </div>
      {field("Date", "date", "YYYY-MM-DD")}
      <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
        <button style={S.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={{ ...S.btnPrimary, opacity: form.title.trim() ? 1 : 0.4 }} onClick={handleSubmit}>
          {project ? "Save Changes" : "Add Project"}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════ About Form ════════════════════════ */
function AboutForm({ about, onSave, onCancel }) {
  const [form, setForm] = useState({ ...about, skills: about.skills?.join(", ") || "" });
  const handleSubmit = () => onSave({ ...form, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) });

  const field = (label, key, placeholder, multiline) => (
    <div style={S.fieldGroup}>
      <label style={S.label}>{label}</label>
      {multiline ? (
        <textarea style={{ ...S.input, height: 100, resize: "vertical", fontFamily: "inherit" }}
          value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
      ) : (
        <input style={S.input} value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <div>
      <h2 style={S.formTitle}>Edit Profile</h2>
      {field("Name", "name", "Your full name")}
      {field("Headline", "headline", "e.g. Analytics Portfolio")}
      {field("Bio", "bio", "Tell people about yourself…", true)}
      {field("Avatar URL", "avatarUrl", "https://… (profile photo URL)")}
      {field("Location", "location", "e.g. New York, NY")}
      {field("Email", "email", "you@example.com")}
      {field("GitHub", "github", "https://github.com/username")}
      {field("LinkedIn", "linkedin", "https://linkedin.com/in/username")}
      {field("Twitter / X", "twitter", "https://twitter.com/username")}
      {field("Website", "website", "https://yoursite.com")}
      {field("Skills / Tools", "skills", "comma-separated, e.g. Python, R, Tableau")}
      <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
        <button style={S.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={S.btnPrimary} onClick={handleSubmit}>Save Profile</button>
      </div>
    </div>
  );
}

/* ════════════════════════ HOME PAGE ════════════════════════ */
function HomePage({ projects, about, onNavigate, onAddProject }) {
  const initials = about.name ? about.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

  // Build category data: all defaults + any custom categories from projects
  const customCats = [...new Set(projects.map(p => p.category))].filter(c => !CATEGORY_META[c]);
  const allCats = [...DEFAULT_CATEGORIES, ...customCats];
  const catCounts = {};
  projects.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });

  // Only show categories that have projects OR are in the default sport list
  const visibleCats = allCats.filter(c => (catCounts[c] || 0) > 0 || DEFAULT_CATEGORIES.includes(c));

  const recentProjects = [...projects].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 3);

  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroGlow} />
        <div style={S.heroContent}>
          {about.avatarUrl ? (
            <img src={about.avatarUrl} alt="" style={S.heroAvatar} />
          ) : (
            <div style={S.heroAvatarFallback}>{initials}</div>
          )}
          <h2 style={S.heroName}>{about.name}</h2>
          <p style={S.heroHeadline}>{about.headline}</p>
          {about.location && <p style={S.heroLocation}>📍 {about.location}</p>}
        </div>
      </div>

      {/* Categories Grid */}
      <div style={S.homeSection}>
        <div style={S.homeSectionHeader}>
          <h3 style={S.homeSectionTitle}>Browse by Category</h3>
          <button style={S.viewAllBtn} onClick={() => onNavigate("projects", "All")}>View all projects →</button>
        </div>
        <div style={S.catGrid}>
          {visibleCats.map((cat, i) => {
            const meta = CATEGORY_META[cat] || { icon: "🔹", gradient: "linear-gradient(135deg, #1a1a1a 0%, #404040 100%)", accent: "#a1a1aa" };
            const count = catCounts[cat] || 0;
            return (
              <button
                key={cat}
                style={{ ...S.catCard, animationDelay: `${i * 50}ms` }}
                onClick={() => onNavigate("projects", cat)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,.4), 0 0 0 1px ${meta.accent}33`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.2), inset 0 0 0 1px rgba(255,255,255,.05)";
                }}
              >
                <div style={{ ...S.catCardBg, background: meta.gradient }} />
                <div style={S.catCardInner}>
                  <span style={S.catCardIcon}>{meta.icon}</span>
                  <span style={S.catCardName}>{cat}</span>
                </div>
              </button>
            );
          })}

          {/* Add project CTA card */}
          <button style={{ ...S.catCard, ...S.catCardAdd, animationDelay: `${visibleCats.length * 50}ms` }}
            onClick={onAddProject}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >
            <div style={S.catCardInner}>
              <span style={{ ...S.catCardIcon, fontSize: 32, color: "#6d28d9" }}>+</span>
              <span style={S.catCardName}>New Project</span>
              <span style={{ ...S.catCardCount, color: "#6d28d9" }}>Add to any category</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div style={S.homeSection}>
          <div style={S.homeSectionHeader}>
            <h3 style={S.homeSectionTitle}>Recent Work</h3>
          </div>
          <div style={S.recentGrid}>
            {recentProjects.map((p, i) => {
              const meta = CATEGORY_META[p.category] || { icon: "🔹", accent: "#a1a1aa" };
              const grad = GRADIENTS[i % GRADIENTS.length];
              return (
                <div key={p.id} style={{ ...S.recentCard, animationDelay: `${i * 80}ms` }}
                  onClick={() => onNavigate("projects", p.category)}>
                  <div style={{ ...S.recentImg, background: p.imageUrl ? `url(${p.imageUrl}) center/cover no-repeat` : grad }} />
                  <div style={S.recentBody}>
                    <span style={{ ...S.recentCat, color: meta.accent }}>{meta.icon} {p.category}</span>
                    <h4 style={S.recentTitle}>{p.title}</h4>
                    {p.description && <p style={S.recentDesc}>{p.description}</p>}
                    <span style={S.recentDate}>{p.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════ About Page ════════════════════════ */
function AboutPage({ about, onEdit }) {
  const initials = about.name ? about.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";
  const socialLinks = [
    { key: "email", icon: "✉", label: "Email", href: about.email ? `mailto:${about.email}` : null, display: about.email },
    { key: "github", icon: "⌂", label: "GitHub", href: about.github, display: about.github?.replace(/https?:\/\/(www\.)?github\.com\/?/, "") },
    { key: "linkedin", icon: "in", label: "LinkedIn", href: about.linkedin, display: "LinkedIn" },
    { key: "twitter", icon: "𝕏", label: "Twitter / X", href: about.twitter, display: about.twitter?.replace(/https?:\/\/(www\.)?(twitter|x)\.com\/?/, "@") },
    { key: "website", icon: "◎", label: "Website", href: about.website, display: about.website?.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, "") },
  ].filter(s => s.href);

  return (
    <div style={{ animation: "fadeUp .5s ease both" }}>
      <div style={S.aboutCard}>
        <div style={S.aboutTop}>
          {about.avatarUrl ? <img src={about.avatarUrl} alt="" style={S.avatar} />
            : <div style={S.avatarFallback}>{initials}</div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={S.aboutName}>{about.name}</h2>
            <p style={S.aboutHeadline}>{about.headline}</p>
            {about.location && <p style={S.aboutLoc}>📍 {about.location}</p>}
          </div>
          <button style={S.editProfileBtn} onClick={onEdit}>✎ Edit</button>
        </div>
        {about.bio && (
          <div style={S.aboutSection}>
            <h3 style={S.aboutSecTitle}>About</h3>
            <p style={S.aboutBio}>{about.bio}</p>
          </div>
        )}
        {about.skills?.length > 0 && (
          <div style={S.aboutSection}>
            <h3 style={S.aboutSecTitle}>Skills & Tools</h3>
            <div style={S.skillGrid}>{about.skills.map(s => <span key={s} style={S.skillChip}>{s}</span>)}</div>
          </div>
        )}
        {socialLinks.length > 0 && (
          <div style={S.aboutSection}>
            <h3 style={S.aboutSecTitle}>Contact & Links</h3>
            <div style={S.socialGrid}>
              {socialLinks.map(s => (
                <a key={s.key} href={s.href} target="_blank" rel="noreferrer" style={S.socialCard}>
                  <span style={S.socialIcon}>{s.icon}</span>
                  <div><div style={S.socialLabel}>{s.label}</div><div style={S.socialValue}>{s.display}</div></div>
                </a>
              ))}
            </div>
          </div>
        )}
        {!about.bio && about.skills?.length === 0 && socialLinks.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "#52525b", fontSize: 15 }}>Tap "Edit" to add your info.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════ Project Card ════════════════════════ */
function Card({ project, index, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const grad = GRADIENTS[index % GRADIENTS.length];
  const meta = CATEGORY_META[project.category] || { icon: "🔹" };

  return (
    <div style={{
      ...S.card, animationDelay: `${index * 60}ms`,
      transform: hovered ? "translateY(-5px) scale(1.01)" : "none",
      boxShadow: hovered ? "0 24px 48px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.09)"
        : "0 2px 16px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.05)",
    }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ ...S.cardImg, background: project.imageUrl ? `url(${project.imageUrl}) center/cover no-repeat` : grad }}>
        <div style={{ ...S.cardImgOverlay, opacity: hovered ? 1 : 0 }}>
          <button style={S.cardIconBtn} onClick={() => onEdit(project)}>✎</button>
          <button style={S.cardIconBtn} onClick={() => onDelete(project.id)}>✕</button>
        </div>
        <span style={S.cardCatBadge}>{meta.icon} {project.category}</span>
      </div>
      <div style={S.cardBody}>
        <h3 style={S.cardTitle}>{project.title}</h3>
        {project.description && <p style={S.cardDesc}>{project.description}</p>}
        <div style={S.cardMeta}>
          <span style={S.cardDate}>{project.date}</span>
          {project.tags?.length > 0 && (
            <div style={S.tagRow}>{project.tags.slice(0, 4).map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
          )}
        </div>
        {project.link && <a href={project.link} target="_blank" rel="noreferrer" style={S.cardLink}>View Project →</a>}
      </div>
    </div>
  );
}

/* ════════════════════════ MAIN APP ════════════════════════ */
export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("home");
  const [activeTab, setActiveTab] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    setProjects(load(PROJ_KEY, []));
    setAbout({ ...DEFAULT_ABOUT, ...load(ABOUT_KEY, DEFAULT_ABOUT) });
    setLoading(false);
  }, []);

  const persistProjects = (next) => { setProjects(next); save(PROJ_KEY, next); };
  const persistAbout = (next) => { setAbout(next); save(ABOUT_KEY, next); };

  const handleSave = (proj) => {
    const exists = projects.find(p => p.id === proj.id);
    persistProjects(exists ? projects.map(p => p.id === proj.id ? proj : p) : [proj, ...projects]);
    setModalOpen(false); setEditing(null);
  };

  const handleDelete = (id) => { persistProjects(projects.filter(p => p.id !== id)); setConfirmDelete(null); };

  const navigateTo = (pg, cat) => { setPage(pg); if (cat) setActiveTab(cat); };

  const existingCategories = [...new Set(projects.map(p => p.category))];
  const allCategories = ["All", ...new Set([...DEFAULT_CATEGORIES, ...existingCategories])];
  const filtered = activeTab === "All" ? projects : projects.filter(p => p.category === activeTab);

  useEffect(() => {
    if (activeTab !== "All" && !allCategories.includes(activeTab)) setActiveTab("All");
  }, [projects]);

  return (
    <div style={S.root}>
      <div style={S.bgNoise} />

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
            <h1 style={S.logo}><span style={S.logoAccent}>▌</span>DREW GLASSMAN PORTFOLIO</h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {page === "projects" && (
              <button style={S.addBtn} onClick={() => { setEditing(null); setModalOpen(true); }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> New Project
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Page Nav ── */}
      <div style={S.pageNav}>
        <div style={S.pageNavInner}>
          {[
            { id: "home", label: "Home", icon: "⌂" },
            { id: "projects", label: "Projects", icon: "◆" },
            { id: "about", label: "About Me", icon: "⦿" },
          ].map(p => (
            <button key={p.id}
              style={{ ...S.pageNavBtn, ...(page === p.id ? S.pageNavBtnActive : {}) }}
              onClick={() => { setPage(p.id); if (p.id === "projects") setActiveTab("All"); }}>
              <span style={{ marginRight: 6 }}>{p.icon}</span>{p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category Tabs (projects page) ── */}
      {page === "projects" && (
        <div style={S.tabBar}>
          <div style={S.tabScroll}>
            {allCategories.map(cat => {
              const count = cat === "All" ? projects.length : projects.filter(p => p.category === cat).length;
              if (cat !== "All" && count === 0 && DEFAULT_CATEGORIES.includes(cat)) return null;
              const icon = CATEGORY_META[cat]?.icon || "🔹";
              return (
                <button key={cat} style={{ ...S.tab, ...(activeTab === cat ? S.tabActive : {}) }}
                  onClick={() => setActiveTab(cat)}>
                  <span style={{ marginRight: 6 }}>{icon}</span>{cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main style={S.main}>
        {loading ? <p style={S.emptyText}>Loading…</p>

        : page === "home" ? (
          <HomePage projects={projects} about={about}
            onNavigate={navigateTo}
            onAddProject={() => { setEditing(null); setModalOpen(true); }} />

        ) : page === "about" ? (
          <AboutPage about={about} onEdit={() => setEditingAbout(true)} />

        ) : filtered.length === 0 ? (
          <div style={S.emptyState}>
            <div style={S.emptyIcon}>📂</div>
            <p style={S.emptyText}>
              {projects.length === 0 ? 'No projects yet — hit "+ New Project" to get started!' : `No projects in "${activeTab}"`}
            </p>
            <button style={S.addBtn} onClick={() => { setEditing(null); setModalOpen(true); }}>+ Add a Project</button>
          </div>

        ) : (
          <div style={S.grid}>
            {filtered.sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((p, i) => (
              <Card key={p.id} project={p} index={i}
                onEdit={proj => { setEditing(proj); setModalOpen(true); }}
                onDelete={id => setConfirmDelete(id)} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}>
        <ProjectForm project={editing} onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
          existingCategories={existingCategories} />
      </Modal>
      <Modal open={editingAbout} onClose={() => setEditingAbout(false)}>
        <AboutForm about={about} onSave={a => { persistAbout(a); setEditingAbout(false); }}
          onCancel={() => setEditingAbout(false)} />
      </Modal>
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div style={{ textAlign: "center", padding: 12 }}>
          <p style={{ color: "#e4e4e7", fontSize: 18, margin: "0 0 24px" }}>Delete this project?</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button style={S.btnSecondary} onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button style={{ ...S.btnPrimary, background: "#b91c1c" }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
          </div>
        </div>
      </Modal>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:scale(.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.15); border-radius:3px; }
      `}</style>
    </div>
  );
}

/* ════════════════════════ STYLES ════════════════════════ */
const S = {
  root: { minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Outfit',sans-serif", color:"#d4d4d8", position:"relative", overflow:"hidden" },
  bgNoise: { position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.03, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` },

  /* Header */
  header: { position:"relative", zIndex:2, borderBottom:"1px solid rgba(255,255,255,.06)", background:"linear-gradient(180deg, rgba(15,15,25,.95) 0%, rgba(10,10,15,.9) 100%)", backdropFilter:"blur(12px)", padding:"28px 0 24px" },
  headerInner: { maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 },
  logo: { fontFamily:"'Space Mono',monospace", fontSize:26, fontWeight:700, letterSpacing:3, color:"#f4f4f5", margin:0 },
  logoAccent: { color:"#6d28d9", marginRight:4, fontSize:30 },
  addBtn: { display:"flex", alignItems:"center", gap:8, background:"#6d28d9", color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .2s", boxShadow:"0 0 20px rgba(109,40,217,.3)" },

  /* Page Nav */
  pageNav: { position:"relative", zIndex:2, background:"rgba(12,12,18,.9)", borderBottom:"1px solid rgba(255,255,255,.06)", padding:"0 24px", backdropFilter:"blur(8px)" },
  pageNavInner: { maxWidth:1200, margin:"0 auto", display:"flex", gap:4, padding:"8px 0" },
  pageNavBtn: { display:"flex", alignItems:"center", background:"transparent", border:"1px solid transparent", color:"#71717a", borderRadius:8, padding:"9px 18px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .2s", letterSpacing:.5 },
  pageNavBtnActive: { background:"rgba(109,40,217,.12)", border:"1px solid rgba(109,40,217,.35)", color:"#c4b5fd" },

  /* Tabs */
  tabBar: { position:"relative", zIndex:2, background:"rgba(10,10,15,.8)", borderBottom:"1px solid rgba(255,255,255,.05)", padding:"0 24px", backdropFilter:"blur(8px)" },
  tabScroll: { maxWidth:1200, margin:"0 auto", display:"flex", gap:4, overflowX:"auto", padding:"10px 0" },
  tab: { display:"flex", alignItems:"center", gap:2, background:"transparent", border:"1px solid transparent", color:"#71717a", borderRadius:6, padding:"7px 13px", fontSize:13, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Outfit',sans-serif", transition:"all .2s" },
  tabActive: { background:"rgba(109,40,217,.15)", border:"1px solid rgba(109,40,217,.4)", color:"#c4b5fd" },
  tabCount: { fontSize:11, marginLeft:6, background:"rgba(255,255,255,.08)", borderRadius:10, padding:"1px 7px", color:"#a1a1aa" },

  main: { position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"32px 24px 80px" },

  /* ─── HOME PAGE ─── */
  hero: { position:"relative", textAlign:"center", padding:"48px 20px 40px", marginBottom:40, borderRadius:16, background:"rgba(20,20,30,.5)", border:"1px solid rgba(255,255,255,.05)", overflow:"hidden" },
  heroGlow: { position:"absolute", top:"-50%", left:"50%", transform:"translateX(-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(109,40,217,.12) 0%, transparent 70%)", pointerEvents:"none" },
  heroContent: { position:"relative", zIndex:1 },
  heroAvatar: { width:96, height:96, borderRadius:"50%", objectFit:"cover", border:"3px solid rgba(109,40,217,.4)", boxShadow:"0 0 30px rgba(109,40,217,.15)", marginBottom:16 },
  heroAvatarFallback: { width:96, height:96, borderRadius:"50%", background:"linear-gradient(135deg,#6d28d9 0%,#4c1d95 100%)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:32, fontWeight:700, color:"#e4e4e7", fontFamily:"'Space Mono',monospace", letterSpacing:2, boxShadow:"0 0 30px rgba(109,40,217,.2)", marginBottom:16 },
  heroName: { fontFamily:"'Space Mono',monospace", fontSize:28, fontWeight:700, color:"#f4f4f5", margin:"0 0 6px" },
  heroHeadline: { fontSize:16, color:"#a1a1aa", margin:"0 0 4px", fontWeight:400 },
  heroLocation: { fontSize:13, color:"#71717a", margin:"0 0 20px" },
  heroStats: { display:"inline-flex", alignItems:"center", gap:24, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"14px 28px" },
  heroStat: { display:"flex", flexDirection:"column", alignItems:"center", gap:2 },
  heroStatNum: { fontFamily:"'Space Mono',monospace", fontSize:24, fontWeight:700, color:"#f4f4f5" },
  heroStatLabel: { fontSize:12, color:"#71717a", textTransform:"uppercase", letterSpacing:1 },
  heroStatDivider: { width:1, height:32, background:"rgba(255,255,255,.08)" },

  homeSection: { marginBottom:40 },
  homeSectionHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 },
  homeSectionTitle: { fontFamily:"'Space Mono',monospace", fontSize:16, fontWeight:700, color:"#e4e4e7", margin:0, letterSpacing:1 },
  viewAllBtn: { background:"none", border:"none", color:"#818cf8", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif", padding:0 },

  catGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:12 },
  catCard: { position:"relative", background:"rgba(20,20,30,.6)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, padding:0, cursor:"pointer", overflow:"hidden", textAlign:"left", fontFamily:"'Outfit',sans-serif", transition:"all .3s cubic-bezier(.4,0,.2,1)", animation:"fadeUp .5s ease both", boxShadow:"0 2px 12px rgba(0,0,0,.2), inset 0 0 0 1px rgba(255,255,255,.05)" },
  catCardAdd: { borderStyle:"dashed", borderColor:"rgba(109,40,217,.3)", background:"rgba(109,40,217,.04)" },
  catCardBg: { position:"absolute", inset:0, opacity:.25, transition:"opacity .3s" },
  catCardInner: { position:"relative", zIndex:1, padding:"20px 18px", display:"flex", flexDirection:"column", gap:4 },
  catCardIcon: { fontSize:28, lineHeight:1, marginBottom:4 },
  catCardName: { fontSize:14, fontWeight:600, color:"#e4e4e7", letterSpacing:.3 },
  catCardCount: { fontSize:12, fontWeight:500, letterSpacing:.3 },
  catCardIndicator: { position:"absolute", bottom:0, left:0, right:0, height:3, opacity:.6 },

  recentGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 },
  recentCard: { display:"flex", background:"rgba(20,20,30,.6)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"all .25s", animation:"fadeUp .5s ease both" },
  recentImg: { width:110, minHeight:110, flexShrink:0 },
  recentBody: { padding:"14px 16px", display:"flex", flexDirection:"column", gap:4, minWidth:0 },
  recentCat: { fontSize:11, fontWeight:600, letterSpacing:.5, textTransform:"uppercase" },
  recentTitle: { fontFamily:"'Space Mono',monospace", fontSize:14, fontWeight:700, color:"#f4f4f5", margin:0, lineHeight:1.3 },
  recentDesc: { fontSize:12.5, color:"#a1a1aa", lineHeight:1.45, margin:0, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" },
  recentDate: { fontFamily:"'Space Mono',monospace", fontSize:10, color:"#52525b", letterSpacing:.5, marginTop:"auto" },

  /* ─── PROJECTS ─── */
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:24 },
  card: { background:"rgba(20,20,30,.7)", borderRadius:12, overflow:"hidden", transition:"all .3s cubic-bezier(.4,0,.2,1)", animation:"fadeUp .5s ease both", cursor:"default" },
  cardImg: { position:"relative", height:180, overflow:"hidden" },
  cardImgOverlay: { position:"absolute", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"opacity .25s" },
  cardIconBtn: { width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", borderRadius:8, color:"#fff", fontSize:16, cursor:"pointer", fontFamily:"inherit" },
  cardCatBadge: { position:"absolute", bottom:10, left:10, background:"rgba(0,0,0,.6)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:600, color:"#d4d4d8", letterSpacing:.5, textTransform:"uppercase" },
  cardBody: { padding:"16px 18px 18px" },
  cardTitle: { fontFamily:"'Space Mono',monospace", fontSize:16, fontWeight:700, color:"#f4f4f5", margin:"0 0 8px", lineHeight:1.35 },
  cardDesc: { fontSize:13.5, color:"#a1a1aa", lineHeight:1.55, margin:"0 0 12px", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" },
  cardMeta: { display:"flex", flexDirection:"column", gap:8 },
  cardDate: { fontFamily:"'Space Mono',monospace", fontSize:11, color:"#52525b", letterSpacing:.5 },
  tagRow: { display:"flex", gap:6, flexWrap:"wrap" },
  tag: { fontSize:11, color:"#a78bfa", letterSpacing:.3, background:"rgba(109,40,217,.12)", border:"1px solid rgba(109,40,217,.2)", borderRadius:4, padding:"2px 8px" },
  cardLink: { display:"inline-block", marginTop:12, fontSize:13, fontWeight:600, color:"#818cf8", textDecoration:"none", letterSpacing:.3 },

  /* ─── ABOUT ─── */
  aboutCard: { background:"rgba(20,20,30,.7)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, padding:"32px 36px", maxWidth:760, margin:"0 auto", boxShadow:"0 8px 32px rgba(0,0,0,.3)" },
  aboutTop: { display:"flex", alignItems:"center", gap:24, flexWrap:"wrap", marginBottom:28, paddingBottom:28, borderBottom:"1px solid rgba(255,255,255,.06)" },
  avatar: { width:88, height:88, borderRadius:"50%", objectFit:"cover", border:"3px solid rgba(109,40,217,.4)", boxShadow:"0 0 24px rgba(109,40,217,.15)" },
  avatarFallback: { width:88, height:88, borderRadius:"50%", background:"linear-gradient(135deg,#6d28d9 0%,#4c1d95 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700, color:"#e4e4e7", fontFamily:"'Space Mono',monospace", letterSpacing:2, boxShadow:"0 0 24px rgba(109,40,217,.2)", flexShrink:0 },
  aboutName: { fontFamily:"'Space Mono',monospace", fontSize:24, fontWeight:700, color:"#f4f4f5", margin:"0 0 4px" },
  aboutHeadline: { fontSize:15, color:"#a1a1aa", margin:"0 0 4px" },
  aboutLoc: { fontSize:13, color:"#71717a", margin:0 },
  editProfileBtn: { marginLeft:"auto", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"8px 16px", color:"#a1a1aa", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'Outfit',sans-serif" },
  aboutSection: { marginBottom:28 },
  aboutSecTitle: { fontFamily:"'Space Mono',monospace", fontSize:12, fontWeight:700, color:"#6d28d9", margin:"0 0 12px", letterSpacing:2, textTransform:"uppercase" },
  aboutBio: { fontSize:15, color:"#d4d4d8", lineHeight:1.7, margin:0, whiteSpace:"pre-wrap" },
  skillGrid: { display:"flex", gap:8, flexWrap:"wrap" },
  skillChip: { fontSize:13, color:"#c4b5fd", fontWeight:500, background:"rgba(109,40,217,.1)", border:"1px solid rgba(109,40,217,.25)", borderRadius:6, padding:"6px 14px" },
  socialGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:10 },
  socialCard: { display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"12px 16px", textDecoration:"none" },
  socialIcon: { width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(109,40,217,.12)", border:"1px solid rgba(109,40,217,.25)", borderRadius:8, fontSize:16, color:"#a78bfa", fontFamily:"'Space Mono',monospace", fontWeight:700, flexShrink:0 },
  socialLabel: { fontSize:11, color:"#71717a", fontWeight:600, letterSpacing:.5, textTransform:"uppercase", marginBottom:2 },
  socialValue: { fontSize:13, color:"#d4d4d8", fontWeight:500 },

  /* ─── SHARED ─── */
  emptyState: { textAlign:"center", padding:"80px 20px", animation:"fadeUp .5s ease both" },
  emptyIcon: { fontSize:48, marginBottom:16 },
  emptyText: { color:"#52525b", fontSize:16, marginBottom:20 },
  modalBackdrop: { position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,.7)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, animation:"fadeUp .2s ease" },
  modal: { position:"relative", background:"#18181b", border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:"28px 28px 24px", width:"100%", maxWidth:540, maxHeight:"90vh", overflowY:"auto", animation:"slideIn .3s ease", boxShadow:"0 32px 64px rgba(0,0,0,.5)" },
  modalClose: { position:"absolute", top:14, right:14, background:"transparent", border:"none", color:"#71717a", fontSize:18, cursor:"pointer", fontFamily:"inherit" },
  formTitle: { fontFamily:"'Space Mono',monospace", fontSize:20, fontWeight:700, color:"#f4f4f5", margin:"0 0 24px", letterSpacing:1 },
  fieldGroup: { marginBottom:18 },
  label: { display:"block", fontSize:12, fontWeight:600, color:"#a1a1aa", marginBottom:6, letterSpacing:.5, textTransform:"uppercase" },
  input: { width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"10px 14px", color:"#e4e4e7", fontSize:14, fontFamily:"'Outfit',sans-serif", outline:"none" },
  catPill: { background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, padding:"6px 12px", color:"#a1a1aa", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" },
  catPillActive: { background:"rgba(109,40,217,.2)", border:"1px solid rgba(109,40,217,.5)", color:"#c4b5fd" },
  btnPrimary: { background:"#6d28d9", color:"#fff", border:"none", borderRadius:8, padding:"10px 22px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif" },
  btnSecondary: { background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"10px 22px", color:"#a1a1aa", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'Outfit',sans-serif" },
};
