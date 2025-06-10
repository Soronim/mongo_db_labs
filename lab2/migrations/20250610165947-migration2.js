module.exports = {
  async up(db, client) {
    await db.createCollection("roles_of_companies", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["role_name"],
          properties: {
            role_name: {
              bsonType: "string",
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-'’]+$",
              description: "Название роли компании"
            }
          }
        }
      }
    });

    await db.collection("roles_of_companies").createIndex(
      { role_name: 1 },
      { unique: true, collation: { locale: "en", strength: 2 } }
    );

    await db.collection("roles_of_companies").insertMany([
      { role_name: "Разработчик" },
      { role_name: "Издатель" }
    ]);
  },

  async down(db, client) {
    await db.collection("roles_of_companies").drop();
  }
};