-- This SQL script is to populate the PRODUCTS table with some records for the purpose of
-- testing during the app development.
--
-- Use the following SQL insert statement to insert a new product data record
--   INSERT INTO `online_shopping`.`products` (`title`, `price`, `description`, `imageUrl`, `createdAt`, `updatedAt`, `userId`)
--   VALUES ('', '', '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, );
--
-- @author: Hoang


INSERT INTO `online_shopping`.`products` (`title`, `price`, `description`, `imageUrl`, `createdAt`, `updatedAt`, `userId`)
VALUES ('Book', 19.5, 'A great book',
  'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

INSERT INTO `online_shopping`.`products` (`title`, `price`, `description`, `imageUrl`, `createdAt`, `updatedAt`, `userId`)
VALUES ('Car', 6010, 'A new generation of engine with high speed!',
  'https://img.icons8.com/plasticine/2x/car.png',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

INSERT INTO `online_shopping`.`products` (`title`, `price`, `description`, `imageUrl`, `createdAt`, `updatedAt`, `userId`)
VALUES ('An Apple', 3.4, 'A sweet apple - you can make your own apple juice with it!',
  'https://png.pngtree.com/png-vector/20190522/ourlarge/pngtree-apple-icon-png-image_1059683.jpg',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

INSERT INTO `online_shopping`.`products` (`title`, `price`, `description`, `imageUrl`, `createdAt`, `updatedAt`, `userId`)
VALUES ('Refrigerator', 880.6, 'Keep your foods and drinks fresh!',
  'https://cdn3.iconfinder.com/data/icons/refrigerators-1/510/Refrigerator_fridge_open-512.png',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

SELECT * FROM online_shopping.products;
