import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const placeholderImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

function App() {
  const [activeView, setActiveView] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [adminCourses, setAdminCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [userToken, setUserToken] = useState(() => localStorage.getItem("userToken") || "");
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userForm, setUserForm] = useState(emptyAuthForm);
  const [adminForm, setAdminForm] = useState(emptyAuthForm);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [editingCourseId, setEditingCourseId] = useState("");

  const userApi = useMemo(() => buildApi(userToken), [userToken]);
  const adminApi = useMemo(() => buildApi(adminToken), [adminToken]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (userToken) {
      loadPurchases();
    } else {
      setPurchases([]);
    }
  }, [userToken]);

  useEffect(() => {
    if (adminToken) {
      loadAdminCourses();
    } else {
      setAdminCourses([]);
    }
  }, [adminToken]);

  async function loadCourses() {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/course/preview`);
      setCourses(response.data.courses || []);
    } catch (error) {
      showError(error, "Could not load courses");
    } finally {
      setLoading(false);
    }
  }

  async function loadPurchases() {
    try {
      const response = await userApi.get("/user/purchases");
      setPurchases(response.data.purchases || []);
    } catch (error) {
      showError(error, "Could not load purchases");
    }
  }

  async function loadAdminCourses() {
    try {
      const response = await adminApi.get("/admin/course/bulk");
      setAdminCourses(response.data.courses || []);
    } catch (error) {
      showError(error, "Could not load admin courses");
    }
  }

  async function handleAuth(role, mode) {
    const isAdmin = role === "admin";
    const form = isAdmin ? adminForm : userForm;
    const endpoint = `/${role}/${mode}`;
    const tokenKey = isAdmin ? "adminToken" : "userToken";
    const setToken = isAdmin ? setAdminToken : setUserToken;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}${endpoint}`, form);
      if (mode === "signin") {
        localStorage.setItem(tokenKey, response.data.token);
        setToken(response.data.token);
        setMessage(`${labelFor(role)} signed in successfully`);
        setActiveView(isAdmin ? "admin" : "courses");
      } else {
        setMessage(`${labelFor(role)} account created. You can sign in now.`);
      }
    } catch (error) {
      showError(error, `${labelFor(role)} ${mode} failed`);
    } finally {
      setLoading(false);
    }
  }

  async function buyCourse(courseId) {
    if (!userToken) {
      setActiveView("userAuth");
      setMessage("Sign in as a student before buying a course");
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.post("/course/purchase", { courseId });
      setMessage(response.data.message || "Course purchased");
      await loadPurchases();
    } catch (error) {
      showError(error, "Purchase failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveCourse(event) {
    event.preventDefault();
    if (!adminToken) {
      setActiveView("adminAuth");
      return;
    }

    const payload = {
      ...courseForm,
      price: Number(courseForm.price),
    };

    try {
      setLoading(true);
      if (editingCourseId) {
        await adminApi.put("/admin/course", { ...payload, courseId: editingCourseId });
        setMessage("Course updated");
      } else {
        await adminApi.post("/admin/course", payload);
        setMessage("Course created");
      }
      setCourseForm(emptyCourseForm);
      setEditingCourseId("");
      await Promise.all([loadCourses(), loadAdminCourses()]);
    } catch (error) {
      showError(error, "Could not save course");
    } finally {
      setLoading(false);
    }
  }

  function editCourse(course) {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      imageUrl: course.imageUrl || "",
      price: course.price || "",
    });
  }

  function logout(role) {
    if (role === "admin") {
      localStorage.removeItem("adminToken");
      setAdminToken("");
      setActiveView("courses");
    } else {
      localStorage.removeItem("userToken");
      setUserToken("");
      setActiveView("courses");
    }
    setMessage(`${labelFor(role)} signed out`);
  }

  function showError(error, fallback) {
    const apiMessage = error?.response?.data?.message;
    setMessage(apiMessage || fallback);
  }

  const purchasedIds = new Set(purchases.map((purchase) => purchase.courseId?._id || purchase.courseId));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <GraduationCap size={28} />
          <div>
            <span>CourseHub</span>
            <small>Learning marketplace</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          <button className={activeView === "courses" ? "active" : ""} onClick={() => setActiveView("courses")}>
            <BookOpen size={18} />
            Courses
          </button>
          <button className={activeView === "purchases" ? "active" : ""} onClick={() => setActiveView("purchases")}>
            <ShoppingBag size={18} />
            My Learning
          </button>
          <button className={activeView === "userAuth" ? "active" : ""} onClick={() => setActiveView("userAuth")}>
            <User size={18} />
            Student
          </button>
          <button className={activeView === "admin" ? "active" : ""} onClick={() => setActiveView("admin")}>
            <LayoutDashboard size={18} />
            Admin
          </button>
          <button className={activeView === "adminAuth" ? "active" : ""} onClick={() => setActiveView("adminAuth")}>
            <ShieldCheck size={18} />
            Admin Auth
          </button>
        </nav>

        <div className="session-box">
          <StatusDot active={Boolean(userToken)} label="Student" />
          <StatusDot active={Boolean(adminToken)} label="Admin" />
          <div className="logout-row">
            {userToken && (
              <button className="icon-button" onClick={() => logout("user")} title="Sign out student">
                <LogOut size={16} />
              </button>
            )}
            {adminToken && (
              <button className="icon-button" onClick={() => logout("admin")} title="Sign out admin">
                <ShieldCheck size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Full-stack course platform</p>
            <h1>{titleFor(activeView)}</h1>
          </div>
          <button className="ghost-button" onClick={loadCourses}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {message && <div className="notice">{message}</div>}

        {activeView === "courses" && (
          <section className="content-section">
            <div className="section-heading">
              <div>
                <h2>Available courses</h2>
                <p>{courses.length} courses ready for students</p>
              </div>
            </div>
            <CourseGrid
              courses={courses}
              purchasedIds={purchasedIds}
              loading={loading}
              onBuy={buyCourse}
            />
          </section>
        )}

        {activeView === "purchases" && (
          <section className="content-section">
            <div className="section-heading">
              <div>
                <h2>Purchased courses</h2>
                <p>{userToken ? `${purchases.length} courses in your library` : "Student signin required"}</p>
              </div>
            </div>
            {userToken ? (
              <CourseGrid
                courses={purchases.map((purchase) => purchase.courseId).filter(Boolean)}
                purchasedIds={purchasedIds}
                loading={loading}
                readonly
              />
            ) : (
              <EmptyState text="Sign in as a student to view your courses." />
            )}
          </section>
        )}

        {activeView === "userAuth" && (
          <AuthPanel
            title="Student access"
            form={userForm}
            setForm={setUserForm}
            onSignin={() => handleAuth("user", "signin")}
            onSignup={() => handleAuth("user", "signup")}
            loading={loading}
          />
        )}

        {activeView === "adminAuth" && (
          <AuthPanel
            title="Admin access"
            form={adminForm}
            setForm={setAdminForm}
            onSignin={() => handleAuth("admin", "signin")}
            onSignup={() => handleAuth("admin", "signup")}
            loading={loading}
          />
        )}

        {activeView === "admin" && (
          <section className="admin-layout">
            {adminToken ? (
              <>
                <form className="panel" onSubmit={saveCourse}>
                  <div className="section-heading compact">
                    <div>
                      <h2>{editingCourseId ? "Edit course" : "Create course"}</h2>
                      <p>{adminCourses.length} courses in your catalog</p>
                    </div>
                    <Plus size={20} />
                  </div>
                  <Field label="Title" value={courseForm.title} onChange={(title) => setCourseForm({ ...courseForm, title })} />
                  <Field
                    label="Description"
                    value={courseForm.description}
                    onChange={(description) => setCourseForm({ ...courseForm, description })}
                    multiline
                  />
                  <Field label="Image URL" value={courseForm.imageUrl} onChange={(imageUrl) => setCourseForm({ ...courseForm, imageUrl })} />
                  <Field label="Price" type="number" value={courseForm.price} onChange={(price) => setCourseForm({ ...courseForm, price })} />
                  <div className="button-row">
                    <button className="primary-button" disabled={loading}>
                      {editingCourseId ? "Update" : "Create"}
                    </button>
                    {editingCourseId && (
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => {
                          setEditingCourseId("");
                          setCourseForm(emptyCourseForm);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="course-list">
                  {adminCourses.length ? (
                    adminCourses.map((course) => (
                      <article className="course-row" key={course._id}>
                        <img src={course.imageUrl || placeholderImage} alt="" />
                        <div>
                          <h3>{course.title}</h3>
                          <p>{course.description}</p>
                          <strong>{formatPrice(course.price)}</strong>
                        </div>
                        <button className="ghost-button" onClick={() => editCourse(course)}>
                          Edit
                        </button>
                      </article>
                    ))
                  ) : (
                    <EmptyState text="Create your first course to publish it in the catalog." />
                  )}
                </div>
              </>
            ) : (
              <EmptyState text="Sign in as an admin to manage courses." />
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function buildApi(token) {
  return axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

function AuthPanel({ title, form, setForm, onSignin, onSignup, loading }) {
  return (
    <section className="auth-grid">
      <div className="panel">
        <div className="section-heading compact">
          <div>
            <h2>{title}</h2>
            <p>Account details</p>
          </div>
        </div>
        <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Field label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        <Field label="First name" value={form.firstName} onChange={(firstName) => setForm({ ...form, firstName })} />
        <Field label="Last name" value={form.lastName} onChange={(lastName) => setForm({ ...form, lastName })} />
        <div className="button-row">
          <button className="primary-button" type="button" onClick={onSignin} disabled={loading}>
            Sign in
          </button>
          <button className="ghost-button" type="button" onClick={onSignup} disabled={loading}>
            Sign up
          </button>
        </div>
      </div>
      <div className="visual-panel">
        <img src={placeholderImage} alt="" />
      </div>
    </section>
  );
}

function CourseGrid({ courses, purchasedIds, loading, onBuy, readonly = false }) {
  if (loading && !courses.length) {
    return <EmptyState text="Loading courses..." />;
  }

  if (!courses.length) {
    return <EmptyState text="No courses available yet." />;
  }

  return (
    <div className="course-grid">
      {courses.map((course) => {
        const purchased = purchasedIds.has(course._id);
        return (
          <article className="course-card" key={course._id}>
            <img src={course.imageUrl || placeholderImage} alt="" />
            <div className="course-card-body">
              <div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
              <div className="course-footer">
                <strong>{formatPrice(course.price)}</strong>
                {!readonly && (
                  <button className="primary-button" onClick={() => onBuy(course._id)} disabled={purchased}>
                    {purchased ? "Purchased" : "Buy"}
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", multiline = false }) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} required />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required />
      )}
    </label>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

function StatusDot({ active, label }) {
  return (
    <div className="status-dot">
      <span className={active ? "online" : ""} />
      {label}
    </div>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}

function titleFor(view) {
  const titles = {
    courses: "Course catalog",
    purchases: "My learning",
    userAuth: "Student account",
    admin: "Admin dashboard",
    adminAuth: "Admin account",
  };
  return titles[view] || "CourseHub";
}

function labelFor(role) {
  return role === "admin" ? "Admin" : "Student";
}

const emptyAuthForm = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

const emptyCourseForm = {
  title: "",
  description: "",
  imageUrl: "",
  price: "",
};

export default App;
