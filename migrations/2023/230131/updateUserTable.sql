ALTER TABLE `users` ADD `isAvailableOnSunday` BOOLEAN NOT NULL DEFAULT TRUE , 
ADD `isAvailableOnMonday` BOOLEAN NOT NULL DEFAULT TRUE AFTER `isAvailableOnSunday`,
 ADD `isAvailableOnTuesday` BOOLEAN NOT NULL DEFAULT TRUE AFTER `isAvailableOnMonday`,
  ADD `isAvailableOnWednesday` BOOLEAN NOT NULL DEFAULT TRUE AFTER `isAvailableOnTuesday`, 
  ADD `isAvailableOnThursday` BOOLEAN NOT NULL DEFAULT TRUE AFTER `isAvailableOnWednesday`,
   ADD `isAvailableOnFriday` BOOLEAN NOT NULL DEFAULT TRUE AFTER `isAvailableOnThursday`,
 ADD `isAvailableOnSaturday` BOOLEAN NOT NULL DEFAULT TRUE AFTER `isAvailableOnFriday`;




/*added joiUs column*/  

 ALTER TABLE `users` ADD `joinUs` BOOLEAN NOT NULL DEFAULT FALSE;