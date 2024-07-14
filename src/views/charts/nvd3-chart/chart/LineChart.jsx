import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useAuth } from 'hooks/useAuth';

const LineChart = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState({
    series: [{ name: 'Page Views', data: [] }],
    options: {
      chart: {
        type: 'line',
        height: 350
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        title: {
          text: 'Page Views'
        }
      },
      title: {
        text: 'Page Views Over Time',
        align: 'left'
      },
      stroke: {
        curve: 'smooth'
      }
    }
  });

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const token = await currentUser.getIdToken();
        const Authorization = `Bearer ${token}`;

        // Fetch data from the API
        try {
          const response = await axios.get('https://react-analytics-tracker-firebase-akrj5ebuo.vercel.app/api/page-views/line-chart', {
            headers: {
              'Content-Type': 'application/json',
              Authorization,
              Appname: localStorage.getItem('rat:dashboard:appName')
            }
          });
          const data = response.data;

          const transformedData = Object.keys(data).map((key) => ({
            x: new Date(key),
            y: data[key]
          }));

          setChartData((prevData) => ({
            ...prevData,
            series: [{ ...prevData.series[0], data: transformedData }]
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [currentUser]);

  return <Chart options={chartData.options} series={chartData.series} type="line" height={350} />;
};

export default LineChart;
