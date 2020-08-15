-- This SQL script includes SQL commands to create a database and access
-- user on your local local MySQL DBMS. It can be either executed with
-- either MySQL Workbench or MySQL Command Line Client. For more information
-- on how to download, install and config MySQL DBMS, head over to:
--    https://www.mysql.com/
--
-- @author: Hoang

-- STEP 1 [DEVELOPMENT]: Create a database, and a user through which our
-- Node.js app is going to access the database.

-- Show all databases currently exist
-- (so that we can decide a new unduplicated database name)
show databases;

-- Create a new database
create database online_shopping;

-- Create a user
create user 'node_app_user'@'localhost' identified by 'ThePassword';

-- Give all privileges to the new user on the newly created database
grant all on online_shopping.* to 'node_app_user'@'localhost';

use online_shopping;

-- Drop existing tables and re-create them
DROP TABLE IF EXISTS `online_shopping`.`products`;
DROP TABLE IF EXISTS `online_shopping`.`users`;

CREATE TABLE `online_shopping`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
)
ENGINE=InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARSET=utf8
COMMENT = 'Holds user accounts data';

CREATE TABLE `online_shopping`.`products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `price` DOUBLE NOT NULL,
  `description` TEXT NOT NULL,
  `imageUrl` VARCHAR(255) NOT NULL,
  `UserId` INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`UserId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARSET = utf8
COMMENT = 'Saves products data';

show tables;




-- STEP 2 [DEPLOYMENT]: Change security priviliges from the 'node_app_user'@'localhost'
-- before exposing the app to users (when the app is in production)

-- Revoke all the priviliges from the user associated with our Node.js app.
revoke all on db_example.* from 'node_app_user'@'localhost';

-- Now the Node.js app cannot do anything in the database.
-- We don't want that, so we allow the Node.js app to do CRUD operations.
grant select, insert, delete, update on db_example.* to 'node_app_user'@'localhost';
