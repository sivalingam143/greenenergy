import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import PageNav from '../Compnents/PageNav'
import { TextInputForm, DropDown } from '../Compnents/Forms'
import { ClickButton } from '../Compnents/ClickButton';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Navigate } from 'react-router-dom';

const ContractTypeCreation = () => {
    const location = useLocation();
    const { type, rowData } = location.state || {};
    const navigate = useNavigate();
    const initialState = type === 'edit' ? { ...rowData } : {
        contract_name: '',
        contract_code: ''
    };
    const [formData, setFormData] = useState(initialState);
    const handleChange = (e, fieldName) => {
        const value = e.target ? e.target.value : e.value;

        setFormData({
            ...formData,
            [fieldName]: value
        });
    };

    return (
        <div>
            <Container>
                <Row className='regular'>
                    <Col lg='12' md='12' xs='12' className='py-3'>
                        <PageNav pagetitle={"ContractTypeCreation"}></PageNav>
                    </Col>
                    <Col lg='4' md='4' xs='12' className='py-3'>
                        <TextInputForm placeholder={"Contract Name"} labelname={" Contract Name"}
                            name='contract_name'
                            value={formData.contract_name}
                            onChange={(e) => handleChange(e, 'contract_name')}
                        ></TextInputForm>
                    </Col>
                    <Col lg='4' md='4' xs='12' className='py-3'>
                        <TextInputForm placeholder={"Contract Code"} labelname={" Contract Code"}
                            name='contract_code'
                            value={formData.contract_code}
                            onChange={(e) => handleChange(e, 'contract_code')}
                        ></TextInputForm>
                    </Col>
                    <Col lg='12' className='py-5 align-self-center'>
                        <div className='text-center'>
                            {type === "edit" ? (
                                <>
                                    <ToastContainer
                                        position="top-center"
                                        autoClose={2000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        theme="colored"
                                    />
                                    <span className='mx-2'>
                                        <ClickButton label={<>Update</>} ></ClickButton>
                                    </span>
                                    <span className='mx-2'>
                                        <ClickButton label={<>Cancel</>} onClick={() => navigate("/console/master/contracttype")}></ClickButton>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ToastContainer
                                        position="top-center"
                                        autoClose={2000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        theme="colored"
                                    />
                                    <span className='mx-2'>
                                        <ClickButton label={<> Submit</>} ></ClickButton>
                                    </span>
                                    <span className='mx-2'>
                                        <ClickButton label={<>Cancel</>} onClick={() => navigate("/console/master/contracttype")}></ClickButton>
                                    </span>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ContractTypeCreation