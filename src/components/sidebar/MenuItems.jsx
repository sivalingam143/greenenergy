import {
  MdOutlineHome,
  MdPersonOutline,
  MdStorefront,
  MdAddToDrive,
  MdOutlineAddRoad ,MdOutlineCallSplit,MdOutlineStraighten ,MdContentPasteGo  
} from "react-icons/md";
const MenuItems = [
  {
    path: "/dashboard",
    icon: <MdOutlineHome />,
    text: "Home",
  },
  {
    path: "/user",
    icon: <MdPersonOutline />,
    text: "User",
  },
  {
    path: "/company",
    icon: <MdStorefront />,
    text: "Company",
  },
  {
    path: "/master",
    icon: <MdAddToDrive />,
    text: "Master",
    submenu: [
      {
        path: "/master/role",
        text: "Role",
      },
      {
        path: "/master/contract-type",
        text: "Contract Type",
      },
      {
        path: "/master/sites",
        text: "Sites",
      },
      {
        path: "/master/locations",
        text: "Locations",
      },
      {
        path: "/master/models",
        text: "Models",
      },
      {
        path: "/master/customer-group",
        text: "Customer Group",
      },
      {
        path: "/master/customers",
        text: "Customers",
      },
      {
        path: "/master/turbines",
        text: "Turbines",
      },
      {
        path: "/master/errors",
        text: "Errors",
      },
      {
        path: "/master/grid-faults",
        text: "Grid Faults",
      },
      {
        path: "/master/grid-drops",
        text: "Grid Drops",
      },
      {
        path: "/master/maintenance",
        text: "Maintenance",
      },
      {
        path: "/master/gallery",
        text: "Gallery",
      },
      {
        path: "/master/parts",
        text: "Parts",
      },
    ],
  },
  {
    path: "/dgr",
    icon: <MdOutlineAddRoad />,
    text: "Daily Generations",
  },
  {
    path: "/csr",
    icon: <MdOutlineStraighten  />,
    text: "CSR",
  },
  {
    path: "/csrmapping",
    icon: <MdOutlineCallSplit  />,
    text: "CSR Mapping",
  },
  {
    path: "/csrentry",
    icon: <MdContentPasteGo />,
    text: "CSR Enrty",
  },
  {
    path: "/reports",
    icon: <MdAddToDrive />,
    text: "Reports",
    submenu: [
      {
        path: "/reports/dgr-reports",
        text: "DGR Reports",
      },
    ],
  },
];

export default MenuItems;
