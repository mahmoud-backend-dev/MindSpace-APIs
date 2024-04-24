/* Appointment date data type change*/
ALTER TABLE `appointments` CHANGE `appointmentDate` `appointmentDate` DATE NULL DEFAULT NULL;

/*Added VOIP token Field*/
ALTER TABLE `users` ADD `voIpToken` TEXT NULL DEFAULT NULL AFTER `deviceToken`;
