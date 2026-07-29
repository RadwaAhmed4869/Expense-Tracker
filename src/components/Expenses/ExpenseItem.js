import React from "react";

import ExpenseDate from "./ExpenseDate";
import Card from "../UI/Card";
import { DeleteIcon } from "../UI/icons";
import "./ExpenseItem.css";

const ExpenseItem = (props) => {

  const deleteHandler = () => {
    props.onDelete(props.id);
  }

  return (
    <li>
      <Card className="expense-item">
        <ExpenseDate date={props.date} />
        <div className="expense-item__description">
          <h2>{props.title}</h2>
          <div className="expense-item__price">${props.amount}</div>
        </div>
        <span className="delete-icon" onClick={deleteHandler}>
          <DeleteIcon />
        </span>
      </Card>
    </li>
  );
};

export default ExpenseItem;
