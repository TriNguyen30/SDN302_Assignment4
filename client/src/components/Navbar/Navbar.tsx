import "./style.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useNavigate, NavLink } from "react-router-dom";

const logoSrc = "/QuizBank.png";
export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div>
      <nav className="navbar bg-white navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <NavLink to="/dashboard" className="navbar-brand d-flex align-items-center">
            <img className="navbar-logo" src={logoSrc} alt="Quiz Bank" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Quiz Bank
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>

            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                <li className="nav-item">
                  <NavLink
                    end
                    className={({ isActive }) =>
                      `nav-link mx-lg-2 ${isActive ? "active" : ""}`
                    }
                    to="/"
                  >
                    Home
                  </NavLink>
                </li>
                {user?.admin && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        end
                        className={({ isActive }) =>
                          `nav-link mx-lg-2 ${isActive ? "active" : ""}`
                        }
                        to="/admin"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link mx-lg-2 ${isActive ? "active" : ""}`
                        }
                        to="/admin/quizzes"
                      >
                        Quizzes
                      </NavLink>  
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          `nav-link mx-lg-2 ${isActive ? "active" : ""}`
                        }
                        to="/admin/questions"
                      >
                        Questions
                      </NavLink>  
                    </li>
                  </>
                )}
                {user && !user.admin && (
                  <li className="nav-item">
                    <NavLink
                      end
                      className={({ isActive }) =>
                        `nav-link mx-lg-2 ${isActive ? "active" : ""}`
                      }
                      to="/dashboard"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="login-button btn btn-outline-danger rounded-pill px-4">
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="login-button btn btn-success rounded-pill px-4">
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}
