
/** CHAT TABLE */ 

ALTER TABLE `chats` ADD `sendBy` INT(11) NOT NULL AFTER `readStatus`;

ALTER TABLE `appointments` ADD `channelName` VARCHAR(255) NULL DEFAULT NULL AFTER `status`;