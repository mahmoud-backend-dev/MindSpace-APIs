-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2023 at 12:51 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mindscape`
--

-- --------------------------------------------------------

--
-- Table structure for table `therapies`
--

CREATE TABLE `therapies` (
  `id` int(11) NOT NULL,
  `therapiName` varchar(50) DEFAULT '',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `therapies`
--

INSERT INTO `therapies` (`id`, `therapiName`, `createdAt`, `updatedAt`) VALUES
(1, 'Depression', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(2, 'P.T.S.D', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(3, 'Couples Therapy', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(4, 'Hypnotherapy', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(5, 'Postnatal Depression', '2023-01-03 07:22:02', '2023-01-03 07:22:02'),
(6, 'Schizophrenia', '2023-01-03 07:22:02', '2023-01-03 07:22:02'),
(7, 'OCD', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(8, 'Marriage Issues', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(9, 'Intervention', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(10, 'CBT', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(11, 'Self Esteem', '2023-01-03 07:22:02', '2023-01-03 07:22:02'),
(12, 'Existential therapy', '2023-01-03 07:22:02', '2023-01-03 07:22:02'),
(13, 'Eating Disorder', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(14, 'Ensomnia', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(15, 'Cognitive Therapy', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(16, 'Family Issues', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(17, 'Social Anxiety', '2023-01-03 07:22:02', '2023-01-03 07:22:02'),
(18, 'Speech Anxiety', '2023-01-03 07:22:02', '2023-01-03 07:22:02'),
(19, 'Intimacy Issues', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(20, 'Anxiety', '2023-01-03 07:18:03', '2023-01-03 07:18:03'),
(21, 'Phobias', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(22, 'Procrastination', '2023-01-03 07:19:46', '2023-01-03 07:19:46'),
(23, 'Physchoanalytic', '2023-01-03 07:22:02', '2023-01-03 07:22:02'),
(24, 'Biopolar Therapy', '2023-01-03 07:22:02', '2023-01-03 07:22:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `therapies`
--
ALTER TABLE `therapies`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `therapies`
--
ALTER TABLE `therapies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
