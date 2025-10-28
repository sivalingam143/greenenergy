import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/PageTitle";
import { TextInputForm, DropDown } from "../../components/Forms";
import Footer from "../../components/Footer";
import { BiMailSend, BiX } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import { fetchCsrs, fetchTurbines } from "../../slices/CsrSlice";
import { toast } from "react-toastify";

const CsrFilter = ({ onClose }) => {
  const dispatch = useDispatch();
  const { turbines } = useSelector((state) => state.csrs);

  const [filterData, setFilterData] = useState({
    weg_no: "",
    csr_type: "",
    csr_no: "",
    csr_booked_by: "",
  });

  useEffect(() => {
    dispatch(fetchCsrs());
    dispatch(fetchTurbines());
  }, [dispatch]);

  const csrTypeShortCodes = [
    { type: "Breakdown", shortCode: "BD" },
    { type: "Maintenance", shortCode: "MD" },
    { type: "General check", shortCode: "GC" },
    { type: "Tower re-torque", shortCode: "TR" },
  ];

  const turbineOptions = Array.isArray(turbines)
    ? turbines.flatMap((turbine) =>
        turbine.wtg_no.map((wtg) => ({
          value: String(wtg),
          label: String(wtg),
        }))
      )
    : [];

  const handleInputChange = (field) => (value) => {
    let newValue;
    if (value && value.target) {
      newValue = value.target.value;
    } else if (value && typeof value === "object" && "value" in value) {
      newValue = value.value;
    } else {
      newValue = value || "";
    }
    setFilterData((prev) => {
      const updatedData = {
        ...prev,
        [field]: String(newValue),
      };
      // Trigger live filtering
      const searchTerms = [
        updatedData.weg_no,
        updatedData.csr_type,
        updatedData.csr_no,
        updatedData.csr_booked_by,
      ]
        .filter((term) => typeof term === "string" && term.trim() !== "")
        .map((term) => term.trim())
        .join(" ");
      dispatch(fetchCsrs(searchTerms))
        .unwrap()
        .catch((err) => {
          toast.error(`Failed to apply filter: ${err}`);
        });
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerms = [
      filterData.weg_no,
      filterData.csr_type,
      filterData.csr_no,
      filterData.csr_booked_by,
    ]
      .filter((term) => typeof term === "string" && term.trim() !== "")
      .map((term) => term.trim())
      .join(" ");

    if (!searchTerms) {
      toast.error("Please enter at least one filter criterion");
      return;
    }

    dispatch(fetchCsrs(searchTerms))
      .unwrap()
      .then(() => {
        if (onClose) onClose();
      })
      .catch((err) => {
        toast.error(`Failed to apply filter: ${err}`);
      });
  };

  const handleReset = () => {
    setFilterData({
      weg_no: "",
      csr_type: "",
      csr_no: "",
      csr_booked_by: "",
    });
    dispatch(fetchCsrs(""))
      .unwrap()
      .then(() => {})
      .catch((err) => {
        toast.error(`Failed to reset filter: ${err}`);
      });
  };

  const handleClose = () => {
    setFilterData({
      weg_no: "",
      csr_type: "",
      csr_no: "",
      csr_booked_by: "",
    });
    dispatch(fetchCsrs(""))
      .unwrap()
      .then(() => {
        if (onClose) onClose();
      })
      .catch((err) => {
        toast.error(`Failed to close filter: ${err}`);
      });
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="12">
            <PageTitle
              PageTitle="CSR Filter"
              showButton={true}
              buttonLabel={<BiX size="24" />}
              OnClick={handleClose}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="content-box">
              <Row>
                <Col xs="12" className="py-3">
                  <DropDown
                    textlabel={<>Weg No.</>}
                    options={turbineOptions}
                    value={filterData.weg_no}
                    onChange={handleInputChange("weg_no")}
                    placeholder="Select Weg No."
                  />
                </Col>
                <Col xs="12" className="py-3">
                  <DropDown
                    textlabel={<>CSR Type</>}
                    options={csrTypeShortCodes.map((item) => ({
                      value: item.type,
                      label: item.type,
                    }))}
                    value={filterData.csr_type}
                    onChange={handleInputChange("csr_type")}
                    placeholder="Select CSR Type"
                  />
                </Col>
                <Col xs="12" className="py-3">
                  <TextInputForm
                    textlabel={<>CSR No.</>}
                    value={filterData.csr_no}
                    onChange={handleInputChange("csr_no")}
                    placeholder="Enter CSR No."
                  />
                </Col>
                <Col xs="12" className="py-3">
                  <TextInputForm
                    textlabel={<>CSR Booked By</>}
                    value={filterData.csr_booked_by}
                    onChange={handleInputChange("csr_booked_by")}
                    placeholder="Enter Booked By"
                  />
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
              LabelOneClick={handleSubmit}
              LabelTwo={
                <>
                  <span className="mx-1">
                    <BiMailSend size="20" />
                  </span>
                  Reset Filter
                </>
              }
              LabelTwoClick={handleReset}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CsrFilter;
