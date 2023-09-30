import mongoose, { ClientSession } from "mongoose";
import { Product, productModel } from "../models/product";
import { User, userModel } from "../models/user";
import { calculateChangeToCoins } from "../utils/money";

type BuyServiceError = {
  statusCode: number;
  code: BuyErrorCode;
  message: string;
};
type BuyErrorCode =
  | "general_error"
  | "insufficient_funds"
  | "product_not_found"
  | "insufficient_product_available";
type BuyError = Record<BuyErrorCode, BuyServiceError>;

export interface BuyPayload {
  total: number;
  change?: number[];
}

interface BuyBody {
  productId: string;
  userId: string;
  amountOfProducts: number;
}

export const buy = async (
  body: BuyBody
): Promise<BuyPayload | BuyServiceError> => {
  try {
    const transaction = await performUpdateWithTransaction(body);

    if (isBuyServiceError(transaction)) {
      return transaction;
    }

    if (transaction.change === 0) {
      return { total: transaction.total };
    }

    return {
      total: transaction.total,
      change: calculateChangeToCoins(transaction.change),
    };
  } catch (e) {
    console.error("[/buy]:", e);
    return BUY_ERROR.general_error;
  }
};

const performUpdateWithTransaction = async (body: BuyBody) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const closeSession = async () => {
    await session.abortTransaction();
    session.endSession();
  };

  try {
    const productOrError = await deductProductAmount(body, session);

    if (isBuyServiceError(productOrError)) {
      await closeSession();
      return productOrError;
    }

    const total = productOrError.cost * body.amountOfProducts;
    const changeOrError = await deductUserDepositAndGetChange(
      body.userId,
      total,
      session
    );

    if (isBuyServiceError(changeOrError)) {
      await closeSession();
      return changeOrError;
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    return { total, change: changeOrError.change };
  } catch (error) {
    await closeSession();
    throw error;
  }
};

const deductProductAmount = async (
  { productId, amountOfProducts }: BuyBody,
  session: ClientSession
) => {
  const product = await productModel.findOneAndUpdate(
    { _id: productId },
    {
      $inc: { amountAvailable: -amountOfProducts },
    },
    { new: true, session }
  );

  if (!product) {
    return BUY_ERROR.product_not_found;
  }

  if (product.amountAvailable < 0) {
    return BUY_ERROR.insufficient_product_available;
  }

  return product;
};

const deductUserDepositAndGetChange = async (
  userId: string,
  total: number,
  session: ClientSession
): Promise<BuyServiceError | { change: number }> => {
  const user = await userModel.findOne({ _id: userId }, {}, { session });

  if (!user || user.deposit < total) {
    return BUY_ERROR.insufficient_funds;
  }

  const change = user.deposit - total;
  await user.updateOne({ $set: { deposit: 0 } }, { session });

  return { change };
};

export const isBuyServiceError = (
  data: Product | { change: number } | BuyPayload | BuyServiceError
): data is BuyServiceError => {
  return (data as BuyServiceError).code !== undefined;
};

const BUY_ERROR: BuyError = {
  general_error: {
    statusCode: 500,
    code: "general_error",
    message: "Internal server error",
  },
  insufficient_funds: {
    statusCode: 400,
    code: "insufficient_funds",
    message: "Insufficient funds for the transaction",
  },
  product_not_found: {
    statusCode: 404,
    code: "product_not_found",
    message: "Product not found",
  },
  insufficient_product_available: {
    statusCode: 400,
    code: "insufficient_product_available",
    message: "Insufficient product availability",
  },
};
