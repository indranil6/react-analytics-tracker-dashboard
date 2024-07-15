import React from 'react';
import { useQuery } from 'react-query';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import axiosInstance from 'services/axiosInstance';
import { GET_SCATTER_PLOT } from 'queries/constants';
import { useAuth } from 'hooks/useAuth';

const ScatterPlot = () => {
  const appName = localStorage.getItem('rat:dashboard:appName');
  const { currentUser } = useAuth();
  const fetchScatterPlotData = async () => {
    const token = await currentUser.getIdToken();
    const Authorization = `Bearer ${token}`;
    try {
      const response = await axiosInstance.get('/api/scatter-plot', {
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
  } = useQuery([GET_SCATTER_PLOT, currentUser], fetchScatterPlotData, {
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 30000
  });

  const series = [
    {
      name: 'Events',
      data: data ? data?.map((d) => [new Date(d.timestamp).getTime(), d.scrollPosition]) : []
    }
  ];

  const options = {
    chart: {
      type: 'scatter',
      height: 350
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      title: {
        text: 'Scroll Position'
      }
    },
    title: {
      text: 'Scatter Plot of Event Timestamps vs Scroll Position',
      align: 'center'
    }
  };

  return <ApexCharts options={options} series={series} type="scatter" height={350} />;
};

export default ScatterPlot;
