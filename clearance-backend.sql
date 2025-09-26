-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for clearance-backend
CREATE DATABASE IF NOT EXISTS `clearance-backend` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `clearance-backend`;

-- Dumping structure for table clearance-backend.clearance_items
CREATE TABLE IF NOT EXISTS `clearance_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` bigint unsigned NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taskName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `assignedTo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completedBy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completedAt` timestamp NULL DEFAULT NULL,
  `signature` text COLLATE utf8mb4_unicode_ci,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clearance_items_employee_id_foreign` (`employee_id`),
  CONSTRAINT `clearance_items_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table clearance-backend.clearance_items: ~7 rows (approximately)
INSERT INTO `clearance_items` (`id`, `employee_id`, `department`, `taskName`, `description`, `status`, `assignedTo`, `completedBy`, `completedAt`, `signature`, `remarks`, `created_at`, `updated_at`) VALUES
	(82, 15, 'hr', 'Final Pay Calculation', 'Calculate final salary and benefits', 'completed', NULL, 'HR Manager', '2025-09-25 17:28:39', 'HHSD', 'SDHS', '2025-09-25 17:26:48', '2025-09-25 17:28:39'),
	(83, 15, 'hr', 'Exit Interview', 'Conduct exit interview and documentation', 'pending', NULL, NULL, NULL, NULL, NULL, '2025-09-25 17:26:48', '2025-09-25 17:26:48'),
	(84, 15, 'it', 'System Access Revocation', 'Revoke all system access', 'pending', NULL, NULL, NULL, NULL, NULL, '2025-09-25 17:26:48', '2025-09-25 17:26:48'),
	(85, 15, 'it', 'Equipment Return', 'Return IT equipment', 'pending', NULL, NULL, NULL, NULL, NULL, '2025-09-25 17:26:48', '2025-09-25 17:26:48'),
	(86, 15, 'team_leader', 'Project Handover', 'Hand over ongoing projects', 'pending', NULL, NULL, NULL, NULL, NULL, '2025-09-25 17:26:48', '2025-09-25 17:26:48'),
	(87, 15, 'engineering_auxiliary', 'Company ID Return', 'Return company ID badge and removed from access list', 'pending', NULL, NULL, NULL, NULL, NULL, '2025-09-25 17:26:48', '2025-09-25 17:26:48'),
	(88, 15, 'engineering_auxiliary', 'Headset Return', 'Return headset and other equipment', 'pending', NULL, NULL, NULL, NULL, NULL, '2025-09-25 17:26:48', '2025-09-25 17:26:48');

-- Dumping structure for table clearance-backend.employees
CREATE TABLE IF NOT EXISTS `employees` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ntlogin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `temporary_password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resignationDate` date NOT NULL,
  `status` enum('in_clearance','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'in_clearance',
  `createdBy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employees_employeeid_unique` (`employeeId`),
  UNIQUE KEY `employees_ntlogin_unique` (`ntlogin`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table clearance-backend.employees: ~1 rows (approximately)
INSERT INTO `employees` (`id`, `name`, `employeeId`, `ntlogin`, `temporary_password`, `department`, `resignationDate`, `status`, `createdBy`, `created_at`, `updated_at`) VALUES
	(15, 'Joshua C. Grijaldo', '0123-38009', 'jcgrijaldo', 'On32Eu1H', 'IT', '2025-09-01', 'in_clearance', NULL, '2025-09-25 17:26:48', '2025-09-25 17:26:48');

-- Dumping structure for table clearance-backend.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table clearance-backend.migrations: ~3 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(2, '2025_09_25_002857_create_employees_table', 2),
	(3, '2025_09_25_002906_create_clearance_items_table', 2);

-- Dumping structure for table clearance-backend.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table clearance-backend.personal_access_tokens: ~0 rows (approximately)

-- Dumping structure for table clearance-backend.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `ntlogin` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'employee',
  `time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table clearance-backend.users: ~9 rows (approximately)
INSERT INTO `users` (`id`, `name`, `username`, `ntlogin`, `email`, `password`, `role`, `time`) VALUES
	(1, 'Super Admin', 'superadmin', NULL, NULL, NULL, 'super_admin', NULL),
	(2, 'HR Manager', 'hr', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', 'hr', NULL),
	(3, 'IT Manager', 'it', NULL, NULL, NULL, 'it', NULL),
	(4, 'Team Leader', 'teamlead', NULL, NULL, NULL, 'team_leader', NULL),
	(5, 'Engineer', 'engineering', NULL, NULL, NULL, 'engineering_auxiliary', NULL),
	(6, 'Facilities', 'facilities', NULL, NULL, NULL, 'admin_facilities', NULL),
	(7, 'Account', 'account', NULL, NULL, NULL, 'account_coordinator', NULL),
	(8, 'Operations', 'operations', NULL, NULL, NULL, 'operations_manager', NULL),
	(9, 'John Doe', 'jdoe', 'jcgrijaldo', NULL, '5f4dcc3b5aa765d61d8327deb882cf99', 'employee', NULL);

-- Dumping structure for table clearance-backend.users_accounts
CREATE TABLE IF NOT EXISTS `users_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `ntlogin` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'employee',
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table clearance-backend.users_accounts: ~10 rows (approximately)
INSERT INTO `users_accounts` (`id`, `name`, `username`, `ntlogin`, `email`, `password`, `role`, `timestamp`) VALUES
	(1, 'Super Admin', 'superadmin', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '8', NULL),
	(2, 'HR', 'hr', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '1', NULL),
	(3, 'IT', 'it', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '2', NULL),
	(4, 'TL', 'teamlead', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '3', NULL),
	(5, 'EAS', 'engineering', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '4', NULL),
	(6, 'Facilities', 'facilities', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '5', NULL),
	(7, 'AC', 'account', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '6', NULL),
	(8, 'OM', 'operations', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '7', NULL),
	(9, 'Employee', 'employee', NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', '9', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
