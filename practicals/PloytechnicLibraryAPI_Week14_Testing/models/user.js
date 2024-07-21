const sql = require('mssql');
const dbConfig = require('../dbConfig');

class User {
    constructor(userId, userNname, passwordHash, role) {
        this.userId = userId;
        this.userNname = userNname;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    static async getUserByUsername(userName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE username = @userName`;

        const request = connection.request();
        request.input("userName", sql.VarChar(50), userName);

        const result = await request.query(sqlQuery);

        connection.close();

        const row = result.recordset[0];
        return row
            ? new User(
                row.user_id,
                row.username,
                row.passwordHash,
                row.role
            )
            : null; // Return null if no user found
    }

    static async registerUser(user) {
        
        // Extract the user properties
        const userName = user.username;
        const passwordHash = user.passwordHash;
        const role = user.role;

        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Users (username, passwordHash, role) VALUES (@userName, @passwordHash, @role)
                            select * from Users where user_id = SCOPE_IDENTITY()`;

        const request = connection.request();
        request.input("userName", sql.VarChar(50), userName);
        request.input("passwordHash", sql.VarChar(150), passwordHash);
        request.input("role", sql.VarChar(20), role);

        const result = await request.query(sqlQuery);

        connection.close();

        const row = result.recordset[0];
        return new User(
            row.user_id,
            row.userName,
            row.passwordHash,
            row.role
        );   
    }
}

module.exports = User;