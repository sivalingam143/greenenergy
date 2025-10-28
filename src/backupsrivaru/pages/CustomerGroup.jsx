import React, { useState, useEffect } from 'react'
import { Container, Col, Row, Modal } from 'react-bootstrap'
import { FaAngleRight, } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from '../components/Table';
import Pagnation from '../components/Pagnation';
import { ClickButton } from '../components/ClickButton';
import { TextInputForm } from '../components/Forms';
import { useLocation } from 'react-router-dom';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UserTablehead = ["No", "Customer Group Name", "Customer User Name"]
const CustomerGroup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {

        setShowModal(false);
        setCrtModal(null);
    }
    const handleShowModal = () => setShowModal(true);

    const location = useLocation();
    const { type, rowData } = location.state || {};
    const initialState = type === 'edit' ? { ...rowData } : {
        customergroup_name: '',
        customergroup_id: '',
        customeruser_name: '',
        customer_password: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [crtModal, setCrtModal] = useState(null);
    const handleEditClick = (rowdata) => {
        setCrtModal(rowdata)
        setShowModal(true)

    };
    const handleChange = (e, fieldName) => {
        const value = e.target ? e.target.value : e.value;
        if (crtModal != null) {
            setCrtModal({
                ...crtModal,
                [fieldName]: value
            })
        }
        setFormData({
            ...formData,
            [fieldName]: value
        });
    };


    const [userData, setUserData] = useState([])
    console.log('userData', userData);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const handleSearch = (value) => {
        setSearchText(value);
        //console.log(value);
    };
    const fetchData = async () => {
        try {
            const response = await fetch('https://greenenergy.zentexus.in/api/customergroup/list.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    search_text: searchText
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            setLoading(false);
            if (responseData.status === 200) {
                setUserData(responseData.data.customer_group);
            } else {
                throw new Error(responseData.msg);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error.message);
        }
    };
    useEffect(() => {
        fetchData(); // Call fetchData directly in useEffect

    }, [searchText]);
    const [showAlert, setShowAlert] = useState(false);

    const errorAlert = (input) => {
        toast.error(input, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    const successAlert = (success) => {
        toast.success(success, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",

        });
    }
    const handleSubmit = async () => {
        try {
            if (formData.model_type === '') {
                if (formData.model_type === '') {
                    errorAlert("Name is Must");
                }
            } else {
                const response = await fetch('https://greenenergy.zentexus.in/api/customergroup/create.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                console.log(formData);
                const responseData = await response.json();

                console.log(responseData);

                if (responseData.status === 200) {
                    setFormData({
                        customergroup_name: '',
                        customergroup_id: '',
                        customeruser_name: '',
                        customer_password: '',
                    })
                    fetchData();
                    successAlert(responseData.msg)
                    setTimeout(() => {
                        handleCloseModal();
                    }, 2000);
                }
                else if (responseData.status === 400) {
                    errorAlert(responseData.msg)
                }
                else {
                    setShowAlert(true);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleUpdateSubmit = async () => {
        try {
            const response = await fetch('https://greenenergy.zentexus.in/api/customergroup/update.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ // Include the company ID in the request
                    customergroup_uniq_id: crtModal.customergroup_uniq_id,
                    customergroup_name: crtModal.customergroup_name,
                    customergroup_id: crtModal.customergroup_id,
                    customeruser_name: crtModal.customeruser_name,
                    customer_password: crtModal.customer_password,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update company');
            }

            const responseData = await response.json();
            console.log(responseData);

            if (responseData.status === 200) {

                fetchData();
                successAlert(responseData.msg)
                setTimeout(() => {
                    handleCloseModal();
                }, 2000);

                // Navigate to the user list page after a delay

            } else {
                console.error(responseData.msg || 'Unknown error occurred during update');
            }
        } catch (error) {
            console.error('Error updating product:', error.msg);
        }

        setLoading(false);
    };
    return (
        <>
            <div id='main'>
                <Container fluid>
                    <Row>
                        <Col lg='7' md='4' xs='6'>
                            <div className='page-nav py-3'>
                                <span class="nav-list">Customer Group</span>
                            </div>
                        </Col>
                        <Col lg='5' md='3' xs='6' className='align-self-center text-end'>
                            <ClickButton label={<>Add New</>} className='create-btn' onClick={handleShowModal}></ClickButton>
                        </Col>
                        <Col lg='3' md='5' xs='12' className='py-1'>
                            <TextInputForm placeholder={"customer"} onChange={(e) => handleSearch(e.target.value)} prefix_icon={<FaMagnifyingGlass />} labelname={"Search Customer Group"}> </TextInputForm>
                        </Col>
                        {/* <Col lg={9} md={12} xs={12} className='py-2'>
                        <Pagnation></Pagnation>
                    </Col> */}
                        <Col lg='12' md='12' xs='12' className='px-0'>
                            <div className='py-1'>
                                <TableUI headers={UserTablehead} body={userData} pageview={"yes"} type="customergroup" handleEditClick={handleEditClick} onDelete={fetchData} style={{ 'borderRadius': '5px' }} />
                            </div>
                        </Col>
                        {/* <Col lg={12} md={12} xs={12}>
                        <Pagnation></Pagnation>
                    </Col> */}
                    </Row>
                </Container>
                <>
                    <Modal show={showModal} onHide={handleCloseModal} size='xl' centered>
                        <Modal.Header >
                            <Modal.Title> Customer Group Creation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col lg='6' md='12' xs='12' className='py-2'>
                                    <TextInputForm placeholder={'Customer Group Name'}
                                        labelname={'Customer Group Name'}
                                        name='customergroup_name'
                                        value={crtModal != null ? crtModal.customergroup_name : formData.customergroup_name}
                                        onChange={(e) => handleChange(e, 'customergroup_name')}
                                    ></TextInputForm>
                                </Col>
                                <Col lg='6' md='12' xs='12' className='py-2'>
                                    <TextInputForm placeholder={'Customer Group Id'}
                                        labelname={'Customer Group Id'}
                                        name='CustomerGroupId'
                                        value={crtModal != null ? crtModal.customergroup_id : formData.customergroup_id}
                                        onChange={(e) => handleChange(e, 'customergroup_id')}
                                    ></TextInputForm>
                                </Col>
                                <Col lg='6' md='12' xs='12' className='py-2'>
                                    <TextInputForm placeholder={'Customer User Name'}
                                        labelname={'Customer User Name'}
                                        name='customeruser_name'
                                        value={crtModal != null ? crtModal.customeruser_name : formData.customeruser_name}
                                        onChange={(e) => handleChange(e, 'customeruser_name')}
                                    ></TextInputForm>
                                </Col>
                                <Col lg='6' md='12' xs='12' className='py-2'>
                                    <TextInputForm
                                        placeholder={'Password'}
                                        suffix_icon={showPassword ? <VscEye onClick={() => setShowPassword(false)} /> : <VscEyeClosed onClick={() => setShowPassword(true)} />}
                                        labelname={'Password'}
                                        type={showPassword ? 'text' : 'password'}
                                        name='customer_password'
                                        value={crtModal != null ? crtModal.customer_password : formData.customer_password}
                                        onChange={(e) => handleChange(e, 'customer_password')}
                                    />
                                </Col>
                            </Row>

                        </Modal.Body>
                        <Modal.Footer>
                            <Col lg='12' className='align-self-center'>
                                <div className='text-center'>
                                    {crtModal != null ? (
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
                                            <div className='d-flex justify-content-center'>
                                                <span className='mx-2'>
                                                    <ClickButton label={<>Update</>} onClick={handleUpdateSubmit} ></ClickButton>
                                                </span>
                                                <span className='mx-2'>
                                                    <ClickButton label={<>Cancel</>} onClick={handleCloseModal}></ClickButton>
                                                </span>
                                            </div>

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
                                            <div className='d-flex justify-content-center'>
                                                <span className='mx-2'>
                                                    <ClickButton label={<> Submit</>} onClick={handleSubmit}></ClickButton>
                                                </span>
                                                <span className='mx-2'>
                                                    <ClickButton label={<>Cancel</>} onClick={handleCloseModal}></ClickButton>
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Col>
                        </Modal.Footer>
                    </Modal>
                </>
            </div>
        </>

    )
}

export default CustomerGroup