import React, { useState, useMemo } from "react";
import { Table, Button, Dropdown, Spinner } from "react-bootstrap";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import { Buttons } from "./ClickButton";
import { FaEdit, FaTrash } from "react-icons/fa";
const TableUI = ({
  headers,
  body,
  style,
  type,
  handleEditClick,
  onDelete,
  pageview,
  onSort,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(
    () => body.slice(indexOfFirstItem, indexOfLastItem),
    [body, indexOfFirstItem, indexOfLastItem]
  );
  const totalPages = Math.ceil(body.length / itemsPerPage);

  // Sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  const sortedItems = useMemo(() => {
    const sortableItems = [...currentItems];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [currentItems, sortConfig]);

  // ======== Handlers =========
  const confirmDelete = async (url, key, idKey, id) => {
    try {
      setLoading(true);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "my-confirm-button-class",
          cancelButton: "my-cancel-button-class",
        },
      });
      if (result.isConfirmed) {
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [idKey]: id }),
        });
        const data = await resp.json();
        setLoading(false);
        if (data.status === "Success" || data.status === 200) {
          await Swal.fire({
            title: "Deleted!",
            text: `The ${key} has been deleted.`,
            icon: "success",
            confirmButtonColor: "#ff5733",
            customClass: { confirmButton: "my-confirm-button-class" },
          });
          onDelete && onDelete();
        } else {
          Swal.fire(
            "Error!",
            `There was an issue deleting the ${key}.`,
            "error"
          );
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Swal.fire("Error!", "An unexpected error occurred.", "error");
    }
  };

  // All edit handlers simply call handleEditClick or relevant navigations
  // All delete handlers use confirmDelete with corresponding params

  // ======== Row Type Config =========
  const rowTypeConfigs = {
    USER: {
      fields: [
        ({ idx }) => idx,
        (row) => row.user_name,
        (row) => row.mobile_number,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete", icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/user/delete.php",
              "user",
              "user_id",
              row.user_id
            ),
        },
      ],
    },
    company: {
      fields: [
        ({ idx }) => idx,
        (row) => row.company_name,
        (row) => row.mobile_number,
        (row) => row.city,
      ],
      actions: [{ label: "Edit",  icon: FaEdit, onClick: handleEditClick }],
    },
    iamge: {
      fields: [({ idx }) => idx, (row) => row.image],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/role/delete.php",
              "image",
              "role_id",
              row.role_id
            ),
        },
      ],
    },
    role: {
      fields: [({ idx }) => idx, (row) => row.role_name],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/role/delete.php",
              "Role",
              "role_id",
              row.role_id
            ),
        },
      ],
    },
    contracttype: {
      fields: [
        ({ idx }) => idx,
        (row) => row.contract_name,
        (row) => row.contract_code,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/contract_type/delete.php",
              "Contract",
              "contract_id",
              row.contract_id
            ),
        },
      ],
    },
    site: {
      fields: [
        ({ idx }) => idx,
        (row) => row.state_id,
        (row) => row.site_name,
        (row) => row.short_code,
      ],
      actions: [
        { label: "Edit", icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete", icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/site/delete.php",
              "Site",
              "site_id",
              row.site_id
            ),
        },
      ],
    },
    location: {
      fields: [
        ({ idx }) => idx,
        (row) => row.state_id,
        (row) => row.location_name,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/location/delete.php",
              "Location",
              "location_id",
              row.location_id
            ),
        },
      ],
    },
    model: {
      fields: [({ idx }) => idx, (row) => row.model_type],
      actions: [
        { label: "Edit",icon: FaEdit,  onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/model/delete.php",
              "Model",
              "model_id",
              row.model_id
            ),
        },
      ],
    },
    customergroup: {
      fields: [
        ({ idx }) => idx,
        (row) => row.customergroup_name,
        (row) => row.customeruser_name,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/customergroup/delete.php",
              "CustomerGroup",
              "customergroup_uniq_id",
              row.customergroup_uniq_id
            ),
        },
      ],
    },
    customer: {
      fields: [
        ({ idx }) => idx,
        (row) => row.customer_id,
        (row) => row.customer_name,
        (row) => row.customergroup_name,
        (row) => row.customer_user_id,
        (row) => row.password,
      ],
      actions: [
        {
          label: "Edit", icon: FaEdit,
          onClick: (row) =>
            navigate("/master/customer/create", {
              state: { type: "edit", rowData: row },
            }),
        },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/customer/delete.php",
              "Customer",
              "customer_unique_id",
              row.customer_unique_id
            ),
        },
      ],
    },
    turbine: {
      fields: [
        ({ idx }) => idx,
        (row) => row.customer_name,
        (row) => row.wtg_no,
        (row) => row.loc_no,
      ],
      actions: [
        {
          label: "Edit",icon: FaEdit,
          onClick: (row) =>
            navigate("/master/turbine/create", {
              state: { type: "edit", rowData: row },
            }),
        },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/turbine/delete.php",
              "Turbine",
              "turbine_id",
              row.turbine_id
            ),
        },
      ],
    },
    error: {
      fields: [
        ({ idx }) => idx,
        (row) => row.error_code,
        (row) => row.error_describtion,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete", icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/error/delete.php",
              "Error",
              "error_id",
              row.error_id
            ),
        },
      ],
    },
    Gridfault: {
      fields: [
        ({ idx }) => idx,
        (row) => row.grid_fault_code,
        (row) => row.grid_fault_describtion,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/grid_fault/delete.php",
              "Grid",
              "grid_fault_id",
              row.grid_fault_id
            ),
        },
      ],
    },
    griddrop: {
      fields: [
        ({ idx }) => idx,
        (row) => row.grid_drop_code,
        (row) => row.grid_drop_describtion,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/grid_drop/delete.php",
              "Griddrop",
              "grid_drop_id",
              row.grid_drop_id
            ),
        },
      ],
    },
    maintenance: {
      fields: [
        ({ idx }) => idx,
        (row) => row.maintenance_code,
        (row) => row.maintenance_describtion,
      ],
      actions: [
        { label: "Edit",icon: FaEdit, onClick: handleEditClick },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/maintenance/delete.php",
              "Maintenance",
              "maintenance_id",
              row.maintenance_id
            ),
        },
      ],
    },
    dailygen: {
      fields: [
        ({ idx }) => idx,
        (row) => row.wtg_no,
        (row) => moment(row.dg_date).format("DD-MM-YYYY"),
        (row) => row.overtotal_hours,
      ],
      actions: [
        {
          label: "Edit",icon: FaEdit,
          onClick: (row) =>
            navigate("/dgr/create", { state: { type: "edit", rowData: row } }),
        },
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/daily_generation/delete.php",
              "Dailygen",
              "daily_generation_id",
              row.daily_generation_id
            ),
        },
      ],
    },
    pdfupload: {
      fields: [
        ({ idx }) => idx,
        (row) => row.turbine_number,
        (row) => row.pdfFile,
      ],
      actions: [
        {
          label: "Delete",icon: FaTrash,
          onClick: (row) =>
            confirmDelete(
              "https://api.demos.srivarugreenenergy.com/grid_drop/delete.php",
              "Griddrop",
              "grid_drop_id",
              row.grid_drop_id
            ),
        },
      ],
    },
  };

  const config = rowTypeConfigs[type] || { fields: [], actions: [] };

  // Sortable headers
  const sortableHeaders = [
    "Customer ID",
    "Customer Name",
    "WTG NO",
    "Error Code",
    "Grid Fault Code",
    "grid drop code",
    "Maintenance Code",
  ];

  return (
    <>
      {pageview === "yes" && (
        <div className="text-end d-flex justify-content-end align-items-center">
          <span className="mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <span className="mx-1">
            <Buttons
            className="pagination-btn"
              label={<MdChevronLeft  />}
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
            />
          </span>
          <span className="mx-1">
            <Buttons
            className="pagination-btn"
              label={<MdChevronRight  />}
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
            />
          </span>
        </div>
      )}
      <Table responsive="md" style={style}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>
                {sortableHeaders.includes(header) ? (
                  <div
                    onClick={() =>
                      requestSort(header.toLowerCase().replace(/ /g, "_"))
                    }
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {header}
                    {sortConfig.key ===
                      header.toLowerCase().replace(/ /g, "_") &&
                      (sortConfig.direction === "asc" ? (
                        <FaSortAlphaDown style={{ marginLeft: 8 }} />
                      ) : (
                        <FaSortAlphaUp style={{ marginLeft: 8 }} />
                      ))}
                  </div>
                ) : (
                  header
                )}
              </th>
            ))}
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {config.fields.map((getCell, idx) => (
                <td key={idx}>
                  {getCell({ ...row, idx: indexOfFirstItem + rowIndex + 1 })}
                </td>
              ))}
              <td className="text-end">
                <Dropdown>
                  <Dropdown.Toggle as={Button} className="action menu-dropdown">
                    <BiDotsVerticalRounded />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {config.actions.map((action, aidx) =>
                      loading ? (
                        <center key={aidx}>
                          <Spinner animation="border" variant="dark" />
                        </center>
                      ) : (
                        <Dropdown.Item
                          key={aidx}
                          onClick={() => action.onClick(row)}
                          disabled={!action.onClick}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span className="mx-2">{action.icon && <action.icon />}</span>{" "}
                            {/* Render icon if present */}
                            <span className="mx-2">{action.label}</span> 
                          </span>
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableUI;
