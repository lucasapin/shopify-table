import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { daysToWeeks, format } from "date-fns";
import { filter } from "lodash";

function ChartsPage(props) {
  const [state, setState] = useState({});
  // Set State with Graphs label and data
  useEffect(() => {
    const transactionsData = props.groupedTransactions;

    const labelsData = [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
    ];

    const valuesData = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    transactionsData.map((transaction) => {
      let i = 0;
      for (i; i < labelsData.length; i++) {
        if (labelsData[i] === format(new Date(transaction.date), "HH:00")) {
          console.log("transaction value", transaction.value);
          valuesData[i] = transaction.value;
        }
      }
    });
    const hours = [];
    // Format and dettach the transaction dates
    props.groupedTransactions.map((transaction) => {
      hours.push(format(new Date(transaction.date), "HH:mm"));
      return hours;
    });
    const values = [];
    // Extract the hourly transaction values for the days
    props.groupedTransactions.map((transaction) => {
      values.push(transaction.value);
      return values;
    });
    //date-fns format by "H" === 0 | 1 | 23

    // Re-assign Labels and Data
    setState({
      dataLine: {
        labels: [
          // ...hours,
          ...labelsData,
        ],
        datasets: [
          {
            label: "Total Transaction Value per hour",
            fill: false,
            lineTension: 0.3,
            backgroundColor: "rgba(225, 204,230, .3)",
            borderColor: "rgb(205, 130, 158)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgb(205, 130,1 58)",
            pointBackgroundColor: "rgb(255, 255, 255)",
            pointBorderWidth: 10,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgb(0, 0, 0)",
            pointHoverBorderColor: "rgba(220, 220, 220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [
              // ...values,
              ...valuesData,
            ],
          },
        ],
      },
    });
  }, [props.groupedTransactions]);

  return (
    <MDBContainer>
      <h4 className="mt-5">Sales per hour</h4>

      <Line data={state.dataLine} options={{ responsive: true }} />
    </MDBContainer>
  );
}

export default ChartsPage;
