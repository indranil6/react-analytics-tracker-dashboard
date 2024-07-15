import React from 'react';
import { Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { Formik } from 'formik';

import { register } from 'firebase';
import { API_BASE_URL } from 'config/constant';
import axiosInstance from 'services/axiosInstance';

const SignUp1 = () => {
  const navigate = useNavigate();
  const handleRegister = async (values) => {
    const { email, password, appName } = values;
    try {
      let userCreds = await register(email, password);
      if (userCreds.user) {
        let response = await axiosInstance.post('/register', {
          uid: userCreds.user.uid,
          appName
        });
        console.log(response.data);
        localStorage.setItem('rat:dashboard:appName', appName);
        navigate('/app/dashboard/default');
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <Formik
                    initialValues={{
                      email: '',
                      password: '',
                      appName: '',
                      submit: null
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                      password: Yup.string().max(255).min(6).required('Password is required'),
                      appName: Yup.string().max(255).required('Application Name is required')
                    })}
                    onSubmit={(values) => {
                      handleRegister(values);
                    }}
                  >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                      <form noValidate onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                          <input
                            className="form-control"
                            label="Email Address / Username"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="example@example.com"
                            type="email"
                            value={values.email}
                          />
                          {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                        </div>
                        <div className="form-group mb-4">
                          <input
                            className="form-control"
                            label="Password"
                            name="password"
                            placeholder="Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="password"
                            value={values.password}
                          />
                          {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
                        </div>

                        <div className="form-group mb-4">
                          <input
                            className="form-control"
                            label="Application Name"
                            name="appName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            placeholder="Application Name"
                            value={values.appName}
                          />
                          {touched.appName && errors.appName && <small className="text-danger form-text">{errors.appName}</small>}
                        </div>

                        {errors.submit && (
                          <Col sm={12}>
                            <Alert>{errors.submit}</Alert>
                          </Col>
                        )}

                        <Row>
                          <Col mt={2}>
                            <Button
                              className="btn-block mb-4"
                              color="primary"
                              disabled={false}
                              size="large"
                              type="submit"
                              variant="primary"
                            >
                              Sign up
                            </Button>
                          </Col>
                        </Row>
                      </form>
                    )}
                  </Formik>

                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to={'/auth/signin'} className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
