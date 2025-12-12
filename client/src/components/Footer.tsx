import React from "react";
import { Facebook, Github, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 pt-5 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-center mb-3">
            <h5 className="fw-bold">QuizBank</h5>
            <p className="text-secondary">
              Improve your knowledge with quick and fun quizzes.
            </p>
          </div>

          <div className="col-md-4 text-center mb-3">
            <h6 className="fw-bold">Navigation</h6>
            <ul className="list-unstyled mt-2">
              <li>
                <a className="text-secondary text-decoration-none" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="text-secondary text-decoration-none" href="#">
                  Quizzes
                </a>
              </li>
              <li>
                <a className="text-secondary text-decoration-none" href="#">
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 text-center mb-3">
            <h6 className="fw-bold">Follow Us</h6>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <Facebook className="fs-4" />
              <Github className="fs-4" />
              <Instagram className="fs-4" />
            </div>
          </div>
        </div>

        <hr className="border-secondary" />
        <p className="text-center text-secondary small mb-0">
          © {new Date().getFullYear()} QuizBank — Built with ❤️
        </p>
      </div>
    </footer>
  );
}
