

ALTER TABLE `users` ADD `isDeleted` TINYINT(1) NOT NULL DEFAULT '0' AFTER `activeAt`;
