import React from 'react';
import './MainTest.css';
import { Link } from 'react-router-dom';

const MainTest = () => {
    return (
        <div>
            <section id="about" className="section">
                <div className="container">
                    <div className="section-content">
                        <div className="section-text">
                            <h2>About Us</h2>
                            <p>Originating in Moscow in 1989 Marcos' now brings French-inspired cuisine to charming, Parisian-style restaurants across Russia. Combining a warm, inviting setting with classic French dishes, our cafe is the perfect restaurant for every occasion and time of day. Join us at your local bistro for a true taste of Paris, whatever the celebration.</p>
                        </div>
                        <div className="section-image">
                            
                        </div>
                    </div>
                </div>
            </section>

            <section id="menu" className="section">
                <div className="container">
                    <div className="section-content">
                        <div className="section-text background">
                            <Link to="/products">
                                <h2>Menu</h2>
                            </Link>
                           
                            <p>Check out our delicious menu items.</p>
                        </div>
                        {/* <div className="section-image">
                            <img src='https://www.cafedusoleilny.com/wp-content/uploads/2021/11/cafedusoleilNY-restaurant-UWS-TAKE-OUT-DINNER-PG-2-2022.jpg' alt="Menu" />
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Add more sections similarly */}

        </div>
    );
};

export default MainTest;
