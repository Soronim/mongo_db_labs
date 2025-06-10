module.exports = {
  async up(db, client) {
    await db.createCollection("companies", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["company_name", "country"],
          properties: {
            company_name: {
              bsonType: "string",
              pattern: "^[A-Za-zА-Яа-яЁё0-9][A-Za-zА-Яа-яЁё0-9\\s\\-\\.'&]+$",
              description: "Название компании"
            },
            country: {
              bsonType: "string",
              pattern: "^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё '’-]+$",
              minLength: 3,
              description: "Страна компании"
            }
          }
        }
      }
    });

    await db.collection("companies").createIndex(
      { company_name: 1, country: 1 },
      { unique: true, collation: { locale: "en", strength: 2 } }
    );

    await db.collection("companies").insertMany([
      { company_name: "CD Projekt Red", country: "Польша" },
      { company_name: "CD Projekt Red", country: "США" },
      { company_name: "Naughty Dog", country: "США" },
      { company_name: "Ubisoft", country: "Франция" },
      { company_name: "Electronic Arts", country: "США" },
      { company_name: "Activision", country: "США" },
      { company_name: "miHoYo", country: "Китай" },
      { company_name: "Mojang Studios", country: "Швеция" },
      { company_name: "InnerSloth", country: "США" },
      { company_name: "Valve", country: "США" }
    ]);
  },

  async down(db, client) {
    await db.collection("companies").drop();
  }
};