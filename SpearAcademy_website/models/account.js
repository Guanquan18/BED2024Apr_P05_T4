const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Account {
    constructor(accId, fullName, dob, email, contactNo, passwordHash, role, photo, linkedIn){
        this.AccId = accId;
        this.FullName = fullName;
        this.DOB = dob;
        this.Email = email;
        this.ContactNo = contactNo;
        this.PasswordHash = passwordHash;
        this.role = role;
        this.Photo = photo;
        this.LinkedIn = linkedIn;
    }

    static async getAllAccounts() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Account`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();

        result.recordset.forEach(row => {
        return row
        ? new Account(
            row.AccId, 
            row.FullName || null, 
            row.DOB || null, 
            row.Email, 
            row.ContactNo || null, 
            row.PasswordHash, 
            row.role || null,
            row.Photo || null, 
            row.LinkedIn || null
        )
        : null;
        // Convert rows to Account objects
        });

        
    }
    
    static async getAccountById(accId) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Account WHERE AccId = @accId`;
    
        const request = connection.request();
        request.input("accId", sql.Int, accId);
    
        const result = await request.query(sqlQuery);
    
        connection.close();

        const row = result.recordset[0];

        return row
            ? new Account(
                row.AccId, 
                row.FullName || null, 
                row.DOB || null, 
                row.Email, 
                row.ContactNo || null, 
                row.PasswordHash,
                row.role || null,
                row.Photo || null, 
                row.LinkedIn || null
            )
            : null;
    }

    static async verifyAccount(email) {

        const connection = await sql.connect(dbConfig);
    
        let sqlQuery = `SELECT * FROM Account WHERE Email = @Email`;
        const request = connection.request();
        request.input("Email", sql.VarChar(100), email);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
        const row = result.recordset[0];
        
        return row
            ? new Account(
                row.AccId, 
                row.FullName, 
                row.DOB, 
                row.Email, 
                row.ContactNo, 
                row.PasswordHash,
                row.role || null, 
                row.Photo || null, 
                row.LinkedIn || null
            )
            : null;
    }
    
    static async createAccount(newAccountData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Account (Email, PasswordHash, Role) 
                            VALUES (@email, @passwordHash, @role) 
                            select * from Account where AccId = SCOPE_IDENTITY()`;
    
        const request = connection.request();
        request.input("email", newAccountData.email);
        request.input("passwordHash", newAccountData.passwordHash);
        request.input("role", newAccountData.role);
        
        const result = await request.query(sqlQuery);
        const row = result.recordset[0];
        
        connection.close();

        return new Account(
            row.AccId, 
            row.FullName || null, 
            row.DOB || null, 
            row.Email, 
            row.ContactNo|| null, 
            row.PasswordHash, 
            row.role,
            row.Photo|| null, 
            row.LinkedIn|| null
        );
    
    }

    static async updateAccount(accId, newAccountData) {
        const connection = await sql.connect(dbConfig);
    
        const request = connection.request();
        request.input("accId", sql.Int, accId);

        let query = [];
        
        if (newAccountData.fullName){
            request.input("fullName", newAccountData.fullName);
            query.push(`FullName = @fullName`);
        }
        if (newAccountData.dob){
            request.input("dob", sql.Date, newAccountData.dob);
            query.push(`DOB = @dob`);
        }
        if (newAccountData.contactNo){
            request.input("contactNo", newAccountData.contactNo);
            query.push(`ContactNo = @contactNo`);
        }
        if (newAccountData.role){
            request.input("role", newAccountData.role);
            query.push(`role = @role`);
        }
        if (newAccountData.PasswordHash){
            request.input("passwordHash", newAccountData.PasswordHash);
            query.push(`PasswordHash = @passwordHash`);
        }
        if (newAccountData.photo){
            request.input("photo", newAccountData.photo);
            query.push(`Photo = @photo`);
        }
        if (newAccountData.linkedIn){
            request.input("linkedIn", newAccountData.linkedIn);
            query.push(`LinkedIn = @linkedIn`);
        }

        const sqlQuery = `UPDATE Account 
                            SET ${query.join(`, `)}
                            WHERE AccId = @accId
                            select * from Account where AccId = @accId`;
        
    
        const result = await request.query(sqlQuery);
        const row = result.recordset[0];
    
        connection.close();
    
        return new Account(
            row.AccId, 
            row.FullName || null, 
            row.DOB || null, 
            row.Email, 
            row.ContactNo || null, 
            row.PasswordHash, 
            row.role || null,
            row.Photo || null, 
            row.LinkedIn || null
        );
    }
}

module.exports = Account;