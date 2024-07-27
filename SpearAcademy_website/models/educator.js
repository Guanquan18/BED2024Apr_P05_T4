const sql = require("mssql");
const dbConfig = require("../config/dbConfig");


class Educator {
    constructor(eduId, professionalTitle, organisation, highestDegree, yearsOfExperience, fieldOfStudy){
        this.EduId = eduId;
        this.ProfessionalTitle = professionalTitle;
        this.Organisation = organisation;
        this.HighestDegree = highestDegree;
        this.YearsOfExperience = yearsOfExperience;
        this.FieldOfStudy = fieldOfStudy;
    }

    static async createEducator(eduId, newEducatorData) {
        

        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Educator (EducatorId, ProfessionalTitle, Organisation, HighestDegree, YearsOfExperience, FieldOfStudy) 
                         VALUES (@eduId, @professionalTitle, @organisation, @highestDegree, @yearsOfExperience, @fieldOfStudy);
                         SELECT * FROM Educator WHERE EducatorId = @eduId;`;
                
        const request = connection.request();
        request.input("eduId",sql.SmallInt, eduId);
        request.input("professionalTitle", newEducatorData.professionalTitle);
        request.input("organisation", newEducatorData.organisation);
        request.input("highestDegree", newEducatorData.highestDegree);
        request.input("yearsOfExperience", newEducatorData.yearsOfExperience);
        request.input("fieldOfStudy", newEducatorData.fieldOfStudy);

        const result = await request.query(sqlQuery);
        const row = result.recordset[0];

        connection.close();

        return new Educator(
            row.EduId, 
            row.Organisation, 
            row.ProfessionalTitle, 
            row.YearsOfExperience, 
            row.FieldOfStudy, 
            row.HighestDegree
        );
    }

    static async getEducatorById(eduId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Educator WHERE EducatorId = @eduId`;
        const request = connection.request();
        request.input("eduId", eduId);

        const result = await request.query(sqlQuery);

        connection.close();

        const row = result.recordset[0];

        return row
            ? new Educator(
                row.EduId, 
                row.ProfessionalTitle, 
                row.Organisation, 
                row.HighestDegree, 
                row.YearsOfExperience, 
                row.FieldOfStudy
            )
            : null;
    }

    static async updateEducator(eduId, newEducatorData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Educator 
                          SET ProfessionalTitle = @professionalTitle, Organisation = @organisation, HighestDegree = @highestDegree, YearsOfExperience = @yearsOfExperience, FieldOfStudy = @fieldOfStudy
                          WHERE EducatorId = @eduId;
                          SELECT * FROM Educator WHERE EducatorId = @eduId;`;

        const request = connection.request();
        request.input("eduId", sql.SmallInt, eduId);
        request.input("professionalTitle", newEducatorData.professionalTitle);
        request.input("organisation", newEducatorData.organisation);
        request.input("highestDegree", newEducatorData.highestDegree);
        request.input("yearsOfExperience", newEducatorData.yearsOfExperience);
        request.input("fieldOfStudy", newEducatorData.fieldOfStudy);

        const result = await request.query(sqlQuery);
        const row = result.recordset[0];

        connection.close();

        return new Educator(
            row.EduId, 
            row.ProfessionalTitle, 
            row.Organisation, 
            row.HighestDegree, 
            row.YearsOfExperience, 
            row.FieldOfStudy
        );
    }
}

module.exports = Educator;