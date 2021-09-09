import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import ChartOne from "./Components/ChartOne";
import _ from "lodash";
// import OrdersTable from "./Components/OrdersTable";
import moment from "moment";
import { format } from "date-fns";

// const timezone = require("moment-timezone");

function App() {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const filterByDay = (day, arr) => {
    const filteredGroups = arr.filter((elem) =>
      moment(elem.date).isSame(day, "day")
    );
    setSelectedOrders(filteredGroups);
  };

  const daysToBeDisplayed = [];
  const daysToDispose = [];
  const groupByDay = groupedOrders.map((elem) => {
    if (daysToBeDisplayed.includes(format(new Date(elem.date), "MM/dd/yyyy"))) {
      daysToDispose.push(format(new Date(elem.date), "MM/dd/yyyy"));
    } else {
      daysToBeDisplayed.push(format(new Date(elem.date), "MM/dd/yyyy"));
    }
    // return <option value={elem.date}>{daysToBeDisplayed}</option>;
    return daysToBeDisplayed;
    // format(new Date(transaction.date), "MM/dd/yyyy HH:mm")
  });

  const displayDates = daysToBeDisplayed.map((day) => {
    return <option value={day}>{day}</option>;
  });

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
      return moment(order.updated_at).startOf("hour").format();
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
          <label for="days">Choose a day:</label>
          <select
            name="days"
            id="days"
            style={{ marginLeft: "10px" }}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              filterByDay(e.target.value, groupedOrders);
            }}
          >
            {displayDates}
          </select>
          <ChartOne groupedTransactions={selectedOrders} />
        </div>
      </div>
    </div>
  );
}

export default App;
