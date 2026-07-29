import React from 'react';

import "./Card.css";

const Card = ({ className = "", children, ...rest }) => {
  const classes = className ? `card ${className}` : "card";

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Card;
