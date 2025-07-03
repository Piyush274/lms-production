require("dotenv").config(); // If using environment variables
const ApiContracts = require("authorizenet").APIContracts;
const ApiControllers = require("authorizenet").APIControllers;

function processPayment(callback) {
  // Authenticate merchant credentials
  const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.AUTHORIZE_LOGIN_ID); // Your API Login ID
  merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZE_TRANSACTION_KEY); // Your Transaction Key

  // Create Credit Card Details
  const creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber("4111111111111111"); // Test Visa Card
  creditCard.setExpirationDate("2030-12"); // Format: YYYY-MM
  creditCard.setCardCode("123"); // CVV

  // Payment type
  const paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  // Order details
  const orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber("INV-1001");
  orderDetails.setDescription("Test Transaction");

  // Transaction request
  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION); // Charge transaction
  transactionRequestType.setAmount(49.99); // Amount in USD
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setOrder(orderDetails);

  // Create the request
  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  console.log("🟢 Sending payment request...");

  // Execute transaction
  const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
  ctrl.execute(() => {
    const apiResponse = ctrl.getResponse();
    const response = new ApiContracts.CreateTransactionResponse(apiResponse);

    if (response !== null) {
      if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
        console.log("✅ Payment Successful!");
        console.log("Transaction ID:", response.getTransactionResponse().getTransId());
      } else {
        console.log("❌ Payment Failed");
        console.log("Error Code:", response.getMessages().getMessage()[0].getCode());
        console.log("Error Message:", response.getMessages().getMessage()[0].getText());
      }
    } else {
      console.log("❌ No response from gateway.");
    }

    callback(response);
  });
}

// Run the function
if (require.main === module) {
  processPayment(() => {
    console.log("🔹 Payment process complete.");
  });
}

module.exports = { processPayment };
