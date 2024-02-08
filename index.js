const { prompt } = require("inquirer");
const db = require("./db/connection");
require("console.table");
const logo = require("asciiart-logo");
db.connect(function (err) {
    console.log("connected")
    if (err) throw err;
});


function init() {
    const logoText = logo({ 
        name: 'Employee Tracker',
        font: 'bloody',
        logoColor: 'bold-red',
        textColor: 'white',
        borderColor: 'bold-cyan',
        padding: 2,
        margin: 3,
        lineChars: 10,

    }).render();

    console.log(logoText);

    loadMainPrompts();
}




async function loadMainPrompts() {
    try {
        const res = await prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'How would you like to proceed?',
                choices: [
                    {
                        name: 'View All Employees',
                        value: 'VIEW_EMPLOYEES'
                    },
                    {
                        name: 'View All Employees By Department',
                        value: 'VIEW_ALL_EMPLOYEES_BY_DEPARTMENT'
                    },
                    {
                        name: 'View All Employees By Manager',
                        value: 'VIEW_ALL_EMPLOYEES_BY_MANAGER'
                    },
                    {
                        name: 'Add Employee',
                        value: 'ADD_EMPLOYEE'
                    },
                    {
                        name: 'Remove Employee',
                        value: 'REMOVE_EMPLOYEE'
                    },
                    {
                        name: 'Update Employee Role',
                        value: 'UPDATE_EMPLOYEE_ROLE'
                    },
                    {
                        name: 'Update Employee Manager',
                        value: 'UPDATE_EMPLOYEE_MANAGER'
                    },
                    {
                        name: 'View All Roles',
                        value: 'VIEW_ALL_ROLES'
                    },
                    {
                        name: 'Add Role',
                        value: 'ADD_ROLE'
                    },
                    {
                        name: 'Remove Role',
                        value: 'REMOVE_ROLE'
                    },
                    {
                        name: 'View All Departments',
                        value: 'VIEW_ALL_DEPARTMENTS'
                    },
                    {
                        name: 'Add Department',
                        value: 'ADD_DEPARTMENT'
                    },
                    {
                        name: 'Remove Department',
                        value: 'REMOVE_DEPARTMENT'
                    },
                    {
                        name: 'View Total Utilized Budget By Department',
                        value: 'VIEW_TOTAL_UTILIZED_BUDGET_BY_DEPARTMENT'
                    },
                    {
                        name: 'Quit',
                        value: 'QUIT'
                    }
                ]
            }
        ])
            let choice = res.choice;
            switch (choice) {
                case 'VIEW_EMPLOYEES':
                    viewEmployees();
                    break;
                case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                    viewEmployeesByDepartment();
                    break;
                case 'VIEW_EMPLOYEES_BY_MANAGER':
                    viewEmployeesByManager();
                    break;
                case 'ADD_EMPLOYEE':
                    addEmployee();
                    break;
                case 'REMOVE_EMPLOYEE':
                    removeEmployee();
                    break;
                case 'UPDATE_EMPLOYEE_ROLE':
                    updateEmployeeRole();
                    break;
                case 'UPDATE_EMPLOYEE_MANAGER':
                    updateEmplloyeeManager();
                    break;
                case 'VIEW_DEPARTMENTS':
                    viewDepartments();
                    break;
                case 'ADD_DEPARTMENT':
                    addDepartment();
                    break;
                case 'REMOVE_DEPARTMENT':
                    removeDepartment();
                    break;
                case 'VIEW_ROLES':
                    viewRoles();
                    break;
                case 'ADD_ROLE':
                    addRole();
                    break;
                case 'REMOVE_ROLE':
                    removeRole();
                    break;
                case 'VIEW_TOTAL_UTILIZED_BUDGET_BY_DEPARTMENT':
                    viewTotalUtilizedBudgetByDepartment();
                    break;
                default:
                    quit();
            }
    } catch (err) {
        console.log(err);
    }
}


async function viewEmployees() {
    try {
        const res = await db.findAllEmployees();
        console.log('\n');
        console.table(res);
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}

async function viewEmployeesByDepartment() {
    try {
        const res = await db.findAllDepartments();
        const departments = res.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        const res2 = await prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department would you like to see employees for?',
                choices: departments
            }
        ]);

        const employees = await db.findAllEmployeesByDepartment(res2.departmentId);
        console.log('\n');
        console.table(employees);
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}


async function viewEmployeesByManager() {
    try {
        const res = await db.findAllEmployees();
        const managers = res.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const res2 = await prompt([
            {
                type: 'list',
                name: 'managerId',
                message: 'Which manager would you like to see employees for?',
                choices: managers
            }
        ]);

        const employees = await db.findAllEmployeesByManager(res2.managerId);
        console.log('\n');
        if (employees.length === 0) {
            console.log("The selected manager has no employees");
        } else {
            console.table(employees);
        }
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}
    
async function removeEmployee() {
    try {
        const res = await db.findAllEmployees();
        const employees = res.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const res2 = await prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee do you want to remove?',
                choices: employees
            }
        ]);

        await db.removeEmployee(res2.employeeId);
        console.log("Removed employee from the database");
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}
   
async function addEmployee() {
    try {
        const res = await db.findAllRoles();
        const roles = res.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        const res2 = await prompt([
            {
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            {
                name: 'lastName',
                message: "What is the employee's last name?"
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roles
            }
        ]);

        await db.createEmployee(res2);
        console.log('\n');
        console.log("Added employee to the database");
        loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}

async function updateEmployeeRole() {
    try {
        const res = await db.findAllEmployees();
        const employees = res.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const res2 = await prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Which employee's role do you want to update?",
                choices: employees
            }
        ]);

        const res3 = await db.findAllRoles();
        const roles = res3.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        const res4 = await prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role do you want to assign the selected employee?',
                choices: roles
            }
        ]);

        await db.updateEmployeeRole(res2.employeeId, res4.roleId);
        console.log("Updated employee's role");
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}
    

async function viewRoles() {
    try {
        const res = await db.findAllRoles();
        console.log('\n');
        console.table(res);
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}
 

async function addRole() {
    try {
        const departments = await db.findAllDepartments();
        const departmentsChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        const response = await prompt([
            {
                name: 'title',
                message: 'What is the name of the role?'
            },
            {
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department does the role belong to?',
                choices: departmentsChoices
            }
        ]);

        await db.createRole(response);
        console.log('\n');
        console.log("Added role to the database");
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}
 

async function removeRole() {
    try {
        const res = await db.findAllRoles();
        const roles = res.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        const res2 = await prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role do you want to remove?',
                choices: roles
            }
        ]);

        await db.removeRole(res2.roleId);
        console.log("Removed role from the database");
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}
  

async function viewDepartments() {
    try {
        const res = await db.findAllDepartments();
        console.log('\n');
        console.table(res);
        loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}

async function addDepartment() {
    try {
        const res = await prompt([
            {
                name: 'name',
                message: 'What is the name of the department?'
            }
        ]);

        await db.createDepartment(res.name);
        console.log('\n');
        console.log("Added department to the database");
        await loadMainPrompts();
    } catch (err) {
        console.log(err);
    }
}


async function removeDepartment() {
    try {
        const res = await db.findAllDepartments();
        const departments = res.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        const res2 = await prompt({
            type: 'list',
            name: 'departmentId',
            message: 'Which department would you like to remove?',
            choices: departments
        });

        await db.removeDepartment(res2.departmentId);
        console.log("Removed department from the database");
        await loadMainPrompts();
    
    } catch (err) {
        console.log(err);
    }
}
    
    
function quit() {
    console.log("All done!")
    process.exit();
}






init();