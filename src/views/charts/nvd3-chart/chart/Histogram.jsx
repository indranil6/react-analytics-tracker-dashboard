import React from 'react';
import { useQuery } from 'react-query';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import axiosInstance from 'services/axiosInstance';
import { GET_HISTOGRAM_DATA, GET_SCATTER_PLOT } from 'queries/constants';
import { useAuth } from 'hooks/useAuth';

const Histogram = () => {
  const appName = localStorage.getItem('rat:dashboard:appName');
  const { currentUser } = useAuth();
  const fetchHistogramData = async () => {
    const token = await currentUser.getIdToken();
    const Authorization = `Bearer ${token}`;
    try {
      const response = await axiosInstance.get('/api/histogram', {
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

  const {
    data = [],
    error,
    isLoading
  } = useQuery([GET_HISTOGRAM_DATA, currentUser], fetchHistogramData, {
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });
  const series = [
    {
      name: 'Viewed Percentage',
      data
    }
  ];

  const options = {
    chart: {
      type: 'histogram',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true
      }
    },
    xaxis: {
      categories: [...Array(100).keys()],
      title: {
        text: 'Viewed Percentage'
      }
    },
    title: {
      text: 'Histogram of Viewed Percentages',
      align: 'center'
    }
  };
  if (error) {
    return null;
  }
  return <ApexCharts options={options} series={series} type="bar" height={350} />;
};

export default Histogram;
