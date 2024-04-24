CREATE TABLE `contact_us` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL COMMENT 'patient id',
  `name` varchar(50) DEFAULT '',
  `email` varchar(50) DEFAULT '',
  `message` varchar(255) DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) 


ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `contact_us`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;