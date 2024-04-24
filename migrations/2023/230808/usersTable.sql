ALTER TABLE `users` ADD `workDaysDetailsFlag` TINYINT NOT NULL DEFAULT '0' AFTER `bankDetailsFlag`;

SELECT * FROM `users` WHERE `isActive` = '1';

/* UPDATE QUERY FOR ACTIVE USERS*/
UPDATE
    users u
JOIN therapist_work_days AS tw
ON
    u.id = tw.userId
SET
    `workDaysDetailsFlag` = 1
WHERE
    u.isActive = '1' AND u.personalDetailsFlag = '1' AND u.professionalFlag = '1' AND u.therapiesFlag = '1' AND u.certificationFlag = '1' AND u.bankDetailsFlag = '1' AND u.isDeleted = 0