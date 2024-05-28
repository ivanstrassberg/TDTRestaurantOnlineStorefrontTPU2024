import React from 'react';
import './MainTest.css';

const MainTest = () => {
    const svgIcon = (
        <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.875 0C16.875 6.44062 0 3.22031 0 16.1016C0 20.932 1.875 22.5422 1.875 22.5422H3.75C3.75 22.5422 0.9375 20.932 0.9375 16.1016C0.9375 12.8812 9.375 9.66094 9.375 9.66094C9.375 9.66094 1.89375 13.1453 1.89375 16.4526C13.8309 18.0579 20.4394 6.12342 16.8741 0H16.875Z" fill="#7C9827"/>
        </svg>
      );
  return (
    <main className="main">
      <div className="promo">
        <ul className="promo_list">
          <li className="promo_list_item">
           {svgIcon}
            <div className="cont_promo_info">
              <p className="promo_list_txt_bold">
                Минимальная сумма заказа – 500 ₽
              </p>
              <p className="promo_list_txt">
                При оформлении заказа выберите доставку в течение часа или
                интервальную. Стандартный интервал доставки заказов — 1 или 2
                часа. Быстрая доставка в течение ближайшего часа дороже
                интервальной на 65 ₽.
              </p>
            </div>
          </li>
          <li className="promo_list_item">
           {svgIcon}
            <div className="cont_promo_info">
              <p className="promo_list_txt_bold">Для заказов от 500 до 1975 ₽:</p>
              <p className="promo_list_txt">
                Цена интервальной доставки динамическая. Чем выше сумма заказа,
                тем ниже цена. Стартовая стоимость доставки 150 ₽. Например, для
                заказа на 1000 ₽ цена доставки – 95 ₽.
              </p>
            </div>
          </li>
          <li className="promo_list_item">
           {svgIcon}
            <div className="cont_promo_info">
              <p className="promo_list_txt_bold">
                А для заказа на 1400 ₽ цена доставки – 55 ₽. 
              </p>
              <p className="promo_list_txt">
                Точную стоимость доставки вы увидите при оформлении заказа.
                Доставка в течение часа: +65 ₽ к стоимости интервальной
                доставки.
              </p>
            </div>
          </li>
          <li className="promo_list_item">
           {svgIcon}
            <div className="cont_promo_info">
              <p className="promo_list_txt_bold">Для заказов от 1975 ₽</p>
              <p className="promo_list_txt">
                Интервальная доставка – бесплатно. Доставка в течение часа – 65
                ₽.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default MainTest;
