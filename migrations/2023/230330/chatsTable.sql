
/** CHAT TABLE */ 
ALTER TABLE `chats` ADD `messageType` ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '0 : text, 1 : image' AFTER `message`;