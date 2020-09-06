-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE TABLE `currencyData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currency` varchar(10) NOT NULL,
  `ether` varchar(20) NOT NULL,
  `usd` varchar(50) NOT NULL,
  `eur` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `currencyData` (`id`, `currency`, `ether`, `usd`, `eur`) VALUES
(1,	'ether',	'1',	'336',	'323');

CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userAddress` varchar(50) NOT NULL,
  `upline` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `userId` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `level` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `matrix` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `transactionHash` varchar(100) NOT NULL,
  `response` text NOT NULL,
  `message` text NOT NULL,
  `transactionType` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `loginType` varchar(20) NOT NULL DEFAULT 'metamask',
  `amount` varchar(10) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `transactions` (`id`, `userAddress`, `upline`, `userId`, `level`, `matrix`, `transactionHash`, `response`, `message`, `transactionType`, `loginType`, `amount`, `created_at`) VALUES
(1231,	'',	'',	'',	'',	'',	'1',	'',	'',	'',	'metamask',	'0',	'2020-08-25 09:27:19'),
(1236,	'0x1207A14Ad91dB14204b73D17b271bA567dEDaa9D',	'0x6787Aa160CE8f512DBf2B7Ed47D389cF0eDF818d',	'1',	'1',	'1',	'0xde4804e79df1a167b7426565e1121b2b2a98586a3934ab522b2b7cc3cb41f4d1',	'',	'success',	'Auto Registration',	'auto',	'0.025',	'2020-07-23 09:36:49'),
(1237,	'0x1207A14Ad91dB14204b73D17b271bA567dEDaa9D',	'0x6787Aa160CE8f512DBf2B7Ed47D389cF0eDF818d',	'1',	'1',	'2',	'0xde4804e79df1a167b7426565e1121b2b2a98586a3934ab522b2b7cc3cb41f4d1',	'',	'success',	'Auto Registration',	'auto',	'0.025',	'2020-07-23 09:36:49');

-- 2020-08-26 11:34:38
