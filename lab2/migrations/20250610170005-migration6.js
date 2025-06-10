module.exports = {
  async up(db, client) {
    await db.createCollection("game_companies", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["game_id", "company_id", "role_company_id"],
          properties: {
            game_id: {
              bsonType: "objectId",
              description: "Ссылка на игру"
            },
            company_id: {
              bsonType: "objectId",
              description: "Ссылка на компанию"
            },
            role_company_id: {
              bsonType: "objectId",
              description: "Ссылка на роль компании"
            }
          }
        }
      }
    });

    await db.collection("game_companies").createIndex(
      { game_id: 1, company_id: 1, role_company_id: 1 },
      { unique: true }
    );

    const games = await db.collection("game_pages").find().toArray();
    const companies = await db.collection("companies").find().toArray();
    const roles = await db.collection("roles_of_companies").find().toArray();

    await db.collection("game_companies").insertMany([
      { game_id: games[0]._id, company_id: companies[0]._id, role_company_id: roles[0]._id },
      { game_id: games[0]._id, company_id: companies[0]._id, role_company_id: roles[1]._id },
      { game_id: games[1]._id, company_id: companies[0]._id, role_company_id: roles[0]._id },
      { game_id: games[1]._id, company_id: companies[0]._id, role_company_id: roles[1]._id },
      { game_id: games[2]._id, company_id: companies[1]._id, role_company_id: roles[0]._id },
      { game_id: games[2]._id, company_id: companies[1]._id, role_company_id: roles[1]._id },
      { game_id: games[3]._id, company_id: companies[2]._id, role_company_id: roles[0]._id },
      { game_id: games[3]._id, company_id: companies[1]._id, role_company_id: roles[1]._id },
      { game_id: games[4]._id, company_id: companies[3]._id, role_company_id: roles[0]._id },
      { game_id: games[4]._id, company_id: companies[3]._id, role_company_id: roles[1]._id },
      { game_id: games[5]._id, company_id: companies[4]._id, role_company_id: roles[0]._id },
      { game_id: games[5]._id, company_id: companies[4]._id, role_company_id: roles[1]._id },
      { game_id: games[6]._id, company_id: companies[5]._id, role_company_id: roles[0]._id },
      { game_id: games[6]._id, company_id: companies[5]._id, role_company_id: roles[1]._id },
      { game_id: games[7]._id, company_id: companies[6]._id, role_company_id: roles[0]._id },
      { game_id: games[7]._id, company_id: companies[6]._id, role_company_id: roles[1]._id },
      { game_id: games[8]._id, company_id: companies[7]._id, role_company_id: roles[0]._id },
      { game_id: games[8]._id, company_id: companies[4]._id, role_company_id: roles[1]._id },
      { game_id: games[9]._id, company_id: companies[8]._id, role_company_id: roles[0]._id },
      { game_id: games[9]._id, company_id: companies[8]._id, role_company_id: roles[1]._id }
    ]);
  },

  async down(db, client) {
    await db.collection("game_companies").drop();
  }
};