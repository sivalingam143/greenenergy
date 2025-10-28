import React, { useState, useEffect } from "react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../components/Table";
import { ClickButton } from "../components/ClickButton";
import { TextInputForm } from "../components/Forms";
import MobileView from "../components/MobileView";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTitle from "../../components/PageTitle";
import Title from "../../components/Title";
const UserTablehead = ["No", "Contract Type", "Contract Code"];

const ContractModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  onChange,
  isEdit,
  loading,
}) => (
  <Modal show={show} onHide={onClose} size="md" centered>
    <Modal.Header closeButton>
      <Modal.Title>{isEdit ? "Edit Contract" : "Create Contract"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container>
        <Row>
          <Col lg={12} md={12} xs={12} className="py-3">
            <TextInputForm
              placeholder="Contract Name"
              labelname="Contract Name"
              name="contract_name"
              value={formData.contract_name}
              onChange={onChange}
            />
          </Col>
          <Col lg={12} md={12} xs={12} className="py-3">
            <TextInputForm
              placeholder="Contract Code"
              labelname="Contract Code"
              name="contract_code"
              value={formData.contract_code}
              onChange={onChange}
            />
          </Col>
        </Row>
      </Container>
    </Modal.Body>
    <Modal.Footer>
      <Col lg={12} className="align-self-center">
        <div className="text-center">
          <span className="mx-2">
            {" "}
            <ClickButton
              label={isEdit ? "Update" : "Submit"}
              onClick={onSubmit}
              disabled={loading}
            />
          </span>
          <span className="mx-2">
            <ClickButton label="Cancel" onClick={onClose} />
          </span>
        </div>
      </Col>
    </Modal.Footer>
  </Modal>
);

const ContractType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, rowData } = location.state || {};

  // Modal state
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form data state, unify edit/create
  const initialFormData = { contract_name: "", contract_code: "" };
  const [formData, setFormData] = useState(
    type === "edit" && rowData ? rowData : initialFormData
  );

  // User data state
  const [userData, setUserData] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Toast helpers
  const notifyError = (msg) =>
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
    });
  const notifySuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
    });

  // Fetch contracts
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.demos.srivarugreenenergy.com/contract_type/list.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_text: searchText }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      if (data.status === 200) {
        setUserData(data.data.contract_type);
      } else {
        throw new Error(data.msg);
      }
    } catch (err) {
      notifyError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchText]);

  // Handlers
  const openModalForCreate = () => {
    setFormData(initialFormData);
    setModalShow(true);
  };

  const openModalForEdit = (row) => {
    setFormData(row);
    setModalShow(true);
  };

  const closeModal = () => {
    setModalShow(false);
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.contract_name.trim()) {
      notifyError("Contract Name is required");
      return false;
    }
    if (!formData.contract_code.trim()) {
      notifyError("Contract Code is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const isEdit = Boolean(formData.contract_id || type === "edit");
      const url = isEdit
        ? "https://api.demos.srivarugreenenergy.com/contract_type/update.php"
        : "https://api.demos.srivarugreenenergy.com/contract_type/create.php";

      // For update, include contract_id
      const body = isEdit
        ? {
            contract_id: formData.contract_id,
            contract_name: formData.contract_name,
            contract_code: formData.contract_code,
          }
        : {
            contract_name: formData.contract_name,
            contract_code: formData.contract_code,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      const data = await response.json();

      if (data.status === 200) {
        notifySuccess(
          data.msg || (isEdit ? "Contract updated!" : "Contract created!")
        );
        fetchData();
        closeModal();
      } else {
        notifyError(data.msg || "Error submitting data");
      }
    } catch (error) {
      notifyError(error.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title title="Contract Type" />
      <div id="main">
        <Container fluid>
          <Row className="py-3 align-items-center">
            <Col lg={7} md={8} xs={6}>
              <PageTitle PageTitle="Contract Type " showButton={false} />
            </Col>
            <Col lg={5} md={4} xs={6} className="text-end">
              <ClickButton label="Add New" onClick={openModalForCreate} />
            </Col>
            <Col lg={4} md={6} xs={12} className="py-1">
              <TextInputForm
                placeholder="Search Contract Type"
                labelname="Search Type"
                onChange={(e) => setSearchText(e.target.value)}
                prefix_icon={<FaMagnifyingGlass />}
                value={searchText}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={12} md={12} xs={12} className="px-0">
              <TableUI
                headers={UserTablehead}
                body={userData}
                type="contracttype"
                pageview="yes"
                handleEditClick={openModalForEdit}
                onDelete={fetchData}
                style={{ borderRadius: "5px" }}
              />
             
            </Col>
          </Row>
        </Container>

        <ContractModal
          show={modalShow}
          onClose={closeModal}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
          isEdit={Boolean(formData.contract_id || type === "edit")}
          loading={loading}
        />

        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="colored"
        />
      </div>
    </>
  );
};

export default ContractType;
