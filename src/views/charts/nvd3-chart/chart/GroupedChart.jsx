import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useAuth } from 'hooks/useAuth';

const Heatmap = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'heatmap',
        height: 350
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: '#00A100', name: 'No Data' },
              { from: 1, to: 10, color: '#128FD9', name: 'Low' },
              { from: 11, to: 25, color: '#FFB200', name: 'Medium' },
              { from: 26, to: 50, color: '#FF0000', name: 'High' }
            ]
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: 'category',
        categories: Array.from({ length: 24 }, (_, i) => `${i}:00`) // Represents 24 hours
      },
      title: {
        text: 'Heatmap of Page Views by Hour',
        align: 'left'
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        return;
      }

      const token = await currentUser.getIdToken();
      const Authorization = `Bearer ${token}`;
      try {
        const response = await axios.get('https://react-analytics-tracker-firebase-akrj5ebuo.vercel.app/api/page-views/heatmap', {
          headers: {
            'Content-Type': 'application/json',
            Authorization,
            Appname: localStorage.getItem('rat:dashboard:appName')
          }
        });
        const data = response.data;

        const series = Object.keys(data).map((date) => ({
          name: date,
          data: data[date].map((value, hour) => ({ x: `${hour}:00`, y: value }))
        }));

        setChartData((prevData) => ({
          ...prevData,
          series
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  return <Chart options={chartData.options} series={chartData.series} type="heatmap" height={350} />;
};

export default Heatmap;
