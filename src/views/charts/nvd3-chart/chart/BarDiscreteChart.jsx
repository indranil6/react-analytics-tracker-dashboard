import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useAuth } from 'hooks/useAuth';

const BarChart = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState({
    series: [{ name: 'Page Views', data: [] }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
          text: 'Page Views'
        }
      },
      title: {
        text: 'Page Views by Pathname',
        align: 'left'
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      }
    }
  });

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const token = await currentUser.getIdToken();
        const Authorization = `Bearer ${token}`;
        try {
          const response = await axios.get('https://react-analytics-tracker-firebase-akrj5ebuo.vercel.app/api/page-views/bar-chart', {
            headers: {
              'Content-Type': 'application/json',
              Authorization,
              Appname: localStorage.getItem('rat:dashboard:appName')
            }
          });
          const data = response.data;

          const categories = Object.keys(data);
          const seriesData = Object.values(data);

          setChartData((prevData) => ({
            ...prevData,
            series: [{ ...prevData.series[0], data: seriesData }],
            options: { ...prevData.options, xaxis: { categories } }
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [currentUser]);

  return <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />;
};

export default BarChart;
