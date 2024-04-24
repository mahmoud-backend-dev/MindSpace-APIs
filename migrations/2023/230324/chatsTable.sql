
/** CHAT TABLE */ 

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `message` text NOT NULL,
  `readStatus` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) 

ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `receiverId` (`receiverId`);


ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`);
COMMIT;



/** CHAT MASTER */ 


CREATE TABLE `chat_masters` (
  `id` int(11) NOT NULL,
  `loginUserId` int(11) NOT NULL,
  `chatUserId` int(11) NOT NULL,
  `inChat` tinyint(1) NOT NULL DEFAULT 0,
  `consultationFlag` tinyint(1) NOT NULL DEFAULT 0,
  `scheduleDateTime` varchar(250) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) 


ALTER TABLE `chat_masters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loginUserId` (`loginUserId`),
  ADD KEY `chatUserId` (`chatUserId`);


ALTER TABLE `chat_masters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `chat_masters`
  ADD CONSTRAINT `chat_masters_ibfk_1` FOREIGN KEY (`loginUserId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `chat_masters_ibfk_2` FOREIGN KEY (`chatUserId`) REFERENCES `users` (`id`);
COMMIT;



/** NEW FIELDS FOR USER TABLE */

ALTER TABLE `users` ADD `activeAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `socketId`;

ALTER TABLE `users` ADD `socketId` TEXT NULL DEFAULT NULL AFTER `activeAt`;