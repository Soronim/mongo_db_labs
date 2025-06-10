module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nickname", "email", "password"],
          properties: {
            nickname: {
              bsonType: "string",
              minLength: 3,
              maxLength: 30,
              pattern: "^[a-zA-Z0-9_]+$",
              description: "Уникальное имя пользователя (только буквы, цифры и подчеркивание)"
            },
            email: {
              bsonType: "string",
              pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
              description: "Электронная почта пользователя"
            },
            password: {
              bsonType: "string",
              minLength: 8,
              pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]{8,}$",
              description: "Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и специальные символы (@$!%*?&)"
            }
          }
        }
      }
    });

    // Создаем индексы с collation для регистронезависимости
    await db.collection("users").createIndex(
      { email: 1 }, 
      { 
        unique: true,
        collation: {
          locale: 'en',
          strength: 2
        }
      }
    );
    
    await db.collection("users").createIndex(
      { nickname: 1 }, 
      { 
        unique: true,
        collation: {
          locale: 'en',
          strength: 2
        }
      }
    );

    await db.collection("users").insertMany([
      { nickname: "ivan123", email: "ivan@example.com", password: "Password123!" },
      { nickname: "petr_the_great", email: "petr@example.com", password: "SecurePass#2023" },
      { nickname: "ann_sid", email: "anna@example.com", password: "AnnaPass$777" },
      { nickname: "maria_kuz", email: "maria@example.com", password: "MariaKuz@2024" },
      { nickname: "alex_smirnoff", email: "alex@example.com", password: "AlexSm!rnov99" },
      { nickname: "elena_volk", email: "elena@example.com", password: "VolkovaElena_1" },
      { nickname: "dmitry_f", email: "dmitry@example.com", password: "Dm!tryFedor0v" },
      { nickname: "olga_moroz", email: "olga@example.com", password: "Moroz0lga#2024" },
      { nickname: "sergey_vas", email: "sergey@example.com", password: "VasilSergey%5" },
      { nickname: "natalia_p", email: "natalia@example.com", password: "Pavlov@Nat123" }
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("users").drop();
  }
};