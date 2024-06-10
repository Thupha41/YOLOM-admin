// localStorage.setItem(
//   "admin-access-token",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2NmY2MxMWEtMjg0OC00YjQxLWI0OTktY2FhNDAwOThmYzkwIiwicm9sZV9pZCI6ImU5NWJkZjNjLWYxNDctNDU3ZS05YTdhLTAzYzQ0NmMxZDY2NiIsImlhdCI6MTcxNjIxNjk2NSwiZXhwIjoxNzE2NDc2MTY1fQ.eitdR34xZyn9FduTwb1wmNIPdT9v3CWQR3UDPBYVi50"
// );

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2NmY2MxMWEtMjg0OC00YjQxLWI0OTktY2FhNDAwOThmYzkwIiwicm9sZV9pZCI6ImU5NWJkZjNjLWYxNDctNDU3ZS05YTdhLTAzYzQ0NmMxZDY2NiIsImlhdCI6MTcxNjIxNjk2NSwiZXhwIjoxNzE2NDc2MTY1fQ.eitdR34xZyn9FduTwb1wmNIPdT9v3CWQR3UDPBYVi50";

// const getTokenFromLocalStorage = localStorage.getItem("admin-access-token")
//   ? JSON.parse(localStorage.getItem("admin-access-token"))
//   : null;
export const config = {
  headers: {
    // Authorization: `Bearer ${
    //   getTokenFromLocalStorage !== null ? getTokenFromLocalStorage : ""
    // }`,
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
};
