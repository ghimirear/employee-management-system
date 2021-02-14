// bringing all the required package.
const mysql = require('mysql');
const consoletable = require('console.table');
const inquirer = require('inquirer')
// creating connection to database.
const connection = mysql.createConnection({
  host: 'localhost',
  // Port for this project
  port: 3306,
  // Username
  user: 'root',
  password: 'M26monicamysql',
  database: 'employeedb',
});
const afterConnection = () => {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    //console.log(consoletable.getTable(res))
    //connection.end();
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  afterConnection() 
});
// function to prompt the user with some options that can do with the database.
function initialize (){
  inquirer.prompt([
    {
      type:'list',
      name : 'todolist',
      choices:
       ['see all employee',
        'add employee',
        'add department',
        'add role',
        'update employee role',
        'update employee manager',
        'view departments',
        'view roles',
        'view employees',
        'delete employee',
        'delete role',
        'delete department',
        
        'exit'
      ],
    }
  ]).then(answers=>{
    switch(answers.todolist){
    case 'see all employee': gettable();
    break;
    case 'add employee': addEmployee();
    break; 
    case 'add department': addDepartment();
    break; 
    case 'add role' : addRole();
    break;
    case 'update employee role' : updateRole();
    break;
    case  'update employee manager' : updateManager();
    break;
    case 'view departments' : viewDepartments();
    break;
    case 'view roles': viewRoles();
    break;
    case 'view employees' : viewEmployees();
    break;
    case 'delete employee': deleteEmployee();
    break; 
    case 'delete role' : deleteRole();
    break;
    case 'delete department' : deleteDepartment();
    break;
    case 'View employees by manager': employeeByManager();
    break;
    case 'exit': exit();
  }
  }) 
}
initialize();
// --------------- functions starts here--------------
function viewRoles(){
  connection.query(`SELECT r.id AS Role_IDs, r.title AS Roles,
   r.salary AS Salaries, department.dptname AS Departments FROM emprole AS r
   INNER JOIN department ON r.dept_id  = department.id ORDER BY department.dptname ASC`, 
   (err, response)=>{
     if (err) throw err;
     console.log(consoletable.getTable(response));
   })
   gettable();
}
// function exit 
function exit(){
  connection.end();
}
// functio view employee by manager 
function employeeByManager(){
  connection.query(`SELECT e.id AS EmpID, concat(e.first_name, ' ', e.last_name) AS Employee,
   concat(m.first_name,' ', m.last_name) AS Manager FROM employee AS e JOIN employee
   AS m ON e.manager_id = m.id ORDER BY e.manager_id ASC`, (err, res)=>{
     if (err) throw err;
     console.log(consoletable.getTable(res));
     initialize();
   })
}

// ----------- next function ---------------
// function deleteRole 
function deleteRole(){
   connection.query('SELECT * FROM emprole', (err, response)=>{
     if (err) throw err;
     inquirer.prompt(
       [
         {
           type : 'rawlist',
           name :'deletingRole',
           choices(){
             const roleArray = [];
             response.forEach(({title})=>{
               roleArray.push(title);
             })
             return roleArray;
           },
           message : ' Which role you want to delete?'
         }
       ])
       .then((answer)=>{
         let chosenRole;
         response.forEach((role)=>{
           if(role.title === answer.deletingRole){
              chosenRole = role;
           }
         })
         connection.query('DELETE FROM emprole where ?',
         [{
           title : chosenRole.title,
         },],
         (err)=>{
           if(err)throw err;
            console.log(chosenRole.title + ' is deleted from the system.')
         })
         gettable();
       })
   })
}
// function to delete department.

