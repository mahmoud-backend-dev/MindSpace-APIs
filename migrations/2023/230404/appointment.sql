
/** APPOINTMENT  TABLE */ 

ALTER TABLE `appointments` ADD `serviceStatus` ENUM('0','1','2','3','4','5','6') NOT NULL DEFAULT '0' COMMENT '\"0: created,1: accepted,2: rejected_By_Therpiest, 3: completed,4: started,5: running,6: timeout \"' AFTER `status`;

ALTER TABLE `appointments` CHANGE `interactionType` `interactionType` ENUM('0','1','2') NOT NULL DEFAULT '0' COMMENT '0 : Text, 1 : Voice,2 : Video';