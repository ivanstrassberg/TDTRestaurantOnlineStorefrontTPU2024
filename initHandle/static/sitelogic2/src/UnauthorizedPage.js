import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate(); 

  const handleGoHome = () => {
    navigate('/login'); 
  };

  return (
    <div>
      <h1>Для доступа к ресурсу Вам нужно войти в личный кабинет.</h1>
      <p>
        {/* You do not have permission to access this page. Please contact your administrator if you believe this is an error. */}
        У Вас нет доступа к данной странице. Если Вы считаете, что произошла ошибка, просим связаться с администратором по почте <strong>admin@nook.ru</strong>
      </p>
      <button onClick={handleGoHome}>Логин</button>
    </div>
  );
};

export default UnauthorizedPage;
