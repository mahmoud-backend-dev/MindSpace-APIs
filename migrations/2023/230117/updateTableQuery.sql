/* Added notification ,reason field*/

 
ALTER TABLE `users` ADD `isNotification` tinyint(1) NOT NULL , ADD `reason` VARCHAR(255) NOT NULL;


/* Added image field */

ALTER TABLE `therapies` ADD `image` VARCHAR(255) NOT NULL ;

