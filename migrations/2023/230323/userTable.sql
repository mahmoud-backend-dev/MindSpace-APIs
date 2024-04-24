
ALTER TABLE `users` ADD `timezone` TEXT NOT NULL;



ALTER TABLE `appointments` CHANGE `appointmentDate` `appointmentDate` DATETIME NULL DEFAULT NULL;