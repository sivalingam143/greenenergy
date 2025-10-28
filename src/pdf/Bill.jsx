import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import Logo from "./assets/logo.jpeg";
import fontBold from "./assets/fonts/MYRIADPRO-BOLD.OTF";
import fontRegular from "./assets/fonts/MYRIADPRO-REGULAR.OTF";
import { formatDateDDMMYY } from "../components/Forms";

Font.register({
  family: "fontBold",
  fonts: [{ src: fontBold, fontStyle: "normal", fontWeight: "bold" }],
});
Font.register({
  family: "fontRegular",
  fonts: [{ src: fontRegular, fontStyle: "normal", fontWeight: "normal" }],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 0,
    position: "relative",
  },
  section: {
    marginHorizontal: 20,
    flexGrow: 1,
    border: 1,
    marginTop: 0,
    marginBottom: 2,
    fontFamily: "fontRegular",
  },
  row: {
    flexDirection: "row",
  },
  bold: {
    fontFamily: "fontBold",
  },
  regular: {
    fontFamily: "fontRegular",
  },
  fwBold: { fontWeight: 800 },
  fs22: { fontSize: 22 },
  fs13: { fontSize: 13 },
  fs12: { fontSize: 12 },
  fs11: { fontSize: 11 },
  fs10: { fontSize: 10 },
  fs8: { fontSize: 8 },
  fs9: { fontSize: 9 },
  borderRight: { borderRight: 1 },
  borderLeft: { borderLeft: 1 },
  borderBottom: { borderBottom: 1 },
  borderTop: { borderTop: 1 },
  w5: { width: "5%" },
  w8: { width: "8%" },
  w10: { width: "10%" },
  w13: { width: "13%" },
  w15: { width: "15%" },
  w25: { width: "25%" },
  w20: { width: "20%" },
  w30: { width: "30%" },
  w33: { width: "33.33%" },
  w50: { width: "50%" },
  w66: { width: "66.66%" },
  w75: { width: "75%" },
  w100: { width: "100%" },
  w45: { width: "45%" },
  pad3: { padding: 3 },
  pad5: { padding: 5 },
  pad10: { padding: 10 },
  padbottom3: { paddingBottom: 3 },
  vp: { paddingVertical: 3.5 },
  vp1: { paddingVertical: 5 },
  vp2: { paddingVertical: 6 },
  hp10: { paddingHorizontal: 10 },
  padleft30: { paddingLeft: 30 },
  textend: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  textStart: { textAlign: "left" },
  head: {
    borderBottom: 1,
    textAlign: "center",
    padding: 8,
    textTransform: "uppercase",
    fontWeight: 800,
  },
  reportTitle: {
    position: "relative",
    left: 25,
    top: 50,
  },
  logo: {
    width: "65px",
    paddingLeft: 0,
    margin: 0,
    padding: 0,
    position: "relative",
    left: 500,
    top: "-10px",
  },
  watermark: {
    position: "absolute",
    height: 500,
    width: "100%",
    top: 50,
    opacity: 0.2,
  },
  h20: { height: "20px" },
  h30: { height: "30px" },
  h50: { height: "50px" },
  h60: { height: "60px" },
  h100: { height: "100px" },
  h150: { height: "150px" },
  footer: {
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 8,
  },
  signatureImage: {
    width: 100,
    height: 40,
    objectFit: "contain",
  },
});

