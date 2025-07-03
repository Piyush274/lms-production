const ApiContracts = require("authorizenet").APIContracts;
const ApiControllers = require("authorizenet").APIControllers;
const moment = require("moment");
const processPayment = async (payload) => {
  try {
    const merchantAuthenticationType =
      new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(
      payload.loginId || process.env.AUTHORIZE_LOGIN_ID
    );
    merchantAuthenticationType.setTransactionKey(
      payload.transactionKey || process.env.AUTHORIZE_TRANSACTION_KEY
    );

    // Create Credit Card Details
    const creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber(payload.cardNumber || "4111111111111111");
    creditCard.setExpirationDate(payload.ExpirationDate || "2030-12");
    creditCard.setCardCode(payload.cvv || "123");

    // Payment type
    const paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    // Order details
    const invoiceNumber = "INV-" + new Date().getTime();
    const orderDetails = new ApiContracts.OrderType();
    orderDetails.setInvoiceNumber(invoiceNumber);
    orderDetails.setDescription("Test Transaction");

    // Transaction request
    const transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(
      ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
    );
    transactionRequestType.setAmount(payload.amount);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setOrder(orderDetails);

    // Create the request
    const createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    console.log("🟢 Sending payment request...");

    // ✅ Ensure the function properly waits for response
    return new Promise((resolve) => {
      const ctrl = new ApiControllers.CreateTransactionController(
        createRequest.getJSON()
      );

      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new ApiContracts.CreateTransactionResponse(
          apiResponse
        );

        console.log("🔵 Raw Response:", response);

        if (
          response !== null &&
          response.getMessages().getResultCode() ===
            ApiContracts.MessageTypeEnum.OK
        ) {
          console.log("✅ Payment Successful!");
          const transactionId = response.getTransactionResponse().getTransId();
          console.log("Transaction ID:", transactionId);

          resolve({
            status: "success",
            transactionId,
          });
        } else {
          console.log("❌ Payment Failed");
          console.log(
            "❌ Failed to create Customer Profile",
            response.getMessages().getMessage()
          );
          console.log("🔴 Payment Failed!");
          console.log(
            "Error Code:",
            response?.transactionResponse?.errors?.error?.[0]?.errorCode
          );
          console.log(
            "Error Message:",
            response?.transactionResponse?.errors?.error?.[0]?.errorText
          );
          const errorMessage =
            response?.getMessages()?.getMessage()?.[0]?.getText() ||
            "Unknown error";
          console.log("Error:", errorMessage);

          // ✅ Return failure instead of throwing an error
          resolve({
            status: "failed",
            error: errorMessage,
          });
        }
      });
    });
  } catch (error) {
    console.error("🚨 Payment processing error:", error);
    return { status: "failed", error: error.message };
  }
};

const createCustomerProfile = async (payload) => {
  return new Promise((resolve) => {
    const merchantAuthenticationType =
      new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(
      payload.loginId || process.env.AUTHORIZE_LOGIN_ID
    );
    merchantAuthenticationType.setTransactionKey(
      payload.transactionKey || process.env.AUTHORIZE_TRANSACTION_KEY
    );

    // ✅ Billing Address (Ensure First & Last Name are provided)
    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(payload.firstName || "John");
    billTo.setLastName(payload.lastName || "Doe");
    billTo.setAddress(payload.address || "1234 Elm Street");
    billTo.setCity(payload.city || "Los Angeles");
    billTo.setState(payload.state || "CA");
    billTo.setZip(payload.zip || "90001");
    billTo.setCountry(payload.country || "USA");

    // ✅ Set Credit Card Details with Correct Expiration Date Format
    const creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber(payload.cardNumber);
    creditCard.setExpirationDate(payload.expirationDate); // ✅ FIXED

    const paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    const paymentProfile = new ApiContracts.CustomerPaymentProfileType();
    paymentProfile.setPayment(paymentType);
    paymentProfile.setBillTo(billTo);
    paymentProfile.setDefaultPaymentProfile(true);

    // Create Customer Profile
    const profile = new ApiContracts.CustomerProfileType();
    profile.setMerchantCustomerId(payload.userId.substring(0, 20));
    profile.setDescription(`Customer for ${payload.userId}`);
    profile.setEmail(payload.email);
    profile.setPaymentProfiles([paymentProfile]);

    const createRequest = new ApiContracts.CreateCustomerProfileRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setProfile(profile);

    const ctrl = new ApiControllers.CreateCustomerProfileController(
      createRequest.getJSON()
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.CreateCustomerProfileResponse(
        apiResponse
      );

      if (
        response !== null &&
        response.getMessages().getResultCode() ===
          ApiContracts.MessageTypeEnum.OK
      ) {
        console.log("✅ Customer Profile Created!");
        resolve({
          status: "success",
          customerProfileId: response.getCustomerProfileId(),
          customerPaymentProfileId: response
            .getCustomerPaymentProfileIdList()
            .getNumericString()[0],
        });
      } else {
        console.log(
          "❌ Failed to create Customer Profile",
          response.getMessages().getMessage()
        );

        resolve({
          status: "failed",
          error: response.getMessages().getMessage()[0].getText(),
        });
      }
    });
  });
};

