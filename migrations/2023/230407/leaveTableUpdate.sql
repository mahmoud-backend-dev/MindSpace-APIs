ALTER TABLE `therapist_leave_days` CHANGE `leaveDate` `leaveStartDate` DATETIME NULL DEFAULT NULL;

ALTER TABLE `therapist_leave_days` ADD `leaveEndDate` DATETIME NULL DEFAULT NULL AFTER `leaveStartDate`;