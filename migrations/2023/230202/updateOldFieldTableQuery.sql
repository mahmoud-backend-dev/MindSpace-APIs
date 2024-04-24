/* Update Isactive  field  users table */



ALTER TABLE `users` CHANGE `isActive` `isActive` ENUM('0','1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '0:Pending ,1 : Active, 2 : inComplete,3 : Declined';