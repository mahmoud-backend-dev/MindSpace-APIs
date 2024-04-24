ALTER TABLE `employmenthistory` ADD `professionalId` INT(11) NOT NULL AFTER `userId`

ALTER TABLE `employmenthistory` ADD KEY `professionalId` (`professionalId`);



RENAME TABLE `mindscape`.`assignRoleResources` TO `mindscape`.`assign_role_resources`;

RENAME TABLE `mindscape`.`bankdetails` TO `mindscape`.`bank_details`;


RENAME TABLE `mindscape`.`employmentHistory` TO `mindscape`.`employment_histories`;

RENAME TABLE `mindscape`.`roleResources` TO `mindscape`.`role_resources`;

RENAME TABLE `mindscape`.`userEducationalDetails` TO `mindscape`.`user_educational_details`;

RENAME TABLE `mindscape`.`userTherapies` TO `mindscape`.`user_therapies`;


ALTER TABLE `certifications` ADD `documentType` VARCHAR(50) NOT NULL AFTER `userId`;

ALTER TABLE `certifications` CHANGE `government` `document` VARCHAR(50)  NULL DEFAULT '';

DROP TABLE `mindscape`.`user_educational_details`