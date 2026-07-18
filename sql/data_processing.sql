-- Employee Table Structure
CREATE TABLE employees (
    Name VARCHAR(50),
    Position VARCHAR(50),
    Join_Date DATE,
    Release_Date DATE,
    Year_of_Experience FLOAT,
    Salary INT
);

-- Insert sample data into employees table
INSERT INTO employees (Name, Position, Join_Date, Release_Date, Year_of_Experience, Salary) VALUES
('Jacky', 'Solution Architect', '2018-07-25', '2022-07-25', 8, 150),
('John', 'Assistant Manager', '2016-02-02', '2021-02-02', 12, 155),
('Alano', 'Manager', '2010-11-09', NULL, 14, 175),
('Aaron', 'Engineer', '2021-08-16', '2022-08-16', 1, 80),
('Allen', 'Engineer', '2024-06-06', NULL, 4, 75),
('Peter', 'Team Leader', '2020-01-09', NULL, 3, 85);

-- 1. Add new employee named Albert
INSERT INTO employees (Name, Position, Join_Date, Release_Date, Year_of_Experience, Salary)
VALUES ('Albert', 'Engineer', '2024-01-24', NULL, 2.5, 50);

-- 2. Update all employees salary for Engineer position
UPDATE employees
SET Salary = 85
WHERE Position = 'Engineer';

-- 3. SUM Total Expense 2021
SELECT SUM(Salary) AS Total_Salary_2021
FROM employees
WHERE Join_Date <= '2021-12-31' AND (Release_Date IS NULL OR Release_Date >= '2021-01-01');

-- 4. Show All employees for longest experience
SELECT * FROM employees
ORDER BY year_of_experience DESC
LIMIT 3;

-- 5. Subquery for employee position Engineer that have experience less than 3 years
SELECT * 
FROM employees 
WHERE name IN (
    SELECT name 
    FROM employees
    WHERE position = 'Engineer' AND year_of_experience <= 3
);