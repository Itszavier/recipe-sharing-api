<!-- @format -->

Using a JSON file is a great way to start. Here’s how you can structure and manage your data in a JSON file while keeping it scalable for a future upgrade to a database.

---

### **1. JSON File Structure**

Create a JSON file named `recipes.json` with the following structure:

```json
{
  "recipes": [
    {
      "id": "1",
      "title": "Spaghetti Carbonara",
      "description": "A classic Italian pasta dish with a creamy egg-based sauce.",
      "image": "https://example.com/images/carbonara.jpg",
      "mealType": "Dinner",
      "cuisine": "Italian",
      "dietaryInfo": {
        "isVegetarian": false,
        "isVegan": false,
        "isGlutenFree": false
      },
      "prepTime": 10,
      "cookTime": 20,
      "servings": 4,
      "ingredients": [
        {
          "name": "Spaghetti",
          "quantity": "400g"
        },
        {
          "name": "Eggs",
          "quantity": "4"
        },
        {
          "name": "Parmesan cheese",
          "quantity": "100g"
        },
        {
          "name": "Pancetta",
          "quantity": "150g"
        },
        {
          "name": "Black pepper",
          "quantity": "to taste"
        }
      ],
      "instructions": [
        "Cook the spaghetti in boiling salted water until al dente.",
        "In a bowl, whisk the eggs with grated Parmesan cheese.",
        "Fry the pancetta in a skillet until crispy.",
        "Drain the spaghetti and toss with the pancetta.",
        "Remove from heat, then stir in the egg mixture. Season with black pepper and serve immediately."
      ],
      "tags": ["Pasta", "Quick", "Italian"],
      "source": "https://example.com/carbonara-recipe",
      "video": "https://youtube.com/watch?v=example"
    },
    {
      "id": "2",
      "title": "Vegetable Stir Fry",
      "description": "A quick and easy vegetable stir fry with a savory sauce.",
      "image": "https://example.com/images/stirfry.jpg",
      "mealType": "Lunch",
      "cuisine": "Asian",
      "dietaryInfo": {
        "isVegetarian": true,
        "isVegan": true,
        "isGlutenFree": true
      },
      "prepTime": 15,
      "cookTime": 10,
      "servings": 2,
      "ingredients": [
        {
          "name": "Broccoli",
          "quantity": "200g"
        },
        {
          "name": "Carrots",
          "quantity": "2"
        },
        {
          "name": "Bell peppers",
          "quantity": "2"
        },
        {
          "name": "Soy sauce",
          "quantity": "2 tbsp"
        },
        {
          "name": "Garlic",
          "quantity": "2 cloves"
        }
      ],
      "instructions": [
        "Heat oil in a large skillet or wok over medium heat.",
        "Add garlic and sauté until fragrant.",
        "Add all the vegetables and stir-fry for 5-7 minutes.",
        "Pour soy sauce over the vegetables and toss to combine.",
        "Serve hot with rice or noodles."
      ],
      "tags": ["Quick", "Healthy", "Vegan"],
      "source": "https://example.com/stirfry-recipe",
      "video": "https://youtube.com/watch?v=example2"
    }
  ]
}
```

---

### **2. Managing the JSON File**

- **File Location**: Store the `recipes.json` file in your project directory.
- **Read Operations**: Use a file reading library to access and parse the JSON data in your app.
- **Write Operations**: Use the same library to add or update data (e.g., adding a new recipe).

---

### **3. Transition to a Database**

When you're ready to upgrade to a database, this JSON structure can easily be migrated. Here’s how:

1. **Database Type**:

   - Use a relational database like **PostgreSQL** or **MySQL** if you want strong relationships (e.g., linking recipes to categories or users).
   - Use a NoSQL database like **MongoDB** for a more flexible, JSON-like schema.

2. **Migration Plan**:

   - Read the JSON file in your app.
   - Write a script to insert the data into the database, using tools like an ORM (e.g., Sequelize for SQL databases or Mongoose for MongoDB).

3. **Schema Example**:
   - For a relational database:
     - `recipes` table for main recipe data.
     - `ingredients` table for ingredients linked by `recipe_id`.
   - For MongoDB:
     - Store each recipe as a document with embedded arrays for ingredients and instructions.

---

### **4. Tools to Work with JSON**

- **Node.js**: Use the `fs` module for reading/writing the JSON file.
- **JSON Server**: A lightweight tool to create a fake REST API directly from the JSON file for testing.

Let me know if you need help with coding the file handling or transitioning to a database!

## Oauth2 App id

```prisma
model App {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  clientId     String   @unique
  clientSecret String   @unique
  scopes       String[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```
