-- Online Pharmacy Management System Database

CREATE DATABASE IF NOT EXISTS online_pharmacy_db;
USE online_pharmacy_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15)
);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
    medicine_id INT PRIMARY KEY AUTO_INCREMENT,
    medicine_name VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    expiry_date DATE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Sample customers
INSERT INTO users (name, email, password, phone_no) VALUES
('Rahul Kumar', 'rahul@example.com', '1234', '9876543210'),
('Anjali Sharma', 'anjali@example.com', '1234', '9876501234');

-- Sample medicines
INSERT INTO medicines (medicine_name, manufacturer, price, stock, expiry_date) VALUES
('Paracetamol 500mg', 'Sun Pharma', 25.00, 120, '2028-06-30'),
('Amoxicillin 250mg', 'Cipla', 85.50, 8, '2027-12-31'),
('Cetirizine 10mg', 'Dr. Reddys', 45.00, 60, '2028-03-15'),
('Vitamin C Tablets', 'Himalaya', 150.00, 35, '2027-09-20'),
('Cough Syrup', 'Abbott', 110.00, 5, '2027-05-10');

-- Sample orders
INSERT INTO orders (user_id, order_date, total_amount, status) VALUES
(1, CURDATE(), 175.00, 'Pending'),
(2, CURDATE(), 85.50, 'Processing');
