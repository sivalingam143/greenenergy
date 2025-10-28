import React from 'react'
import { Container, Row, Col } from "react-bootstrap";
import PageTitle from "../../components/PageTitle";
import {
  TextInputForm,
  DropDown,
} from "../../components/Forms";
import Footer from "../../components/Footer";
import { BiMailSend } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
const CsrMappingFilter = () => {
  return (
    <div>  <Container fluid>
        <Row>
          <Col lg="12">
            <PageTitle
              PageTitle=" CSR Filter"
              showButton={false}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="content-box">
              <Row>
                <Col xs="12" className="py-3">
                  <TextInputForm textlabel={<>Weg No.</>} />
                </Col>
                 <Col xs="12" className="py-3">
                  <DropDown textlabel="CSR Type"/>
                </Col>
                 
                <Col xs="12" className="py-3">
                  <TextInputForm textlabel={<>CSR No.</>} />
                </Col>
                 <Col xs="12" className="py-3">
                  <TextInputForm textlabel={<>CSR Booked By</>} />
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg="12">
            <Footer
              LabelOne={
                <>
                  <span className="mx-1">
                    <HiOutlineDownload size="20" />
                  </span>
                  Submit
                </>
              }
              LabelTwo={
                <>
                  <span className="mx-1">
                    <BiMailSend size="20" />
                  </span>
                  Cancel
                </>
              }
            />
          </Col>
        </Row>
      </Container></div>
  )
}

export default CsrMappingFilter