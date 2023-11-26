const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_tracker_db',
});

// Function to display the main menu
function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Add Employee',
          'Delete Employee',
          'Update Employee Role',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'View All Employees',
          'Exit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'Add Employee':
          addEmployee();
          break;
        case 'Delete Employee':
          deleteEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
  // Call the function to display the main menu
  mainMenu();
});

// Function to add an employee
function addEmployee() {
  // Fetch a list of roles from the database
  connection.query('SELECT id, title FROM role', (err, roles) => {
    if (err) {
      console.error('Error querying database for roles:', err);
      return;
    }

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'last_name',
          message: "Enter the employee's last name:",
        },
        {
          type: 'list',
          name: 'role_id',
          message: "Select the employee's role:",
          choices: roleChoices,
        },
        {
          type: 'input',
          name: 'manager_id',
          message: "Enter the employee's manager ID (if applicable):",
        },
        {
          type: 'input',
          name: 'department_id',
          message: "Enter the employee's department ID:",
        },
      ])
      .then((answers) => {
        // Continue with the code to insert the new employee into the database
        const sql =
          'INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id) VALUES (?, ?, ?, ?, ?)';
        const values = [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id || null,
          answers.department_id,
        ];

        // Run the SQL query to add the employee
        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error adding employee to the database:', err);
            return;
          }
          console.log('Employee added successfully!');
          // Return to the main menu after adding the employee
          mainMenu();
        });
      });
  });
}

// Function to delete an employee
function deleteEmployee() {
  connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
    if (err) {
      console.error('Error querying database for employees:', err);
      return;
    }

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to delete:',
          choices: employeeChoices,
        },
      ])
      .then((answers) => {
        const { employeeId } = answers;
        const sql = 'DELETE FROM employee WHERE id = ?';

        connection.query(sql, [employeeId], (err, results) => {
          if (err) {
            console.error('Error deleting employee:', err);
          } else {
            console.log('Employee deleted successfully!');
          }
          mainMenu(); // Return to the main menu
        });
      });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  // Fetch a list of employees from the database
  connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
    if (err) {
      console.error('Error querying database for employees:', err);
      return mainMenu();
    }

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    connection.query('SELECT id, title FROM role', (err, roles) => {
      if (err) {
        console.error('Error querying database for roles:', err);
        return mainMenu();
      }

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employeeChoices,
          },
          {
            type: 'list',
            name: 'newRoleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          const { employeeId, newRoleId } = answers;
          const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';

          connection.query(sql, [newRoleId, employeeId], (err, results) => {
            if (err) {
              console.error('Error updating employee role:', err);
            } else {
              console.log('Employee role updated successfully!');
            }
            mainMenu(); // Return to the main menu
          });
        });
    });
  });
}

// Function to view all roles
function viewAllRoles() {
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) {
      console.error('Error querying database for roles:', err);
      return mainMenu();
    }

    console.log('\nAll Roles:\n');
    roles.forEach((role) => {
      console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary}`);
    });

    mainMenu(); // Return to the main menu
  });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the new role:',
      },
    ])
    .then((answers) => {
      const sql = 'INSERT INTO role (title, salary) VALUES (?, ?)';
      const values = [answers.title, answers.salary];

      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error adding role to the database:', err);
        } else {
          console.log('Role added successfully!');
        }
        mainMenu(); // Return to the main menu
      });
    });
}

// Function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) {
      console.error('Error querying database for departments:', err);
      return mainMenu();
    }

    console.log('\nAll Departments:\n');
    departments.forEach((department) => {
      console.log(`ID: ${department.id} | Name: ${department.name}`);
    });

    mainMenu(); // Return to the main menu
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:',
      },
    ])
    .then((answers) => {
      const sql = 'INSERT INTO department (name) VALUES (?)';
      const values = [answers.name];

      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error adding department to the database:', err);
        } else {
          console.log('Department added successfully!');
        }
        mainMenu(); // Return to the main menu
      });
    });
}

// Function to view all employees
function viewAllEmployees() {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) {
      console.error('Error querying database for employees:', err);
      return mainMenu();
    }

    console.log('\nAll Employees:\n');
    employees.forEach((employee) => {
      console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id} | Department ID: ${employee.department_id}`);
    });

    mainMenu(); // Return to the main menu
  });
}