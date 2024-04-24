
/*added cms column*/ 


CREATE TABLE `cms` (
  `id` int(11) NOT NULL,
  `pageKey` varchar(50) NOT NULL DEFAULT '',
  `pageTitle` varchar(50) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) 

ALTER TABLE `cms`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `cms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT