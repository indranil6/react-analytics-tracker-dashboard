import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useAuth } from 'hooks/useAuth';
import axiosInstance from 'services/axiosInstance';
import { GET_PAGE_VIEWS_LINE_CHART } from 'queries/constants';
import { useQuery } from 'react-query';

const LineChart = () => {
  const { currentUser } = useAuth();
  const fetchData = async () => {
    const token = await currentUser.getIdToken();
    const Authorization = `Bearer ${token}`;
    try {
      const response = await axiosInstance.get('/api/page-views/line-chart', {
        headers: {
          'Content-Type': 'application/json',
          Authorization,
          Appname: localStorage.getItem('rat:dashboard:appName')
        }
      });
      const data = response.data;

      return data;
    } catch (error) {
      return {};
    }
  };
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

  const { data, error, isLoading } = useQuery([GET_PAGE_VIEWS_LINE_CHART, currentUser], fetchData, {
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (data) {
      const transformedData = Object.keys(data).map((key) => ({
        x: new Date(key),
        y: data[key]
      }));

      setChartData((prevData) => ({
        ...prevData,
        series: [{ ...prevData.series[0], data: transformedData }]
      }));
    }
  }, [data]);
  if (error) {
    return null;
  }
  return <Chart options={chartData.options} series={chartData.series} type="line" height={350} />;
};

export default LineChart;
