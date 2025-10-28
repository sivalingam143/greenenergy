import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import { TextForm } from '../Compnents/Forms'
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { ClickButton } from '../Compnents/ClickButton';
import { useNavigate } from 'react-router-dom';
const Login = ({ onLogin }) => {
    const [login_id, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (login_id === "" || password === "") {
                throw new Error('Username Or Password is Empty');
            }
            if (!login_id || !password) {
                throw new Error('Username and Password are required');
            }
            setLoading(true);

            const loginData = {
                login_id: login_id,
                password: password
            };

            const response = await fetch('https://api.demos.srivarugreenenergy.com/login/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData),
            });

            // if (!response.ok) {
            //   throw new Error('Login failed');
            // }

            const responseData = await response.json();

            console.log('responseData', responseData);

            if (responseData.status !== 'Success') {
                setError(responseData.msg);
            } else if (responseData.status === 'Success') {
                onLogin();
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error.message);      
            setError(error.message);
        }finally {
            setLoading(false); // Stop loading
        }
    };
    return (
        // <div className='login-bg'>
        //     <Container fluid className='px-5 pad min-vh-100'>
        //         <Row className='justify-content-center'>
        //             <Col lg='3' md="6" xs='12' className='align-self-center p-0 m-0'>
        //                 <div className='shadow login-box'>
        //                     <div className='text-center'>
        //                         <img src={require('../Compnents/sidebar/images/logo.png')} className='img-fluid login-logo' alt='' />
        //                     </div>
        //                     <div className='text-center py-4 '>Login Your Credential</div>
        //                     <div className='py-3'>
        //                         <TextForm
        //                             placeholder={"LoginId"}
        //                             value={login_id}
        //                             onChange={(e) => setLoginId(e.target.value)}
        //                         />
        //                     </div>
        //                     <div className='py-3'>
        //                         <TextForm
        //                             placeholder={"Password"}
        //                             type={showPassword ? "text" : "password"}
        //                             value={password}
        //                             onChange={(e) => setPassword(e.target.value)}
        //                             suffix_icon={showPassword ? <VscEye onClick={() => setShowPassword(false)} /> : <VscEyeClosed onClick={() => setShowPassword(true)} />}
        //                         />
        //                     </div>
        //                     <div className='py-3 text-center'>
        //                         <ClickButton label={<>Login</>} onClick={handleLogin}></ClickButton>
        //                     </div>
        //                     {error && (
        //                         <Alert variant="danger">{error}</Alert> // Render error alert banner if error state is not null
        //                     )}
        //                 </div>
        //             </Col>
        //         </Row>
        //     </Container>
        // </div>
        <div className="login-bg">
            <Container
                fluid
                className="d-flex justify-content-center align-items-center min-vh-100 ssc"
            >
                <Row className="justify-content-center w-100">
                    <Col xs={10} sm={8} md={6} lg={3} className="kannan">
                        <div className="border p-4 shadow-sm rounded kannan1">
                            <div className="p-2 text-center">

                                <img src={require('../Compnents/sidebar/images/logo.png')} className='img-fluid login-logo' alt='' />

                            </div>
                            <div className="text-center fs-3 py-2">
                                Login Your Credential{" "}
                            </div>
                            <div className="py-3">
                                <TextForm
                                    placeholder={"LoginId"}
                                    value={login_id}
                                    onChange={(e) => setLoginId(e.target.value)}
                                />
                            </div>

                            <div className='py-3'>
                                <TextForm
                                    placeholder={"Password"}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Call handleLogin on Enter key press
                                    suffix_icon={showPassword ? <VscEye onClick={() => setShowPassword(false)} /> : <VscEyeClosed onClick={() => setShowPassword(true)} />}

                                />
                            </div>
                            <div className='py-3 text-center'>
                                <ClickButton label={loading ? "Loading..." : "Login"}  onClick={handleLogin} disabled={loading}></ClickButton>
                            </div>
                            {error && (
                                <Alert variant="danger">{error}</Alert> // Render error alert banner if error state is not null
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login