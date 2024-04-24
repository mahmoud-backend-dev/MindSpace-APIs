

/*added deviceId column in users table*/



ALTER TABLE `users` ADD `deviceId` TEXT NOT NULL AFTER `deviceToken`;