import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {
  MdOutlineFilterList,
  MdOutlineDelete,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiDotsVertical } from "react-icons/hi";
import { TextInputForm, formatDateDDMMYY } from "../../components/Forms";
import PageTitle from "../../components/PageTitle";
import TableUI from "../../components/TableUI";
import { Buttons, ActionButton } from "../../components/Buttons";
import OffCanvas from "../../components/OffCanvas";
import CsrEntryFilter from "../filter/CsrEntryFilter";
import Dialog from "../../components/Dialog";
import PaginationUI from "../../components/Pagination";
import useCsrEntrylistHandler from "../../hooks/listinghooks/useCsrEntrylistHandler";
import { pdf } from "@react-pdf/renderer";
import Bill from "../../pdf/Bill";

const CsrEntry = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.user_id;
  const role = user?.role_name.trim() || "";
  const {
    searchText,
    setSearchText,
    showConfirmDialog,
    handleConfirmDelete,
    handleNavigate,
    handleEdit,
    handleView,
    handleDelete,
    handleClearFilter,
    currentPage,
    setCurrentPage,
    indexOfFirstItem,
    currentEntries,
    status,
    error,
    totalPages,
    handleGetSign,
  } = useCsrEntrylistHandler();

  // Function to handle PDF preview
  const handleDownloadPDF = async (csrEntry) => {
    try {
      // Generate the PDF blob
      const blob = await pdf(<Bill csrEntry={csrEntry} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Open the PDF in a new tab for preview/print
      // window.open(url, "_blank");

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `CSR_${csrEntry.csr_no || "entry"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const options = (csrEntry) => {
    const allOptions = [
      ...(csrEntry.incharge_operator_sign
        ? []
        : [
            {
              label: "Get Sign",
              icon: <LiaEditSolid />,
              onClick: () => handleGetSign(csrEntry),
            },
          ]),
      {
        label: "View",
        icon: <MdOutlineRemoveRedEye />,
        onClick: () => handleView(csrEntry),
      },
      {
        label: "Edit",
        icon: <LiaEditSolid />,
        onClick: () => handleEdit(csrEntry),
      },
      {
        label: "Delete",
        icon: <MdOutlineDelete />,
        onClick: () => handleDelete(csrEntry.csr_entry_id),
      },
      {
        label: "Download PDF",
        icon: <LiaEditSolid />,
        onClick: () => handleDownloadPDF(csrEntry),
      },
    ];

    if (role === "Engineer") {
      return allOptions.filter((option) => option.label !== "Delete"); // Engineer: View + Edit + (Get Sign if applicable)
    } else if (role === "Admin") {
      return allOptions; // Admin: View + Edit + Delete + (Get Sign if applicable)
    } else {
      return allOptions.filter((option) => option.label === "View"); // Others: View only
    }
  };

  const CsrHead = ["No", "CSR No", "Customer Name", "Entry Date", "WTG No."];

  const filteredEntries =
    role === "Engineer"
      ? currentEntries.filter((entry) => entry.employee_id === userId)
      : currentEntries;

  const CsrData = filteredEntries.map((entry, index) => ({
    values: [
      indexOfFirstItem + index + 1,
      entry.csr_no || "-",
      entry.customer_name || "-",
      formatDateDDMMYY(entry.csr_entry_date || "-"),
      entry.wtg_no || "-",
      <ActionButton options={options(entry)} label={<HiDotsVertical />} />,
    ],
  }));

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="6" className="py-3 align-self-center">
            <PageTitle PageTitle="CSR Entries" showButton={false} />
          </Col>
          <Col lg="6" className="py-3 text-end">
            <Buttons
              label={<>Add CSR Entry</>}
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
          <Col lg="9" className="py-3 d-flex justify-content-end gap-3">
            <OffCanvas
              OffCanvasBody={<CsrEntryFilter />}
              openFilter={true}
              OffCanvasLabel={
                <>
                  <MdOutlineFilterList /> Filters
                </>
              }
              OffCanvasTitle="Filters"
              Size="offcanvas-lg"
              classname="filter-btn"
            />
            <Buttons
              label={<>Clear Filter</>}
              classname="filter-btn me-2"
              OnClick={handleClearFilter}
            />
          </Col>

          <Col lg="12" className="text-end">
            <PaginationUI
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Col>

          <Col lg="12">
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && (
              <p>{error || "Failed to load CSR entries"}</p>
            )}
            {status === "succeeded" && CsrData.length === 0 && (
              <p>No CSR entries found</p>
            )}
            {CsrData.length > 0 && <TableUI headers={CsrHead} body={CsrData} />}
          </Col>
        </Row>
      </Container>

      <Dialog
        DialogTitle="Are you sure you want to delete this CSR entry?"
        isVisible={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onCancel={() => handleConfirmDelete(false)}
      />
    </div>
  );
};

export default CsrEntry;
