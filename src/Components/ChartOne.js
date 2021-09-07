import React, { Component, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import moment from "moment";

function ChartsPage(props) {
  const [state, setState] = useState({});

  useEffect(() => {
    const dates = [];
    props.groupedTransactions.map((transaction) => {
      dates.push(transaction.date);
      console.log(dates);
      return dates;
    });
    const values = [];
    props.groupedTransactions.map((transaction) => {
      values.push(transaction.value);
      return values;
    });

    setState({
      dataLine: {
        labels: [...dates],
        datasets: [
          {
            label: "Total Transaction Value per Day",
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
            data: [...values],
          },
          // {
          //   label: "My Second dataset",
          //   fill: true,
          //   lineTension: 0.3,
          //   backgroundColor: "rgba(184, 185, 210, .3)",
          //   borderColor: "rgb(35, 26, 136)",
          //   borderCapStyle: "butt",
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   borderJoinStyle: "miter",
          //   pointBorderColor: "rgb(35, 26, 136)",
          //   pointBackgroundColor: "rgb(255, 255, 255)",
          //   pointBorderWidth: 10,
          //   pointHoverRadius: 5,
          //   pointHoverBackgroundColor: "rgb(0, 0, 0)",
          //   pointHoverBorderColor: "rgba(220, 220, 220, 1)",
          //   pointHoverBorderWidth: 2,
          //   pointRadius: 1,
          //   pointHitRadius: 10,
          //   data: [28, 48, 40, 19, 86, 27, 90],
          // },
        ],
      },
    });
  }, [props.groupedTransactions]);

  // const {date} = this.props.groupedTransactions["date"]
  // Pass down the sorted Array

  // Labels ...spread each date
  // data ...spread each value
  return (
    <MDBContainer>
      <h3 className="mt-5">Line chart</h3>
      <Line data={state.dataLine} options={{ responsive: true }} />
    </MDBContainer>
  );
}

export default ChartsPage;
