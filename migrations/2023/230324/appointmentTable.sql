
ALTER TABLE `appointments` CHANGE `slotStartTime` `slotStartTime` DATETIME NOT NULL;



ALTER TABLE `appointments` CHANGE `slotEndTime` `slotEndTime` DATETIME NOT NULL;

ALTER TABLE `appointments` CHANGE `appointmentDate` `appointmentDate` DATE NULL DEFAULT NULL;