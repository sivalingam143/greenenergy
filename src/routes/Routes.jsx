import React from "react"
// import { Navigate } from "react-router-dom"
// import listing path 
import Login from "../view/Login"
import DashBoard from "../view/DashBoard"
import Parts from "../view/listings/Parts";
import CsrMapping from "../view/listings/CsrMapping";
import Csr from "../view/listings/CSR";
import CsrEntry from "../view/listings/CsrEntry";
import User from '../backupsrivaru/pages/User'
import Company from '../backupsrivaru/pages/Company'
import Role from '../backupsrivaru/pages/Role'
import ContractType from '../backupsrivaru/pages/ContractType'
import Site from '../backupsrivaru/pages/Site'
import Location from '../backupsrivaru/pages/Location'
import Model from '../backupsrivaru/pages/Model'
import CustomerGroup from '../backupsrivaru/pages/CustomerGroup'
import Customer from '../backupsrivaru/pages/Customer'
import Turbine from '../backupsrivaru/pages/Turbine'
import Error from '../backupsrivaru/pages/Error'
import GridFault from '../backupsrivaru/pages/GridFault'
import GridDrop from '../backupsrivaru/pages/GridDrop'
import Maintenance from '../backupsrivaru/pages/Maintenance'
import Gallery from '../backupsrivaru/pages/Gallery'
import DailyGeneration from '../backupsrivaru/pages/DailyGeneration'

// import creation path
import PartsCreations from "../view/creations/PartsCreations"
import CsrCreation from "../view/creations/CsrCreation"
import CsrEntryCreation from "../view/creations/CsrEntryCreation"
import CsrmapCreation from "../view/creations/CsrmapCreation";
import DgCreation from "../backupsrivaru/pages/DgCreation";
import TurbineCreation from "../backupsrivaru/pages/TurbineCreation";
import CustomerCreation from "../backupsrivaru/pages/CustomerCreation";
// pdf
import Billpreview from '../pdf/BillPreview'
import CsrPreview from "../view/CsrPreview";
import DgReport from "../backupsrivaru/pages/DgReport";
import CSRPreviews from "../view/CSRPreviews";


const routes = [

  //  login route
  { path: "/", element: <Login /> },


  // Page Routes litsing
  { path: "/dashboard", element: <DashBoard /> },
  { path: "/user", element: <User /> },
  { path: "/master/role", element: <Role /> },
  { path: "/master/contract-type", element: <ContractType /> },
  { path: "/master/sites", element: <Site /> },
  { path: "/master/locations", element: <Location /> },
  { path: "/master/models", element: <Model /> },
  { path: "/master/customer-group", element: <CustomerGroup /> },
  { path: "/master/customers", element: <Customer /> },
  { path: "/master/turbines", element: <Turbine /> },
  { path: "/master/errors", element: <Error /> },
  { path: "/master/grid-faults", element: <GridFault /> },
  { path: "/master/grid-drops", element: <GridDrop /> },
  {path:"master/maintenance", element: <Maintenance />},
  { path: "/master/gallery", element: <Gallery /> },
  {path: "dgr", element:<DailyGeneration />},

  { path: "master/parts", element: <Parts /> },
  { path: "/company", element: <Company /> },

  { path: "/csr", element: <Csr /> },
  { path: "/csrmapping", element: <CsrMapping /> },
  { path: "/csrentry", element: <CsrEntry /> },

  //   { path: "/billing/:id?", element: <Billing /> },  
  { path: "/csr-preview", element: <CsrPreview /> },
  { path: "/billpreview", element: <Billpreview /> },
  { path: "/csr-previews", element: <CSRPreviews /> },

  // page routes creations

  { path: "/parts-creation", element: <PartsCreations /> },
  { path: "/create-csr", element: <CsrCreation /> },
  { path: "/create-csrmap", element: <CsrmapCreation /> },
  { path: "/create-csrentry", element: <CsrEntryCreation /> },
  { path: "/master/turbine/create", element: <TurbineCreation /> },
  { path: "/master/customer/create", element: <CustomerCreation /> },
  { path: "/dgr/create", element: <DgCreation /> },




  // page routes reports
  {path:"/reports/dgr-reports",element:<DgReport />},
];
export default routes;