function deleteDepartment(){
  connection.query('SELECT * FROM department', (err, response)=>{
    if (err)throw err;
    inquirer.prompt([
      {
        type: 'rawlist',
        name : 'deletingDepart',
        choices(){
          const departArray = [];
          response.forEach(({dptname})=>{
              departArray.push(dptname);
          })
          return departArray;
        },
        message : ' Wchich department you would like to delete?'
      }
    ]).then((answer)=>{
      let chosenDepart;
      response.forEach((depart)=>{
        if (depart.dptname=== answer.deletingDepart) {
          chosenDepart = depart;
        }
      });

      connection.query('DELETE FROM department where ?',
      [
        {
          id : chosenDepart.id
        },
      ], (err)=>{
        if(err) throw err;
        console.log('Department ' + chosenDepart.dptname + ' is deleted from the system.')
      })
      gettable();
    })
  })
}



// Function deleteEmployee.
function deleteEmployee(){
  connection.query('SELECT * FROM employee', (err, response)=>{
    if(err) throw err;
    inquirer.prompt([
      {
        type : 'rawlist',
        name : 'deletingEmployee',
        choices(){
          let employeeArray= [];
          for (let i = 0; i < response.length; i++) {
            employeeArray.push(response[i].first_name + ' ' + response[i].last_name);
          }
          return employeeArray
        },
        message : 'Which employee you would like to delete?'
      }
    ]).then((answer)=>{
      let chosenEmployee;
      response.forEach((item)=>{
        if (item.first_name + ' ' + item.last_name === answer.deletingEmployee) {
          chosenEmployee = item;
        }
      })
      deletingId = chosenEmployee.id;
      connection.query('DELETE FROM employee WHERE ?',
      [
        {
          id : deletingId,
        }
      ],
      (err)=>{
        if (err) throw err;
        console.log('employee ' +chosenEmployee.first_name + ' ' + 
        chosenEmployee.last_name + ' is sucessfully deleted from the system.')
      })
    })
    gettable();
  })
}

// ----------- next function ---------------
function viewDepartments(){
  connection.query('SELECT * FROM department', (err, response)=>{
    if(err)throw err;
    console.log(consoletable.getTable(response))
  })
  gettable();
}



// ----------- next function ---------------


function viewEmployees(){
  connection.query(`SELECT e.id, e.first_name, e.last_name,
  emprole.title, emprole.salary, department.dptname AS department,
  concat(m.first_name, ' ', m.last_name) AS manager FROM employee AS e
  LEFT JOIN employee AS m ON e.manager_id = m.id 
  INNER JOIN emprole ON e.role_id = emprole.id INNER
  JOIN department ON emprole.dept_id = department.id`,
  (err, response)=>{
    if(err) throw err;
    console.log(consoletable.getTable(response))
  })
  initialize();
}



// ----------- next function ---------------

function updateManager(){
    // bringing table 
    connection.query('SELECT * FROM employee', (err, response)=>{
      if (err) throw err;
        inquirer.prompt([
          {
            name : 'employee',
            type : 'rawlist',
            choices(){
              const employeeArray = [];
              // To bring firstName and lastName from table
             for (let i = 0; i < response.length; i++) {
                  employeeArray.push(response[i].first_name + ' ' + response[i].last_name)
             }
             return employeeArray;
            },
            message : 'Which employee manager you would like to update?',
          },
          {
            type: 'rawlist',
            name : 'updatingManager',
            choices(){
              let managerAraay = [];
              for (let i = 0; i < response.length; i++) {
                  // If role_id matches to 7 then show on list as manager option
                if (response[i].role_id === 7) {
                  managerAraay.push(response[i].first_name + ' '+ response[i].last_name)
                }
              }
              return managerAraay;
            },
            message :'Which manager you would like to assign?'
          }
          
        ]).then((answer)=>{
          let chosenEmployee;
          let chosenManager;
          response.forEach((item)=>{
              // checking selected answer and table data to bring the employee as object.
            if (item.first_name + ' '+ item.last_name === answer.employee) {
                chosenEmployee = item;
            }
            else if (item.first_name + ' '+ item.last_name === answer.updatingManager) {
              chosenManager = item
            }
          })
          let chosenEmployeeId = chosenEmployee.id;
          let updatingManagerId = chosenManager.id;
          // connection query to update the table.
          connection.query('UPDATE employee SET ? WHERE ?',
          [
            {manager_id : updatingManagerId},
            {id : chosenEmployeeId, }
          ],(err)=>{
            if(err) throw err;
            console.log('employee '+ answer.employee  + ' manager is updated as ' + answer.updatingManager)
          }
          )
          // calling gettable function to show table.
          gettable();
        })
        

    })
  }
  
  

