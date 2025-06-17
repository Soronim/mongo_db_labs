module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("reviews", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user_id", "game_id", "rating", "created_at"],
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
            },
            text: {
              bsonType: "string",
              maxLength: 2000,
              description: "Текст отзыва"
            }
          }
        }
      }
    });

    // Уникальный индекс - один пользователь может оставить только один отзыв на игру
    await db.collection("reviews").createIndex(
      { user_id: 1, game_id: 1 },
      { unique: true }
    );

    
    const users = await db.collection("users").find().sort({ nickname: 1 }).toArray();
    
    const games = await db.collection("game_pages").find().sort({ title: 1 }).toArray();

    
    

    
    await db.collection("reviews").insertMany([
      {
        user_id: users[0]._id,  
        game_id: games[0]._id,  
        rating: 10,
        text: "Лучшая RPG всех времен! Геральт - легенда."
        
      },
      {
        user_id: users[1]._id,  
        game_id: games[1]._id, 
        rating: 7,
        text: "Хорошая игра, но ожидал большего после такого ажиотажа."
        
      },
      {
        user_id: users[2]._id,  
        game_id: games[2]._id,  
        rating: 9,
        text: "Потрясающий сюжет и атмосфера Дикого Запада!"
        
      },
      {
        user_id: users[3]._id,  
        game_id: games[3]._id,  
        rating: 8,
        text: "Эмоционально тяжелая, но очень сильная история."
        
      },
      {
        user_id: users[4]._id,  
        game_id: games[4]._id,  
        rating: 8,
        text: "Отличный викинг-симулятор с красивыми пейзажами."
        
      },
      {
        user_id: users[5]._id,  
        game_id: games[5]._id,  
        rating: 6,
        text: "Стандартный ежегодный апдейт, ничего нового."
        
      },
      {
        user_id: users[6]._id,  
        game_id: games[6]._id,  
        rating: 9,
        text: "Лучший бесплатный шутер! Играю каждый вечер."
        
      },
      {
        user_id: users[7]._id,  
        game_id: games[7]._id,  
        rating: 10,
        text: "Обожаю этот мир и персонажей! Графика потрясающая."
       
      },
      {
        user_id: users[8]._id, 
        game_id: games[8]._id, 
        rating: 10,
        text: "Классика, в которую можно играть бесконечно."
        
      },
      {
        user_id: users[9]._id,  
        game_id: games[9]._id,  
        rating: 7,
        text: "Весело с друзьями, но быстро надоедает."
        
      }
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("reviews").drop();
  }
};