const db = require('../config/db');

exports.isAdmin = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;

        const query = `SELECT r.role_name FROM user_roles ur JOIN roles r ON ur.role_id = r.role_id WHERE ur.user_id = ?`;

        const [rows] = await db.execute(query, [user_id]);

        if(rows.length === 0 || rows[0].role_name !== 'admin') {
            return res.status(403).json({
                message: 'Access Denied. Admin Only'
            });
        }

        next();
    }catch (err) {
        res.status(500).json({
            message: 'Server error',
            err: err.message
        });
    }
};