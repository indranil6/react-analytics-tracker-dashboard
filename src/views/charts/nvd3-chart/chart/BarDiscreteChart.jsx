import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useAuth } from 'hooks/useAuth';
import axiosInstance from 'services/axiosInstance';
import { GET_PAGE_VIEWS_BAR_CHART } from 'queries/constants';
import { useQuery } from 'react-query';

const BarChart = () => {
  const { currentUser } = useAuth();
  const fetchBarChartData = async () => {
    const token = await currentUser.getIdToken();
    const Authorization = `Bearer ${token}`;
    try {
      const response = await axiosInstance.get('/api/page-views/bar-chart', {
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
  const { data, error, isLoading } = useQuery([GET_PAGE_VIEWS_BAR_CHART, currentUser], fetchBarChartData, {
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });
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
    if (data) {
      const categories = Object.keys(data);
      const seriesData = Object.values(data);

      setChartData((prevData) => ({
        ...prevData,
        series: [{ ...prevData.series[0], data: seriesData }],
        options: { ...prevData.options, xaxis: { categories } }
      }));
    }
  }, [data]);
  if (error) {
    return null;
  }
  return <Chart options={chartData?.options} series={chartData?.series} type="bar" height={350} />;
};

export default BarChart;
