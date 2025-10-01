// const readline = require("readline") //old - commonJs

import readline from "readline"; //new - module

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const employees = [{ id: 1, name: "Aniket", age: 5 }];
function showMenu() {
  console.log("\nEmployee Management");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");
  rl.question("Enter your choice: ", handleInput);
}

function handleInput(choice) {
  switch (choice.trim()) {
    case "1":
      addEmp();
      break;
    case "2":
      //call list employee func
      listEmp();
      break;
    case "3":
      //call delete employee func
      deleteEmp();
      break;
    case "4":
      rl.close();
      break;
    default:
      console.log("\nInvalid Choice");
      showMenu();
  }
}

function addEmp() {
  rl.question("Enter Employee name: ", (name) => {
    rl.question("Enter employee age: ", (age) => {
      const newEmp = {
        id: Date.now(),
        name: name,
        age: age,
      };
      employees.push(newEmp);
      console.log("Employee added");
      showMenu();
    });
  });
}

function listEmp() {
  employees.forEach((emp, index) => {
    console.log(
      `${index + 1}. ID: ${emp.id}, NAME: ${emp.name}, AGE: ${emp.age}`
    );
  });
  showMenu();
}
function deleteEmp() {
  rl.question("Enter employee Id to remove: ", (empId) => {
    const empIndex = employees.findIndex((emp) => emp.id === Number(empId));
    console.log(empIndex)
    if (empIndex < 0) {
      console.log("Employee not found");
      showMenu();
    } else {
      console.log("Employee remove successfully");
      showMenu();
    }
  });
}
showMenu();