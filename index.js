const mysql = require('mysql');
const consoletable = require('console.table');
const inquirer = require('inquirer')
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port, if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
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
 // connection.end();
  
});
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
  }
  })

  
}
initialize();
// function gettable to bring all the tables and joining them with the query.
function gettable (){
  connection.query(`SELECT e.id, e.first_name, e.last_name, emprole.title, emprole.salary, department.dptname AS department,
  concat(m.first_name, ' ', m.last_name) AS manager FROM employee AS e  LEFT JOIN employee AS m ON e.manager_id = m.id 
  INNER JOIN emprole ON e.role_id = emprole.id INNER JOIN department ON emprole.dept_id = department.id`,
  (err, res) => {
    if (err) throw err;
    console.log(consoletable.getTable(res))
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
            name : 'latName',
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
          console.log(answer)
          let chosenrole;
           results.forEach((item) => {
            if (item.title === answer.choice) {
              chosenrole = item;
            }
           });
          console.log(chosenrole.dept_id)
   


      if (answer.choice != '') {
        connection.query('SELECT * FROM employee', (err, response) =>{
          if (err) {
            throw err
          }
        //console.log(response);
          inquirer.prompt([
            {
              type: "list",
              name : 'manager',
            
              choices(){
                const choicea = [];
                console.log(response.length);
               for (let i = 0; i < response.length; i++) {
                 console.log(response[i]);
                 if (response[i].role_id == 7) {
                    choicea.push(response[i].first_name + ' ' + response[i].last_name)
                  
                 }
                 return choicea; 
               }
               
              },
              message: 'Who is the manager of this employee?',
            }
          ])
        })
      }
    });

})

}