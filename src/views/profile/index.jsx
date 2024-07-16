import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axiosInstance from 'services/axiosInstance';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
const Profile = () => {
  const { currentUser } = useAuth();
  function convertTimestampToDate(timestamp) {
    // Create a new Date object using the timestamp
    const date = new Date(parseInt(timestamp));
    // Extract the individual components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Construct the date string in the desired format
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  const fetchTeamMembers = async () => {
    const token = await currentUser?.getIdToken();
    const Authorization = `Bearer ${token}`;
    const { data } = await axiosInstance.get('/team-members', {
      headers: {
        Authorization,
        'Content-Type': 'application/json',
        Appname: localStorage.getItem('rat:dashboard:appName')
      }
    });
    return data;
  };
  const lastLoggedIn = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).lastLoginAt : null;

  const { data: teamMembers } = useQuery(['teamMembers', currentUser], fetchTeamMembers, {
    refetchOnWindowFocus: false,
    enabled: !!currentUser,
    cacheTime: 60000,
    staleTime: 60000
  });
  console.log(teamMembers);
  //write a function to convert date string from timestamp

  return (
    <Row className="justify-content-md-center">
      <Col md={8}>
        <Card className="mb-4">
          <Card.Header>Profile</Card.Header>
          <Card.Body>
            <div className="d-flex">
              {' '}
              <img src={avatar1} className="img-radius" alt="User Profile" />
              <div className="ms-3">
                <Card.Text>
                  <strong>Email:</strong> {currentUser?.email}
                </Card.Text>
                <Card.Text>
                  <strong>App Name:</strong> {localStorage.getItem('rat:dashboard:appName')}
                </Card.Text>
                <Card.Text>
                  <strong>Last Logged In:</strong> {lastLoggedIn ? convertTimestampToDate(lastLoggedIn) : 'N/A'}
                </Card.Text>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>Team Members</Card.Header>
          <ListGroup variant="flush">
            {teamMembers?.length > 0 ? (
              teamMembers.map((member, index) => <ListGroup.Item key={index}>{member.email}</ListGroup.Item>)
            ) : (
              <ListGroup.Item>No team members found</ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
