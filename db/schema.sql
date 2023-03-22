DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;

USe departments_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;
    name VARCHAR(30) NOT NULL;
);

CREATE TABLE roles (
    id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department (id)
    ON DELETE SET NULL
)

CREATE TABLE employees (
     id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     role_id INT,
     manager_id INT NULL IF the employee has no manager,
     FOREIGN KEY (role_id)
     REFERENCES  employee(id)
     KEY (manager_id)
     REFERENCES employee(id)
     ON DELETE SET NULL
)