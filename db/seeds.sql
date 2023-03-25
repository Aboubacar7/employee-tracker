INSERT INTO departments(name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");
       
INSERT INTO roles (department_id, title, salary)
VALUES (4, "Sales Lead", 100000),
       (4, "Salesperson", 800000),
       (1, "Lead Engineer", 150000),
       (1, "Software Engineer", 120000),
       (2, "Account Manager", 160000),
       (2, "Accountant", 125000),
       (3, "Legal Team Lead", 250000),
       (3, "Lawyer", 190000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jhon", "Doe", 1, null),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriguez", 3, null),
       ("Kevin", "Tupik", 4, 3),
       ("Kumal", "Singh", 5, null),
       ("Malia", "Brown", 6, 5),
       ("Sarah", "Lourd", 7, null),
       ("Tom", "Allen", 8, 7);