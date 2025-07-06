import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CS1FundamentalsSlides } from '../components/CS1FundamentalsSlides';

export const FundamentalsSlidesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1);
  };
  
  return <CS1FundamentalsSlides onClose={handleClose} />;
}; 