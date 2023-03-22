const inquirer = require("inquirer");
const mysql = require("mysql2");
const Department = require('./lib/department');
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');

inquirer
.prompt([
    {
        type: 'list',
        name: "",
        message: "What would you like to do?",
        choices: ['View All Departments', 'View All Roles','View All Employees','Add Department', 'Add Role', 'Add Employee' ,'Update Employee Role']
    }
]).then(answers =>{
    if(answers === 'View All Departments'){

    }else if (answers === 'View All Roles'){

    }else if (answers === 'View All Employees'){
        
    }else if (answers === 'Add Department'){
        
    }else if (answers === 'Add Role'){
        
    }else if (answers === 'Add Employee'){
        
    }else if (answers === 'Update Employee Role'){
        
    }
})