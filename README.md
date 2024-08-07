# Restaurant API

This is an Express.js API for managing a restaurant's menu, gallery, contact information, reviews, and more.

## Endpoints

### Homepage

- **GET `/homepage`**
  - **Description**: Retrieves the homepage data including image sliders and introductory text.

### Menu

- **GET `/menu`**
  - **Description**: Retrieves the food menu, breakfast menu, and cocktail menu.

- **POST `/menu`**
  - **Description**: Adds a new menu item. Checks if an item with the same name already exists.
  - **Request Body**:
    ```json
    {
      "name": "Spaghetti Carbonara",
      "image": "https://example.com/images/spaghetti-carbonara.jpg",
      "details": "Classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
      "ingredients": ["Spaghetti", "Eggs", "Cheese", "Pancetta", "Pepper"],
      "price": 13.99,
      "offer": false,
      "offerPrice": 0,
      "type": "Main Course",
      "promotionalLine": "Experience the taste of Italy!",
      "available": true,
      "category": "Food"
    }
    ```

### About Us

- **GET `/about`**
  - **Description**: Retrieves the restaurant's about information.

### Photo Gallery

- **GET `/gallery`**
  - **Description**: Retrieves the photo gallery.

### Contact and Location

- **GET `/contact`**
  - **Description**: Retrieves the contact information and location.

### Customer Reviews and Testimonials

- **GET `/reviews`**
  - **Description**: Retrieves customer reviews and testimonials.

- **POST `/reviews`**
  - **Description**: Adds a new customer review.
  - **Request Body**:
    ```json
    {
      "name": "John Doe",
      "review": "Amazing food and great service!",
      "rating": 5
    }
    ```

### Social Media Integration

- **GET `/social`**
  - **Description**: Retrieves the restaurant's social media links.

## Running the Server

1. Install dependencies:
   ```sh
   npm install
2.start the server:
   npm run dev