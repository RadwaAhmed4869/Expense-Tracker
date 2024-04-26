import React from "react";

import Expenses from "./components/Expenses/Expenses";

const App = () => {
  const expenses = [
    {
      id: "e1",
      title: "Car Insurance",
      amount: 450,
      date: new Date(2021, 2, 15),
    },
    {
      id: "e2",
      title: "Healthy Spread",
      amount: 310,
      date: new Date(2024, 4, 8),
    },
    {
      id: "e3",
      title: "Peanut Butter",
      amount: 280,
      date: new Date(2024, 4, 8),
    },
    {
      id: "e4",
      title: "Mobile",
      amount: 14000,
      date: new Date(2023, 11, 10),
    },
  ];

  // return React.createElement(
  //   "div",
  //   {},
  //   React.createElement("h2", {}, "Let's get started!"),
  //   React.createElement(Expenses, { items: expenses })
  // );

  return (
    <div>
      <h2>Let's get started!</h2>
      <Expenses items={expenses}/>
    </div>
  );
}

export default App;
