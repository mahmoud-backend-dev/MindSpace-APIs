
CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `therapistId` int(11) NOT NULL COMMENT 'therapist id',
  `patientId` int(11) NOT NULL COMMENT 'patient id',
  `feedback` varchar(255) DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
)


ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
