import React from 'react';
import Header from './index'; 
import Footer from './index';

const LayoutWithoutCarousel = ({ children }) => {
  return (
    <div>
      <Header showCarousel={false} />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutWithoutCarousel;