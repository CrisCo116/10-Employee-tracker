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
          const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id) VALUES (?, ?, ?, ?, ?)';
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
            promptUser();
          });
        });
    });
  }