import React from "react";
import { Table } from "antd";
//
// import { getUsers } from "../features/cutomers/customerSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Phone",
    dataIndex: "mobile",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const Customers = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getUsers());
  // }, []);
  // const customerstate = useSelector((state) => state.customer.customers);
  const data1 = [];
  for (let i = 0; i < 10; i++) {
    // if (customerstate[i].role !== "admin") {
    //   data1.push({
    //     key: i + 1,
    //     name: customerstate[i].firstname + " " + customerstate[i].lastname,
    //     email: customerstate[i].email,
    //     mobile: customerstate[i].mobile,
    //   });
    // }
  }

  return (
    <div>
      <h3 className="mb-4 title">Customers</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Customers;
