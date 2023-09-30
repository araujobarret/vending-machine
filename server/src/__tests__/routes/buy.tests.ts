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
  test("successfully completes the purchase", async () => {
    const login = await request(app).post("/login").send({
      email: mockBuyer.email,
      password: mockBuyer.password,
    });
    const buyerToken = login.text;
    const response = await request(app)
      .post("/buy")
      .set("Authorization", `Bearer ${buyerToken}`)
      .send({
        productId: productId,
        amountOfProducts: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("change");
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
  deposit: 100,
};

const productId = new mongoose.Types.ObjectId();
const mockProduct = {
  _id: productId,
  productName: "chips",
  amountAvailable: 10,
  cost: 0.5,
  sellerId: "seller-id",
};
