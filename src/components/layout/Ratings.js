import React from 'react';

const Ratings = ({ rate }) => {
  switch (rate) {
    case 0.5:
      return <i className='fs-14 fas fa-star-half-alt color-primary mr-2'></i>;
    case 1:
      return <i className='fs-14 fas fa-star color-primary mr-2'></i>;
    case 1.5:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star-half-alt color-primary mr-2'></i>
        </>
      );
    case 2:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary mr-2'></i>
        </>
      );
    case 2.5:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star-half-alt color-primary mr-2'></i>
        </>
      );
    case 3:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary mr-2'></i>
        </>
      );
    case 3.5:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star-half-alt color-primary mr-2'></i>
        </>
      );
    case 4:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary mr-2'></i>
        </>
      );
    case 4.5:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star-half-alt color-primary mr-2'></i>
        </>
      );
    case 5:
      return (
        <>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary'></i>
          <i className='fs-14 fas fa-star color-primary mr-2'></i>
        </>
      );

    default:
      return <i className='far fa-star mr-2'></i>;
  }
};

export default Ratings;
