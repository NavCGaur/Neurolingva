import React from 'react';
import CreatePaymentLink from './CreatePaymentLink';

// Dummy test data
const TEST_USER_ID = "65f1a2b3c4d5e6f7g8h9i0j1";
const TEST_USER_SERVICES = [
  {
    _id: "srv1",
    serviceName: "GST Registration",
    paymentStatus: "Pending",
    nextDueDate: new Date("2024-02-15"),
    notes: "Business registration pending"
  },
  {
    _id: "srv2",
    serviceName: "Income Tax Return Filing",
    paymentStatus: "Pending",
    nextDueDate: new Date("2024-03-31"),
    notes: "ITR for FY 2023-24"
  },
  {
    _id: "srv3",
    serviceName: "Accounting & BookKeeping",
    paymentStatus: "Pending",
    nextDueDate: new Date("2024-02-28"),
    notes: "Monthly bookkeeping"
  },
  {
    _id: "srv4",
    serviceName: "GST Return Filing",
    paymentStatus: "Paid",  // This won't show up in selection
    nextDueDate: new Date("2024-02-20"),
    paidOn: new Date("2024-01-15")
  }
];

const TestPaymentPage = () => {
  return (
    <CreatePaymentLink 
      userId={TEST_USER_ID} 
      userServices={TEST_USER_SERVICES}
    />
  );
};

export default TestPaymentPage;