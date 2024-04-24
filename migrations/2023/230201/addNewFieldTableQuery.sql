/* new field add for users table */


ALTER TABLE `users` ADD `isSuspend` BOOLEAN NOT NULL DEFAULT FALSE AFTER `reason`;

ALTER TABLE `users` ADD `suspendReason` VARCHAR(255) NULL AFTER `isSuspend`;

ALTER TABLE `users` ADD `suspendSubject` VARCHAR(255) NULL AFTER `suspendReason`;

