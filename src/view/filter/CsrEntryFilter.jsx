import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/PageTitle";
import { TextInputForm, DropDown } from "../../components/Forms";
import Footer from "../../components/Footer";
import { BiMailSend, BiX } from "react-icons/bi";
import { HiOutlineDownload } from "react-icons/hi";
import { fetchTurbines } from "../../slices/CsrSlice";
import { fetchCsrEntries } from "../../slices/CsrEntrySlice";
import { toast } from "react-toastify";

const CsrEntryFilter = ({ onClose }) => {
  const dispatch = useDispatch();
  const { turbines } = useSelector((state) => state.csrs);
  const { csrEntries, status, error } = useSelector(
    (state) => state.csrEntries
  );

  const [filterData, setFilterData] = useState({
    weg_no: "",
    csr_type: "",
    site_name: "",
    fromDate: "",
    toDate: "",
  });

  console.log(filterData);
  useEffect(() => {
    dispatch(fetchTurbines());
    dispatch(fetchCsrEntries());
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
        updatedData.site_name,
      ]
        .filter((term) => typeof term === "string" && term.trim() !== "")
        .map((term) => term.trim())
        .join(" ");
      dispatch(
        fetchCsrEntries({
          searchText: searchTerms,
          fromDate: updatedData.fromDate,
          toDate: updatedData.toDate,
        })
      )
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
      filterData.site_name,
    ]
      .filter((term) => typeof term === "string" && term.trim() !== "")
      .map((term) => term.trim())
      .join(" ");

    if (!searchTerms && !filterData.fromDate && !filterData.toDate) {
      toast.error("Please enter at least one filter criterion");
      return;
    }

    dispatch(
      fetchCsrEntries({
        searchText: searchTerms,
        fromDate: filterData.fromDate,
        toDate: filterData.toDate,
      })
    )
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
      site_name: "",
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchCsrEntries({ searchText: "", fromDate: "", toDate: "" }))
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
      site_name: "",
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchCsrEntries({ searchText: "", fromDate: "", toDate: "" }))
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
                  <TextInputForm
                    textlabel="From Date"
                    type="date"
                    value={filterData.fromDate}
                    onChange={handleInputChange("fromDate")}
                  />
                </Col>

                <Col xs="12" className="py-3">
                  <TextInputForm
                    textlabel="To Date"
                    type="date"
                    value={filterData.toDate}
                    onChange={handleInputChange("toDate")}
                  />
                </Col>
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
                    textlabel={<>Site Name</>}
                    type="text"
                    value={filterData.site_name}
                    onChange={handleInputChange("site_name")}
                    placeholder="Enter Site Name"
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

export default CsrEntryFilter;
