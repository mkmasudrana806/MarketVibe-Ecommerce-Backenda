import axios from "axios";
import { TPayment } from "./payment.interface";
import config from "../../config";

// --------------- initiate amarpay payment session ---------------
export const initiatePayment = async (
  paymentData: Partial<TPayment>,
  success_url: string,
  fail_url: string
) => {
  const response = await axios.post(config.amarpay_payment_url as string, {
    store_id: config.amarpay_store_id,
    signature_key: config.amarpay_signature_key,
    tran_id: paymentData.transactionId,
    success_url: success_url,
    fail_url: fail_url,
    cancel_url: "http://localhost:5000/",
    amount: paymentData.amount,
    currency: "BDT",
    desc: "Merchant Registration Payment",
    cus_name: "N/A",
    cus_email: paymentData.email,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "Bangladesh",
    cus_phone: "N/A",
    type: "json",
  });

  return response.data;
};

// verify payment
export const verifyPayment = async (tnxId: string) => {
  const response = await axios.get(
    config.amarpay_payment_verify_url as string,
    {
      params: {
        store_id: config.amarpay_store_id,
        signature_key: config.amarpay_signature_key,
        type: "json",
        request_id: tnxId,
      },
    }
  );

  return response.data;
};
