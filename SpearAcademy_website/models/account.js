const sql = require("mssql");
const dbConfig = require("../config/dbConfig");
const { query } = require("express");

class Account {
    constructor(accId, fullName, dob, email, contactNo, passwordHash, Role, photo, linkedIn){
        this.AccId = accId;
        this.FullName = fullName;
        this.DOB = dob;
        this.Email = email;
        this.ContactNo = contactNo;
        this.PasswordHash = passwordHash;
        this.Role = Role;
        this.Photo = photo;
        this.LinkedIn = linkedIn;
    }

    static async getAllAccounts() {
        const connection = await sql.connect(dbConfig);
        try{
        
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
                    row.Role || null,
                    row.Photo || null, 
                    row.LinkedIn || null
                )
                : null; // Convert rows to Account objects
            });
        
        }catch(error){        
            throw error;
        }finally{
            connection.close();
        }        
    }
    
    static async getAccountById(accId) {
        const connection = await sql.connect(dbConfig);
        try{
        
            const sqlQuery = `SELECT * FROM Account WHERE AccId = @accId`;
        
            const request = connection.request();
            request.input("accId", sql.SmallInt, accId);
        
            const result = await request.query(sqlQuery);
            const row = result.recordset[0];
    
            return row
                ? new Account(
                    row.AccId, 
                    row.FullName || null, 
                    row.DOB || null, 
                    row.Email, 
                    row.ContactNo || null, 
                    row.PasswordHash,
                    row.Role || null,
                    row.Photo || null, 
                    row.LinkedIn || null
                )
                : null;

        }catch(error){
            throw error;
        }finally{
            connection.close();
        }
    }

    static async getAccountByEmail(email) {
        const connection = await sql.connect(dbConfig);
        try{
        
            const sqlQuery = `SELECT * FROM Account WHERE Email = @Email`;
        
            const request = connection.request();
            request.input("Email", email);
        
            const result = await request.query(sqlQuery);
            const row = result.recordset[0];
            
            return row
                ? new Account(
                    row.AccId, 
                    row.FullName || null, 
                    row.DOB || null, 
                    row.Email, 
                    row.ContactNo || null, 
                    row.PasswordHash, 
                    row.Role || null,
                    row.Photo || null, 
                    row.LinkedIn || null
                )
                : null;

        }catch(error){
            throw error;
        }finally{
            connection.close();
        }
    }

    static async verifyAccount(email) {
        const connection = await sql.connect(dbConfig);
        try{
        
            let sqlQuery = `SELECT * FROM Account WHERE Email = @Email`;
            const request = connection.request();
            request.input("Email", email);
        
            const result = await request.query(sqlQuery);
            const row = result.recordset[0];
            
            return row
                ? new Account(
                    row.AccId, 
                    row.FullName, 
                    row.DOB, 
                    row.Email, 
                    row.ContactNo, 
                    row.PasswordHash,
                    row.Role || null, 
                    row.Photo || null, 
                    row.LinkedIn || null
                )
                : null;

        }catch(error){
            throw error;
        }finally{
            connection.close();
        }
    }
    
    static async createAccount(newAccountData) {
        const connection = await sql.connect(dbConfig);
        try{
    
            const sqlQuery = `INSERT INTO Account (Email, PasswordHash, Role) 
                                VALUES (@email, @passwordHash, @role) 
                                select * from Account where AccId = SCOPE_IDENTITY()`;
        
            const request = connection.request();
            request.input("email", newAccountData.email);
            request.input("passwordHash", newAccountData.passwordHash);
            request.input("role", newAccountData.role);
            
            const result = await request.query(sqlQuery);
            const row = result.recordset[0];
    
            return new Account(
                row.AccId, 
                row.FullName || null, 
                row.DOB || null, 
                row.Email, 
                row.ContactNo|| null, 
                row.PasswordHash, 
                row.Role,
                row.Photo|| null, 
                row.LinkedIn|| null
            );

        }catch(error){
            throw error;
        }finally{
            connection.close();
        }
    }

    static async updateAccount(accId, newAccountData) {
        const connection = await sql.connect(dbConfig);
        try{
        
            const request = connection.request();
            request.input("accId", sql.SmallInt, accId);
    
            let query = [];
            
            if (newAccountData.fullName){
                request.input("fullName", newAccountData.fullName);
                query.push(`FullName = @fullName`);
            }
            if (newAccountData.dob){
                request.input("dob", sql.Date, newAccountData.dob.replace(/\//g, '-'));
                query.push(`DOB = @dob`);
            }
            if (newAccountData.contactNo){
                request.input("contactNo", newAccountData.contactNo);
                query.push(`ContactNo = @contactNo`);
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
        
            return new Account(
                row.AccId || null, 
                row.FullName || null, 
                row.DOB || null, 
                row.Email || null, 
                row.ContactNo || null, 
                row.PasswordHash || null, 
                row.Role || null,
                row.Photo || null, 
                row.LinkedIn || null
            );
        }catch(error){
            throw error;
        }finally{
            connection.close();
        }
    }

    static async resetPassword(identity, newHashedPassword) {
        const connection = await sql.connect(dbConfig);
        try{
            const request = connection.request();
            let query = [];

            if (!isNaN(identity)) {
                request.input("accId", sql.SmallInt, identity);
                query.push(`AccId = @accId`);
            }else {
                request.input("email", identity);
                query.push(`Email = @email`);
            }

            request.input("newPassword", newHashedPassword);

            const sqlQuery = `UPDATE Account 
                                SET PasswordHash = @newPassword
                                WHERE ${query}
                                
                                SELECT * FROM Account WHERE ${query}`;
        
            const result = await request.query(sqlQuery);
            const row = result.recordset[0];
    
            return row
                ? new Account(
                    row.AccId || null, 
                    row.FullName || null, 
                    row.DOB || null, 
                    row.Email || null, 
                    row.ContactNo || null, 
                    row.PasswordHash || null,
                    row.Role || null, 
                    row.Photo || null, 
                    row.LinkedIn || null
                )
                : null;

        }catch(error){
            throw error;
        }finally{
            connection.close();
        }
    }

    static async deleteAccount(accId) {
        const connection = await sql.connect(dbConfig);
        try{
        
            const request = connection.request();
            request.input("accId", sql.SmallInt, accId);
        
            const sqlQuery = `
                BEGIN TRANSACTION;
                    
                -- Delete from [Option] table
                DELETE o
                FROM [Option] o
                INNER JOIN Question qu ON o.Quiz_Option = qu.Quiz_Question
                INNER JOIN Quiz q ON qu.Section_Question = q.Section_Quiz
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
                    
                -- Delete from Question table
                DELETE qu
                FROM Question qu
                INNER JOIN Quiz q ON qu.Section_Question = q.Section_Quiz
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
                    
                -- Delete from Quiz table 
                DELETE q
                FROM Quiz q
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
                    
                -- Delete from SectionDetails table
                DELETE sd
                FROM SectionDetails sd
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
                    
                -- Delete from Review table
                DELETE r
                FROM Review r
                INNER JOIN Course c ON r.Review_Course = c.CourseId
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
                            
                    -- Delete from Message table
                    DELETE m
                FROM Message m
                INNER JOIN QnA qna ON m.Message_QnA = qna.QnAId
                INNER JOIN Course c ON qna.QnA_Course = c.CourseId
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
    
                -- Delete from QnA table
                DELETE qna
                FROM QnA qna
                INNER JOIN Course c ON qna.QnA_Course = c.CourseId
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
                    
                -- Delete from Course table
                DELETE c
                FROM Course c
                INNER JOIN Account a ON c.Creator = a.AccId
                WHERE a.AccId = 1;
    
                -- Delete from Educator Table
                DELETE e
                FROM Educator e
                INNER JOIN Account a ON e.EducatorId = a.AccId
                WHERE a.AccId = 1;
    
                -- Delete from Account Table
                DELETE a
                FROM Account a
                WHERE A.AccId = 1;
                    
                COMMIT TRANSACTION;
            `;
        
            const result = await request.query(sqlQuery);
            return result.rowsAffected.some(count => count > 0); // Return true if any rows were affected;
    
        }catch(error){
            throw error;
        }
        finally{
            connection.close();
        }
    }
}

module.exports = Account;