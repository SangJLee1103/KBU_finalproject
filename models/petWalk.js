const Sequelize = require('sequelize');
const { associate } = require('./pet');

module.exports = class PetWalk extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            whetherToWork: {
                type: Sequelize.TINYINT,
                allowNull: false,
            },
            walkDate: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'PetWalk',
            tableName: 'petwalk',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.PetWalk.belongsTo(db.Pet, { foreignKey: 'petId', targetKey: 'id' });
    }
};
