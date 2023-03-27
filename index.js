const inquirer = require("inquirer");
const mysql = require("mysql2");
const { title } = require("process");
require("console.table")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "departments_db"
})

connection.connect(err => {
    if (err) throw err;
    console.log("connected to DB\n")
    mainQuestion()
})

function mainQuestion() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: "mainQuestion",
                message: "What would you like to do?",
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Delete department', 'Quit']
            }
        ]).then(answers => {
            if (answers.mainQuestion === 'View All Departments') {
                viewAllDepartments()
            } else if (answers.mainQuestion === 'View All Roles') {
                viewAllRoles()
            } else if (answers.mainQuestion === 'View All Employees') {
                viewAllEmployees()
            } else if (answers.mainQuestion === 'Add Department') {
                addDepartment()
            } else if (answers.mainQuestion === 'Add Role') {
                addRole()
            } else if (answers.mainQuestion === 'Add Employee') {
                addEmployee()
            } else if (answers.mainQuestion === 'Update Employee Role') {
                updateRole()
            } else if (answers.mainQuestion === 'Delete department') {
                deleteDepartment()
            } else {
                connection.end()
            }
        })
}

function viewAllDepartments() {
    connection.query("SELECT * FROM departments", (err, data) => {
        if (err) throw err;
        console.table(data)
        mainQuestion()
    })
}

function viewAllRoles() {
    connection.query("SELECT roles.id, roles.title, departments.name as department, roles.salary FROM roles join departments on roles.department_id = departments.id ", (err, data) => {
        if (err) throw err;
        console.table(data)
        mainQuestion()
    })
}

function viewAllEmployees() {
    connection.query("SELECT employees1.id, employees1.first_name, employees1.last_name, roles.title, roles.salary, departments.name, CONCAT(employees2.first_name, ' ', employees2.last_name) AS manager_name FROM employees AS employees1 JOIN roles ON employees1.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS employees2 ON employees1.manager_id = employees2.id",

        (err, data) => {
            if (err) throw err;
            console.table(data)
            mainQuestion()
        })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of your new department?"
        }
    ]).then(answer => {
        connection.query("INSERT INTO departments SET ?",
            {
                name: answer.departmentName
            }, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`New department ${answer.departmentName} has been added.`);
                }
                mainQuestion()
            });
    });
};


function addRole() {
    connection.query("SELECT * FROM departments", (err, data) => {
        if (err) throw err;
        const departmentChoices = data.map(({ id, name }) => ({
            name: name,
            value: id
        }))
        inquirer.prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "What is the title of the new role?"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary of the new role?"
            },
            {
                type: "list",
                name: "rolesDepartment",
                message: "Which department does the role belong to?",
                choices: departmentChoices
            }
        ]).then(answer => {
            connection.query("INSERT INTO roles SET ?",
                {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id: answer.rolesDepartment
                }, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Added ${answer.roleTitle} to the database.`);
                    }
                    mainQuestion()
                });

        })
    })
}

function addEmployee() {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        const roleChoices = data.map(({ id, title }) => ({
            name: title,
            value: id
        }))
        console.log(roleChoices)
        inquirer.prompt([
            {
                type: "input",
                name: "employeeFirst_name",
                message: "What is the employee first name?"
            },
            {
                type: "input",
                name: "employeeLast_name",
                message: "What is the employee last name?"
            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employee's role?",
                choices: roleChoices
            },
        ]).then(answerEmployee => {
            const employeeRole = answerEmployee.employeeRole
            connection.query("SELECT id, first_name, last_name FROM employees WHERE employees.manager_id is not null", (err, data) => {
                if (err) throw err;
                const employeeManager = data.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                }))
                inquirer.prompt([
                    {
                        type: "list",
                        name: "employeeManager",
                        message: "Who is the employee's manager?",
                        choices: employeeManager
                    }
                ]).then(answer => {
                    connection.query("INSERT INTO employees SET ?",
                        {
                            first_name: answerEmployee.employeeFirst_name,
                            last_name: answerEmployee.employeeLast_name,
                            role_id: employeeRole,
                            manager_id: answer.employeeManager
                        }, (error, result) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(`Added ${answerEmployee.employeeFirst_name} ${answerEmployee.employeeLast_name} to the database.`);
                            }
                            mainQuestion()
                        });
                })
            })
        })
    })
}

function updateRole() {
    connection.query("SELECT id, first_name, last_name FROM employees ", (err, data) => {
        if (err) throw err;
        const employeeChoices = data.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        console.log(employeeChoices)
        inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices
            },
        ]).then(answers => {
            const employeeID = answers.employeeId

            connection.query("SELECT * FROM roles", (err, data) => {
                if (err) throw err;
                const roleChoices = data.map(({ id, title }) => ({
                    name: title,
                    value: id
                }))

                inquirer.prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "Which role do you want to assign the sellected employee?",
                        choices: roleChoices
                    }
                ]).then(roleAnswer => {
                    connection.query("UPDATE employees SET ? WHERE ?", [
                        {
                            role_id: roleAnswer.roleId
                        },
                        {
                            id: employeeID
                        }
                    ])
                    console.log("Updated employee's role")
                    mainQuestion()
                })
            })
        })
    })
}

function deleteDepartment() {
    connection.query("SELECT * FROM departments", (error, results) => {
        if (error) {
            console.log(error);
        } else {

            console.log("Current departments:");
            console.table(results);
            inquirer.prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to delete?",
                    choices: results.map(department => ({
                        name: department.name,
                        value: department.id
                    }))
                }
            ]).then(answer => {

                connection.query("DELETE FROM departments WHERE id = ?", [answer.departmentId], (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Department with ID ${answer.departmentId} has been deleted.`);
                    }
                    mainQuestion();
                });
            });
        }
    });
}
