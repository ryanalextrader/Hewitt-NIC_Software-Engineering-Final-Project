-- MySQL Script generated by MySQL Workbench
-- Fri Apr 11 10:11:01 2025
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema hewitt
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema hewitt
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `hewitt` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
-- USE `hewitt` ;

-- -----------------------------------------------------
-- Table `hewitt`.`rubric`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`rubric` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `checkbox_text` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rubric_id` INT NOT NULL,
  `text` VARCHAR(255) NULL DEFAULT NULL,
  `order` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `rubric_id` (`rubric_id` ASC) VISIBLE,
  CONSTRAINT `category_ibfk_1`
    FOREIGN KEY (`rubric_id`)
    REFERENCES `hewitt`.`rubric` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rubric_id` INT NOT NULL,
  `text` VARCHAR(255) NULL DEFAULT NULL,
  `order` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `rubric_id` (`rubric_id` ASC) VISIBLE,
  CONSTRAINT `comment_ibfk_1`
    FOREIGN KEY (`rubric_id`)
    REFERENCES `hewitt`.`rubric` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`competition`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`competition` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `submission_due_date` DATE NULL DEFAULT NULL,
  `feedback_due_date` DATE NULL DEFAULT NULL,
  `rubric_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `rubric_id` (`rubric_id` ASC) VISIBLE,
  CONSTRAINT `competition_ibfk_1`
    FOREIGN KEY (`rubric_id`)
    REFERENCES `hewitt`.`rubric` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fname` VARCHAR(255) NULL DEFAULT NULL,
  `lname` VARCHAR(255) NULL DEFAULT NULL,
  `type` INT NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `pronouns` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `program` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`judge`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`judge` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `competition_id` INT NOT NULL,
  `min_grade_assigned` INT NULL DEFAULT NULL,
  `max_grade_assigned` INT NULL DEFAULT NULL,
  `time_zone` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `competition_id` (`competition_id` ASC) VISIBLE,
  CONSTRAINT `judge_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `hewitt`.`users` (`id`),
  CONSTRAINT `judge_ibfk_2`
    FOREIGN KEY (`competition_id`)
    REFERENCES `hewitt`.`competition` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comp_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `group_name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `comp_id` (`comp_id` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `group_ibfk_1`
    FOREIGN KEY (`comp_id`)
    REFERENCES `hewitt`.`competition` (`id`),
  CONSTRAINT `group_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `hewitt`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`submission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`submission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `problem_solved` VARCHAR(255) NULL DEFAULT NULL,
  `presentation_link` VARCHAR(255) NULL DEFAULT NULL,
  `youtube_link` VARCHAR(255) NULL DEFAULT NULL,
  `log_book_link` VARCHAR(255) NULL DEFAULT NULL,
  `image_for_judges` BLOB NULL DEFAULT NULL,
  `public_image` BLOB NULL DEFAULT NULL,
  `team_image` BLOB NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `group_id` (`group_id` ASC) VISIBLE,
  CONSTRAINT `submission_ibfk_1`
    FOREIGN KEY (`group_id`)
    REFERENCES `hewitt`.`group` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `judge_id` INT NOT NULL,
  `submission_id` INT NOT NULL,
  `box_checked` TINYINT(1) NULL DEFAULT NULL,
  `approved` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `judge_id` (`judge_id` ASC) VISIBLE,
  INDEX `submission_id` (`submission_id` ASC) VISIBLE,
  CONSTRAINT `feedback_ibfk_1`
    FOREIGN KEY (`judge_id`)
    REFERENCES `hewitt`.`judge` (`id`),
  CONSTRAINT `feedback_ibfk_2`
    FOREIGN KEY (`submission_id`)
    REFERENCES `hewitt`.`submission` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`long_answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`long_answer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rubric_id` INT NOT NULL,
  `prompt` VARCHAR(255) NULL DEFAULT NULL,
  `order` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `rubric_id` (`rubric_id` ASC) VISIBLE,
  CONSTRAINT `long_answer_ibfk_1`
    FOREIGN KEY (`rubric_id`)
    REFERENCES `hewitt`.`rubric` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`long_answer_feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`long_answer_feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `feedback_id` INT NOT NULL,
  `long_answer_id` INT NOT NULL,
  `text` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `feedback_id` (`feedback_id` ASC) VISIBLE,
  INDEX `long_answer_id` (`long_answer_id` ASC) VISIBLE,
  CONSTRAINT `long_answer_feedback_ibfk_1`
    FOREIGN KEY (`feedback_id`)
    REFERENCES `hewitt`.`feedback` (`id`),
  CONSTRAINT `long_answer_feedback_ibfk_2`
    FOREIGN KEY (`long_answer_id`)
    REFERENCES `hewitt`.`long_answer` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`participant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`participant` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `f_name` VARCHAR(255) NULL DEFAULT NULL,
  `l_name` VARCHAR(255) NULL DEFAULT NULL,
  `pronouns` VARCHAR(255) NULL DEFAULT NULL,
  `grade` VARCHAR(255) NULL DEFAULT NULL,
  `age` INT NULL DEFAULT NULL,
  `school` VARCHAR(255) NULL DEFAULT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `city` VARCHAR(255) NULL DEFAULT NULL,
  `state` VARCHAR(255) NULL DEFAULT NULL,
  `zip` VARCHAR(255) NULL DEFAULT NULL,
  `group_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `group_id` (`group_id` ASC) VISIBLE,
  CONSTRAINT `participant_ibfk_1`
    FOREIGN KEY (`group_id`)
    REFERENCES `hewitt`.`group` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`scale`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`scale` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rubric_id` INT NOT NULL,
  `max_score` INT NULL DEFAULT NULL,
  `min_text` VARCHAR(255) NULL DEFAULT NULL,
  `max_text` VARCHAR(255) NULL DEFAULT NULL,
  `prompt_text` VARCHAR(255) NULL DEFAULT NULL,
  `order` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `rubric_id` (`rubric_id` ASC) VISIBLE,
  CONSTRAINT `scale_ibfk_1`
    FOREIGN KEY (`rubric_id`)
    REFERENCES `hewitt`.`rubric` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `hewitt`.`scale_feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hewitt`.`scale_feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `feedback_id` INT NOT NULL,
  `scale_id` INT NOT NULL,
  `score` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `feedback_id` (`feedback_id` ASC) VISIBLE,
  INDEX `scale_id` (`scale_id` ASC) VISIBLE,
  CONSTRAINT `scale_feedback_ibfk_1`
    FOREIGN KEY (`feedback_id`)
    REFERENCES `hewitt`.`feedback` (`id`),
  CONSTRAINT `scale_feedback_ibfk_2`
    FOREIGN KEY (`scale_id`)
    REFERENCES `hewitt`.`scale` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Insert into rubric
INSERT INTO rubric (name, checkbox_text) VALUES
('Creativity', 'Innovative ideas presented'),
('Teamwork', 'Evidence of collaboration'),
('Impact', 'Potential real-world impact'),
('Presentation', 'Quality of presentation skills'),
('Research', 'Depth and rigor of research'),
('Design', 'Aesthetic quality of the project'),
('Feasibility', 'Project practicality'),
('Technical Skill', 'Demonstration of skills'),
('Originality', 'Uniqueness of approach'),
('Execution', 'Completion and polish');

-- Insert into category
INSERT INTO category (rubric_id, text, `order`) VALUES
(1, 'Original Concepts', 1),
(2, 'Communication Skills', 2),
(3, 'Community Benefit', 3),
(4, 'Speaking Clarity', 4),
(5, 'Research Thoroughness', 5),
(6, 'Design Elements', 6),
(7, 'Practicality Assessment', 7),
(8, 'Technical Achievement', 8),
(9, 'Creative Uniqueness', 9),
(10, 'Execution Quality', 10);

-- Insert into comment
INSERT INTO comment (rubric_id, text, `order`) VALUES
(1, 'Highly creative approach.', 1),
(2, 'Strong teamwork throughout.', 2),
(3, 'Impact is clear and measurable.', 3),
(4, 'Presentation was smooth.', 4),
(5, 'Research was thorough.', 5),
(6, 'Design was appealing.', 6),
(7, 'Project is feasible.', 7),
(8, 'Skills are evident.', 8),
(9, 'Very original work.', 9),
(10, 'Well executed project.', 10);

-- Insert into scale
INSERT INTO scale (rubric_id, max_score, min_text, max_text, prompt_text, `order`) VALUES
(1, 5, 'Poor', 'Excellent', 'Rate Creativity', 1),
(2, 5, 'Poor', 'Excellent', 'Rate Teamwork', 2),
(3, 5, 'Poor', 'Excellent', 'Rate Impact', 3),
(4, 5, 'Poor', 'Excellent', 'Rate Presentation', 4),
(5, 5, 'Poor', 'Excellent', 'Rate Research', 5),
(6, 5, 'Poor', 'Excellent', 'Rate Design', 6),
(7, 5, 'Poor', 'Excellent', 'Rate Feasibility', 7),
(8, 5, 'Poor', 'Excellent', 'Rate Technical Skill', 8),
(9, 5, 'Poor', 'Excellent', 'Rate Originality', 9),
(10, 5, 'Poor', 'Excellent', 'Rate Execution', 10);

-- Insert into long_answer
INSERT INTO long_answer (rubric_id, prompt, `order`) VALUES
(1, 'Describe the innovative aspect.', 1),
(2, 'Explain collaboration methods.', 2),
(3, 'Detail the potential impact.', 3),
(4, 'Evaluate presentation effectiveness.', 4),
(5, 'Summarize research conducted.', 5),
(6, 'Discuss design choices.', 6),
(7, 'Assess project feasibility.', 7),
(8, 'Comment on technical proficiency.', 8),
(9, 'Highlight original elements.', 9),
(10, 'Review execution and delivery.', 10);

-- Insert into competition
INSERT INTO competition (name, start_date, submission_due_date, feedback_due_date, rubric_id) VALUES
('Innovators Cup', '2025-04-01', '2025-04-10', '2025-04-20', 1),
('Collaboration Award', '2025-05-01', '2025-05-10', '2025-05-20', 2),
('Impact Initiative', '2025-06-01', '2025-06-10', '2025-06-20', 3),
('Presentation Masters', '2025-07-01', '2025-07-10', '2025-07-20', 4),
('Research Challenge', '2025-08-01', '2025-08-10', '2025-08-20', 5),
('Design Sprint', '2025-09-01', '2025-09-10', '2025-09-20', 6),
('Feasibility Hackathon', '2025-10-01', '2025-10-10', '2025-10-20', 7),
('Tech Skill Showcase', '2025-11-01', '2025-11-10', '2025-11-20', 8),
('Originality Expo', '2025-12-01', '2025-12-10', '2025-12-20', 9),
('Execution Summit', '2026-01-01', '2026-01-10', '2026-01-20', 10);

-- Insert into users
INSERT INTO users (fname, lname, type, email, pronouns, password, program) VALUES
('Anna', 'Smith', 3, 'anna@example.com', 'she/her', 'pass123', 'CS'),
('Ben', 'Miller', 2, 'ben@example.com', 'he/him', 'pass123', 'Data Science'),
('Clara', 'Wang', 1, 'clara@example.com', 'she/her', 'pass123', 'Math'),
('Derek', 'Johnson', 2, 'derek@example.com', 'he/him', 'pass123', 'Biology'),
('Elisa', 'Cruz', 1, 'elisa@example.com', 'she/her', 'pass123', 'Chemistry'),
('Frank', 'Nguyen', 2, 'frank@example.com', 'he/him', 'pass123', 'Physics'),
('Grace', 'Hernandez', 1, 'grace@example.com', 'she/her', 'pass123', 'Engineering'),
('Henry', 'Foster', 2, 'henry@example.com', 'he/him', 'pass123', 'Business'),
('Irene', 'Patel', 1, 'irene@example.com', 'she/her', 'pass123', 'Economics'),
('Jack', 'Li', 2, 'jack@example.com', 'he/him', 'pass123', 'Psychology');

-- Insert into `group`
INSERT INTO `group` (comp_id, user_id, group_name) VALUES
(1, 1, 'Team Alpha'),
(2, 2, 'Team Beta'),
(3, 3, 'Team Gamma'),
(4, 4, 'Team Delta'),
(5, 5, 'Team Epsilon'),
(6, 6, 'Team Zeta'),
(7, 7, 'Team Eta'),
(8, 8, 'Team Theta'),
(9, 9, 'Team Iota'),
(10, 10, 'Team Kappa');

-- Insert into participant
INSERT INTO participant (f_name, l_name, pronouns, grade, age, school, address, city, state, zip, group_id) VALUES
('Tom', 'Allen', 'he/him', '10', 15, 'Riverdale High', '123 Main St', 'Seattle', 'WA', '98101', 1),
('Sara', 'Baker', 'she/her', '11', 16, 'Springfield High', '456 Oak St', 'Portland', 'OR', '97201', 2),
('Noah', 'Cruz', 'they/them', '12', 17, 'Hill Valley High', '789 Pine St', 'San Francisco', 'CA', '94101', 3),
('Olivia', 'Diaz', 'she/her', '9', 14, 'Sunnydale High', '321 Cedar St', 'Denver', 'CO', '80201', 4),
('Liam', 'Evans', 'he/him', '10', 15, 'Hawkins High', '654 Birch St', 'Boise', 'ID', '83701', 5),
('Mia', 'Garcia', 'she/her', '11', 16, 'Riverdale High', '987 Spruce St', 'Seattle', 'WA', '98102', 6),
('Ethan', 'Hughes', 'he/him', '12', 17, 'Springfield High', '213 Elm St', 'Portland', 'OR', '97202', 7),
('Ava', 'Jung', 'they/them', '9', 14, 'Hill Valley High', '777 Maple St', 'San Francisco', 'CA', '94102', 8),
('Lucas', 'Kim', 'he/him', '10', 15, 'Sunnydale High', '888 Cedar Ave', 'Denver', 'CO', '80202', 9),
('Chloe', 'Lopez', 'she/her', '11', 16, 'Hawkins High', '999 Birch Ave', 'Boise', 'ID', '83702', 10);

-- Insert into submission
INSERT INTO submission (group_id, title, problem_solved, presentation_link, youtube_link, log_book_link) VALUES
(1, 'Eco Energy', 'Reduce carbon footprint', 'http://present1.com', 'http://youtube1.com', 'http://log1.com'),
(2, 'Virtual Classroom', 'Better remote education', 'http://present2.com', 'http://youtube2.com', 'http://log2.com'),
(3, 'Health Monitor', 'Track health stats', 'http://present3.com', 'http://youtube3.com', 'http://log3.com'),
(4, 'Urban Farming', 'Greener cities', 'http://present4.com', 'http://youtube4.com', 'http://log4.com'),
(5, 'Water Filter', 'Clean water access', 'http://present5.com', 'http://youtube5.com', 'http://log5.com'),
(6, 'AI Assistant', 'Help users organize', 'http://present6.com', 'http://youtube6.com', 'http://log6.com'),
(7, 'Traffic Optimizer', 'Reduce jams', 'http://present7.com', 'http://youtube7.com', 'http://log7.com'),
(8, 'Emergency Response App', 'Quicker help', 'http://present8.com', 'http://youtube8.com', 'http://log8.com'),
(9, 'Solar Tech', 'Boost solar efficiency', 'http://present9.com', 'http://youtube9.com', 'http://log9.com'),
(10, 'Mental Wellness App', 'Support mental health', 'http://present10.com', 'http://youtube10.com', 'http://log10.com');

-- Insert into judge
INSERT INTO judge (user_id, competition_id, min_grade_assigned, max_grade_assigned, time_zone) VALUES
(1, 1, 9, 12, 'PST'),
(2, 2, 9, 12, 'MST'),
(3, 3, 9, 12, 'CST'),
(4, 4, 9, 12, 'EST'),
(5, 5, 9, 12, 'PST'),
(6, 6, 9, 12, 'MST'),
(7, 7, 9, 12, 'CST'),
(8, 8, 9, 12, 'EST'),
(9, 9, 9, 12, 'PST'),
(10, 10, 9, 12, 'MST');

-- Insert into feedback
INSERT INTO feedback (judge_id, submission_id, box_checked, approved) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 1, 1),
(5, 5, 1, 1),
(6, 6, 1, 1),
(7, 7, 1, 1),
(8, 8, 1, 1),
(9, 9, 1, 1),
(10, 10, 1, 1);

-- Insert into scale_feedback
INSERT INTO scale_feedback (feedback_id, scale_id, score) VALUES
(1, 1, 4),
(2, 2, 5),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 4),
(7, 7, 5),
(8, 8, 3),
(9, 9, 4),
(10, 10, 5);

-- Insert into long_answer_feedback
INSERT INTO long_answer_feedback (feedback_id, long_answer_id, text) VALUES
(1, 1, 'Excellent innovation.'),
(2, 2, 'Effective teamwork.'),
(3, 3, 'Strong impact outlined.'),
(4, 4, 'Clear presentation.'),
(5, 5, 'Good research background.'),
(6, 6, 'Appealing design choices.'),
(7, 7, 'Feasibility well addressed.'),
(8, 8, 'Technical skills shown.'),
(9, 9, 'Very original idea.'),
(10, 10, 'Execution well delivered.');
