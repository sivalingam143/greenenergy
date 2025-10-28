import CSR_TYPE_SHORT_CODES from "../constants/csrTypeShortCodes";

export const getFinancialYear = (d = new Date()) => {
  const year = d.getFullYear();
  const month = d.getMonth(); // 0 - Jan
  const startYear = month >= 3 ? year : year - 1; // FY starts in April
  const endYear = startYear + 1;
  return `${startYear.toString().slice(2)}-${endYear.toString().slice(2)}`;
};

export const getShortCodeForWegNo = (wegNo, turbines) => {
  if (!wegNo || !Array.isArray(turbines)) return "";
  const wegNoStr = String(wegNo);
  for (const turbine of turbines) {
    if (turbine.wtg_no.some((wtg) => String(wtg) === wegNoStr)) {
      return turbine.short_code;
    }
  }
  return "";
};

export const generateSequenceNumber = (csrType, financialYear, csrs) => {
  if (!csrType || !Array.isArray(csrs)) return "0001";

  const csrTypeShortCode = CSR_TYPE_SHORT_CODES.find(
    (item) => item.type === csrType
  )?.shortCode;
  if (!csrTypeShortCode) return "0001";

  const filtered = csrs.filter(
    (c) =>
      c.csr_type === csrType &&
      c.csr_no?.includes(`/${csrTypeShortCode}/${financialYear}/`)
  );

  if (filtered.length === 0) return "0001";

  const lastSeq = filtered
    .map((c) => {
      const parts = c.csr_no.split("/");
      const seq = parts[parts.length - 1];
      return parseInt(seq, 10);
    })
    .filter((num) => !isNaN(num))
    .sort((a, b) => b - a)[0];

  const nextSeq = (lastSeq || 0) + 1;
  return nextSeq.toString().padStart(4, "0");
};

export const generateCsrNo = ({
  wegNo,
  csrType,
  turbines,
  csrs,
  existingSequenceNumber,
}) => {
  if (!wegNo || !csrType) return "";

  const shortCode = getShortCodeForWegNo(wegNo, turbines);
  const csrTypeShortCode =
    CSR_TYPE_SHORT_CODES.find((item) => item.type === csrType)?.shortCode || "";
  const financialYear = getFinancialYear();
  const sequenceNumber =
    existingSequenceNumber ||
    generateSequenceNumber(csrType, financialYear, csrs);

  if (!csrTypeShortCode) return "";

  const csrNo = shortCode
    ? `SVGE/${shortCode}/${csrTypeShortCode}/${financialYear}/${sequenceNumber}`
    : `SVGE/${csrTypeShortCode}/${financialYear}/${sequenceNumber}`;

  return csrNo;
};
