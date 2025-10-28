import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { DropDown, TextInputForm } from '../Compnents/Forms'
import PageNav from '../Compnents/PageNav'
import { ClickButton } from '../Compnents/ClickButton';
import { useLocation } from 'react-router-dom';
const DropList = [
    {
        value: 'chocolate', label: 'Chocolate'
    },
    {
        value: 'strawberry', label: 'Strawberry'
    },
    {
        value: 'strawberry', label: 'Strawberry'
    },
    {
        value: 'strawberry', label: 'Strawberry'
    }
];
const LocationCreation = () => {
    const location = useLocation();
    const { type, rowData } = location.state || {};
    const initialState = type === 'edit' ? { ...rowData } : {
        state_id: '',
        site_id: '',
        location_name: ""
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
                <Row>
                    <Col lg='12' md='6' xs='6' className='align-self-center py-3'>
                        <PageNav pagetitle={"Location Creation"}></PageNav>
                    </Col>
                    <Col lg='4' md='6' xs='12' className='py-3'>
                        <DropDown
                            optionlist={[]}
                            placeholder='State name'
                            labelname='Choose State'
                            name='state_id'
                            value={formData.state_id}
                            onChange={(updatedFormData) => setFormData({ ...formData, state_id: updatedFormData.state_id })}
                        ></DropDown>
                    </Col>
                    <Col lg='4' md='6' xs='12' className='py-3'>
                        <DropDown
                            optionlist={[]}
                            placeholder='Site Name'
                            labelname='Site Name'
                            name='site_id'
                            value={formData.site_id}
                            onChange={(updatedFormData) => setFormData({ ...formData, site_id: updatedFormData.site_id })}
                        ></DropDown>
                    </Col>
                    <Col lg='4' md='6' xs='12' className='py-3'>
                        <TextInputForm placeholder={"Location Name"} labelname={"Location Name"}
                            name='location_name'
                            value={formData.location_name}
                            onChange={(e) => handleChange(e, 'location_name')}
                        ></TextInputForm>
                    </Col>
                    <Col lg='12' md='12' xs='12' className='align-self-center py-5 text-center'>
                        <ClickButton label={<>Add New</>} onClick={() => ("/console/master/customer/create")}></ClickButton>
                    </Col>
                    <Col lg='12' md='12' xs='12'>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LocationCreation