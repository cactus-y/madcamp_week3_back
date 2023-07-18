const { University } = require('./schema');

const createUniversity = async (data) => {
    const university = await University.create(data);
    return university;
};

const findUniversityByName = async (universityName) => {
    const university = await University.findOne({ "universityName": universityName });
    return university;
};

const findUniversityById = async (universityId) => {
    const university = await University.findById(universityId);
    return university;
};

const findAllUniversity = async () => {
    const universityList = await University.find();
    return universityList;
}

module.exports = {
    createUniversity,
    findUniversityByName,
    findUniversityById,
    findAllUniversity
};