// function gettable to bring all the tables and joining them with the query.
function gettable (){ // query to connect all the table to show all the data.
  connection.query(`SELECT e.id, e.first_name, e.last_name, emprole.title, emprole.salary, department.dptname AS department,
  concat(m.first_name, ' ', m.last_name) AS manager FROM employee AS e  LEFT JOIN employee AS m ON e.manager_id = m.id 
  INNER JOIN emprole ON e.role_id = emprole.id INNER JOIN department ON emprole.dept_id = department.id`,
  (err, res) => {
    if (err) throw err;
    console.log(consoletable.getTable(res))
    initialize();
  });
}
// function addEmployee to add employee to database.
function addEmployee(){
  connection.query('SELECT * FROM emprole', (err, results) =>{
    if (err) throw err;
    inquirer.prompt([
          { // prompting to gather required information
              type:'input',
              name : 'firstName',
              message : 'please enter the first name of employee',
              validate: answer =>{if (answer!== '') {
                return true;  
                }
            else{
                return 'Please provide the first name of the employee.';
            }
            }
          },
          {
            type:'input',
            name : 'lastName',
            message : 'please enter the last name of employee',
            validate: answer =>{if (answer!== '') {
              return true;  
              }
          else{
              return 'Please provide the last name of the employee.';
          }
          }
          },
          {
            name: 'choice',
            type: 'rawlist',
            choices() {
              // whatever job title is there on table it will show all the result.
              const choiceArray = [];
              results.forEach(({ title }) => {
                choiceArray.push(title);
              });
              return choiceArray;
            },
            message: 'what is the role of the employee?',
          }  
        ])
        .then((answer) => {
          // console.log(answer)
          let chosenrole;
           results.forEach((item) => {
             // For each object it is matching the value with the selected value and grabbing the whole row with matching value as a object
            if (item.title === answer.choice) {
              chosenrole = item;
            }
           });
          // console.log(chosenrole.id);
           let firstname = answer.firstName;
           let lastname = answer.lastName;
           let roleid = chosenrole.id;

           // This is just a condition to put another connection query to continuee prompt to bring other information.
      if (answer.choice != '') {
        connection.query('SELECT * FROM employee', (err, response) =>{
          if (err) {
            throw err
          }
          inquirer.prompt([
            {
              type: "list",
              name : 'manager',
              choices(){
                const choicea = ['null'];
                //console.log(response.length);
                // for loop to check the which employee has role_id "7" which belongs to manager
               for (let i = 0; i < response.length; i++) {
                 // console.log(response[i]);
                 if (response[i].role_id == 7) {
                    choicea.push(response[i].first_name + ' ' + response[i].last_name)
                 }  
               }
               return choicea;
              },
              message: 'Who is the manager of this employee?',
            }
          ])
          .then((answer) => {
            let chosenmanager;
            // this is a option for some employee who will not have manager.
            // hardcoded just to make sure.
            if (answer.manager === 'null') {
              chosenmanager = 'null';
              // if no manager then no manager id for that employee.
              manager_id = null;
            }
            //console.log(answer)
             response.forEach((item) => {
              if (item.first_name +' ' + item.last_name === answer.manager) {
                chosenmanager = item;
              }
             });
             // connection query to insert the data to table.
             connection.query(
              'INSERT INTO employee SET ?', 
              {
                first_name: firstname,
                last_name : lastname,
                manager_id : chosenmanager.id,
                role_id :  roleid
              },(err)=>{
                if (err) throw err;
                console.log('Employee is added to the system.')
              }
            )
             gettable();

          })
        })
       
      }
      


    });
    

})
}
// ---------------------------------- next function ----------------------------------
// Function to add department.
  function addDepartment(){
    inquirer.prompt([
      {
      type :'input',
      name : 'department',
      message :'what is the name of the department you want to add?',
      validate: answer =>{if (answer!== '') {
        return true;  
        }
    else{
        return 'Please provide the department name.';
    }
    }
      }
  ]).then((answer)=>{
    departmentName = answer.department;
    connection.query(
      'INSERT INTO department SET ?', 
      {
        dptname : departmentName
      },(err)=>{
        if (err) throw err;
        console.log('department ' + departmentName + ' is added to the system.')
      }
    )
    viewDepartments();
  })
  }

  // ---------------------------- next function -----------------------
  // function to add role. 
  function addRole(){
    // making an connection to database table.
    connection.query('SELECT * FROM department', (err, results) =>{
      if (err) throw err;
      inquirer.prompt([
        {
          type: 'rawlist',
          name :'department',
          choices (){
            const roleArray = [];
            results.forEach(({dptname})=> {
              roleArray.push(dptname);
            });
            return roleArray;
          },
          message : 'On which department you would like to add role?'
        
        },
        {
          type : 'input',
          name : 'departmentrole',
          message : 'What is the role you would to add?',
          validate: answer =>{if (answer!== '') {
            return true;  
            }
        else{
            return 'Please provide the role please....';
        }
        }

        },
        {
          type : 'input',
          name : 'salary',
          message : 'What is the salary of that role.?',
          validate: answer =>{
            const correct = answer.match(/^[1-9]\d*$/)
            if (correct) {
                return true  
            }
            else {
                return 'Please provide the salary of the role. should be in number'
            }
        }

        }
      ]).then((answer)=>{
        let chosenDepartment;
        results.forEach((depart) =>{
          if (depart.dptname === answer.department) {
            chosenDepartment = depart;
            // console.log(chosenDepartment);
          }
        })
        connection.query('INSERT INTO emprole SET ?',
        [
          {title : answer.departmentrole,
            salary : answer.salary,
            dept_id : chosenDepartment.id

          }
        ], (err)=>{
          if (err) throw err;
          console.log("role " + answer.departmentrole + ' is added to '+ answer.department + ' with salary of $' + answer.salary)
        }
        )
        viewRoles();
      })
    })
  }
  // ----------------next function----------------
  
  // Function to  update employee role.
  function updateRole(){
    connection.query('SELECT * FROM employee', (err, response)=>{
      if (err) throw err;
      inquirer.prompt([
        {
          name : 'employee',
          type: 'rawlist',
          choices(){
            const employeeList = [];
              for (let i = 0; i < response.length; i++) {
                employeeList.push(response[i].first_name + ' ' + response[i].last_name)
              }
              return employeeList; 
          },
          message: 'which employee role you want to update?'
        }
    ]).then((answer)=>{
      let chosenEmployee;
      response.forEach((employee)=>{
        if (employee.first_name + ' ' + employee.last_name === answer.employee) {
          chosenEmployee = employee;  
        }
      })
      console.log(chosenEmployee.id);
        let employeeId = chosenEmployee.id;
      connection.query('SELECT * FROM emprole', (err, results)=>{
        inquirer.prompt([
          {
            name:'employeeRole',
            type: 'rawlist',
            choices(){
            const roleArray = [];
            results.forEach(({title})=>{
              roleArray.push(title);
            })
            return roleArray;
            },
            message:'Which role you want to assign?'
          }
        ]).then((answer)=>{
            let chosenrole;
            results.forEach((role)=>{
              if (role.title === answer.employeeRole) {
                chosenrole = role;
              }
            })

            connection.query(
              'UPDATE employee SET ? Where ?',
              [
                {
                  role_id : chosenrole.id
                },
                {
                  id : employeeId
                },
              ],(err)=>{
                if(err) throw err;
              
              console.log('Employee role is updated')
              }
             
            )
            gettable();
        })
      })
      
      
    })
    })
  } 