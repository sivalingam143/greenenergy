import { Container, Row, Col } from "react-bootstrap";
import PageTitle from "../../components/PageTitle";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../../components/TableUI";
import { MdEdit, MdOutlineVisibility, MdOutlineDelete } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { ActionButton, Buttons } from "../../components/Buttons";
import PaginationUI from "../../components/Pagination";
import Dialog from "../../components/Dialog";
import useCsrmaplistHandler from "../../hooks/listinghooks/useCsrmaplistHandler";

const CsrMapping = () => {
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
    currentMappings,
    status,
    error,
    totalPages,
  } = useCsrmaplistHandler();

  const options = (mappingId, status) => {
    const opts = [
      {
        label: "View",
        icon: <MdOutlineVisibility />,
        onClick: () => handleView(mappingId),
      },
    ];

    if (status === "Not Completed") {
      opts.push({
        label: "Edit",
        icon: <MdEdit />,
        onClick: () => handleEdit(mappingId),
      });
    }

    opts.push({
      label: "Delete",
      icon: <MdOutlineDelete />,
      onClick: () => handleDelete(mappingId),
    });

    return opts;
  };

  const CsrHead = ["No", "CSR No", "Status"];
  const CsrData = currentMappings.map((mapping, index) => ({
    values: [
      indexOfFirstItem + index + 1,
      mapping.csr_mapping_data?.[0]?.csr_no || "N/A",
      mapping.status,
      <ActionButton
        options={options(mapping.csr_mapping_id, mapping.status)}
        label={<HiDotsVertical />}
      />,
    ],
  }));

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="6" className="py-3 align-self-center">
            <PageTitle PageTitle="CSR Mapping" showButton={false} />
          </Col>
          <Col lg="6" className="py-3 text-end">
            <Buttons
              label="Add CSR Map"
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

          <Col lg="12">
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && (
              <p>{error || "Failed to load CSR mappings"}</p>
            )}
            {status === "succeeded" && CsrData.length === 0 && (
              <p>No CSR mappings found</p>
            )}
            {CsrData.length > 0 && <TableUI headers={CsrHead} body={CsrData} />}
          </Col>
        </Row>
      </Container>

      <Dialog
        DialogTitle="Are you sure you want to delete this CSR mapping?"
        isVisible={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onCancel={() => handleConfirmDelete(false)}
      />
    </div>
  );
};

export default CsrMapping;
