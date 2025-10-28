import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageTitle from "../../components/PageTitle";
import { TextInputForm, formatDateDDMMYY } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineRemoveRedEye, MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiDotsVertical } from "react-icons/hi";
import PaginationUI from "../../components/Pagination";
import Dialog from "../../components/Dialog";
import useCsrlistHandler from "../../hooks/listinghooks/useCsrlistHandler";

const Csr = () => {
  const {
    searchText,
    setSearchText,
    showConfirmDialog,
    handleConfirmDelete,
    handleNavigate,
    handleEdit,
    handleView,
    handleDelete,
    currentPage,
    setCurrentPage,
    indexOfFirstItem,
    currentCsrs,
    status,
    error,
    totalPages,
  } = useCsrlistHandler();

  const options = (csrId, status) => {
    const opts = [
      {
        label: "View",
        icon: <MdOutlineRemoveRedEye />,
        onClick: () => handleView(csrId),
      },
    ];

    if (status === "Unmapping") {
      opts.push({
        label: "Edit",
        icon: <LiaEditSolid />,
        onClick: () => handleEdit(csrId),
      });
    }

    // opts.push({
    //   label: "Delete",
    //   icon: <MdOutlineDelete />,
    //   onClick: () => handleDelete(csrId),
    // });

    return opts;
  };

  const CsrHead = ["No", "CSR No", "Weg No", "CSR Type", "Date", "Booked By"];

  const CsrData =
    Array.isArray(currentCsrs) && currentCsrs.length > 0
      ? currentCsrs.map((csr, index) => ({
          values: [
            indexOfFirstItem + index + 1,
            csr.csr_no || "-",
            csr.weg_no || "-",
            csr.csr_type || "-",
            formatDateDDMMYY(csr.csr_date || "-"),
            csr.csr_booked_by || "-",
            <ActionButton
              options={options(csr.csr_id, csr.status)}
              label={<HiDotsVertical />}
            />,
          ],
        }))
      : [];

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="6" md="12" xs="12" className="py-3 align-self-center">
            <PageTitle PageTitle="CSR" showButton={false} />
          </Col>
          <Col lg="6" md="12" xs="12" className="py-3 text-end">
            <Buttons
              label={<>Add CSR</>}
              classname="crud-btn"
              OnClick={handleNavigate}
            />
          </Col>
          <Col lg="3" className="align-self-center">
            <TextInputForm
              PlaceHolder="Search"
              classname="form-control-padleft sea"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
          <Col lg="12" className="text-end">
            <PaginationUI
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Col>
          <Col lg="12" xs="12">
            {status === "loading" && <p>Loading CSRs...</p>}
            {status === "failed" && <p>{error || "Failed to load CSRs"}</p>}
            {status === "succeeded" && CsrData.length === 0 && (
              <p>No CSRs found</p>
            )}
            {CsrData.length > 0 && <TableUI headers={CsrHead} body={CsrData} />}
          </Col>
        </Row>
      </Container>

      <Dialog
        DialogTitle="Are you sure you want to delete this CSR?"
        isVisible={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onCancel={() => handleConfirmDelete(false)}
      />
    </div>
  );
};

export default Csr;
