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
              pattern: "^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\\s\\-/'’.+,]{2,}$",
              minLength: 3,
              maxLength: 50,
              description: "Название роли (3-50 символов). Должно начинаться с буквы. Может содержать: буквы, цифры, пробелы, дефисы, слэши, апострофы, точки и запятые."
            }
          }
        }
      }
    });

    // Регистронезависимый уникальный индекс
    await db.collection("roles_of_companies").createIndex(
      { role_name: 1 },
      { 
        unique: true,
        collation: {
          locale: "en",
          strength: 2,
          caseFirst: "off"
        }
      }
    );

    // Примеры ролей
    await db.collection("roles_of_companies").insertMany([
      { role_name: "Разработчик" },
      { role_name: "Издатель" }
    ]);
  },

  async down(db, client) {
    await db.collection("roles_of_companies").drop();
  }
};