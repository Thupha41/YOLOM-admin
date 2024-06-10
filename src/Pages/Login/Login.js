import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
// import BackgroundImage from "../../assets/images/background.png";
// import Logo from "../../assets/images/logo.png";

const Login = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await delay(500);
    console.log(`Username :${inputUsername}, Password :${inputPassword}`);
    if (inputUsername !== "admin" || inputPassword !== "admin") {
      setShow(true);
    }
    navigate("admin");
    setLoading(false);
  };

  const handlePassword = () => {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    // <div classNameName="sign-in__wrapper" style={{ backgroundColor: "white" }}>
    //   {/* Overlay */}
    //   <div classNameName="sign-in__backdrop"></div>
    //   {/* Form */}
    //   <Form classNameName="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
    //     {/* Header */}
    //     <img classNameName="img-thumbnail mx-auto d-block mb-2" src="" alt="logo" />
    //     <div classNameName="h4 mb-2 text-center">Sign In</div>
    //     {/* ALert */}
    //     {show ? (
    //       <Alert
    //         classNameName="mb-2"
    //         variant="danger"
    //         onClose={() => setShow(false)}
    //         dismissible
    //       >
    //         Incorrect username or password.
    //       </Alert>
    //     ) : (
    //       <div />
    //     )}
    //     <Form.Group classNameName="mb-2" controlId="username">
    //       <Form.Label>Username</Form.Label>
    //       <Form.Control
    //         type="text"
    //         value={inputUsername}
    //         placeholder="Username"
    //         onChange={(e) => setInputUsername(e.target.value)}
    //         required
    //       />
    //     </Form.Group>
    //     <Form.Group classNameName="mb-2" controlId="password">
    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         type="password"
    //         value={inputPassword}
    //         placeholder="Password"
    //         onChange={(e) => setInputPassword(e.target.value)}
    //         required
    //       />
    //     </Form.Group>
    //     <Form.Group classNameName="mb-2" controlId="checkbox">
    //       <Form.Check type="checkbox" label="Remember me" />
    //     </Form.Group>
    //     {!loading ? (
    //       <Button classNameName="w-100" variant="primary" type="submit">
    //         Log In
    //       </Button>
    //     ) : (
    //       <Button classNameName="w-100" variant="primary" type="submit" disabled>
    //         Logging In...
    //       </Button>
    //     )}
    //     <div classNameName="d-grid justify-content-end">
    //       <Button
    //         classNameName="text-muted px-0"
    //         variant="link"
    //         onClick={handlePassword}
    //       >
    //         <Link to="forgot-password" classNameName="">
    //           Forgot Password?
    //         </Link>
    //       </Button>
    //     </div>
    //   </Form>
    //   {/* Footer */}
    //   <div classNameName="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
    //     Made by Hendrik C | &copy;2022
    //   </div>
    // </div>
    <section className="vh-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 text-black">
            <div className="px-5 ms-xl-4">
              <i
                className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4"
                style={{ color: "#709085" }}
              ></i>
              <span className="h1 fw-bold mb-0">Logo</span>
            </div>

            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-5 mt-5 pt-5 pt-xl-0 mt-xl-n5">
              <form style={{ width: "23rem" }}>
                <h3
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Log in
                </h3>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="email"
                    id="form2Example18"
                    className="form-control form-control-lg"
                  />
                  <label className="form-label" for="form2Example18">
                    Email address
                  </label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="password"
                    id="form2Example28"
                    className="form-control form-control-lg"
                  />
                  <label className="form-label" for="form2Example28">
                    Password
                  </label>
                </div>

                <div className="pt-1 mb-4">
                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-info btn-lg btn-block"
                    type="button"
                  >
                    Login
                  </button>
                </div>

                <p className="small mb-5 pb-lg-2">
                  <a className="text-muted" href="#!">
                    Forgot password?
                  </a>
                </p>
                <p>
                  Don't have an account?{" "}
                  <a href="#!" className="link-info">
                    Register here
                  </a>
                </p>
              </form>
            </div>
          </div>
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
              alt="Login"
              className="w-100 vh-100"
              style={{ objectPosition: "left", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