// const createCustomerProfile = async (payload) => {
//   return new Promise(async (resolve) => {
//     const merchantAuthenticationType =
//       new ApiContracts.MerchantAuthenticationType();
//     merchantAuthenticationType.setName(process.env.AUTHORIZE_LOGIN_ID);
//     merchantAuthenticationType.setTransactionKey(
//       process.env.AUTHORIZE_TRANSACTION_KEY
//     );

//     console.log("payload", payload);

//     // ✅ Check for existing customer profile
//     const profileCheck = await getCustomerProfile(payload.email);
//     if (profileCheck.exists) {
//       return resolve({
//         status: "failed",
//         error: "Customer profile already exists",
//         profileId: profileCheck.profileId,
//       });
//     }

//     // ✅ Correct Expiration Date Format
//     const expirationDate = payload.expirationDate;

//     // ✅ Billing Address
//     const billTo = new ApiContracts.CustomerAddressType();
//     billTo.setFirstName(payload.firstName || "John");
//     billTo.setLastName(payload.lastName || "Doe");
//     billTo.setAddress(payload.address || "1234 Elm Street");
//     billTo.setCity(payload.city || "Los Angeles");
//     billTo.setState(payload.state || "CA");
//     billTo.setZip(payload.zip || "90001");
//     billTo.setCountry(payload.country || "USA");

//     // ✅ Credit Card Details
//     const creditCard = new ApiContracts.CreditCardType();
//     creditCard.setCardNumber(payload.cardNumber);
//     creditCard.setExpirationDate(expirationDate);
//     console.log("creditCard", creditCard);

//     const paymentType = new ApiContracts.PaymentType();
//     paymentType.setCreditCard(creditCard);
//     console.log("paymentType", paymentType);

//     const paymentProfile = new ApiContracts.CustomerPaymentProfileType();
//     paymentProfile.setPayment(paymentType);
//     paymentProfile.setBillTo(billTo);
//     paymentProfile.setDefaultPaymentProfile(true);
//     console.log("paymentProfile", paymentProfile);

//     // Create Customer Profile
//     const profile = new ApiContracts.CustomerProfileType();
//     profile.setMerchantCustomerId(payload.userId.substring(0, 13));
//     profile.setDescription(`Customer for ${payload.userId}`);
//     profile.setEmail(payload.email);
//     profile.setPaymentProfiles([paymentProfile]);

//     const createRequest = new ApiContracts.CreateCustomerProfileRequest();
//     createRequest.setMerchantAuthentication(merchantAuthenticationType);
//     createRequest.setProfile(profile);

//     const ctrl = new ApiControllers.CreateCustomerProfileController(
//       createRequest.getJSON()
//     );

//     ctrl.execute(() => {
//       const apiResponse = ctrl.getResponse();
//       const response = new ApiContracts.CreateCustomerProfileResponse(
//         apiResponse
//       );

//       if (
//         response &&
//         response.getMessages().getResultCode() ===
//           ApiContracts.MessageTypeEnum.OK
//       ) {
//         console.log("✅ Customer Profile Created!");
//         resolve({
//           status: "success",
//           customerProfileId: response.getCustomerProfileId(),
//           customerPaymentProfileId: response
//             .getCustomerPaymentProfileIdList()
//             .getNumericString()[0],
//         });
//       } else {
//         console.log(
//           "❌ Failed to create Customer Profile",
//           response.getMessages().getMessage()
//         );

//         resolve({
//           status: "failed",
//           error: response.getMessages().getMessage()[0].getText(),
//         });
//       }
//     });
//   });
// };

