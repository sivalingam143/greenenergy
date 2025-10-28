import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import PageTitle from "../components/PageTitle";
import {
  TextInputForm,
  DropDown,
  DatePick,
  TimePick,
  TextArea,
  CheckBox,
} from "../components/Forms";
import SignatureCanvas from "react-signature-canvas";
import TableUI from "../components/TableUI";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Buttons } from "../components/Buttons";
import Footer from "../components/Footer";
import { BiMailSend } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import Dialog from "../components/Dialog";
const CsrPreview = () => {
  const navigate = useNavigate();
  const signatureRef = useRef();

  const handleDownloadSignature = () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "signature.png";
      link.click();
    }
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isMailChecked, setIsMailChecked] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState("No");
  const handleCheckBoxChange = (event) => {
    const checked = event.target.checked;
    setIsMailChecked(checked);
    setCheckboxLabel(checked ? "Yes" : "No");
  };
  const InvoiceHead = [
    "S No",
    "Item No.",
    "Description",
    "UOM",
    "Qty",
    "Status",
  ];
  const InvoiceData = [
    {
      values: [
        "01",
        <TextInputForm className="w-25" />,
        "Screws",
        "Litres",
        "5",
        <>
          <DropDown textlabel={<>Contract Type</>} />
        </>,
        <Buttons
          label={
            <>
              <MdOutlineDeleteOutline />
            </>
          }
          classname="icon-only delete"
        />,
      ],
    },
  ];
  const handleConfirmCsr=()=>{

  }
  
  const handleCloseForm = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      console.log("Form closed");
      navigate(-1);
    }
  };

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="12">
            <PageTitle
              PageTitle="Create CSR Entry"
              showButton={true}
              OnClick={handleCloseForm}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="content-box">
              <Row>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>CSR No</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3 align-self-center">
                  <DatePick textlabel={<> Date</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Customer Name</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <DropDown />
                </Col>
                <Col xs="12" className="py-3">
                  <PageTitle PageTitle="Turbine Details" showButton={false} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Error Details</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Weg No.</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Loc No.</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Model</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>HTSC No</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Capacity</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Make</>} />
                </Col>
                <Col lg="8" xs="12" className="py-3"></Col>
                <Col xs="12" className="py-3">
                  <PageTitle PageTitle="CSR Book" showButton={false} />
                </Col>
                <Col lg="4" xs="12" className="py-3">
                  <TextInputForm textlabel={<>CSR Booked By</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3 align-self-center">
                  <DatePick textlabel={<> Date</>} />
                </Col>
                <Col lg="4" md="3" xs="12" className="py-3">
                  <TimePick textlabel={<> Time</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3 align-self-center">
                  <DatePick textlabel={<> Date</>} />
                </Col>
                <Col lg="4" md="3" xs="12" className="py-3">
                  <TimePick textlabel={<> Time</>} />
                </Col>
                <Col xs="12" className="py-3">
                  <TextArea textlabel={<> Nature Of work</>} />
                </Col>
                <Col xs="12" className="py-3">
                  <PageTitle PageTitle="Machine Stop" showButton={false} />
                </Col>
                <Col lg="4" md="3" xs="12" className="py-3">
                  <CheckBox
                    textlabel={<>System Down</>}
                    boxlabel={<> {checkboxLabel} </>}
                    checked={isMailChecked}
                    OnChange={handleCheckBoxChange}
                  />
                </Col>
                <Col xs="12" className="py-3">
                  <PageTitle PageTitle="Work Time Status" showButton={false} />
                </Col>
                <Col lg="4" xs="12" className="py-3 align-self-center">
                  <DatePick textlabel={<> Date</>} />
                </Col>
                <Col lg="4" md="3" xs="12" className="py-3">
                  <TimePick textlabel={<> Time</>} />
                </Col>
                <Col lg="4" xs="12" className="py-3 align-self-center">
                  <DatePick textlabel={<> Date</>} />
                </Col>
                <Col lg="4" md="3" xs="12" className="py-3">
                  <TimePick textlabel={<> Time</>} />
                </Col>
                <Col xs="12" className="py-3">
                  <TableUI headers={InvoiceHead} body={InvoiceData} />
                </Col>
                <Col lg="6" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Employee Name</>} />
                </Col>
                 <Col lg="6" xs="12" className="py-3"></Col>
                <Col lg="6" xs="12" className="py-3">
                  <TextInputForm textlabel={<>Incharge Operator Name</>} />
                </Col>
                <Col lg="6" xs="12" className="py-3">
                  <div className="bg-white p-3 ">
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        width: 400,
                        height: 150,
                        className: "border w-100",
                      }}
                    />
                  </div>
                  <div className="p-3 ">
                    <Footer
                      LabelOne={
                        <>
                          <span className="mx-1">
                            <HiOutlineDownload size="20" />
                          </span>
                          Ok
                        </>
                      }
                      LabelTwo={
                        <>
                          <span className="mx-1">
                            <BiMailSend size="20" />
                          </span>
                          Clear
                        </>
                      }
                      LabelOneClick={handleDownloadSignature}
                      LabelTwoClick={handleClearSignature}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg="12">
            <Buttons
              label={<>Submit</>}
              classname="crud-btn"
              OnClick={handleConfirmCsr}
            />
          </Col>
        </Row>
      </Container>
      <>
        <Dialog
          isVisible={showConfirmDialog}
          onConfirm={handleConfirmClose}
          onCancel={() => handleConfirmClose(false)}
        />
      </>
      <></>
    </div>
  );
};

export default CsrPreview;
