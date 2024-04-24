

ALTER TABLE `users` ADD `language` VARCHAR(15) NOT NULL 

ALTER TABLE `users` ADD `chatSessionPrice` DECIMAL(10,2) NOT NULL

ALTER TABLE `users` ADD `voiceSessionPrice` DECIMAL(10,2) NOT NULL AFTER `chatSessionPrice`, ADD `videoSessionPrice` DECIMAL(10,2) NOT NULL AFTER `voiceSessionPrice`;

ALTER TABLE `users` ADD `gender` ENUM('0','1','2','3') NOT NULL DEFAULT '0' COMMENT '0:Default,1:Male,2:Female,3:Others'