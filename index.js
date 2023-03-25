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
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
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
    connection.query("SELECT * FROM employees", (err, data) => {
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
            })
        mainQuestion()
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "What is the title of your new role?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary of your new role?"
        },
        {
            type: "input",
            name: "rolesDepartment",
            message: "What is the department id number of your new role?"
        }
    ]).then(answer => {
        connection.query("INSERT INTO roles SET ?",
            {
                title: answer.roleTitle,
                salary: answer.roleSalary,
                department_id: answer.rolesDepartment
            })
        mainQuestion()
    })
}

function addEmployee() {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        const roleChoices = data.map(({ id, title }) => ({
            title: title,
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
        ]).then(answer => {
            // const employeeRole = answer.employeeRole
            connection.query("SELECT * FROM employees", (err, data) => {
                if (err) throw err;
                const employeeManager = data.map(({ namager_name }) => ({
                    name: namager_name,
                    
                }))
                inquirer.prompt([
                    {
                        type: "list",
                        name: "employeeManager",
                        message: "What is the id number of the new role for that employee?",
                        choices: employeeManager
                    }
                ])
            })
        })
    })
}

function updateRole() {
    connection.query("SELECT * FROM employees", (err, data) => {
        if (err) throw err;
        const employeeChoices = data.map(({ id, first_name }) => ({
            name: first_name,
            value: id
        }))
        console.log(employeeChoices)
        inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "What is the id number of the employee you want to update?",
                choices: employeeChoices
            },
        ]).then(answers => {
            const employeeID = answers.employeeId

            connection.query("SELECT * FROM roles", (err, data) => {
                if (err) throw err;
                const roleChoices = data.map(({ id, title }) => ({
                    tite: title,
                    value: id
                }))

                inquirer.prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "What is the id number of the new role for that employee?",
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
                    mainQuestion()
                })
            })
        })
    })
}