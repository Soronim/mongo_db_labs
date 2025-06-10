const { MongoClient, ObjectId } = require('mongodb'); // Добавлен ObjectId
const readline = require('readline');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "base";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName);
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

// CRUD Operations
async function RoleCreate(db) {
  try {
    const roleName = await askQuestion("Введите название роли: ");
    
    // Предварительная проверка ввода
    if (roleName.length < 3) {
      console.log("\nОшибка: название роли должно содержать минимум 3 символа");
      return;
    }
    
    if (/^[0-9\W]/.test(roleName)) {
      console.log("\nОшибка: название роли не может начинаться с цифры или специального символа");
      console.log("Первый символ должен быть буквой");
      return;
    }
    
    if (!/^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\s\-/'’.+,]{2,}$/.test(roleName)) {
      console.log("\nОшибка: название содержит недопустимые символы");
      console.log("Можно использовать: буквы, цифры, пробелы, дефисы, слэши, апострофы, точки и запятые");
      console.log("Пример правильного названия: 'AR/VR разработчик' или 'Со-издатель'");
      return;
    }
    
    const result = await db.collection("roles_of_companies").insertOne({
      role_name: roleName
    });
    
    console.log(`\nРоль создана с ID: ${result.insertedId}`);
  } catch (err) {
    if (err.code === 11000) {
      console.log("\nОшибка: роль с таким названием уже существует");
      console.log("Попробуйте другое название");
    } else if (err.code === 121) {
      console.log("\nОшибка валидации названия роли");
      console.log("Требования:");
      console.log("- Минимум 3 символа");
      console.log("- Начинается с буквы");
      console.log("- Без запрещенных символов");
    } else {
      console.log("\nНеожиданная ошибка при создании роли:", err.message);
    }
  }
}

async function RoleRetrieveAll(db) {
  try {
    const roles = await db.collection("roles_of_companies").find().toArray();
    
    if (roles.length === 0) {
      console.log("Роли не найдены");
      return;
    }
    
    console.log("Список всех ролей:");
    roles.forEach(role => {
      console.log(`ID: ${role._id}, Название: ${role.role_name}`);
    });
  } catch (err) {
    console.log("Ошибка при получении ролей:", err.message);
  }
}

async function RoleRetrieve(db) {
  try {
    const roleId = await askQuestion("Введите ID роли: ");
    
    if (!ObjectId.isValid(roleId)) {
      console.log("Неверный формат ID. Должно быть 24 символа (например, 507f1f77bcf86cd799439011)");
      return;
    }
    
    const role = await db.collection("roles_of_companies").findOne({
      _id: new ObjectId(roleId)
    });
    
    if (!role) {
      console.log("Роль не найдена");
      return;
    }
    
    console.log(`ID: ${role._id}, Название: ${role.role_name}`);
  } catch (err) {
    console.log("Ошибка при получении роли:", err.message);
  }
}

async function RoleUpdate(db) {
  try {
    const roleId = await askQuestion("Введите ID роли для обновления: ");
    
    if (!ObjectId.isValid(roleId)) {
      console.log("\nОшибка: неверный формат ID");
      console.log("Должно быть 24 символа (например, 507f1f77bcf86cd799439011)");
      return;
    }

    const newRoleName = await askQuestion("Введите новое название роли: ");
    
    // Предварительная валидация нового названия
    if (newRoleName.length < 3) {
      console.log("\nОшибка: название роли должно содержать минимум 3 символа");
      return;
    }
    
    if (/^[0-9\W]/.test(newRoleName)) {
      console.log("\nОшибка: название роли не может начинаться с цифры или специального символа");
      console.log("Первый символ должен быть буквой");
      return;
    }
    
    if (!/^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\s\-/'’.+,]{2,}$/.test(newRoleName)) {
      console.log("\nОшибка: название содержит недопустимые символы");
      console.log("Можно использовать: буквы, цифры, пробелы, дефисы, слэши, апострофы, точки и запятые");
      console.log("Пример правильного названия: 'AR/VR разработчик' или 'Со-издатель'");
      return;
    }

    const result = await db.collection("roles_of_companies").updateOne(
      { _id: new ObjectId(roleId) },
      { $set: { role_name: newRoleName } }
    );
    
    if (result.matchedCount === 0) {
      console.log("\nРоль с указанным ID не найдена");
    } else if (result.modifiedCount === 0) {
      console.log("\nНазвание роли не было изменено (возможно, вы ввели то же самое название)");
    } else {
      console.log("\nРоль успешно обновлена");
    }
  } catch (err) {
    if (err.code === 11000) {
      console.log("\nОшибка: роль с таким названием уже существует");
      console.log("Попробуйте другое название");
    } else if (err.code === 121) {
      console.log("\nОшибка валидации названия роли");
      console.log("Требования:");
      console.log("- Минимум 3 символа");
      console.log("- Начинается с буквы");
      console.log("- Без запрещенных символов");
    } else {
      console.log("\nНеожиданная ошибка при обновлении роли:", err.message);
    }
  }
}

