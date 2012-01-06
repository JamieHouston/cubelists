CREATE DATABASE TagList;

GRANT ALL PRIVILEGES
ON TagList.*
TO 'intellagent_demo'@'localhost'
IDENTIFIED BY 'intellagent_demo'
WITH GRANT OPTION;

GRANT ALL PRIVILEGES
ON TagList.*
TO 'intellagent_demo'@'%'
IDENTIFIED BY 'intellagent_demo'
WITH GRANT OPTION;

USE TagList;

CREATE TABLE Users(
	ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	UserName VARCHAR(50) NOT NULL,
	Email VARCHAR(100),
	Password VARCHAR(50)
	);
	
CREATE TABLE List (
         ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         Title VARCHAR(100) NOT NULL,
		 CreatedByUserId INT,
		CreateDate TIMESTAMP DEFAULT NOW(),
		ModifiedDate TIMESTAMP
       );
	   
CREATE TABLE SharedList(
	ListID INT NOT NULL,
	UserID INT NOT NULL,
	Permissions INT NOT NULL
	);
	
CREATE TABLE ListItem(
	ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	ListID INT NOT NULL,
	Title VARCHAR(50) NOT NULL,
	Description VARCHAR(50),
	Complete TINYINT(1) NOT NULL DEFAULT 0,
	Sort INT,
	CreatedByUserId INT,
	CreateDate TIMESTAMP DEFAULT NOW(),
	ModifiedDate TIMESTAMP
	);