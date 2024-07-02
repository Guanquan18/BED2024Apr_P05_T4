const sql = require("mssql");
const dbConfig = require("../dbConfig");
const Account = require("./account");

class Educator {
    constructor(eduId, professionalTitle, organisation, highestEducationQualification, yearsOfExperience, fieldOfStudy){
        this.EduId = eduId;
        this.ProfessionalTitle = professionalTitle;
        this.Organisation = organisation;
        this.HighestEducationQualification = highestEducationQualification;
        this.YearsOfExperience = yearsOfExperience;
        this.FieldOfStudy = fieldOfStudy;
    }

    static async createEducator(eduId, newEducatorData) {
        
        const existingEducator = await Account.getAccountById(newEducatorData.accId);
        
        if (existingEducator) {
            return null;
        }

        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Educator (EducatorId, ProfessionalTitle, Organisation, HighestDegree, YearsOfExperience, FieldOfStudy) 
                         VALUES (@eduId, @professionalTitle, @organisation, @highestDegree, @yearsOfExperience, @fieldOfStudy);
                         SELECT * FROM Educator WHERE EducatorId = @eduId;`;
                
        const request = connection.request();
        request.input("eduId", eduId);
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

}

module.exports = Educator;