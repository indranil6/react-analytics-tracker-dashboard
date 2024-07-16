import React from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import { useQuery } from 'react-query';
import { useAuth } from 'hooks/useAuth';
import axiosInstance from 'services/axiosInstance';
import RecordsTable from 'components/RecordsTable';
import Nvd3Chart from 'views/charts/nvd3-chart';

const dashSalesData = [
  { title: 'Daily Sales', amount: '$249.95', icon: 'icon-arrow-up text-c-green', value: 50, class: 'progress-c-theme' },
  { title: 'Monthly Sales', amount: '$2.942.32', icon: 'icon-arrow-down text-c-red', value: 36, class: 'progress-c-theme2' },
  { title: 'Yearly Sales', amount: '$8.638.32', icon: 'icon-arrow-up text-c-green', value: 70, color: 'progress-c-theme' }
];

const DashDefault = () => {
  const { currentUser } = useAuth();
  const fetchData = async () => {
    const token = await currentUser.getIdToken();
    const Authorization = `Bearer ${token}`;
    try {
      const response = await axiosInstance.get(`/api/total-records`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization,
          Appname: localStorage.getItem('rat:dashboard:appName')
        }
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };
  const fetchAllData = async () => {
    const token = await currentUser.getIdToken();
    const Authorization = `Bearer ${token}`;
    try {
      const response = await axiosInstance.get(`/data`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization,
          Appname: localStorage.getItem('rat:dashboard:appName')
        }
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };
  const { data } = useQuery(['page-dashboard', currentUser], fetchData, {
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });
  const { data: allData } = useQuery(['all-page-views', currentUser], fetchAllData, {
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });
  const [dashdata, setDashdata] = React.useState([]);
  console.log('allData', allData);
  function transformCamelCaseToTitle(str) {
    // Add space before each uppercase letter and capitalize each word
    return str
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, function (char) {
        return char.toUpperCase();
      }) // Capitalize the first character
      .trim(); // Remove leading/trailing spaces
  }

  React.useEffect(() => {
    if (data) {
      let temp = [];
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key];
          temp.push({
            title: transformCamelCaseToTitle(key),
            amount: element,
            icon: 'icon-arrow-up text-c-green',
            class: 'progress-c-theme'
          });
        }
      }
      setDashdata(temp);
    }
  }, [data]);
  return (
    <React.Fragment>
      <Row>
        {dashdata?.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0">{data.value}</p>
                    </div>
                  </div>
                  {/* <div className="progress m-t-30" style={{ height: '7px' }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value}%` }}
                      aria-valuenow={data.value}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div> */}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        <Nvd3Chart />
        {allData?.length > 0 && (
          <Col lg={12}>
            <RecordsTable data={allData} />
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
