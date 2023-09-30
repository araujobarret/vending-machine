import request from "supertest";
import mongoose from "mongoose";
import app, { server } from "../../app";
import { userModel } from "../../models/user";
import { productModel } from "../../models/product";
import { createPasswordHash } from "../../services/auth";

beforeEach(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI!);

  // Insert mock data into the database
  await userModel.create(mockBuyer);
  await productModel.create(mockProduct);
});

afterEach(async () => {
  // Disconnect from the test database and remove it
  server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /buy", () => {
  const getBearerToken = async () => {
    const login = await request(app).post("/login").send({
      email: mockBuyer.email,
      password: mockBuyer.password,
    });
    return `Bearer ${login.text}`;
  };

  test("successfully completes the purchase", async () => {
    const response = await request(app)
      .post("/buy")
      .set("Authorization", await getBearerToken())
      .send({
        productId: productId,
        amountOfProducts: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 1,
      change: [20],
    });
  });

  test("returns the right change", async () => {
    const response = await request(app)
      .post("/buy")
      .set("Authorization", await getBearerToken())
      .send({
        productId: productId,
        amountOfProducts: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      total: 0.5,
      change: [50, 20],
    });
  });

  test("returns an error given invalid product amount", async () => {
    const response = await request(app)
      .post("/buy")
      .set("Authorization", await getBearerToken())
      .send({
        productId: productId,
        amountOfProducts: 11,
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.code).toBe("insufficient_product_available");
  });

  test("returns an error given not enough deposit", async () => {
    const response = await request(app)
      .post("/buy")
      .set("Authorization", await getBearerToken())
      .send({
        productId: productId,
        amountOfProducts: 5,
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.code).toBe("insufficient_funds");
  });
});

const buyerId = new mongoose.Types.ObjectId();
const buyerPassword = createPasswordHash("my-encrypted-pass");
const mockBuyer = {
  _id: buyerId,
  id: buyerId,
  email: "buyer@gmail.com",
  password: buyerPassword,
  role: "buyer",
  deposit: 1.2,
};

const productId = new mongoose.Types.ObjectId();
const mockProduct = {
  _id: productId,
  productName: "chips",
  amountAvailable: 10,
  cost: 0.5,
  sellerId: "seller-id",
};
