const db = require("./connection");

class DB {

constructor(connection){
    this.db = connection;
}

    findAllEmployees(){
        return this.db.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        );
    }

    findAllManagers(employeeId){
        return this.db.promise().query(
            "SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeId
        );
    }

    createEmployee(employee){
        return this.db.promise().query("INSERT INTO employee SET ?", employee);
    }

    removeEmployee(employeeId){
        return this.db.promise().query("DELETE FROM employee WHERE id = ?", employeeId);
    }

    updateEmployeeRole(employeeId, roleId){
        return this.db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?",
        [roleId, employeeId]
        );
    }

    updateEmployeeManager(employeeId, managerId){
        return this.db.promise().query("UPDATE employee SET manager_id = ? WHERE id = ?",
        [employeeId, managerId]
        );
    }

    findAllRoles(){
        return this.db.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id"
        )
    }

}

module.exports = new DB(db);
