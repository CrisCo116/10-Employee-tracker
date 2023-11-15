INSERT INTO department (names) VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id) VALUES
('Sales Lead', 200000, 1),
('Salesperson', 100000, 1),
('Lead Engineer', 200000, 2),
('Software Engineer', 150000, 2),
('Account Manager', 160000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4),
('CEO', 600000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Chris', 'Murphy', 1, null),
('Jennifer', 'Lawrence', 2, 1),
('Adam', 'Lee', 3, null),
('Kevin', 'Smith', 4, 3),
('Billy', 'Johnson', 1, null),
('Jane', 'Doe', 2, 4);
('Ron', 'Burg', 3, 4),
('Jeff', 'Shoulder', 4, NULL);
('Les', 'Davis', 5, NULL);
