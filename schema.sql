DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department
 (
	  id INT NOT NULL AUTO_INCREMENT,
	  dptname VARCHAR(45) NULL,
	  PRIMARY KEY (id)
);
INSERT INTO department (dptname)
VALUES ('Engineering'), ('Human Resourse'), ('Cleaning'), ('Security'), ('R and D'), ('Finance'), ('Management');
CREATE TABLE emprole
 (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (dept_id) REFERENCES department(id)
);
INSERT INTO emprole ( title, salary, dept_id )
VALUES ('engineer', 170000, 1),
 ('recruiter', 100000, 2),
 ('cleaner', 30000, 3), 
 ('guard', 40000, 4),
 ('researcher', 120000, 5),
 ('Financing' , 100000, 6),
 ('manager', 120000, 7);
CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	PRIMARY KEY (id),
    role_id INT NOT NULL,
	FOREIGN KEY (role_id) REFERENCES emprole(id),
    manager_id INT,
	FOREIGN KEY (manager_id) REFERENCES employee (id)

);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('safal', 'ghimire', 7, null),
		('arjun', 'ghimire', 1, 1);