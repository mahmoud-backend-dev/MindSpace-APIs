/* change isBlock to 'isActive */


    ALTER TABLE `users` CHANGE `isBlock` `isActive` TINYINT(1) NOT NULL DEFAULT '1';


/* Added randomString column */
    ALTER TABLE `users` ADD `randomString` VARCHAR(255) NOT NULL;
