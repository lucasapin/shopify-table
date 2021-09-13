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
  const [kaiduData, setKaiduData] = useState([]);

  // API Call to the /request endpoint - Retrieve all the orders
  useEffect(() => {
    const ordersAPI = "http://localhost:8000/request";
    const kaiduAPI =
      "https://kaidu-dev1.deeppixel.ai/globalData?customer=Safetrack&building=Devesh+home&endDate=2021-09-10T00:00:00-04:00";
    const getOrders = axios.get(ordersAPI);
    const getKaiduData = axios.get(kaiduAPI);
    axios.all([getOrders, getKaiduData]).then(
      axios.spread((...allData) => {
        const allDataOrders = _.orderBy(
          allData[0].data.orders,
          ["updated_at"],
          ["asc"]
        );
        // const allDataKaidu = _.orderBy(
        //   allData[1].data.graph.data,
        //   ["date"],
        //   ["asc"]
        // );
        const allDataKaidu = allData[1].data.graph.data;

        setKaiduData(allDataKaidu);
        setOrders(allDataOrders);
      })
    );
  }, []);

  const filterByDay = (day, arr) => {
    const filteredGroups = arr.filter((elem) =>
      moment(elem.date).isSame(day, "day")
    );
    setSelectedOrders(filteredGroups);
  };

  const getKaiduByDate = (date) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const kaiduAPI = `https://kaidu-dev1.deeppixel.ai/globalData?customer=Safetrack&building=Devesh+home&endDate=${formattedDate}T00:00:00-04:00`;
    const getKaiduData = axios.get(kaiduAPI);
    axios.all([getKaiduData]).then(
      axios.spread((...allData) => {
        console.log(allData[0].data);
        const allDataKaidu = allData[0].data.graph.data;

        setKaiduData(allDataKaidu);
      })
    );
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
      </tr>
    );
  });
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
                <th>Date and Time</th>
              </tr>
            </thead>
            <tbody>{displayOrders}</tbody>
          </table>
        </div>
        <div className="col-md-6">
          <label htmlFor="days">Choose a day:</label>
          <select
            name="days"
            id="days"
            style={{ marginLeft: "10px" }}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              filterByDay(e.target.value, groupedOrders);
              getKaiduByDate(e.target.value);
            }}
          >
            <option value="Date">Date</option>
            {displayDates}
          </select>
          <ChartOne
            groupedTransactions={selectedOrders}
            KaiduCount={kaiduData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
