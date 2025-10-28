import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TextInputForm } from "../components/Forms";
import { Buttons } from "../components/Buttons";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import useLoginHandlers from "../hooks/useLoginHandler";

const Login = () => {
  const {
    formData,
    handleChange,
    handleLogin,
    showPassword,
    togglePasswordVisibility,
  } = useLoginHandlers();

  return (
    <div className="pad_120">
      <Container>
        <Row className="justify-content-center">
          <Col lg="8" md="8" xs="12">
            <div className="login-box">
              <Row className="justify-content-center">
                <Col lg="6" md="12" xs="12">
                  <img
                    src={require("../assets/images/login_two.png")}
                    className="img-fluid"
                    alt="Srivaru Green Energy"
                  />
                </Col>
                <Col lg="6" md="12" xs="12" className="align-self-center">
                  <form onSubmit={handleLogin}>
                    <Row>
                      <Col lg="12">
                        <h2 className="bold">Welcome Back</h2>
                        <p className="regular">
                          Enter Your Login ID and Password to access your
                          account
                        </p>
                      </Col>
                      <Col lg="12" className="py-3">
                        <TextInputForm
                          textlabel="Login ID"
                          name="login_id"
                          type="text"
                          value={formData.login_id}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col lg="12" className="py-3">
                        <TextInputForm
                          textlabel="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          classname="form-control-padright"
                          type={showPassword ? "text" : "password"}
                          suffix_icon={
                            showPassword ? (
                              <VscEyeClosed
                                onClick={togglePasswordVisibility}
                              />
                            ) : (
                              <VscEye onClick={togglePasswordVisibility} />
                            )
                          }
                        />
                      </Col>
                      <Col lg="12" className="py-3">
                        <Buttons
                          label="Login"
                          classname="login-btn"
                          type="submit"
                        />
                      </Col>
                    </Row>
                  </form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
