/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - You are about to alter the column `status` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'USER', 'TUTOR', 'GUARDIAN') NOT NULL DEFAULT 'USER',
    MODIFY `status` ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `tutors` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NULL,
    `profileCompleted` INTEGER NULL,
    `resume` VARCHAR(191) NULL,
    `profileStatus` ENUM('LOCKED', 'UNLOCKED') NOT NULL DEFAULT 'LOCKED',
    `phoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `fathersName` VARCHAR(191) NULL,
    `mothersName` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `emergencyContactPersonName` VARCHAR(191) NULL,
    `emergencyPhoneNumber` VARCHAR(191) NULL,
    `emergencyRelation` VARCHAR(191) NULL,
    `emergencyAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tutors_userId_key`(`userId`),
    UNIQUE INDEX `tutors_tutorId_key`(`tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `degree` ENUM('SSC_O_LEVEL', 'HSC_A_LEVEL', 'DIPLOMA', 'BACHELOR', 'HONOURS', 'MASTERS', 'DOCTORATE') NOT NULL,
    `instituteName` VARCHAR(191) NOT NULL,
    `medium` VARCHAR(191) NULL,
    `group` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `semester` VARCHAR(191) NULL,
    `year` VARCHAR(191) NULL,
    `result` VARCHAR(191) NOT NULL,
    `passingYear` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TuitionPreference` (
    `id` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `availabilityFrom` VARCHAR(191) NOT NULL,
    `availabilityTo` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `preferredLocation` VARCHAR(191) NULL,
    `expectedSalary` DOUBLE NULL,
    `tuitionStyle` ENUM('ONE_TO_ONE', 'ONE_TO_MANY', 'ONLINE') NULL,
    `placeOfTuition` ENUM('MY_HOME', 'STUDENT_HOME', 'ONLINE') NULL,

    UNIQUE INDEX `TuitionPreference_tutorId_key`(`tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreferredSubject` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `tuitionPreferenceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreferredClass` (
    `id` VARCHAR(191) NOT NULL,
    `className` VARCHAR(191) NOT NULL,
    `tuitionPreferenceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `totalExperience` INTEGER NOT NULL,
    `experienceDetails` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IdentityDocument` (
    `id` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `fileType` ENUM('SSC_MARKSHEET', 'SSC_CERTIFICATE', 'HSC_MARKSHEET', 'HSC_CERTIFICATE', 'NID', 'PASSPORT', 'BIRTH_CERTIFICATE', 'ADMISSION_SLIP', 'UNIVERSITY_ID', 'CERTIFICATE', 'OTHERS') NOT NULL,
    `front_url` VARCHAR(191) NOT NULL,
    `back_url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tutors` ADD CONSTRAINT `tutors_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TuitionPreference` ADD CONSTRAINT `TuitionPreference_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreferredSubject` ADD CONSTRAINT `PreferredSubject_tuitionPreferenceId_fkey` FOREIGN KEY (`tuitionPreferenceId`) REFERENCES `TuitionPreference`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreferredClass` ADD CONSTRAINT `PreferredClass_tuitionPreferenceId_fkey` FOREIGN KEY (`tuitionPreferenceId`) REFERENCES `TuitionPreference`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IdentityDocument` ADD CONSTRAINT `IdentityDocument_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `tutors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
