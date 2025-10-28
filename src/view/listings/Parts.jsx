import { Container, Row, Col } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import PageTitle from "../../components/PageTitle";
import { Buttons, ActionButton } from "../../components/Buttons";
import TableUI from "../../components/TableUI";
import Dialog from "../../components/Dialog";
import { useNavigate } from "react-router-dom";
import PaginationUI from "../../components/Pagination";
import { MdOutlineDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiDotsVertical } from "react-icons/hi";
import usePartslistHandlers from "../../hooks/listinghooks/usePartslistHandler";

const Parts = () => {
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
    currentParts,
    status,
    error,
    totalPages,
  } = usePartslistHandlers();

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role_name.trim() || "";
  const navigate = useNavigate();
  const PartHead = [
    "No",
    "Part No",
    "Type/Classification",
    "Description",
    "UOM",
  ];
  const options = (part) => {
    const allOptions = [
      {
        label: "View",
        icon: <MdOutlineRemoveRedEye />,
        onClick: () => handleView(part),
      },
      {
        label: "Edit",
        icon: <LiaEditSolid />,
        onClick: () => handleEdit(part),
      },
      {
        label: "Delete",
        icon: <MdOutlineDelete />,
        onClick: () => handleDelete(part.parts_id),
      },
    ];

    return role.trim() === "Engineer"
      ? allOptions.filter((option) => option.label === "View")
      : allOptions;
  };

  const PartData = currentParts.map((part, index) => ({
    values: [
      indexOfFirstItem + index + 1,
      part.part_no,
      part.type_and_classification,
      part.description,
      part.uom,
      <ActionButton options={options(part)} label={<HiDotsVertical />} />,
    ],
  }));

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col lg="6" md="12" xs="12" className="py-3 align-self-center">
            <PageTitle PageTitle="Parts" showButton={false} />
          </Col>
          <Col lg="6" md="12" xs="12" className="py-3 text-end">
            {role !== "Engineer" && (
              <>
                <div className="my-1">
                  <Buttons
                    label={<>Add Part</>}
                    classname="crud-btn"
                    OnClick={handleNavigate}
                  />
                </div>
                <div className="my-1">
                  <Buttons
                    label="Bulk Excel Upload"
                    classname="crud-btn"
                    OnClick={() => navigate("/bulk-upload/parts")}
                  />
                </div>
              </>
            )}
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
          <Col lg="12" md="12" xs="12" className="text-end">
            <PaginationUI
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Col>
          <Col lg="12" xs="12">
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Error: {error}</p>}
            {status === "succeeded" && (
              <TableUI headers={PartHead} body={PartData} />
            )}
          </Col>
        </Row>
      </Container>

      <Dialog
        DialogTitle="Are you sure you want to delete this part?"
        isVisible={showConfirmDialog}
        onConfirm={handleConfirmDelete}
        onCancel={() => handleConfirmDelete(false)}
      />
    </div>
  );
};

export default Parts;
