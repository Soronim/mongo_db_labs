module.exports = {
  async up(db, client) {
    await db.createCollection("game_pages", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "release_date", "companies"],
          properties: {
            title: { bsonType: "string" },
            description: { bsonType: "string" },
            release_date: { bsonType: "date" },
            companies: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["company_id", "role_id"],
                properties: {
                  company_id: { bsonType: "objectId" },
                  role_id: { bsonType: "objectId" }
                }
              }
            }
          }
        }
      }
    });


    const developerRole = await db.collection("roles_of_companies").findOne({ role_name: "Разработчик" });
    const publisherRole = await db.collection("roles_of_companies").findOne({ role_name: "Издатель" });

    
    const companies = {
      cdProjektRed: await db.collection("companies").findOne({ company_name: "CD Projekt Red" }),
      naughtyDog: await db.collection("companies").findOne({ company_name: "Naughty Dog" }),
      rockstar: await db.collection("companies").findOne({ company_name: "Rockstar Games" }),
      ubisoft: await db.collection("companies").findOne({ company_name: "Ubisoft" }),
      ea: await db.collection("companies").findOne({ company_name: "Electronic Arts" }),
      activision: await db.collection("companies").findOne({ company_name: "Activision" }),
      miHoYo: await db.collection("companies").findOne({ company_name: "miHoYo" }),
      mojang: await db.collection("companies").findOne({ company_name: "Mojang Studios" }),
      innerSloth: await db.collection("companies").findOne({ company_name: "InnerSloth" }),
      sony: await db.collection("companies").findOne({ company_name: "Sony Interactive Entertainment" }) 
    };

    // Проверяем, что все компании найдены
    for (const [key, company] of Object.entries(companies)) {
      if (!company) throw new Error(`Не найдена компания: ${key}`);
    }

    await db.collection("game_pages").insertMany([
      
      { 
        title: "The Last of Us Part 2", 
        description: "Постапокалиптический экшен", 
        release_date: new Date("2020-06-19"),
        companies: [
          { company_id: companies.naughtyDog._id, role_id: developerRole._id },
          { company_id: companies.sony._id, role_id: publisherRole._id } // Исправлено
        ]
      },
      { 
        title: "The Witcher 3", 
        description: "Ролевая игра в открытом мире", 
        release_date: new Date("2015-05-19"),
        companies: [
          { company_id: companies.cdProjektRed._id, role_id: developerRole._id },
          { company_id: companies.cdProjektRed._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "Cyberpunk 2077", 
        description: "Футуристическая RPG", 
        release_date: new Date("2020-12-10"),
        companies: [
          { company_id: companies.cdProjektRed._id, role_id: developerRole._id },
          { company_id: companies.cdProjektRed._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "Red Dead Redemption 2", 
        description: "Приключенческий вестерн", 
        release_date: new Date("2018-10-26"),
        companies: [
          { company_id: companies.rockstar._id, role_id: developerRole._id },
          { company_id: companies.rockstar._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "The Last of Us Part 2", 
        description: "Постапокалиптический экшен", 
        release_date: new Date("2020-06-19"),
        companies: [
          { company_id: companies.naughtyDog._id, role_id: developerRole._id },
          { company_id: companies.sony._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "Assassin's Creed Valhalla", 
        description: "Исторический экшен", 
        release_date: new Date("2020-11-10"),
        companies: [
          { company_id: companies.ubisoft._id, role_id: developerRole._id },
          { company_id: companies.ubisoft._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "FIFA 22", 
        description: "Футбольный симулятор", 
        release_date: new Date("2021-10-01"),
        companies: [
          { company_id: companies.ea._id, role_id: developerRole._id },
          { company_id: companies.ea._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "Call of Duty: Warzone", 
        description: "Боевой шутер", 
        release_date: new Date("2020-03-10"),
        companies: [
          { company_id: companies.activision._id, role_id: developerRole._id },
          { company_id: companies.activision._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "Genshin Impact", 
        description: "Игра с открытым миром", 
        release_date: new Date("2020-09-28"),
        companies: [
          { company_id: companies.miHoYo._id, role_id: developerRole._id },
          { company_id: companies.miHoYo._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "Minecraft", 
        description: "Песочница с кубической графикой", 
        release_date: new Date("2011-11-18"),
        companies: [
          { company_id: companies.mojang._id, role_id: developerRole._id },
          { company_id: companies.ea._id, role_id: publisherRole._id }
        ]
      },
      { 
        title: "Among Us", 
        description: "Мультиплеерная социальная игра", 
        release_date: new Date("2018-06-15"),
        companies: [
          { company_id: companies.innerSloth._id, role_id: developerRole._id },
          { company_id: companies.innerSloth._id, role_id: publisherRole._id }
        ]
      }
    ]);
  },
  async down(db, client) {
    await db.collection("game_pages").drop();
  }
};