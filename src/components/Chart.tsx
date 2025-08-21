import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

type Props = {
  data: number[]; // monthly average values passed from App.tsx
};

const Chart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      // initialize echarts instance
      const chart = echarts.init(chartRef.current);

      // chart configuration
      chart.setOption({
        title: { text: "Monthly Average RSP" },
        tooltip: {},
        xAxis: {
          type: "category",
          data: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "bar",
            data: data, // monthly average prices from App.tsx
          },
        ],
      });

      // cleanup chart instance when component unmounts or updates
      return () => chart.dispose();
    }
  }, [data]);

  // chart container
  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default Chart;
