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
              pattern: "^[A-Za-zА-Яа-яЁё0-9][A-Za-zА-Яа-яЁё0-9\\s\\-\\.'&]+$"
            },
            country: {
              bsonType: "string",
              pattern: "^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё '’-]+$",
              minLength: 3
            }
          }
        }
      }
    });

    await db.collection("companies").insertMany([
      { company_name: "CD Projekt Red", country: "Польша" },
      { company_name: "Naughty Dog", country: "США" },
      { company_name: "Rockstar Games", country: "США" },
      { company_name: "Ubisoft", country: "Франция" },
      { company_name: "Electronic Arts", country: "США" },
      { company_name: "Activision", country: "США" },
      { company_name: "miHoYo", country: "Китай" },
      { company_name: "Mojang Studios", country: "Швеция" },
      { company_name: "InnerSloth", country: "США" },
      { company_name: "Sony Interactive Entertainment", country: "Япония" } 
    ]);
  },
  async down(db, client) {
    await db.collection("companies").drop();
  }
};