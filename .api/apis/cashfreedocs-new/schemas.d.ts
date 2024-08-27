declare const AddBeneficiary: {
    readonly body: {
        readonly title: "AddBeneficiaryRequest";
        readonly description: "Request Body for adding a new beneficiary";
        readonly type: "object";
        readonly properties: {
            readonly beneId: {
                readonly type: "string";
                readonly description: "Unique Beneficiary ID to identify the beneficiary. Alphanumeric and underscore (_) allowed (50 character limit)";
                readonly examples: readonly ["JOHN18011343"];
            };
            readonly name: {
                readonly type: "string";
                readonly description: "It is the name of the beneficiary. A maximum of 100 characters are allowed. Alphabets, numbers, white spaces ( ), and special characters are allowed.";
                readonly examples: readonly ["john doe"];
            };
            readonly email: {
                readonly type: "string";
                readonly description: "Beneficiaries email, string in email Id format (Ex: johndoe_1@cashfree.com) - should contain @ and dot (.) - (200 character limit)";
                readonly examples: readonly ["johndoe@cashfree.com"];
            };
            readonly phone: {
                readonly type: "string";
                readonly description: "Beneficiaries phone number, phone number registered in India (only digits, 8 - 12 characters after stripping +91)";
                readonly examples: readonly ["9876543210"];
            };
            readonly bankAccount: {
                readonly type: "string";
                readonly description: "Beneficiary bank account (9 - 18 alphanumeric character limit)";
                readonly examples: readonly ["00111122233"];
            };
            readonly ifsc: {
                readonly type: "string";
                readonly description: "Accounts IFSC (standard IFSC format) - length 11, first four bank IFSC and 5th digit 0";
                readonly examples: readonly ["HDFC0000001"];
            };
            readonly vpa: {
                readonly type: "string";
                readonly description: "Beneficiary VPA, alphanumeric, dot (.), hyphen (-), at sign (@), and underscore () allowed (100 character limit). Note: underscore () and dot (.) gets accepted before and after at sign (@), but hyphen (-) get only accepted before at sign (@)";
                readonly examples: readonly ["test@upi"];
            };
            readonly address1: {
                readonly type: "string";
                readonly description: "Beneficiaries address, alphanumeric and space allowed (but script, HTML tags gets sanitized or removed) (150 character limit)";
                readonly examples: readonly ["ABC Road"];
            };
            readonly address2: {
                readonly type: "string";
                readonly description: "Beneficiary address, alphanumeric and space allowed (but script, HTML tags gets sanitized or removed) (150 character limit)";
                readonly examples: readonly ["XYZ Layout"];
            };
            readonly city: {
                readonly type: "string";
                readonly description: "Beneficiary city, only alphabets and white space (50 character limit)";
                readonly examples: readonly ["Bangalore"];
            };
            readonly state: {
                readonly type: "string";
                readonly description: "Beneficiary state, only alphabets and white space (50 character limit)";
                readonly examples: readonly ["Karnataka"];
            };
            readonly pincode: {
                readonly type: "string";
                readonly description: "Beneficiaries pincode, only numbers (6 character limit)";
                readonly examples: readonly ["560001"];
            };
        };
        readonly required: readonly ["beneId", "name", "email", "phone", "address1"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "AddBeneficiaryResponse";
            readonly description: "Response for creating new Beneficiary";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "409": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "412": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BeneHistory: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly beneId: {
                    readonly type: "string";
                    readonly examples: readonly ["VENKY_UPI"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The beneficiary id that you have created. Alphanumeric characters accepted.";
                };
                readonly startDate: {
                    readonly type: "string";
                    readonly examples: readonly ["2021-05-27"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Start date for the desired period. Format - yyyy-mm-dd";
                };
                readonly endDate: {
                    readonly type: "string";
                    readonly examples: readonly ["2021-05-31"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "End date for the desired period. Format - yyyy-mm-dd. If start date is provided, end date is a mandatory. End date has to be a day less than current date.";
                };
                readonly perPage: {
                    readonly type: "integer";
                    readonly examples: readonly [10];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Number of transactions to be displayed on the page. Maximum = 25. Default value set is 25.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly examples: readonly [1];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Will show the latest transfers on the first page. Minimum = 1. Default value set is 1.";
                };
            };
            readonly required: readonly ["beneId"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "BeneficiaryHistoryResponse";
            readonly description: "Response for fetching Beneficiary history";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly transfers: {
                            readonly type: "array";
                            readonly items: {
                                readonly title: "BeneficiaryTransfer";
                                readonly description: "Beneficiary Transfer Object";
                                readonly type: "object";
                                readonly properties: {
                                    readonly transferDate: {
                                        readonly type: "string";
                                        readonly examples: readonly ["2020-06-16"];
                                    };
                                    readonly amount: {
                                        readonly type: "string";
                                        readonly examples: readonly ["1"];
                                    };
                                    readonly mode: {
                                        readonly type: "string";
                                        readonly examples: readonly ["IMPS"];
                                    };
                                    readonly beneId: {
                                        readonly type: "string";
                                        readonly examples: readonly ["John Doe"];
                                    };
                                    readonly status: {
                                        readonly type: "string";
                                        readonly examples: readonly ["SUCCESS"];
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Cardpay: {
    readonly body: {
        readonly title: "CardPayRequest";
        readonly description: "Card Pay Request";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Amount you want to transfer. Amount should be >= 1.00. Decimals are allowed.";
                readonly examples: readonly [1.2];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "Unique transfer ID to identify the transfer. Alphanumeric characters and underscore are allowed. The maximum character limit is 40.";
                readonly examples: readonly ["cardpay_11"];
            };
            readonly token: {
                readonly type: "string";
                readonly description: "It is the tokenised card number or card token for this transfer.";
                readonly examples: readonly ["4640837720072836"];
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Remarks for your reference. Alphanumeric characters and whitespace are allowed. The maximum character limit is 70.";
                readonly examples: readonly ["Transfer to card"];
            };
            readonly name: {
                readonly type: "string";
                readonly description: "The name of the beneficiary who receives the transfer amount.";
                readonly examples: readonly ["John Doe"];
            };
            readonly networkType: {
                readonly type: "string";
                readonly description: "Specify the card type - VISA/MASTERCARD.";
                readonly enum: readonly ["VISA", "MASTERCARD"];
                readonly examples: readonly ["VISA"];
            };
            readonly cryptogram: {
                readonly type: "string";
                readonly description: "It contains formatted chip/cryptogram data relating to the token cryptogram. The maximum character limit is 600. It is optional for MASTERCARD and not required for VISA.";
            };
            readonly tokenExpiry: {
                readonly type: "string";
                readonly description: "Applicable only for MASTERCARD. The format for the valid token expiry date should be YYYY-MM. It cannot be null. Provide a valid tokenExpiry if collected from the customers. If unavailable, populate a static value with a forward year and month in the correct format (YYYY-MM). The maximum character limit is 10.";
                readonly examples: readonly ["2026-07"];
            };
            readonly cardType: {
                readonly type: "string";
                readonly description: "Specify if it is a debit or credit card. Values allowed: DEBIT/CREDIT. CREDIT is the default value if the parameter does not exist or is not specified.";
                readonly examples: readonly ["CREDIT"];
            };
            readonly tokenPANSequenceNumber: {
                readonly type: "string";
                readonly description: "A maximum of 3 alphanumeric characters are allowed. It is optional for MASTERCARD and not required for VISA.";
            };
            readonly ipAddress: {
                readonly type: "string";
                readonly description: "IP Address of the caller";
            };
            readonly product: {
                readonly type: "string";
                readonly description: "Cashfree Product Name";
            };
        };
        readonly required: readonly ["token", "amount", "transferId", "cardType"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "201": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "412": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const CreateCashgram: {
    readonly body: {
        readonly title: "CashgramCreateRequest";
        readonly description: "Cashgram Create Request";
        readonly type: "object";
        readonly properties: {
            readonly cashgramId: {
                readonly type: "string";
                readonly description: "Unique Id of the Cashgram. Alphanumeric, underscore (_), and hyphen (-) allowed (35 character limit)";
                readonly maxLength: 36;
                readonly examples: readonly ["JOHaN10"];
            };
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Amount to be transferred, >= 1.00";
                readonly examples: readonly ["1.00"];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly name: {
                readonly type: "string";
                readonly description: "Name of the contact";
                readonly maxLength: 100;
                readonly examples: readonly ["John Doe"];
            };
            readonly email: {
                readonly type: "string";
                readonly description: "Email of the contact";
                readonly maxLength: 200;
                readonly examples: readonly ["johndoe@cashfree.com"];
            };
            readonly phone: {
                readonly type: "string";
                readonly description: "Phone number of the contact";
                readonly examples: readonly ["9876543210"];
            };
            readonly linkExpiry: {
                readonly type: "string";
                readonly description: "Date to expire the cashgram link, Date format YYYY/MM/DD, maximum 30 days from the date of creation.";
                readonly maxLength: 10;
                readonly examples: readonly ["2020/04/01"];
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Specify remarks, if any.";
                readonly examples: readonly ["sample cashgram"];
            };
            readonly notifyCustomer: {
                readonly type: "integer";
                readonly description: "If value is 1, a link is sent to customers phone and email.";
                readonly examples: readonly [1];
            };
            readonly validateAccount: {
                readonly type: "integer";
                readonly description: "Binary value (0,1) to decide whether to validate account or not";
            };
            readonly payoutType: {
                readonly type: "string";
                readonly description: "Payout Type";
            };
            readonly description: {
                readonly type: "string";
                readonly description: "Description of the cashgram";
            };
        };
        readonly required: readonly ["cashgramId", "amount", "name", "phone", "linkExpiry"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "CashgramCreateResponse";
            readonly description: "Cashgram Create Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "integer";
                        };
                        readonly cashgramLink: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "409": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeactivateCashgram: {
    readonly body: {
        readonly title: "CashgramDeactivateRequest";
        readonly description: "Cashgram Deactivate Request";
        readonly type: "object";
        readonly properties: {
            readonly cashgramId: {
                readonly type: "string";
                readonly description: "ID of the Cashgram to be deactivated. Alphanumeric and underscore (_) allowed (35 character limit)";
                readonly maxLength: 35;
                readonly examples: readonly ["JOHaN10"];
            };
        };
        readonly required: readonly ["cashgramId"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "CashgramDeactivateResponse";
            readonly description: "Response for deactivating a cashgram";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DirectTransfer: {
    readonly body: {
        readonly title: "DirectTransferRequest";
        readonly description: "Direct Transfer Request";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Amount to be transferred. Amount should be greater that INR 1.00. Decimals are allowed.";
                readonly examples: readonly [30];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "A unique ID to identify this transfer. Alphanumeric characters and underscores are allowed (40 character limit).";
                readonly examples: readonly ["JUNOB2018142"];
            };
            readonly transferMode: {
                readonly type: "string";
                readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
                readonly examples: readonly ["banktransfer"];
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Additional Remarks, if required.";
                readonly examples: readonly ["test"];
            };
            readonly beneDetails: {
                readonly type: "object";
                readonly description: "Object with the beneficiary details to whom amount is to be transferred";
                readonly properties: {
                    readonly beneId: {
                        readonly type: "string";
                        readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "Beneficiary name, only alphabets and white space (100 character limit)";
                        readonly examples: readonly ["Ranjiths"];
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Beneficiary email address, string in email Id format (Ex: johndoe_1@cashfree.com) - should contain @ and dot (.) - (200 character limit)";
                        readonly examples: readonly ["ranjiths@cashfree.com"];
                    };
                    readonly phone: {
                        readonly type: "string";
                        readonly description: "Beneficiary phone number, phone number registered in India (only digits, 8 - 12 characters after stripping +91)";
                        readonly examples: readonly ["9999999999"];
                    };
                    readonly bankAccount: {
                        readonly type: "string";
                        readonly description: "Beneficiary bank account (9 - 18 alphanumeric character limit) (Required in case of banktransfer, imps, neft mode)";
                        readonly examples: readonly ["026291800001191"];
                    };
                    readonly ifsc: {
                        readonly type: "string";
                        readonly description: "Accounts IFSC (standard IFSC format) - length 11, first four bank IFSC and 5th digit 0 (Required in case of banktransfer, imps, neft mode)";
                        readonly examples: readonly ["YESB0000262"];
                    };
                    readonly vpa: {
                        readonly type: "string";
                        readonly description: "Beneficiary VPA, alphanumeric, dot (.), hyphen (-), at sign (@), and underscore () allowed (100 character limit). Note: underscore () and dot (.) gets accepted before and after at sign (@), but hyphen (-) get only accepted before at sign (@) (Required in case of UPI)";
                    };
                    readonly address1: {
                        readonly type: "string";
                        readonly description: "Beneficiary address. Alphanumeric characters and space allowed (150 character limit).";
                        readonly examples: readonly ["any_dummy_value"];
                    };
                    readonly address2: {
                        readonly type: "string";
                        readonly description: "Beneficiary address, alphanumeric and space allowed (but script, HTML tags gets sanitized or removed) (150 character limit)";
                    };
                    readonly city: {
                        readonly type: "string";
                        readonly description: "Beneficiary city, only alphabets and white space (50 character limit)";
                    };
                    readonly state: {
                        readonly type: "string";
                        readonly description: "Beneficiary state, only alphabets and white space (50 character limit)";
                    };
                    readonly pincode: {
                        readonly type: "string";
                        readonly description: "Beneficiaries pincode, only numbers (6 character limit)";
                    };
                };
                readonly required: readonly ["name", "email", "phone"];
            };
        };
        readonly required: readonly ["amount", "transferId", "transferMode", "beneDetails"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DirectTransferV12: {
    readonly body: {
        readonly title: "DirectTransferRequestV12";
        readonly description: "Direct Transfer Request v1.2";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Amount to be transferred. Amount should be greater that INR 1.00. Decimals are allowed.";
                readonly examples: readonly [30];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "A unique ID to identify this transfer. Alphanumeric characters and underscores are allowed (40 character limit).";
                readonly examples: readonly ["JUNOB2018142"];
            };
            readonly transferMode: {
                readonly type: "string";
                readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
                readonly examples: readonly ["banktransfer"];
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Additional Remarks, if required.";
                readonly examples: readonly ["test"];
            };
            readonly paymentInstrumentId: {
                readonly type: "string";
                readonly description: "Specify the fund source ID from where you want the amount to be debited.";
                readonly examples: readonly ["YESB_CONNECTED"];
            };
            readonly beneDetails: {
                readonly type: "object";
                readonly description: "Object with the beneficiary details to whom amount is to be transferred";
                readonly properties: {
                    readonly beneId: {
                        readonly type: "string";
                        readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                        readonly maxLength: 50;
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "Beneficiary name, only alphabets and white space (100 character limit)";
                        readonly maxLength: 100;
                        readonly examples: readonly ["Ranjiths"];
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Beneficiary email address, string in email Id format (Ex: johndoe_1@cashfree.com) - should contain @ and dot (.) - (200 character limit)";
                        readonly maxLength: 200;
                        readonly examples: readonly ["ranjiths@cashfree.com"];
                    };
                    readonly phone: {
                        readonly type: "string";
                        readonly description: "Beneficiary phone number, phone number registered in India (only digits, 8 - 12 characters after stripping +91)";
                        readonly examples: readonly ["9999999999"];
                    };
                    readonly bankAccount: {
                        readonly type: "string";
                        readonly description: "Beneficiary bank account (9 - 18 alphanumeric character limit) (Required in case of banktransfer, imps, neft mode)";
                        readonly maxLength: 40;
                        readonly examples: readonly ["026291800001191"];
                    };
                    readonly ifsc: {
                        readonly type: "string";
                        readonly description: "Accounts IFSC (standard IFSC format) - length 11, first four bank IFSC and 5th digit 0 (Required in case of banktransfer, imps, neft mode)";
                        readonly maxLength: 50;
                        readonly examples: readonly ["YESB0000262"];
                    };
                    readonly vpa: {
                        readonly type: "string";
                        readonly description: "Beneficiary VPA, alphanumeric, dot (.), hyphen (-), at sign (@), and underscore () allowed (100 character limit). Note: underscore () and dot (.) gets accepted before and after at sign (@), but hyphen (-) get only accepted before at sign (@) (Required in case of UPI)";
                        readonly maxLength: 100;
                    };
                    readonly address1: {
                        readonly type: "string";
                        readonly description: "Beneficiary address. Alphanumeric characters and space allowed (150 character limit).";
                        readonly examples: readonly ["any_dummy_value"];
                    };
                    readonly address2: {
                        readonly type: "string";
                        readonly description: "Beneficiary address, alphanumeric and space allowed (but script, HTML tags gets sanitized or removed) (150 character limit)";
                    };
                    readonly city: {
                        readonly type: "string";
                        readonly description: "Beneficiary city, only alphabets and white space (50 character limit)";
                    };
                    readonly state: {
                        readonly type: "string";
                        readonly description: "Beneficiary state, only alphabets and white space (50 character limit)";
                    };
                    readonly pincode: {
                        readonly type: "string";
                        readonly description: "Beneficiaries pincode, only numbers (6 character limit)";
                        readonly maxLength: 6;
                    };
                };
            };
        };
        readonly required: readonly ["amount", "transferId", "transferMode", "beneDetails"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GenerateBearerToken: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "AuthorizeResponse";
            readonly description: "Response for generating Bearer Token";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly token: {
                            readonly type: "string";
                        };
                        readonly expiry: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBalance: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "BalanceResponse";
            readonly description: "Balance Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly balance: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly availableBalance: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBalanceV12: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly paymentInstrumentId: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Payment Instrument ID";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "BalanceResponse";
            readonly description: "Balance Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly balance: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly availableBalance: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBatchTransferStatus: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly batchTransferId: {
                    readonly type: "string";
                    readonly examples: readonly ["test_batch_format_01"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Batch transfer ID to fetch the status";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "BatchTransferStatusResponse";
            readonly description: "Batch Transfer Status Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly rowCount: {
                            readonly type: "integer";
                        };
                        readonly referenceId: {
                            readonly type: "integer";
                        };
                        readonly transfers: {
                            readonly type: "array";
                            readonly items: {
                                readonly title: "BatchTransferEntry";
                                readonly description: "Batch Transfer";
                                readonly type: "object";
                                readonly properties: {
                                    readonly transferId: {
                                        readonly type: "string";
                                        readonly examples: readonly ["PTM_00052312126"];
                                    };
                                    readonly paymentInstrumentId: {
                                        readonly type: "string";
                                    };
                                    readonly beneId: {
                                        readonly type: "string";
                                        readonly examples: readonly ["9999999999_18875"];
                                    };
                                    readonly referenceId: {
                                        readonly type: "string";
                                        readonly examples: readonly [1523969543];
                                    };
                                    readonly bankAccount: {
                                        readonly type: "string";
                                        readonly examples: readonly ["9999999999"];
                                    };
                                    readonly ifsc: {
                                        readonly type: "string";
                                        readonly examples: readonly ["PYTM0000001"];
                                    };
                                    readonly amount: {
                                        readonly type: "number";
                                        readonly format: "double";
                                        readonly examples: readonly ["12.00"];
                                        readonly minimum: -1.7976931348623157e+308;
                                        readonly maximum: 1.7976931348623157e+308;
                                    };
                                    readonly remarks: {
                                        readonly type: "string";
                                    };
                                    readonly utr: {
                                        readonly type: "string";
                                        readonly examples: readonly ["W1532082926"];
                                    };
                                    readonly addedOn: {
                                        readonly type: "string";
                                        readonly examples: readonly ["2018-07-20"];
                                    };
                                    readonly processedOn: {
                                        readonly type: "string";
                                        readonly examples: readonly ["2018-07-20"];
                                    };
                                    readonly status: {
                                        readonly type: "string";
                                        readonly examples: readonly ["SUCCESS"];
                                    };
                                    readonly failureReason: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBatchTransferStatusV12: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly batchTransferId: {
                    readonly type: "string";
                    readonly examples: readonly ["test_batch_format_01"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Batch transfer ID to fetch the status";
                };
            };
            readonly required: readonly ["batchTransferId"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "BatchTransferStatusResponseV12";
            readonly description: "Batch Transfer Status Response v1.2";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly examples: readonly ["SUCCESS"];
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly examples: readonly ["200"];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Data retrieved successfully"];
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly rowCount: {
                            readonly type: "integer";
                            readonly examples: readonly [2];
                        };
                        readonly referenceId: {
                            readonly type: "integer";
                            readonly examples: readonly [1582];
                        };
                        readonly paymentInstrumentId: {
                            readonly type: "string";
                            readonly examples: readonly ["CASHFREE_1"];
                        };
                        readonly transfers: {
                            readonly type: "array";
                            readonly items: {
                                readonly title: "BatchTransferEntryV12";
                                readonly description: "Batch Transfer v1.2";
                                readonly type: "object";
                                readonly properties: {
                                    readonly transferId: {
                                        readonly type: "string";
                                        readonly examples: readonly ["PTM_00121241112"];
                                    };
                                    readonly beneId: {
                                        readonly type: "string";
                                        readonly examples: readonly ["9999999999_18875"];
                                    };
                                    readonly referenceId: {
                                        readonly type: "string";
                                        readonly examples: readonly [1523969542];
                                    };
                                    readonly bankAccount: {
                                        readonly type: "string";
                                        readonly examples: readonly ["9999999999"];
                                    };
                                    readonly ifsc: {
                                        readonly type: "string";
                                        readonly examples: readonly ["PYTM0000001"];
                                    };
                                    readonly amount: {
                                        readonly type: "number";
                                        readonly format: "double";
                                        readonly examples: readonly ["12.00"];
                                        readonly minimum: -1.7976931348623157e+308;
                                        readonly maximum: 1.7976931348623157e+308;
                                    };
                                    readonly remarks: {
                                        readonly type: "string";
                                    };
                                    readonly utr: {
                                        readonly type: "string";
                                        readonly examples: readonly ["W1532082925"];
                                    };
                                    readonly addedOn: {
                                        readonly type: "string";
                                        readonly examples: readonly ["2018-07-20"];
                                    };
                                    readonly processedOn: {
                                        readonly type: "string";
                                        readonly examples: readonly ["2018-07-20"];
                                    };
                                    readonly status: {
                                        readonly type: "string";
                                        readonly examples: readonly ["SUCCESS"];
                                    };
                                    readonly failureReason: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBeneficiary: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly beneId: {
                    readonly type: "string";
                    readonly examples: readonly ["JOHN18011"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The bene_id passed in the request during the creation of the beneficiary";
                };
            };
            readonly required: readonly ["beneId"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetBeneficiaryResponse";
            readonly description: "Response for getting Beneficiary by id";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly beneId: {
                            readonly type: "string";
                        };
                        readonly name: {
                            readonly type: "string";
                        };
                        readonly groupName: {
                            readonly type: "string";
                        };
                        readonly email: {
                            readonly type: "string";
                        };
                        readonly phone: {
                            readonly type: "string";
                        };
                        readonly address1: {
                            readonly type: "string";
                        };
                        readonly address2: {
                            readonly type: "string";
                        };
                        readonly city: {
                            readonly type: "string";
                        };
                        readonly state: {
                            readonly type: "string";
                        };
                        readonly pincode: {
                            readonly type: "string";
                        };
                        readonly bankAccount: {
                            readonly type: "string";
                        };
                        readonly ifsc: {
                            readonly type: "string";
                        };
                        readonly status: {
                            readonly type: "string";
                        };
                        readonly vpa: {
                            readonly type: "string";
                        };
                        readonly addedOn: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBeneficiaryId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly bankAccount: {
                    readonly type: "string";
                    readonly examples: readonly ["00111122233"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Bank Account of beneficiary";
                };
                readonly ifsc: {
                    readonly type: "string";
                    readonly examples: readonly ["HDFC0000001"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "IFSC code of beneficiary";
                };
            };
            readonly required: readonly ["bankAccount", "ifsc"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetBeneficiaryIDResponse";
            readonly description: "Response for getting Beneficiary id by bank account and ifsc";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly beneId: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetCashgramStatus: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly cashgramId: {
                    readonly type: "string";
                    readonly examples: readonly ["JOHaN10"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "ID of the Cashgram";
                };
            };
            readonly required: readonly ["cashgramId"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "CashgramStatusResponse";
            readonly description: "Cashgram Status Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly cashgramStatus: {
                            readonly type: "string";
                        };
                        readonly reason: {
                            readonly type: "string";
                        };
                        readonly referenceId: {
                            readonly type: "integer";
                        };
                        readonly cashgramId: {
                            readonly type: "string";
                        };
                        readonly cashgramLink: {
                            readonly type: "string";
                        };
                        readonly redeemRefId: {
                            readonly type: "integer";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetIncidents: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly examples: readonly ["ALL"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Incident status - RESOLVED/UNRESOLVED/ALL are the allowed values Default value is UNRESOLVED if not provided";
                };
                readonly startTime: {
                    readonly type: "string";
                    readonly examples: readonly ["2022-01-01 00:00:00"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Start Time for the desired period. Format yyyy-mm-dd hh:mm:ss";
                };
                readonly endTime: {
                    readonly type: "string";
                    readonly examples: readonly ["2022-01-05 23:59:59"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "End Time for the desired period. Format yyyy-mm-dd hh:mm:ss. Default values are current day start Time(00:00:00) and end Time(23:59:59) if not provided.";
                };
                readonly entityCode: {
                    readonly type: "string";
                    readonly examples: readonly ["CIUB"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Code for the entity(BANK) on which the incidents are created.";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetIncidentsResponse";
            readonly description: "Response for getting incidents";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly incidents: {
                            readonly type: "array";
                            readonly items: {
                                readonly title: "IncidentExternal";
                                readonly description: "External Incident";
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "integer";
                                    };
                                    readonly type: {
                                        readonly type: "string";
                                    };
                                    readonly entity: {
                                        readonly type: "string";
                                    };
                                    readonly mode: {
                                        readonly type: "string";
                                    };
                                    readonly createdAt: {
                                        readonly type: "string";
                                    };
                                    readonly resolvedAt: {
                                        readonly type: "string";
                                    };
                                    readonly isScheduled: {
                                        readonly type: "boolean";
                                    };
                                    readonly isResolved: {
                                        readonly type: "boolean";
                                    };
                                    readonly impact: {
                                        readonly type: "string";
                                    };
                                    readonly entityName: {
                                        readonly type: "string";
                                    };
                                    readonly entityCode: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetTransferStatus: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly referenceId: {
                    readonly type: "string";
                    readonly examples: readonly ["10023"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Reference ID of the transaction. (Either referenceId or transferId is mandatory)";
                };
                readonly transferId: {
                    readonly type: "string";
                    readonly examples: readonly ["Sample_test"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Transfer ID of the transaction.";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetTransferStatusResponse";
            readonly description: "Transfer Status Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly transfer: {
                            readonly type: "object";
                            readonly properties: {
                                readonly transferId: {
                                    readonly type: "string";
                                };
                                readonly referenceId: {
                                    readonly type: "string";
                                };
                                readonly bankAccount: {
                                    readonly type: "string";
                                };
                                readonly ifsc: {
                                    readonly type: "string";
                                };
                                readonly beneId: {
                                    readonly type: "string";
                                };
                                readonly amount: {
                                    readonly type: "number";
                                    readonly format: "double";
                                    readonly minimum: -1.7976931348623157e+308;
                                    readonly maximum: 1.7976931348623157e+308;
                                };
                                readonly status: {
                                    readonly type: "string";
                                };
                                readonly utr: {
                                    readonly type: "string";
                                };
                                readonly addedOn: {
                                    readonly type: "string";
                                };
                                readonly processedOn: {
                                    readonly type: "string";
                                };
                                readonly reason: {
                                    readonly type: "string";
                                };
                                readonly transferMode: {
                                    readonly type: "string";
                                };
                                readonly acknowledged: {
                                    readonly type: "integer";
                                };
                                readonly phone: {
                                    readonly type: "string";
                                };
                                readonly vpa: {
                                    readonly type: "string";
                                };
                                readonly paymentInstrumentId: {
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetTransferStatusV12: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly referenceId: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Reference ID of the transaction. (Either referenceId or transferId is mandatory)";
                };
                readonly transferId: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Transfer ID of the transaction.";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetTransferStatusResponse";
            readonly description: "Transfer Status Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly transfer: {
                            readonly type: "object";
                            readonly properties: {
                                readonly transferId: {
                                    readonly type: "string";
                                };
                                readonly referenceId: {
                                    readonly type: "string";
                                };
                                readonly bankAccount: {
                                    readonly type: "string";
                                };
                                readonly ifsc: {
                                    readonly type: "string";
                                };
                                readonly beneId: {
                                    readonly type: "string";
                                };
                                readonly amount: {
                                    readonly type: "number";
                                    readonly format: "double";
                                    readonly minimum: -1.7976931348623157e+308;
                                    readonly maximum: 1.7976931348623157e+308;
                                };
                                readonly status: {
                                    readonly type: "string";
                                };
                                readonly utr: {
                                    readonly type: "string";
                                };
                                readonly addedOn: {
                                    readonly type: "string";
                                };
                                readonly processedOn: {
                                    readonly type: "string";
                                };
                                readonly reason: {
                                    readonly type: "string";
                                };
                                readonly transferMode: {
                                    readonly type: "string";
                                };
                                readonly acknowledged: {
                                    readonly type: "integer";
                                };
                                readonly phone: {
                                    readonly type: "string";
                                };
                                readonly vpa: {
                                    readonly type: "string";
                                };
                                readonly paymentInstrumentId: {
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const InternalTransfer: {
    readonly body: {
        readonly title: "InternalTransferRequest";
        readonly description: "Internal Transfer Request";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Amount to be transferred. Number (>=1)";
                readonly examples: readonly [10.5];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly rechargeAccount: {
                readonly type: "string";
                readonly description: "Cashfree internal recharge account number. Alphanumeric allowed";
                readonly examples: readonly ["492372992"];
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "A unique ID to identify this transfer. Alphanumeric, hyphen and underscore (_) allowed (40 character limit). If the value is not passed, the id will be autogenerated.";
            };
        };
        readonly required: readonly ["amount", "rechargeAccount"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "InternalTransferResponse";
            readonly description: "Internal Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly transferId: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const InternalTransferV12: {
    readonly body: {
        readonly title: "InternalTransferRequestV12";
        readonly description: "Internal Transfer Request v1.2";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Amount to be transferred. Number (>=1)";
                readonly examples: readonly [10.5];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly rechargeAccount: {
                readonly type: "string";
                readonly description: "It is the Cashfree Payments' internal recharge account number. Alphanumeric characters are allowed.";
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "It is the unique ID to identify the transfer. Alphanumeric, hyphen (-), and underscore (_) characters are allowed. Maximum character limit is 40. The ID is auto-generated if the parameter is left blank.";
                readonly examples: readonly ["testingw123"];
            };
            readonly paymentInstrumentId: {
                readonly type: "string";
                readonly description: "It is the unique ID to identify the fund source from which you want to transfer the money. Alphanumeric characters are allowed.";
                readonly examples: readonly ["COLENDING_WALLET_336561_8888982"];
            };
            readonly toPaymentInstrumentId: {
                readonly type: "string";
                readonly description: "It is the unique ID to identify the fund source where you want to deposit the money. Alphanumeric characters are allowed.";
                readonly examples: readonly ["COLENDING_WALLET_336561_8888981"];
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Any remarks if required.";
                readonly examples: readonly ["some remarks"];
            };
        };
        readonly required: readonly ["amount"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "InternalTransferResponse";
            readonly description: "Internal Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly transferId: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Lend: {
    readonly body: {
        readonly title: "LendRequest";
        readonly description: "Lend Request";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "It is the loan amount. It should be equal to or greater than 1.00.";
                readonly examples: readonly ["1000"];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly beneId: {
                readonly type: "string";
                readonly description: "It is the unique ID to identify the beneficiary. Only alphanumeric characters are allowed.";
                readonly examples: readonly ["bene1"];
            };
            readonly loanId: {
                readonly type: "string";
                readonly description: "It is the unique ID to identify the loan. Only alphanumeric characters are allowed.";
                readonly examples: readonly ["laon1"];
            };
            readonly remarks: {
                readonly type: "string";
            };
            readonly transferMode: {
                readonly type: "string";
                readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
                readonly examples: readonly ["imps"];
            };
            readonly transferType: {
                readonly type: "string";
            };
            readonly serviceCharges: {
                readonly type: "array";
                readonly description: "It is the service charges that need to be disbursed to different parties.";
                readonly items: {
                    readonly title: "LoanDisbursalServiceCharge";
                    readonly description: "Loan Disbursal Service Charge";
                    readonly type: "object";
                    readonly properties: {
                        readonly key: {
                            readonly type: "string";
                            readonly description: "Service Charge Name";
                            readonly examples: readonly ["something"];
                        };
                        readonly value: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "Service Charge Amount";
                            readonly examples: readonly ["50"];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                    };
                    readonly required: readonly ["key", "value"];
                };
            };
            readonly beneDetails: {
                readonly type: "object";
                readonly description: "It is the details of the beneficiary.";
                readonly properties: {
                    readonly beneId: {
                        readonly type: "string";
                        readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                        readonly examples: readonly ["bene1"];
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "It is the name of the beneficiary. It should be a maximum of 100 characters. Only alphabets and whitespaces ( ) are allowed.";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "It is the email address of the beneficiary. A maximum of 200 characters are allowed. The value should contain @ and period (.).";
                    };
                    readonly phone: {
                        readonly type: "string";
                        readonly description: "It is the phone number of the beneficiary. The phone number must be registered in India. Only numeric values are allowed. It should be between 8 and 12 characters excluding +91.";
                    };
                    readonly bankAccount: {
                        readonly type: "string";
                        readonly description: "It is the bank account of the beneficiary. It must be between 9-18 alphanumeric characters. It is a required parameter in the case of banktransfer, imps, and neft.";
                    };
                    readonly ifsc: {
                        readonly type: "string";
                        readonly description: "The IFSC information of the bank account of the dealer/distributor who raised the invoice for the customer to pay. It should be an alphanumeric value of 11 characters. The first 4 characters should be alphabets, the 5th character should be a 0, and the remaining 6 characters should be numerals.";
                    };
                    readonly vpa: {
                        readonly type: "string";
                        readonly description: "It is the virtual payment address of the beneficiary. A maximum of 100 characters are allowed. Accepted values: alphanumeric, period (.), hyphen (-), at sign (@), underscore (). Underscore () and period (.) are accepted before and after at sign (@). Hyphen (-) is accepted only before at sign (@).";
                    };
                    readonly address1: {
                        readonly type: "string";
                        readonly description: "It is the address of the beneficiary. A maximum of 150 characters are allowed. Only alphanumeric values and whitespaces ( ) are allowed.";
                    };
                    readonly address2: {
                        readonly type: "string";
                        readonly description: "Beneficiary address, alphanumeric and space allowed (but script, HTML tags gets sanitized or removed) (150 character limit)";
                    };
                    readonly city: {
                        readonly type: "string";
                        readonly description: "Beneficiary city, only alphabets and white space (50 character limit)";
                    };
                    readonly state: {
                        readonly type: "string";
                        readonly description: "Beneficiary state, only alphabets and white space (50 character limit)";
                    };
                    readonly pincode: {
                        readonly type: "string";
                        readonly description: "Beneficiaries pincode, only numbers (6 character limit)";
                    };
                };
                readonly required: readonly ["name", "email", "phone", "address1"];
            };
        };
        readonly required: readonly ["loanId", "serviceCharges"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "201": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RemoveBeneficiary: {
    readonly body: {
        readonly title: "RemoveBeneficiaryRequest";
        readonly description: "Request Body for removing a new beneficiary";
        readonly type: "object";
        readonly properties: {
            readonly beneId: {
                readonly type: "string";
                readonly description: "Beneficiaries Id to delete, alphanumeric and underscore allowed (50 character limit)";
                readonly examples: readonly ["JOHN18011343"];
            };
        };
        readonly required: readonly ["beneId"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "RemoveBeneficiaryResponse";
            readonly description: "Response for removing Beneficiary";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RequestAsyncTransfer: {
    readonly body: {
        readonly title: "TransferRequest";
        readonly description: "Transfer Request";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "amount to be transferred. Decimals allowed (>= 1.00)";
                readonly examples: readonly ["1.00"];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly beneId: {
                readonly type: "string";
                readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                readonly maxLength: 50;
                readonly examples: readonly ["JOHN18011"];
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "A unique Id to identify this transfer. Alphanumeric and underscore (_) allowed (40 character limit).";
                readonly maxLength: 40;
                readonly examples: readonly ["JUNOB2018"];
            };
            readonly transferMode: {
                readonly type: "string";
                readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
                readonly maxLength: 20;
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Additional remarks, if any. Alphanumeric and white spaces allowed (70 characters limit).";
                readonly maxLength: 70;
            };
            readonly transferType: {
                readonly type: "string";
                readonly description: "Transfer Type";
                readonly maxLength: 7;
            };
            readonly ipAddress: {
                readonly type: "string";
                readonly description: "IP Address of the caller";
            };
            readonly product: {
                readonly type: "string";
                readonly description: "Cashfree Product Name";
            };
            readonly rda: {
                readonly type: "object";
                readonly description: "Rupee Drawing Arrangement";
                readonly properties: {
                    readonly quoteId: {
                        readonly type: "string";
                        readonly description: "Quote ID";
                    };
                    readonly requestCurrency: {
                        readonly type: "string";
                        readonly description: "Request Currency";
                    };
                    readonly sendingCurrency: {
                        readonly type: "string";
                        readonly description: "Sending Currency";
                    };
                    readonly receivingCurrency: {
                        readonly type: "string";
                        readonly description: "Receiving Currency";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly description: "RDA Type";
                        readonly enum: readonly ["inttransfer", "p2p", "p2b", "b2p", "b2b"];
                    };
                    readonly senderMobNo: {
                        readonly type: "string";
                        readonly description: "Sender Mobile Number";
                    };
                    readonly senderKyc: {
                        readonly type: "object";
                        readonly description: "Sender KYC Details";
                        readonly properties: {
                            readonly nationality: {
                                readonly type: "string";
                                readonly description: "Sender's Nationality";
                            };
                            readonly dateOfBirth: {
                                readonly type: "string";
                                readonly description: "Sender's Date of Birth";
                            };
                            readonly document: {
                                readonly type: "object";
                                readonly description: "Sender's Document";
                                readonly properties: {
                                    readonly idType: {
                                        readonly type: "string";
                                        readonly description: "Document Type";
                                    };
                                    readonly idNumber: {
                                        readonly type: "string";
                                        readonly description: "Document Number";
                                    };
                                    readonly expiryDate: {
                                        readonly type: "string";
                                        readonly description: "Document expiration date";
                                    };
                                };
                                readonly required: readonly ["idType", "idNumber", "expiryDate"];
                            };
                            readonly postalAddress: {
                                readonly type: "object";
                                readonly description: "Sender's Postal Address";
                                readonly properties: {
                                    readonly addressLine1: {
                                        readonly type: "string";
                                        readonly description: "Address Line 1";
                                    };
                                    readonly city: {
                                        readonly type: "string";
                                        readonly description: "City";
                                    };
                                    readonly country: {
                                        readonly type: "string";
                                        readonly description: "Country";
                                    };
                                };
                                readonly required: readonly ["addressLine1", "city", "country"];
                            };
                            readonly subjectName: {
                                readonly type: "object";
                                readonly description: "Sender's Name";
                                readonly properties: {
                                    readonly firstName: {
                                        readonly type: "string";
                                        readonly description: "First Name";
                                    };
                                    readonly lastName: {
                                        readonly type: "string";
                                        readonly description: "Last Name";
                                    };
                                    readonly fullName: {
                                        readonly type: "string";
                                        readonly description: "Full Name";
                                    };
                                };
                                readonly required: readonly ["firstName", "lastName", "fullName"];
                            };
                            readonly primaryContactCountryCode: {
                                readonly type: "string";
                                readonly description: "Primary Contact's Country Code";
                            };
                            readonly primaryContactNo: {
                                readonly type: "string";
                                readonly description: "Primary Contact Number";
                            };
                            readonly primaryContactNoType: {
                                readonly type: "string";
                                readonly description: "Primary Contact Type";
                            };
                        };
                        readonly required: readonly ["nationality", "dateOfBirth", "document", "postalAddress", "subjectName"];
                    };
                    readonly receivingCountry: {
                        readonly type: "string";
                        readonly description: "Receiving Country";
                    };
                    readonly remittancePurpose: {
                        readonly type: "string";
                        readonly description: "Remittance Purpose";
                    };
                    readonly sourceOfFunds: {
                        readonly type: "string";
                        readonly description: "Source Of Funds";
                    };
                    readonly relationshipSender: {
                        readonly type: "string";
                        readonly description: "Relationship with Sender";
                    };
                    readonly originCountry: {
                        readonly type: "string";
                        readonly description: "Country of origin";
                    };
                    readonly senderBusinessKyc: {
                        readonly type: "object";
                        readonly description: "Business KYC details";
                        readonly properties: {
                            readonly pinCode: {
                                readonly type: "string";
                                readonly description: "Pincode";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Address";
                            };
                            readonly primaryContactCountryCode: {
                                readonly type: "string";
                                readonly description: "Primary Contact's Country Code";
                            };
                            readonly primaryContactNo: {
                                readonly type: "string";
                                readonly description: "Primary Contact Number";
                            };
                            readonly email: {
                                readonly type: "string";
                                readonly description: "Business Email ID";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Business Name";
                            };
                            readonly addressCountryCode: {
                                readonly type: "string";
                                readonly description: "Business Address Country Code";
                            };
                            readonly countryCode: {
                                readonly type: "string";
                                readonly description: "Country Code";
                            };
                            readonly regType: {
                                readonly type: "string";
                                readonly description: "Registration Type";
                            };
                            readonly regIssuedBy: {
                                readonly type: "string";
                                readonly description: "Registration Issued By";
                            };
                            readonly regIssuedAt: {
                                readonly type: "string";
                                readonly description: "Registration Issued At";
                            };
                            readonly regNumber: {
                                readonly type: "string";
                                readonly description: "Registration Number";
                            };
                            readonly regIssueDate: {
                                readonly type: "string";
                                readonly description: "Registration Issued Date";
                            };
                            readonly idValidThru: {
                                readonly type: "string";
                                readonly description: "Registration ID Validation Date";
                            };
                        };
                        readonly required: readonly ["address", "primaryContactCountryCode", "primaryContactNo", "email", "name", "countryCode", "regType", "regNumber", "regIssueDate", "idValidThru"];
                    };
                };
                readonly required: readonly ["senderMobNo", "remittancePurpose", "sourceOfFunds", "originCountry"];
            };
        };
        readonly required: readonly ["beneId", "amount", "transferId"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferAsyncResponse";
            readonly description: "Transfer Async Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RequestAsyncTransferV12: {
    readonly body: {
        readonly title: "TransferRequestV12";
        readonly description: "Transfer Request v1.2";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "amount to be transferred. Decimals allowed (>= 1.00)";
                readonly examples: readonly ["1.00"];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly beneId: {
                readonly type: "string";
                readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                readonly examples: readonly ["JOHN18011"];
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "A unique Id to identify this transfer. Alphanumeric and underscore (_) allowed (40 character limit).";
                readonly examples: readonly ["JUNOB2018"];
            };
            readonly transferMode: {
                readonly type: "string";
                readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Additional remarks, if any. Alphanumeric and white spaces allowed (70 characters limit).";
            };
            readonly transferType: {
                readonly type: "string";
                readonly description: "Transfer Type";
                readonly maxLength: 7;
            };
            readonly ipAddress: {
                readonly type: "string";
                readonly description: "IP Address of the caller";
            };
            readonly product: {
                readonly type: "string";
                readonly description: "Cashfree Product Name";
            };
            readonly paymentInstrumentId: {
                readonly type: "string";
                readonly description: "Specify the fund source ID from where you want the amount to be debited.";
            };
        };
        readonly required: readonly ["beneId", "amount", "transferId"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferAsyncResponse";
            readonly description: "Transfer Async Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RequestBatchTransfer: {
    readonly body: {
        readonly title: "BatchTransferRequest";
        readonly description: "Batch Transfer Request";
        readonly type: "object";
        readonly properties: {
            readonly batchTransferId: {
                readonly type: "string";
                readonly description: "Unique Id of the Batch Transfer, alphanumeric and underscore allowed (60 character limit)";
                readonly examples: readonly ["abc-12356"];
            };
            readonly batchFormat: {
                readonly type: "string";
                readonly description: "Format of the batch transfers, valid values are, BENEFICIARY_ID, BANK_ACCOUNT, UPI, PAYTM, AMAZONPAY.";
                readonly enum: readonly ["BENEFICIARY_ID", "BANK_ACCOUNT", "UPI", "PAYTM", "AMAZONPAY"];
                readonly examples: readonly ["BANK_ACCOUNT"];
            };
            readonly deleteBene: {
                readonly type: "integer";
                readonly description: "Flag to delete and read new beneficiaries if a beneficiary with the same Beneficiary Id is available. When the batch transfer format is BANK_ACCOUNT";
            };
            readonly batch: {
                readonly type: "array";
                readonly description: "An array of transfer objects";
                readonly items: {
                    readonly title: "CreateTransferBatch";
                    readonly description: "Batch Transfer Request";
                    readonly type: "object";
                    readonly properties: {
                        readonly transferId: {
                            readonly type: "string";
                            readonly description: "A unique ID to identify this transfer. Alphanumeric, hyphen and underscore (_) allowed (40 character limit).";
                            readonly maxLength: 40;
                            readonly examples: readonly ["1234"];
                        };
                        readonly amount: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "Amount to be transferred. Number (>=1)";
                            readonly examples: readonly ["1"];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly remarks: {
                            readonly type: "string";
                            readonly description: "Any remarks if required.";
                            readonly maxLength: 70;
                            readonly examples: readonly ["Transfer with Id 12356"];
                        };
                        readonly beneId: {
                            readonly type: "string";
                            readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                            readonly maxLength: 50;
                        };
                        readonly name: {
                            readonly type: "string";
                            readonly description: "It is the name of the beneficiary. A maximum of 100 characters are allowed.";
                            readonly maxLength: 100;
                            readonly examples: readonly ["john doe"];
                        };
                        readonly email: {
                            readonly type: "string";
                            readonly description: "Beneficiaries email, string in email Id format (Ex: johndoe_1@cashfree.com) - should contain @ and dot (.) - (200 character limit)";
                            readonly maxLength: 200;
                            readonly examples: readonly ["johndoe@cashfree.com"];
                        };
                        readonly phone: {
                            readonly type: "string";
                            readonly description: "Beneficiaries phone number, phone number registered in India";
                            readonly maxLength: 11;
                            readonly examples: readonly [9876543210];
                        };
                        readonly bankAccount: {
                            readonly type: "string";
                            readonly description: "Beneficiary bank account (only alphanumeric characters allowed)";
                            readonly maxLength: 40;
                            readonly examples: readonly ["00111122233"];
                        };
                        readonly ifsc: {
                            readonly type: "string";
                            readonly description: "Accounts IFSC (standard IFSC format)";
                            readonly maxLength: 50;
                            readonly examples: readonly ["HDFC0000001"];
                        };
                        readonly vpa: {
                            readonly type: "string";
                            readonly description: "Beneficiary VPA, alphanumeric, dot (.), hyphen (-), at sign (@), and underscore () allowed (100 character limit). Note: underscore () and dot (.) gets accepted before and after at sign (@), but hyphen (-) get only accepted before at sign (@)";
                        };
                        readonly transferMode: {
                            readonly type: "string";
                            readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
                        };
                    };
                    readonly required: readonly ["transferId", "amount"];
                };
            };
        };
        readonly required: readonly ["batchTransferId", "batchFormat", "batch"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferAsyncResponse";
            readonly description: "Transfer Async Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "409": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RequestBatchTransferV12: {
    readonly body: {
        readonly title: "BatchTransferRequestV12";
        readonly description: "Batch Transfer Request v1.2";
        readonly type: "object";
        readonly properties: {
            readonly batchTransferId: {
                readonly type: "string";
                readonly description: "Unique Id of the Batch Transfer, alphanumeric and underscore allowed (60 character limit)";
                readonly examples: readonly ["batch_req_21"];
            };
            readonly batchFormat: {
                readonly type: "string";
                readonly description: "Format of the batch transfers, valid values are, BENEFICIARY_ID, BANK_ACCOUNT, UPI, PAYTM, AMAZONPAY.";
                readonly enum: readonly ["BENEFICIARY_ID", "BANK_ACCOUNT", "UPI", "PAYTM", "AMAZONPAY"];
                readonly examples: readonly ["BANK_ACCOUNT"];
            };
            readonly deleteBene: {
                readonly type: "integer";
                readonly description: "Flag to delete and read new beneficiaries if a beneficiary with the same Beneficiary Id is available. When the batch transfer format is BANK_ACCOUNT";
            };
            readonly paymentInstrumentId: {
                readonly type: "string";
                readonly description: "Specify the payment instrument from where you want the amount to be debited.";
                readonly examples: readonly ["IBL_CONNECTED"];
            };
            readonly batch: {
                readonly type: "array";
                readonly description: "An array of transfer objects";
                readonly items: {
                    readonly title: "CreateTransferBatch";
                    readonly description: "Batch Transfer Request";
                    readonly type: "object";
                    readonly properties: {
                        readonly transferId: {
                            readonly type: "string";
                            readonly description: "A unique ID to identify this transfer. Alphanumeric, hyphen and underscore (_) allowed (40 character limit).";
                            readonly maxLength: 40;
                            readonly examples: readonly ["1234"];
                        };
                        readonly amount: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "Amount to be transferred. Number (>=1)";
                            readonly examples: readonly ["1"];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly remarks: {
                            readonly type: "string";
                            readonly description: "Any remarks if required.";
                            readonly maxLength: 70;
                            readonly examples: readonly ["Transfer with Id 12356"];
                        };
                        readonly beneId: {
                            readonly type: "string";
                            readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                            readonly maxLength: 50;
                        };
                        readonly name: {
                            readonly type: "string";
                            readonly description: "It is the name of the beneficiary. A maximum of 100 characters are allowed.";
                            readonly maxLength: 100;
                            readonly examples: readonly ["john doe"];
                        };
                        readonly email: {
                            readonly type: "string";
                            readonly description: "Beneficiaries email, string in email Id format (Ex: johndoe_1@cashfree.com) - should contain @ and dot (.) - (200 character limit)";
                            readonly maxLength: 200;
                            readonly examples: readonly ["johndoe@cashfree.com"];
                        };
                        readonly phone: {
                            readonly type: "string";
                            readonly description: "Beneficiaries phone number, phone number registered in India";
                            readonly maxLength: 11;
                            readonly examples: readonly [9876543210];
                        };
                        readonly bankAccount: {
                            readonly type: "string";
                            readonly description: "Beneficiary bank account (only alphanumeric characters allowed)";
                            readonly maxLength: 40;
                            readonly examples: readonly ["00111122233"];
                        };
                        readonly ifsc: {
                            readonly type: "string";
                            readonly description: "Accounts IFSC (standard IFSC format)";
                            readonly maxLength: 50;
                            readonly examples: readonly ["HDFC0000001"];
                        };
                        readonly vpa: {
                            readonly type: "string";
                            readonly description: "Beneficiary VPA, alphanumeric, dot (.), hyphen (-), at sign (@), and underscore () allowed (100 character limit). Note: underscore () and dot (.) gets accepted before and after at sign (@), but hyphen (-) get only accepted before at sign (@)";
                        };
                        readonly transferMode: {
                            readonly type: "string";
                            readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
                        };
                    };
                    readonly required: readonly ["transferId", "amount"];
                };
            };
        };
        readonly required: readonly ["batchTransferId", "batchFormat", "batch"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferAsyncResponse";
            readonly description: "Transfer Async Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "409": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RequestTransfer: {
    readonly body: {
        readonly title: "TransferRequest";
        readonly description: "Transfer Request";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "amount to be transferred. Decimals allowed (>= 1.00)";
                readonly examples: readonly ["1.00"];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly beneId: {
                readonly type: "string";
                readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                readonly maxLength: 50;
                readonly examples: readonly ["JOHN18011"];
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "A unique Id to identify this transfer. Alphanumeric and underscore (_) allowed (40 character limit).";
                readonly maxLength: 40;
                readonly examples: readonly ["JUNOB2018"];
            };
            readonly transferMode: {
                readonly type: "string";
                readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
                readonly maxLength: 20;
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Additional remarks, if any. Alphanumeric and white spaces allowed (70 characters limit).";
                readonly maxLength: 70;
            };
            readonly transferType: {
                readonly type: "string";
                readonly description: "Transfer Type";
                readonly maxLength: 7;
            };
            readonly ipAddress: {
                readonly type: "string";
                readonly description: "IP Address of the caller";
            };
            readonly product: {
                readonly type: "string";
                readonly description: "Cashfree Product Name";
            };
            readonly rda: {
                readonly type: "object";
                readonly description: "Rupee Drawing Arrangement";
                readonly properties: {
                    readonly quoteId: {
                        readonly type: "string";
                        readonly description: "Quote ID";
                    };
                    readonly requestCurrency: {
                        readonly type: "string";
                        readonly description: "Request Currency";
                    };
                    readonly sendingCurrency: {
                        readonly type: "string";
                        readonly description: "Sending Currency";
                    };
                    readonly receivingCurrency: {
                        readonly type: "string";
                        readonly description: "Receiving Currency";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly description: "RDA Type";
                        readonly enum: readonly ["inttransfer", "p2p", "p2b", "b2p", "b2b"];
                    };
                    readonly senderMobNo: {
                        readonly type: "string";
                        readonly description: "Sender Mobile Number";
                    };
                    readonly senderKyc: {
                        readonly type: "object";
                        readonly description: "Sender KYC Details";
                        readonly properties: {
                            readonly nationality: {
                                readonly type: "string";
                                readonly description: "Sender's Nationality";
                            };
                            readonly dateOfBirth: {
                                readonly type: "string";
                                readonly description: "Sender's Date of Birth";
                            };
                            readonly document: {
                                readonly type: "object";
                                readonly description: "Sender's Document";
                                readonly properties: {
                                    readonly idType: {
                                        readonly type: "string";
                                        readonly description: "Document Type";
                                    };
                                    readonly idNumber: {
                                        readonly type: "string";
                                        readonly description: "Document Number";
                                    };
                                    readonly expiryDate: {
                                        readonly type: "string";
                                        readonly description: "Document expiration date";
                                    };
                                };
                                readonly required: readonly ["idType", "idNumber", "expiryDate"];
                            };
                            readonly postalAddress: {
                                readonly type: "object";
                                readonly description: "Sender's Postal Address";
                                readonly properties: {
                                    readonly addressLine1: {
                                        readonly type: "string";
                                        readonly description: "Address Line 1";
                                    };
                                    readonly city: {
                                        readonly type: "string";
                                        readonly description: "City";
                                    };
                                    readonly country: {
                                        readonly type: "string";
                                        readonly description: "Country";
                                    };
                                };
                                readonly required: readonly ["addressLine1", "city", "country"];
                            };
                            readonly subjectName: {
                                readonly type: "object";
                                readonly description: "Sender's Name";
                                readonly properties: {
                                    readonly firstName: {
                                        readonly type: "string";
                                        readonly description: "First Name";
                                    };
                                    readonly lastName: {
                                        readonly type: "string";
                                        readonly description: "Last Name";
                                    };
                                    readonly fullName: {
                                        readonly type: "string";
                                        readonly description: "Full Name";
                                    };
                                };
                                readonly required: readonly ["firstName", "lastName", "fullName"];
                            };
                            readonly primaryContactCountryCode: {
                                readonly type: "string";
                                readonly description: "Primary Contact's Country Code";
                            };
                            readonly primaryContactNo: {
                                readonly type: "string";
                                readonly description: "Primary Contact Number";
                            };
                            readonly primaryContactNoType: {
                                readonly type: "string";
                                readonly description: "Primary Contact Type";
                            };
                        };
                        readonly required: readonly ["nationality", "dateOfBirth", "document", "postalAddress", "subjectName"];
                    };
                    readonly receivingCountry: {
                        readonly type: "string";
                        readonly description: "Receiving Country";
                    };
                    readonly remittancePurpose: {
                        readonly type: "string";
                        readonly description: "Remittance Purpose";
                    };
                    readonly sourceOfFunds: {
                        readonly type: "string";
                        readonly description: "Source Of Funds";
                    };
                    readonly relationshipSender: {
                        readonly type: "string";
                        readonly description: "Relationship with Sender";
                    };
                    readonly originCountry: {
                        readonly type: "string";
                        readonly description: "Country of origin";
                    };
                    readonly senderBusinessKyc: {
                        readonly type: "object";
                        readonly description: "Business KYC details";
                        readonly properties: {
                            readonly pinCode: {
                                readonly type: "string";
                                readonly description: "Pincode";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Address";
                            };
                            readonly primaryContactCountryCode: {
                                readonly type: "string";
                                readonly description: "Primary Contact's Country Code";
                            };
                            readonly primaryContactNo: {
                                readonly type: "string";
                                readonly description: "Primary Contact Number";
                            };
                            readonly email: {
                                readonly type: "string";
                                readonly description: "Business Email ID";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Business Name";
                            };
                            readonly addressCountryCode: {
                                readonly type: "string";
                                readonly description: "Business Address Country Code";
                            };
                            readonly countryCode: {
                                readonly type: "string";
                                readonly description: "Country Code";
                            };
                            readonly regType: {
                                readonly type: "string";
                                readonly description: "Registration Type";
                            };
                            readonly regIssuedBy: {
                                readonly type: "string";
                                readonly description: "Registration Issued By";
                            };
                            readonly regIssuedAt: {
                                readonly type: "string";
                                readonly description: "Registration Issued At";
                            };
                            readonly regNumber: {
                                readonly type: "string";
                                readonly description: "Registration Number";
                            };
                            readonly regIssueDate: {
                                readonly type: "string";
                                readonly description: "Registration Issued Date";
                            };
                            readonly idValidThru: {
                                readonly type: "string";
                                readonly description: "Registration ID Validation Date";
                            };
                        };
                        readonly required: readonly ["address", "primaryContactCountryCode", "primaryContactNo", "email", "name", "countryCode", "regType", "regNumber", "regIssueDate", "idValidThru"];
                    };
                };
                readonly required: readonly ["senderMobNo", "remittancePurpose", "sourceOfFunds", "originCountry"];
            };
        };
        readonly required: readonly ["beneId", "amount", "transferId"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RequestTransferV12: {
    readonly body: {
        readonly title: "TransferRequestV12";
        readonly description: "Transfer Request v1.2";
        readonly type: "object";
        readonly properties: {
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "amount to be transferred. Decimals allowed (>= 1.00)";
                readonly examples: readonly ["1.00"];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly beneId: {
                readonly type: "string";
                readonly description: "Beneficiary Id. Alphanumeric characters allowed.";
                readonly examples: readonly ["JOHN18011"];
            };
            readonly transferId: {
                readonly type: "string";
                readonly description: "A unique Id to identify this transfer. Alphanumeric and underscore (_) allowed (40 character limit).";
                readonly examples: readonly ["JUNOB2018"];
            };
            readonly transferMode: {
                readonly type: "string";
                readonly description: "It is the mode of transfer. Allowed values are: banktransfer, neft, imps, rtgs, upi, paytm, and amazonpay. The default transferMode is banktransfer.";
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Additional remarks, if any. Alphanumeric and white spaces allowed (70 characters limit).";
            };
            readonly transferType: {
                readonly type: "string";
                readonly description: "Transfer Type";
                readonly maxLength: 7;
            };
            readonly ipAddress: {
                readonly type: "string";
                readonly description: "IP Address of the caller";
            };
            readonly product: {
                readonly type: "string";
                readonly description: "Cashfree Product Name";
            };
            readonly paymentInstrumentId: {
                readonly type: "string";
                readonly description: "Specify the fund source ID from where you want the amount to be debited.";
            };
        };
        readonly required: readonly ["beneId", "amount", "transferId"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "TransferResponse";
            readonly description: "Transfer Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly referenceId: {
                            readonly type: "string";
                        };
                        readonly utr: {
                            readonly type: "string";
                        };
                        readonly acknowledged: {
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const SelfWithdrawal: {
    readonly body: {
        readonly title: "SelfWithdrawalRequest";
        readonly description: "Self Withdrawal Request";
        readonly type: "object";
        readonly properties: {
            readonly withdrawalId: {
                readonly type: "string";
                readonly description: "Unique identifier for the withdrawal, alphanumeric allowed (50 character limit)";
                readonly examples: readonly ["1"];
            };
            readonly amount: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Amount to be withdrawn, decimal (>= 1.00)";
                readonly examples: readonly [20];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly remarks: {
                readonly type: "string";
                readonly description: "Remarks, if any. Alphanumeric and white space (70 character limit)";
            };
        };
        readonly required: readonly ["withdrawalId", "amount"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "SelfWithdrawalResponse";
            readonly description: "Self Withdrawal Response";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                };
                readonly subCode: {
                    readonly type: "string";
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const VerifyToken: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "x-request-id": {
                    readonly type: "string";
                    readonly examples: readonly ["4dfb9780-46fe-11ee-be56-0242ac120002"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "VerifyTokenResponse";
            readonly description: "Response for verifying Bearer Token";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly examples: readonly ["SUCCESS"];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["Token is valid"];
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly examples: readonly ["200"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly title: "Error";
            readonly description: "Error Response for non-2XX cases";
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly description: "Overall status of the API call";
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Detailed message explaining the response";
                };
                readonly subCode: {
                    readonly type: "string";
                    readonly description: "Status code acting as an umbrella for the response";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { AddBeneficiary, BeneHistory, Cardpay, CreateCashgram, DeactivateCashgram, DirectTransfer, DirectTransferV12, GenerateBearerToken, GetBalance, GetBalanceV12, GetBatchTransferStatus, GetBatchTransferStatusV12, GetBeneficiary, GetBeneficiaryId, GetCashgramStatus, GetIncidents, GetTransferStatus, GetTransferStatusV12, InternalTransfer, InternalTransferV12, Lend, RemoveBeneficiary, RequestAsyncTransfer, RequestAsyncTransferV12, RequestBatchTransfer, RequestBatchTransferV12, RequestTransfer, RequestTransferV12, SelfWithdrawal, VerifyToken };
