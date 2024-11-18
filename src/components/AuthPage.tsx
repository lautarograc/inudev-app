import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import Cookies from 'js-cookie';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

const AuthPage: React.FC = () => {
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const showRegisterModal = () => {
    setRegisterModalVisible(true);
  };

  const showLoginModal = () => {
    setLoginModalVisible(true);
  };

  const handleRegisterSuccess = () => {
    setRegisterModalVisible(false);
    message.success('Registration successful! Please log in.');
    setLoginModalVisible(true);
  };

  const handleLoginSuccess = (token: string) => {
    setLoginModalVisible(false);
    Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
    message.success('Login successful!');
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: 100 }}>
      <Button type="primary" onClick={showRegisterModal} style={{ marginRight: 16 }}>
        Register
      </Button>
      <Button type="default" onClick={showLoginModal}>
        Login
      </Button>

      <Modal
        title="Register"
        open={isRegisterModalVisible}
        footer={null}
        onCancel={() => setRegisterModalVisible(false)}
      >
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </Modal>

      <Modal
        title="Login"
        open={isLoginModalVisible}
        footer={null}
        onCancel={() => setLoginModalVisible(false)}
      >
        <LoginForm onSuccess={handleLoginSuccess} />
      </Modal>
    </div>
  );
};

export default AuthPage;
