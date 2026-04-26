import { useState, useEffect, createContext, useContext } from "react";

// ============ AUTH CONTEXT ============
const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============ API SERVICE ============
const API_BASE = "http://localhost:8080/api/v1";

const api = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ============ STYLES ============
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1a1a28;
    --border: #2a2a3d;
    --accent: #6c63ff;
    --accent2: #ff6584;
    --accent3: #43e97b;
    --text: #e8e8f0;
    --muted: #6b6b8a;
    --error: #ff4757;
    --warning: #ffa502;
    --success: #2ed573;
  }

  body {
    font-family: 'Space Grotesk', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  .app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Auth Page */
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at top left, #1a1030 0%, var(--bg) 60%),
                radial-gradient(ellipse at bottom right, #0d1f1a 0%, transparent 60%);
    padding: 2rem;
  }

  .auth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 3rem;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 25px 80px rgba(108, 99, 255, 0.15);
  }

  .auth-logo {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    letter-spacing: -1px;
  }

  .auth-subtitle {
    color: var(--muted);
    margin-bottom: 2.5rem;
    font-size: 0.95rem;
  }

  .tab-switcher {
    display: flex;
    background: var(--surface2);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 2rem;
    gap: 4px;
  }

  .tab-btn {
    flex: 1;
    padding: 0.6rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
    background: transparent;
    color: var(--muted);
  }

  .tab-btn.active {
    background: var(--accent);
    color: white;
  }

  .form-group {
    margin-bottom: 1.2rem;
  }

  .form-label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .form-input {
    width: 100%;
    padding: 0.85rem 1rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--muted); }

  select.form-input option { background: var(--surface2); }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1.5rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s;
    text-decoration: none;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
    width: 100%;
  }

  .btn-primary:hover { background: #5a52e0; transform: translateY(-1px); }

  .btn-danger {
    background: rgba(255, 71, 87, 0.15);
    color: var(--error);
    border: 1px solid rgba(255, 71, 87, 0.3);
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .btn-danger:hover { background: rgba(255, 71, 87, 0.25); }

  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  .btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    border-radius: 8px;
  }

  .btn-success {
    background: rgba(43, 213, 115, 0.15);
    color: var(--success);
    border: 1px solid rgba(43, 213, 115, 0.3);
  }

  /* Alert */
  .alert {
    padding: 0.85rem 1rem;
    border-radius: 10px;
    margin-bottom: 1.2rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .alert-error { background: rgba(255, 71, 87, 0.1); border: 1px solid rgba(255, 71, 87, 0.3); color: var(--error); }
  .alert-success { background: rgba(43, 213, 115, 0.1); border: 1px solid rgba(43, 213, 115, 0.3); color: var(--success); }

  /* Navbar */
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo {
    font-size: 1.3rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .role-chip {
    background: var(--accent);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .role-chip.admin { background: var(--accent2); }

  /* Dashboard */
  .dashboard {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h1 {
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .dashboard-header p {
    color: var(--muted);
    margin-top: 0.25rem;
  }

  /* Stats */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.2rem;
  }

  .stat-label {
    font-size: 0.78rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }

  .stat-value.pending { color: var(--warning); }
  .stat-value.progress { color: var(--accent); }
  .stat-value.done { color: var(--success); }
  .stat-value.total { color: var(--text); }

  /* Task Form */
  .task-form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .task-form-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.8rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  /* Tasks */
  .tasks-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .tasks-header h2 {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .task-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.2rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: border-color 0.2s;
  }

  .task-card:hover { border-color: var(--accent); }

  .task-main { flex: 1; }

  .task-title {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  .task-desc {
    color: var(--muted);
    font-size: 0.85rem;
    margin-bottom: 0.6rem;
  }

  .task-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .chip {
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .chip-pending { background: rgba(255, 165, 2, 0.15); color: var(--warning); }
  .chip-in_progress { background: rgba(108, 99, 255, 0.15); color: var(--accent); }
  .chip-completed { background: rgba(43, 213, 115, 0.15); color: var(--success); }
  .chip-low { background: rgba(107, 107, 138, 0.15); color: var(--muted); }
  .chip-medium { background: rgba(255, 165, 2, 0.1); color: var(--warning); }
  .chip-high { background: rgba(255, 71, 87, 0.1); color: var(--error); }

  .task-actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--muted);
    background: var(--surface);
    border: 1px dashed var(--border);
    border-radius: 16px;
  }

  .empty-state h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text); }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--muted);
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 0.75rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 1rem;
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 480px;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .modal-header h3 { font-size: 1.1rem; font-weight: 600; }

  .close-btn {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 1.4rem;
    line-height: 1;
  }

  .close-btn:hover { color: var(--text); }
`;

// ============ COMPONENTS ============

const Alert = ({ type, message }) => (
  <div className={`alert alert-${type}`}>{message}</div>
);

const Spinner = () => (
  <div className="loading">
    <div className="spinner" />
    Loading...
  </div>
);

const TaskChip = ({ label, type }) => (
  <span className={`chip chip-${label.toLowerCase().replace(" ", "_")}`}>
    {label}
  </span>
);

// ============ AUTH PAGE ============
const AuthPage = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
      const body = tab === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await api(endpoint, "POST", body);
      const { token, ...userData } = res.data;
      login(userData, token);
      setAlert({ type: "success", message: res.message });
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⚡ TaskFlow</div>
        <p className="auth-subtitle">Scalable Task Management API</p>

        <div className="tab-switcher">
          <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <form onSubmit={handleSubmit}>
          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============ TASK MODAL (Edit) ============
const TaskModal = ({ task, onClose, onSave, token }) => {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "PENDING",
    priority: task?.priority || "MEDIUM",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = task ? `/tasks/${task.id}` : "/tasks";
      const method = task ? "PUT" : "POST";
      const res = await api(endpoint, method, form, token);
      onSave(res.data, !!task);
      onClose();
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? "Edit Task" : "New Task"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {alert && <Alert type={alert.type} message={alert.message} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============ DASHBOARD ============
const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | task object
  const [alert, setAlert] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api("/tasks?size=50", "GET", null, token);
      setTasks(res.data?.content || []);
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
    setLoading(false);
  };

  useEffect(() => { loadTasks(); }, []);

  const handleSave = (task, isEdit) => {
    if (isEdit) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks((prev) => [task, ...prev]);
    }
    setAlert({ type: "success", message: `Task ${isEdit ? "updated" : "created"} successfully!` });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api(`/tasks/${id}`, "DELETE", null, token);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setAlert({ type: "success", message: "Task deleted!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="nav-logo">⚡ TaskFlow</div>
        <div className="nav-right">
          <div className="user-badge">
            👤 {user?.name}
            <span className={`role-chip ${user?.role === "ADMIN" ? "admin" : ""}`}>
              {user?.role}
            </span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard">
        <div className="dashboard-header">
          <h1>My Tasks</h1>
          <p>Welcome back, {user?.name?.split(" ")[0]}! Here's your workspace.</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value total">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value pending">{stats.pending}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-value progress">{stats.inProgress}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value done">{stats.completed}</div>
          </div>
        </div>

        <div className="tasks-header">
          <h2>Task List</h2>
          <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setModal("create")}>
            + New Task
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks yet</h3>
            <p>Click "New Task" to create your first task</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <div className="task-main">
                  <div className="task-title">{task.title}</div>
                  {task.description && <div className="task-desc">{task.description}</div>}
                  <div className="task-meta">
                    <TaskChip label={task.status} />
                    <TaskChip label={task.priority} />
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal(task)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <TaskModal
          task={modal === "create" ? null : modal}
          token={token}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// ============ ROOT APP ============
function App() {
  const { user } = useAuth();

  return (
    <>
      <style>{styles}</style>
      {user ? <Dashboard /> : <AuthPage />}
    </>
  );
}

// Wrap with provider
export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}