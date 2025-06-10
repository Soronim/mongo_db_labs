module.exports = {
  async up(db, client) {
    await db.createCollection("reviews", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user_id", "game_id", "rating"],
          properties: {
            user_id: {
              bsonType: "objectId",
              description: "Ссылка на пользователя"
            },
            game_id: {
              bsonType: "objectId",
              description: "Ссылка на игру"
            },
            rating: {
              bsonType: "int",
              minimum: 1,
              maximum: 10,
              description: "Оценка игры (от 1 до 10)"
            }
          }
        }
      }
    });

    await db.collection("reviews").createIndex(
      { user_id: 1, game_id: 1 },
      { unique: true }
    );

    const users = await db.collection("users").find().toArray();
    const games = await db.collection("game_pages").find().toArray();

    await db.collection("reviews").insertMany([
      { user_id: users[0]._id, game_id: games[0]._id, rating: 10 },
      { user_id: users[0]._id, game_id: games[1]._id, rating: 8 },
      { user_id: users[0]._id, game_id: games[2]._id, rating: 9 },
      { user_id: users[1]._id, game_id: games[0]._id, rating: 9 },
      { user_id: users[1]._id, game_id: games[3]._id, rating: 10 },
      { user_id: users[1]._id, game_id: games[4]._id, rating: 7 },
      { user_id: users[2]._id, game_id: games[5]._id, rating: 8 },
      { user_id: users[2]._id, game_id: games[6]._id, rating: 6 },
      { user_id: users[2]._id, game_id: games[7]._id, rating: 9 },
      { user_id: users[3]._id, game_id: games[8]._id, rating: 10 },
      { user_id: users[3]._id, game_id: games[9]._id, rating: 8 },
      { user_id: users[3]._id, game_id: games[0]._id, rating: 9 },
      { user_id: users[4]._id, game_id: games[1]._id, rating: 7 },
      { user_id: users[4]._id, game_id: games[2]._id, rating: 10 },
      { user_id: users[4]._id, game_id: games[3]._id, rating: 8 },
      { user_id: users[5]._id, game_id: games[4]._id, rating: 7 },
      { user_id: users[5]._id, game_id: games[5]._id, rating: 9 },
      { user_id: users[5]._id, game_id: games[6]._id, rating: 6 },
      { user_id: users[6]._id, game_id: games[7]._id, rating: 8 },
      { user_id: users[6]._id, game_id: games[8]._id, rating: 10 },
      { user_id: users[6]._id, game_id: games[9]._id, rating: 7 },
      { user_id: users[7]._id, game_id: games[0]._id, rating: 9 },
      { user_id: users[7]._id, game_id: games[2]._id, rating: 10 },
      { user_id: users[7]._id, game_id: games[4]._id, rating: 8 },
      { user_id: users[8]._id, game_id: games[1]._id, rating: 7 },
      { user_id: users[8]._id, game_id: games[3]._id, rating: 9 },
      { user_id: users[8]._id, game_id: games[5]._id, rating: 8 },
      { user_id: users[9]._id, game_id: games[6]._id, rating: 6 },
      { user_id: users[9]._id, game_id: games[7]._id, rating: 9 },
      { user_id: users[9]._id, game_id: games[8]._id, rating: 10 }
    ]);
  },

  async down(db, client) {
    await db.collection("reviews").drop();
  }
};