import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import ChartOne from "./Components/ChartOne";
import _ from "lodash";
// import OrdersTable from "./Components/OrdersTable";
import moment from "moment";
// const timezone = require("moment-timezone");

function App() {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState([]);

  console.log(groupedOrders);

  // API Call to the /request endpoint - Retrieve all the orders
  useEffect(() => {
    const ordersAPI = "http://localhost:8000/request";
    const getOrders = axios.get(ordersAPI);
    axios.all([getOrders]).then(
      axios.spread((...allData) => {
        const allDataOrders = _.orderBy(
          allData[0].data.orders,
          ["updated_at"],
          ["asc"]
        );
        setOrders(allDataOrders);
      })
    );
  }, []);

  useEffect(() => {
    const sorted = _.groupBy(orders, function (order) {
      return moment(order.updated_at).startOf("day").format();
    });

    // Reduce each array to its total
    // as [{ date : Sep 3 , value : 10 dollars}]

    const output = [];
    Object.keys(sorted).map((date) => {
      output.push({
        date: date,
        value: sorted[date]
          .reduce((sum, currentValue) => {
            return sum + parseFloat(currentValue.current_total_price);
          }, 0)
          .toFixed(2),
      });
    });
    setGroupedOrders(output);
  }, [orders]);

  const displayOrders = orders.map((order) => {
    // const dates = moment(order.updated_at);
    // const datesTZ = dates.tz("America/Toronto").format("DD/MM/YYYY");
    // const datesTime = dates.tz("America/Toronto").format("h:mm a");

    return (
      <tr key={order.id}>
        <td style={{ padding: "5px" }}>{order.id}</td>
        <td style={{ padding: "5px" }}>{order.currency}</td>
        <td style={{ padding: "5px" }}>${order.current_total_price}</td>
        <td>{order.updated_at}</td>
        {/* <td style={{ padding: "5px" }}> {datesTime}</td>
          <td style={{ padding: "5px" }}> {datesTZ}</td>{" "} */}
        {/* <td style={{ padding: "10px" }}> */}
        {/* {order.billing_address["first_name"]} */}
        {/* </td> */}
        {/* <td style={{ padding: "10px" }}>
          {/* {order.billing_address["last_name"]} */}
        {/* </td> */}
        {/* <td style={{ padding: "10px" }}>{order.contact_email}</td> */}
      </tr>
    );
  });

  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <table>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Currency</th>
                <th>Total</th>
                <th>Time</th>
                <th>Date</th>
                {/* <th>First Name</th> */}
                {/* <th>Last Name</th> */}
                {/* <th>Email</th> */}
              </tr>
            </thead>
            <tbody>{displayOrders}</tbody>
          </table>
        </div>
        <div className="col-md-6">
          <ChartOne groupedTransactions={groupedOrders} />
        </div>
      </div>
    </div>
  );
}

export default App;