const createSubscriptionFromCustomerProfile = async (
  customerProfileId,
  customerPaymentProfileId,
  price,
  loginId,
  transactionKey
) => {
  return new Promise((resolve) => {
    const merchantAuthenticationType =
      new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(
      loginId || process.env.AUTHORIZE_LOGIN_ID
    );
    merchantAuthenticationType.setTransactionKey(
      transactionKey || process.env.AUTHORIZE_TRANSACTION_KEY
    );

    // Define Subscription Start Date (12 months from now)
    // const startDate = moment().add(12, "months").format("YYYY-MM-DD");
    const startDate = moment().format("YYYY-MM-DD"); // Starts immediately

    const interval = new ApiContracts.PaymentScheduleType.Interval();
    interval.setLength(1); // Every 1 month
    interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

    const paymentSchedule = new ApiContracts.PaymentScheduleType();
    paymentSchedule.setInterval(interval);
    paymentSchedule.setStartDate(startDate);
    paymentSchedule.setTotalOccurrences(9999); // Infinite subscription

    const profile = new ApiContracts.CustomerProfileIdType();
    profile.setCustomerProfileId(customerProfileId);
    profile.setCustomerPaymentProfileId(customerPaymentProfileId);

    const subscription = new ApiContracts.ARBSubscriptionType();
    subscription.setName("Monthly Subscription After 12 Months");
    subscription.setPaymentSchedule(paymentSchedule);
    subscription.setAmount(price); // Monthly recurring amount
    subscription.setProfile(profile);

    const createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setSubscription(subscription);

    const ctrl = new ApiControllers.ARBCreateSubscriptionController(
      createRequest.getJSON()
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.ARBCreateSubscriptionResponse(
        apiResponse
      );

      if (
        response !== null &&
        response.getMessages().getResultCode() ===
          ApiContracts.MessageTypeEnum.OK
      ) {
        console.log("✅ Subscription Created!");
        resolve({
          status: "success",
          subscriptionId: response.getSubscriptionId(),
        });
      } else {
        console.log(
          "❌ Failed to create subscription",
          response.getMessages().getMessage()
        );
        resolve({
          status: "failed",
          error: response.getMessages().getMessage()[0].getText(),
        });
      }
    });
  });
};

const cancelSubscription = async (subscriptionId, loginId, transactionKey) => {
  return new Promise((resolve) => {
    const merchantAuthenticationType =
      new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(
      loginId || process.env.AUTHORIZE_LOGIN_ID
    );
    merchantAuthenticationType.setTransactionKey(
      transactionKey || process.env.AUTHORIZE_TRANSACTION_KEY
    );

    const cancelRequest = new ApiContracts.ARBCancelSubscriptionRequest();
    cancelRequest.setMerchantAuthentication(merchantAuthenticationType);
    cancelRequest.setSubscriptionId(subscriptionId);

    const ctrl = new ApiControllers.ARBCancelSubscriptionController(
      cancelRequest.getJSON()
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new ApiContracts.ARBCancelSubscriptionResponse(
        apiResponse
      );

      if (
        response &&
        response.getMessages().getResultCode() ===
          ApiContracts.MessageTypeEnum.OK
      ) {
        console.log("✅ Subscription Canceled!");
        resolve({
          status: "success",
          message: "Subscription canceled successfully",
        });
      } else {
        console.log(
          "❌ Failed to cancel subscription",
          response.getMessages().getMessage()
        );
        resolve({
          status: "failed",
          error: response.getMessages().getMessage()[0].getText(),
        });
      }
    });
  });
};

// const getCustomerProfile = async (email) => {
//   return new Promise((resolve) => {
//     const merchantAuthenticationType =
//       new ApiContracts.MerchantAuthenticationType();
//     merchantAuthenticationType.setName(process.env.AUTHORIZE_LOGIN_ID);
//     merchantAuthenticationType.setTransactionKey(
//       process.env.AUTHORIZE_TRANSACTION_KEY
//     );

//     const request = new ApiContracts.GetCustomerProfileRequest();
//     request.setMerchantAuthentication(merchantAuthenticationType);
//     request.setEmail(email);

//     const ctrl = new ApiControllers.GetCustomerProfileController(
//       request.getJSON()
//     );
//     ctrl.execute(() => {
//       const apiResponse = ctrl.getResponse();
//       const response = new ApiContracts.GetCustomerProfileResponse(apiResponse);

//       if (
//         response &&
//         response.getMessages().getResultCode() ===
//           ApiContracts.MessageTypeEnum.OK
//       ) {
//         resolve({ exists: true, profileId: response.getCustomerProfileId() });
//       } else {
//         resolve({ exists: false });
//       }
//     });
//   });
// };

module.exports = {
  processPayment,
  createCustomerProfile,
  createSubscriptionFromCustomerProfile,
  cancelSubscription,
};
