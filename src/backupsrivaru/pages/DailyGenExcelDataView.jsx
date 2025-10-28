import React from "react";
import { Container, Col, Row,Table } from "react-bootstrap";
import { ClickButton } from "../Compnents/ClickButton";
import { useLocation } from 'react-router-dom';
import PageNav from "../Compnents/PageNav";

const DailyGenExcelDataView = ()=>{

    const location = useLocation();
    const excelData = location.state?.excelData;

    
    console.log('Received Excel Data:', excelData);
    return (
        <>
        <Container fluid>
            <Row>
                <Col lg="7" md="6" xs="3" className="align-self-center">
                    <div className="page-nav py-3">
                        <PageNav pagetitle={'Daily Generation'}></PageNav>
                    </div>
                </Col>
                <Col lg="5" md="6" xs="9" className="align-self-center py-3">
                    <div className="d-flex justify-content-end">
                        <div className="px-2">
                            <ClickButton
                            label={<>Submit</>}
                            className="create-btn "
                            onClick={() => {}}
                            ></ClickButton>
                        </div>
                    </div>
                </Col>
                <Col>
                <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Turbine No</th>
                                <th>Location No</th>
                                <th>Gen 0</th>
                                <th>Gen 1</th>
                                <th>Gen 2</th>
                                <th>Gen 1 hrs</th>
                                <th>Gen 2 hrs</th>
                                <th>KWH imp (EB)</th>
                                <th>KWH Exp (EB)</th>
                                <th>KVARH Imp (EB)</th>
                                <th>KVARH Exp (EB)</th>

                                
                                <th>Machine Fault</th>
                                <th>KWH Exp (EB)</th>
                                <th>KVARH Imp (EB)</th>
                                <th>KVARH Exp (EB)</th>
                                <th>Remarks</th>
                                {/* {excelData.defaultData.map((header) => (
                                    <th key={header}>{header}</th>
                                ))} */}
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.defaultData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td key={"Date"}>{row["Date"]}</td>
                                    <td key={"Turbine No"}>{row["Turbine No"]}</td>
                                    <td key={"Location No"}>{row["Location No"]}</td>
                                    <td key={"Gen 0"}>{row["Gen 0"]}</td>
                                    <td key={"Gen 1"}>{row["Gen 1"]}</td>
                                    <td key={"Gen 2"}>{row["Gen 2"]}</td>
                                    <td key={"Gen 1 hrs"}>{row["Gen 1 hrs"]}</td>
                                    <td key={"Gen 2 hrs"}>{row["Gen 2 hrs"]}</td>
                                    <td key={"KWH imp (EB)"}>{row["KWH imp (EB)"]}</td>
                                    <td key={"KWH Exp (EB)"}>{row["KWH Exp (EB)"]}</td>
                                    <td key={"KVARH Imp (EB)"}>{row["KVARH Imp (EB)"]}</td>
                                    <td key={"KVARH Exp (EB)"}>{row["KVARH Exp (EB)"]}</td>
                                    <td key={"Remarks"}>{row["Remarks"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                </Col>
            </Row>
        </Container>
        </>
    );
};


export default DailyGenExcelDataView;