const Bill = ({ csrEntry }) => {
  // Convert machine_status (1/0) to "RUN" or "STOP"
  const machineStatus = csrEntry.machine_status === 1 ? "RUN" : "STOP";

  // Format error details as a string
  const errorDetails = csrEntry.error_details
    ? csrEntry.error_details
        .map(
          (error) =>
            `${error.error_description}${
              error.error_value ? `: ${error.error_value}` : ""
            }`
        )
        .join(", ")
    : " ";

  // Prepare parts table with exactly 10 rows
  const partsData = csrEntry.parts_data || [];
  console.log("partsData", partsData);
  const tableRows = Array(10).fill({
    slNo: "",
    part_no: "",
    description: "",
    uom: "",
    qty: "",
    status: "",
    serial_no: "",
  });
  partsData.forEach((part, index) => {
    tableRows[index] = {
      slNo: (index + 1).toString(),
      part_no: part.part_no || "",
      description: part.description || "",
      uom: part.uom || "",
      qty: part.qty || "",
      status: part.status || "",
      serial_no: part.serial_no || "",
    };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={[styles.reportTitle]}>Customer Service Report</Text>
        </View>
        <View>
          <Image style={styles.logo} src={Logo} />
        </View>
        <View style={styles.section}>
          <View>
            <Image style={styles.watermark} src={Logo} />
          </View>
          {/* CSR with customer start */}
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.w45,
                styles.pad5,
                styles.fs11,
                styles.borderRight,
              ]}
            >
              <Text>CSR No: {csrEntry.csr_no || " "}</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.pad5,
                styles.fs11,
                styles.borderRight,
              ]}
            >
              <Text>
                Date: {formatDateDDMMYY(csrEntry.csr_entry_date) || " "}
              </Text>
            </View>
            <View style={[styles.row, styles.w33, styles.pad5, styles.fs11]}>
              <Text>Contract Type: {csrEntry.contract_type || " "}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.borderBottom]}>
            <View style={[styles.w100, styles.pad5, styles.fs11]}>
              <Text style={[styles.bold, styles.vp]}>Customer Details:</Text>
              <View style={[styles.padleft30]}>
                <Text>{csrEntry.customer_name || " "}</Text>
              </View>
            </View>
          </View>
          {/* CSR with customer end */}
          {/* Turbine status start */}
          <View style={[styles.row, styles.borderBottom, styles.h60]}>
            <View style={[styles.w100, styles.pad5, styles.fs11]}>
              <Text style={[styles.vp, styles.bold]}>Error Details:</Text>
              <View style={styles.padleft30}>
                <Text>{errorDetails}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.borderRight,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>WEG No: {csrEntry.wtg_no || " "}</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.borderRight,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>Loc No: {csrEntry.loc_no || " "}</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>Model: {csrEntry.model_type || " "}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.borderRight,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>HTSC No: {csrEntry.htsc_no || " "}</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.borderRight,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>
                Capacity: {csrEntry.capacity ? `${csrEntry.capacity}KW` : " "}
              </Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>Make: {csrEntry.make || " "}</Text>
            </View>
          </View>
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.borderRight,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>Reported By: {csrEntry.csr_booked_by || " "}</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.borderRight,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>
                Date: {formatDateDDMMYY(csrEntry.csr_booked_by_date) || " "}
              </Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w33,
                styles.fs11,
                styles.hp10,
                styles.vp1,
              ]}
            >
              <Text>Time: {csrEntry.csr_booked_by_time || " "}</Text>
            </View>
          </View>
          {/* Turbine status end */}
          {/* Nature of work start */}
          <View style={[styles.row, styles.borderBottom, styles.h150]}>
            <View style={[styles.w100, styles.pad5, styles.fs11]}>
              <Text style={[styles.padbottom3]}>Nature of Work</Text>
              <View style={[styles.padleft30]}>
                <Text>{csrEntry.nature_of_work || " "}</Text>
              </View>
            </View>
          </View>
          {/* Nature of work end */}
          {/* Spare details start */}
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.fs10,
                styles.borderRight,
                styles.w5,
                styles.pad3,
              ]}
            >
              <Text style={[styles.w100, styles.textCenter]}>SNo</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.fs10,
                styles.borderRight,
                styles.w10,
                styles.pad3,
              ]}
            >
              <Text style={[styles.w100, styles.textCenter]}>Part No</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w50,
                styles.fs10,
                styles.borderRight,
                styles.pad3,
              ]}
            >
              <Text style={[styles.w100, styles.textCenter]}>Description</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w15,
                styles.fs10,
                styles.borderRight,
                styles.pad3,
              ]}
            >
              <Text style={[styles.w100, styles.textCenter]}>Serial No</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.fs10,
                styles.borderRight,
                styles.w8,
                styles.pad3,
              ]}
            >
              <Text style={[styles.w100, styles.textCenter]}>UoM</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.fs10,
                styles.borderRight,
                styles.w8,
                styles.pad3,
              ]}
            >
              <Text style={[styles.w100, styles.textCenter]}>Qty</Text>
            </View>
            <View style={[styles.row, styles.fs10, styles.w13, styles.pad3]}>
              <Text style={[styles.w100, styles.textCenter]}>Status</Text>
            </View>
          </View>
          {tableRows.map((row, index) => (
            <View
              key={index}
              style={[styles.row, styles.borderBottom, styles.h20]}
            >
              <View
                style={[
                  styles.row,
                  styles.fs10,
                  styles.borderRight,
                  styles.w5,
                  styles.pad3,
                ]}
              >
                <Text style={[styles.w100, styles.textCenter]}>{row.slNo}</Text>
              </View>
              <View
                style={[
                  styles.row,
                  styles.fs10,
                  styles.borderRight,
                  styles.w10,
                  styles.pad3,
                ]}
              >
                <Text style={[styles.w100, styles.textCenter]}>
                  {row.part_no}
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  styles.w50,
                  styles.fs10,
                  styles.borderRight,
                  styles.pad3,
                ]}
              >
                <Text style={[styles.w100, styles.textStart]}>
                  {row.description}
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  styles.w15,
                  styles.fs10,
                  styles.borderRight,
                  styles.pad3,
                ]}
              >
                <Text style={[styles.w100, styles.textStart]}>
                  {row.serial_no}
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  styles.fs10,
                  styles.borderRight,
                  styles.w8,
                  styles.pad3,
                ]}
              >
                <Text style={[styles.w100, styles.textCenter]}>{row.uom}</Text>
              </View>
              <View
                style={[
                  styles.row,
                  styles.fs10,
                  styles.borderRight,
                  styles.w8,
                  styles.pad3,
                ]}
              >
                <Text style={[styles.w100, styles.textCenter]}>{row.qty}</Text>
              </View>
              <View style={[styles.row, styles.fs10, styles.w13, styles.pad3]}>
                <Text style={[styles.w100, styles.textCenter]}>
                  {row.status}
                </Text>
              </View>
            </View>
          ))}
          {/* Spare details end */}
          {/* Machine status start */}
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.w20,
                styles.pad5,
                styles.fs10,
                styles.borderRight,
              ]}
            >
              <Text style={styles.bold}>Machine Run:</Text>
              <Text style={styles.bold}> {machineStatus}</Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w30,
                styles.pad5,
                styles.fs10,
                styles.borderRight,
              ]}
            >
              <Text style={styles.bold}>Work Start:</Text>
              <Text>
                {formatDateDDMMYY(csrEntry.work_st_date) || " "} &nbsp;
                {csrEntry.work_st_time || " "}{" "}
              </Text>
            </View>
            <View
              style={[
                styles.row,
                styles.w30,
                styles.pad5,
                styles.fs10,
                styles.borderRight,
              ]}
            >
              <Text style={styles.bold}>Work End:</Text>
              <Text>
                {formatDateDDMMYY(csrEntry.work_end_date) || " "} &nbsp;
                {csrEntry.work_end_time || " "}{" "}
              </Text>
            </View>
            <View style={[styles.row, styles.w20, styles.pad5, styles.fs10]}>
              <Text style={styles.bold}>Status : </Text>
              <Text> {csrEntry.work_status || " "} </Text>
            </View>
          </View>
          {/* Machine status end */}
          {/* Employee/incharge sign start */}
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.w50,
                styles.pad5,
                styles.fs10,
                styles.borderRight,
              ]}
            >
              <Text style={styles.bold}>
                Employee Name: {csrEntry.employee_name || " "}
              </Text>
            </View>
            <View style={[styles.row, styles.w50, styles.pad5, styles.fs10]}>
              <Text style={styles.bold}>
                Incharge / Operator Name:{" "}
                {csrEntry.incharge_operator_name || " "}
              </Text>
            </View>
          </View>
          <View style={[styles.row, styles.borderBottom]}>
            <View
              style={[
                styles.row,
                styles.w50,
                styles.pad5,
                styles.fs10,
                styles.borderRight,
                styles.h50,
              ]}
            >
              <Text style={[styles.bold, styles.vp]}>Signature: </Text>
              {csrEntry.employee_sign ? (
                <Image
                  style={styles.signatureImage}
                  src={csrEntry.employee_sign}
                />
              ) : (
                ""
              )}
            </View>
            <View
              style={[
                styles.row,
                styles.w50,
                styles.pad5,
                styles.fs10,
                styles.h50,
              ]}
            >
              <Text style={[styles.bold, styles.vp]}>Signature: </Text>
              {csrEntry.incharge_operator_sign ? (
                <Image
                  style={styles.signatureImage}
                  src={csrEntry.incharge_operator_sign}
                />
              ) : (
                ""
              )}
            </View>
          </View>
          {/* Employee/incharge sign end */}
          {/* Customer feedback start */}
          <View style={[styles.w100, styles.pad5, styles.fs11, styles.h30]}>
            <Text style={styles.bold}>Customer Feedback</Text>
            <View style={styles.padleft30}>
              <Text>{csrEntry.customer_feedback || " "}</Text>
            </View>
          </View>
          {/* Customer feedback end */}
        </View>
        <View style={[styles.row, styles.footer]}>
          <View style={[styles.w50, styles.pad5, styles.fs8]}>
            <View style={[styles.padbottom3]}>
              <Text>SRIVARU GREEN ENERGY SERVICE PRIVATE LIMITED</Text>
            </View>
            <View style={[styles.padbottom3]}>
              <Text>219/2, Vairam Nagar, Manickapuram road,</Text>
            </View>
            <View>
              <Text>Palladam (T.K), Tirupur (D.T) - 641664.</Text>
            </View>
          </View>
          <View style={[styles.w45, styles.pad5, styles.fs9]}>
            <View style={[styles.padbottom3]}>
              <Text>Mobile No: +91 90250 73814, +91 80152 00475</Text>
            </View>
            <View style={[styles.padbottom3]}>
              <Text>Mail: info@srivarugreenenergy.com</Text>
            </View>
            <View>
              <Text>www.srivarugreenenergy.com</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Bill;
