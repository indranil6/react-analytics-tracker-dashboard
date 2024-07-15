import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import axios from 'axios';
import { GET_PIE_CHART_COMPONENTS } from 'queries/constants';
import axiosInstance from 'services/axiosInstance';
import { useAuth } from 'hooks/useAuth';

const PieChart = () => {
  const appName = localStorage.getItem('rat:dashboard:appName');
  const { currentUser } = useAuth();
  const fetchPieChartData = async ({ queryKey }) => {
    const token = await currentUser.getIdToken();
    const Authorization = `Bearer ${token}`;
    try {
      const response = await axiosInstance.get(`/api/pie-chart`, {
        headers: {
          'Content-Type': 'application/json',
          Appname: appName,
          Authorization
        }
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const { data, error, isLoading } = useQuery([GET_PIE_CHART_COMPONENTS, currentUser], fetchPieChartData, {
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 30000
  });

  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: {
        type: 'pie'
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      title: {
        text: 'Pie chart of distribution of components and interactions',
        align: 'left'
      }
    }
  });

  useEffect(() => {
    if (data) {
      const components = data.map((item) => item.component);
      const interactions = data.map((item) => item.interactions);
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: interactions,
        options: {
          ...prevOptions.options,
          labels: components
        }
      }));
    }
  }, [data]);

  return <ReactApexChart options={chartOptions.options} series={chartOptions.series} type="pie" />;
};

export default PieChart;
