
/*added languages column*/ 


CREATE TABLE `languages` (
  `id` int(11) NOT NULL,
  `languageName` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
)


ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `languages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;