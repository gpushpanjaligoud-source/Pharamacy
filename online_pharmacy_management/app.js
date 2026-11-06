// Online Pharmacy Management System
// Backend created using Node.js, Express.js and MySQL

const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456", // Change this if your MySQL root has a password
    database: "online_pharmacy_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully");
    }
});

// ---------------- MEDICINE APIs ----------------

// GET all medicines
app.get("/api/medicines", (req, res) => {
    db.query("SELECT * FROM medicines ORDER BY medicine_id DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Search medicines by name
app.get("/api/medicines/search/:name", (req, res) => {
    const search = `%${req.params.name}%`;
    db.query(
        "SELECT * FROM medicines WHERE medicine_name LIKE ?",
        [search],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// Add a medicine
app.post("/api/medicines", (req, res) => {
    const { medicine_name, manufacturer, price, stock, expiry_date } = req.body;
    const sql = `INSERT INTO medicines
        (medicine_name, manufacturer, price, stock, expiry_date)
        VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [medicine_name, manufacturer, price, stock, expiry_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Medicine added successfully", medicine_id: result.insertId });
    });
});

// Update a medicine
app.put("/api/medicines/:id", (req, res) => {
    const { medicine_name, manufacturer, price, stock, expiry_date } = req.body;
    const sql = `UPDATE medicines SET
        medicine_name = ?, manufacturer = ?, price = ?, stock = ?, expiry_date = ?
        WHERE medicine_id = ?`;

    db.query(
        sql,
        [medicine_name, manufacturer, price, stock, expiry_date, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Medicine updated successfully" });
        }
    );
});

// Delete a medicine
app.delete("/api/medicines/:id", (req, res) => {
    db.query("DELETE FROM medicines WHERE medicine_id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Medicine deleted successfully" });
    });
});

// ---------------- ORDER APIs ----------------

// View all orders with customer names
app.get("/api/orders", (req, res) => {
    const sql = `SELECT orders.*, users.name AS customer_name
                 FROM orders
                 LEFT JOIN users ON orders.user_id = users.user_id
                 ORDER BY order_id DESC`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Place a new order
app.post("/api/orders", (req, res) => {
    const { user_id, total_amount } = req.body;
    const sql = `INSERT INTO orders (user_id, order_date, total_amount, status)
                 VALUES (?, CURDATE(), ?, 'Pending')`;

    db.query(sql, [user_id, total_amount], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Order placed successfully", order_id: result.insertId });
    });
});

// Update order status
app.put("/api/orders/:id", (req, res) => {
    const { status } = req.body;

    db.query(
        "UPDATE orders SET status = ? WHERE order_id = ?",
        [status, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Order status updated successfully" });
        }
    );
});

// ---------------- DASHBOARD API ----------------

app.get("/api/dashboard", (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM medicines) AS totalMedicines,
            (SELECT COUNT(*) FROM medicines WHERE stock > 0) AS availableMedicines,
            (SELECT COUNT(*) FROM medicines WHERE stock > 0 AND stock <= 10) AS lowStock,
            (SELECT COUNT(*) FROM orders) AS totalOrders
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
