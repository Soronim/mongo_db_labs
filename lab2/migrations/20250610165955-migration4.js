module.exports = {
  async up(db, client) {
    await db.createCollection("game_pages", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "release_date"],
          properties: {
            title: {
              bsonType: "string",
              description: "Название игры"
            },
            description: {
              bsonType: "string",
              description: "Описание игры"
            },
            release_date: {
              bsonType: "date",
              description: "Дата выпуска игры"
            }
          }
        }
      }
    });

    await db.collection("game_pages").createIndex(
      { title: 1, release_date: 1 },
      { unique: true, collation: { locale: "en", strength: 2 } }
    );

    await db.collection("game_pages").insertMany([
      { title: "The Witcher 3", description: "Ролевая игра в открытом мире", release_date: new Date("2015-05-19") },
      { title: "Cyberpunk 2077", description: "Футуристическая RPG", release_date: new Date("2020-12-10") },
      { title: "Red Dead Redemption 2", description: "Приключенческий вестерн", release_date: new Date("2018-10-26") },
      { title: "The Last of Us Part 2", description: "Постапокалиптический экшен", release_date: new Date("2020-06-19") },
      { title: "Assassin's Creed Valhalla", description: "Исторический экшен", release_date: new Date("2020-11-10") },
      { title: "FIFA 22", description: "Футбольный симулятор", release_date: new Date("2021-10-01") },
      { title: "Call of Duty: Warzone", description: "Боевой шутер", release_date: new Date("2020-03-10") },
      { title: "Genshin Impact", description: "Игра с открытым миром", release_date: new Date("2020-09-28") },
      { title: "Minecraft", description: "Песочница с кубической графикой", release_date: new Date("2011-11-18") },
      { title: "Among Us", description: "Мультиплеерная социальная игра", release_date: new Date("2018-06-15") }
    ]);
  },

  async down(db, client) {
    await db.collection("game_pages").drop();
  }
};