async function RoleDelete(db) {
  try {
    const roleId = await askQuestion("Введите ID роли для удаления: ");
    
    const result = await db.collection("roles_of_companies").deleteOne({
      _id: new ObjectId(roleId)
    });
    
    if (result.deletedCount === 0) {
      console.log("Роль не найдена");
    } else {
      console.log("Роль успешно удалена");
    }
  } catch (err) {
    console.log("Ошибка при удалении роли:", err.message);
  }
}

async function RoleDeleteMany(db) {
  try {
    const roleIdsInput = await askQuestion("Введите ID ролей для удаления (через запятую или пробел): ");
    
    // Разделяем ввод по запятым или пробелам
    const inputIds = roleIdsInput.split(/[, ]+/);
    
    // Фильтруем и валидируем ID
    const validIds = [];
    const invalidIds = [];
    
    inputIds.forEach(id => {
      const trimmedId = id.trim();
      if (ObjectId.isValid(trimmedId)) {
        validIds.push(new ObjectId(trimmedId));
      } else if (trimmedId) {
        invalidIds.push(trimmedId);
      }
    });
    
    // Сообщаем о некорректных ID
    /*
    if (invalidIds.length > 0) {
      console.log(`\nНекорректные ID (игнорируются): ${invalidIds.join(', ')}`);
      console.log("Правильный формат: 24 символа (например, 507f1f77bcf86cd799439011)");
    }
    */
    // Если нет валидных ID
    if (validIds.length === 0) {
      console.log("Нет корректных ID для удаления");
      return;
    }
    
    // Удаляем только валидные ID
    const result = await db.collection("roles_of_companies").deleteMany({
      _id: { $in: validIds }
    });
    
    console.log(`\nУдалено ролей: ${result.deletedCount}`);
    
    
  } catch (err) {
    console.log("Ошибка при удалении ролей:", err.message);
  }
}

// Helper function
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// Main menu
async function mainMenu(db) {
  while (true) {
    console.log("\nМеню управления ролями компаний:");
    console.log("1. Создать роль");
    console.log("2. Показать все роли");
    console.log("3. Найти роль по ID");
    console.log("4. Обновить роль");
    console.log("5. Удалить роль");
    console.log("6. Удалить несколько ролей");
    console.log("0. Выход");
    
    const choice = await askQuestion("Выберите действие: ");
    
    switch (choice) {
      case '1':
        await RoleCreate(db);
        break;
      case '2':
        await RoleRetrieveAll(db);
        break;
      case '3':
        await RoleRetrieve(db);
        break;
      case '4':
        await RoleUpdate(db);
        break;
      case '5':
        await RoleDelete(db);
        break;
      case '6':
        await RoleDeleteMany(db);
        break;
      case '0':
        rl.close();
        await client.close();
        process.exit(0);
      default:
        console.log("Неверный выбор");
    }
  }
}

// Start application
(async function() {
  const db = await connectToDB();
  await mainMenu(db);
})();