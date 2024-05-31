import React from 'react';
import './Hero.css';
import Slider from 'react-slick';

const Hero = () => {
  const svgIcon = (
    <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.875 0C16.875 6.44062 0 3.22031 0 16.1016C0 20.932 1.875 22.5422 1.875 22.5422H3.75C3.75 22.5422 0.9375 20.932 0.9375 16.1016C0.9375 12.8812 9.375 9.66094 9.375 9.66094C9.375 9.66094 1.89375 13.1453 1.89375 16.4526C13.8309 18.0579 20.4394 6.12342 16.8741 0H16.875Z" fill="#7C9827"/>
    </svg>
  );

  return (
    <main className="about-main">
      <div className="about-container">
        <h1 className="about-title">О нашем эко-маркете</h1>
        <ul className="about-list">
          <li className="about-item">
            <p>{svgIcon} Начиная с 2018 года создаем натуральную продукцию для тех, кто с вниманием относится к своему питанию.</p>
          </li>
          <li className="about-item">
            <p>{svgIcon} Используем чистейшие овощи, орехи и другие ресурсы природы лучших сортов, выращивая их на нашей ферме.</p>
          </li>
          <li className="about-item">
            <p>{svgIcon} Готовим все блюда исключительно из свежих продуктов, прошедших отбор и обработку в естественной среде.</p>
          </li>
          <li className="about-item">
            <p>{svgIcon} Ежедневно клиенты выбирают нас и становятся постоянными покупателями, доверяя нам свои приемы пищи.</p>
          </li>
        </ul>
      </div>
    </main>
    
  );
};



export default Hero;