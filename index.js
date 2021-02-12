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
        'add manager',
        'add role'
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
    case 'add manager' :addManager();
    break;
    case 'add role' : addRole();
  }
  }) 
}
initialize();
// function gettable to bring all the tables and joining them with the query.
function gettable (){ // query to connect all the table to show all the data.
  connection.query(`SELECT e.id, e.first_name, e.last_name, emprole.title, emprole.salary, department.dptname AS department,
  concat(m.first_name, ' ', m.last_name) AS manager FROM employee AS e  LEFT JOIN employee AS m ON e.manager_id = m.id 
  INNER JOIN emprole ON e.role_id = emprole.id INNER JOIN department ON emprole.dept_id = department.id`,
  (err, res) => {
    if (err) throw err;
    console.log(consoletable.getTable(res))
    initialize();
    connection.end();
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
              initialize();

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
        return 'Please provide the last name of the employee.';
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
    initialize();
  })
  }

  // ---------------------------- next function -----------------------
  // function to add role. 
  function addRole(){
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
        initialize();
      })
    })
  }