"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'cashfreedocs-new/2023-10-26 (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Use this API to generate the token from client id and secret
     *
     * @summary Generate Bearer Token
     * @throws FetchError<401, types.GenerateBearerTokenResponse401> Unauthorized Error
     */
    SDK.prototype.generateBearerToken = function (metadata) {
        return this.core.fetch('/payout/v1/authorize', 'post', metadata);
    };
    /**
     * Use this API to verify the bearer token generated. If the token does not
     * exist/invalid/expired, the response 'Token is not valid' is returned. Regenerate token
     * in case of token expiry to make API calls (use /payout/v1/authorize for this).
     *
     * @summary Verify the bearer token generated
     * @throws FetchError<403, types.VerifyTokenResponse403> Forbidden Error
     */
    SDK.prototype.verifyToken = function (metadata) {
        return this.core.fetch('/payout/v1/verifyToken', 'post', metadata);
    };
    /**
     * Use this API to add a beneficiary to your Cashfree account by providing the bank account
     * number, IFSC, and other required details. Before you request a transfer, ensure the
     * account has been successfully added as a beneficiary.
     *
     * @summary Add a beneficiary for making transfers to it.
     * @throws FetchError<403, types.AddBeneficiaryResponse403> Forbidden Error
     * @throws FetchError<409, types.AddBeneficiaryResponse409> Resource Conflict Error
     * @throws FetchError<412, types.AddBeneficiaryResponse412> Precondition Failed Error
     * @throws FetchError<422, types.AddBeneficiaryResponse422> Unprocessable Entity
     */
    SDK.prototype.addBeneficiary = function (body, metadata) {
        return this.core.fetch('/payout/v1/addBeneficiary', 'post', body, metadata);
    };
    /**
     * Use this API to get the details of a particular beneficiary in your account.
     *
     * @summary Get Beneficiary details by id
     * @throws FetchError<403, types.GetBeneficiaryResponse403> Forbidden Error
     * @throws FetchError<404, types.GetBeneficiaryResponse404> Resource Not Found
     */
    SDK.prototype.getBeneficiary = function (metadata) {
        return this.core.fetch('/payout/v1/getBeneficiary/{beneId}', 'get', metadata);
    };
    /**
     * Use this API to get the beneficiary ID by providing the bank account number and ifsc.
     *
     * @summary Get Beneficiary ID by bank account and ifsc
     * @throws FetchError<403, types.GetBeneficiaryIdResponse403> Forbidden Error
     * @throws FetchError<404, types.GetBeneficiaryIdResponse404> Resource Not Found
     */
    SDK.prototype.getBeneficiaryID = function (metadata) {
        return this.core.fetch('/payout/v1/getBeneId', 'get', metadata);
    };
    /**
     * Use this API to remove an existing beneficiary from a list of added beneficiaries.
     *
     * @summary Remove Beneficiary
     * @throws FetchError<403, types.RemoveBeneficiaryResponse403> Forbidden Error
     */
    SDK.prototype.removeBeneficiary = function (body, metadata) {
        return this.core.fetch('/payout/v1/removeBeneficiary', 'post', body, metadata);
    };
    /**
     * Use this API to fetch the transaction history for a particular beneficiary and for a
     * desired period of time.
     *
     * @summary Get Beneficiary History
     * @throws FetchError<403, types.BeneHistoryResponse403> Forbidden Error
     * @throws FetchError<422, types.BeneHistoryResponse422> Unprocessable Entity
     */
    SDK.prototype.beneHistory = function (metadata) {
        return this.core.fetch('/payout/v1/beneHistory', 'get', metadata);
    };
    /**
     * Use this API to get the ledger balance and available balance of your account. Available
     * balance is ledger balance minus the sum of all pending transfers (transfers triggered
     * and processing or pending now).
     *
     * @summary Get Balance
     * @throws FetchError<403, types.GetBalanceResponse403> Forbidden Error
     */
    SDK.prototype.getBalance = function (metadata) {
        return this.core.fetch('/payout/v1/getBalance', 'get', metadata);
    };
    /**
     * Use this API to get the ledger balance and available balance of your account. Available
     * balance is ledger balance minus the sum of all pending transfers (transfers triggered
     * and processing or pending now).
     *
     * @summary Get Balance V1.2
     * @throws FetchError<403, types.GetBalanceV12Response403> Forbidden Error
     * @throws FetchError<422, types.GetBalanceV12Response422> Unprocessable Entity
     */
    SDK.prototype.getBalance_v12 = function (metadata) {
        return this.core.fetch('/payout/v1.2/getBalance', 'get', metadata);
    };
    /**
     * Use this API to request a self withdrawal at Cashfree. Self withdrawal is allowed a
     * maximum of 3 times a day. The API response will either result in an ERROR or SUCCESS
     * response. The status of the withdrawal request is available on the dashboard.
     *
     * @summary Self Withdrawal
     * @throws FetchError<403, types.SelfWithdrawalResponse403> Forbidden Error
     */
    SDK.prototype.selfWithdrawal = function (body, metadata) {
        return this.core.fetch('/payout/v1/selfWithdrawal', 'post', body, metadata);
    };
    /**
     * Use this API to request an internal transfer at Cashfree. The internal transfer API is
     * useful for multiple Payouts accounts. The API response will either result in an ERROR or
     * SUCCESS response.
     *
     * @summary Internal Transfer
     * @throws FetchError<403, types.InternalTransferResponse403> Forbidden Error
     * @throws FetchError<404, types.InternalTransferResponse404> Resource Not Found
     * @throws FetchError<422, types.InternalTransferResponse422> Unprocessable Entity
     */
    SDK.prototype.internalTransfer = function (body, metadata) {
        return this.core.fetch('/payout/v1/internalTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to request an internal transfer. It is useful for accounts with multiple
     * fund sources. You need to provide either the rechargeAccount or paymentInstrumentId and
     * toPaymentInstrumentId along with the amount.
     *
     * @summary Internal Transfer V1.2
     * @throws FetchError<422, types.InternalTransferV12Response422> Unprocessable Entity
     */
    SDK.prototype.internalTransfer_v12 = function (body, metadata) {
        return this.core.fetch('/payout/v1.2/internalTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
     * id, amount, and transfer id. This is a sync transfer request.
     *
     * @summary Standard Transfer Sync
     * @throws FetchError<403, types.RequestTransferResponse403> Forbidden Error
     */
    SDK.prototype.requestTransfer = function (body, metadata) {
        return this.core.fetch('/payout/v1/requestTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
     * id, amount, and transfer id. This is an async transfer request.
     *
     * @summary Standard Transfer Async
     * @throws FetchError<403, types.RequestAsyncTransferResponse403> Forbidden Error
     * @throws FetchError<422, types.RequestAsyncTransferResponse422> Unprocessable Entity
     */
    SDK.prototype.requestAsyncTransfer = function (body, metadata) {
        return this.core.fetch('/payout/v1/requestAsyncTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to initiate amount transfers directly to the beneficiary account via a bank
     * transfer or UPI. You can add the beneficiary details in the same API request.
     *
     * @summary Direct Transfer
     * @throws FetchError<403, types.DirectTransferResponse403> Forbidden Error
     */
    SDK.prototype.directTransfer = function (body, metadata) {
        return this.core.fetch('/payout/v1/directTransfer', 'post', body, metadata);
    };
    /**
     * Use these details to get details of a particular transfer. You can pass referenceId or
     * transferId to fetch the details.
     *
     * @summary Get Transfer Status
     * @throws FetchError<403, types.GetTransferStatusResponse403> Forbidden Error
     * @throws FetchError<404, types.GetTransferStatusResponse404> Resource Not Found
     */
    SDK.prototype.getTransferStatus = function (metadata) {
        return this.core.fetch('/payout/v1/getTransferStatus', 'get', metadata);
    };
    /**
     * Use this API to create multiple transfers to multiple beneficiaries. This API accepts an
     * array of transfer objects under the batch field.
     *
     * @summary Batch Transfer
     * @throws FetchError<403, types.RequestBatchTransferResponse403> Forbidden Error
     * @throws FetchError<409, types.RequestBatchTransferResponse409> Resource Conflict Error
     * @throws FetchError<422, types.RequestBatchTransferResponse422> Unprocessable Entity
     */
    SDK.prototype.requestBatchTransfer = function (body, metadata) {
        return this.core.fetch('/payout/v1/requestBatchTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to get the status of the Batch Transfer.
     *
     * @summary Get Batch Transfer Status
     * @throws FetchError<403, types.GetBatchTransferStatusResponse403> Forbidden Error
     * @throws FetchError<404, types.GetBatchTransferStatusResponse404> Resource Not Found
     */
    SDK.prototype.getBatchTransferStatus = function (metadata) {
        return this.core.fetch('/payout/v1/getBatchTransferStatus', 'get', metadata);
    };
    /**
     * Use this API to transfer money to beneficiary cards. Provide details such as beneficiary
     * name, card type, network type, and transfer ID.
     *
     * @summary CardPay
     * @throws FetchError<400, types.CardpayResponse400> Bad Request Error
     * @throws FetchError<403, types.CardpayResponse403> Forbidden Error
     * @throws FetchError<412, types.CardpayResponse412> Precondition Failed Error
     * @throws FetchError<422, types.CardpayResponse422> Unprocessable Entity
     */
    SDK.prototype.cardpay = function (body, metadata) {
        return this.core.fetch('/payout/v1/cardpay', 'post', body, metadata);
    };
    /**
     * Use this API to send requests for loan disbursement to the beneficiary. The service
     * charges are pooled for the respective party and disbursed at the end of day.
     * Disbursement amount = (Amount - total service charges).
     *
     * @summary Lend
     * @throws FetchError<400, types.LendResponse400> Bad Request Error
     * @throws FetchError<403, types.LendResponse403> Forbidden Error
     * @throws FetchError<422, types.LendResponse422> Unprocessable Entity
     */
    SDK.prototype.lend = function (body, metadata) {
        return this.core.fetch('/payout/v1/lend', 'post', body, metadata);
    };
    /**
     * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
     * id, amount, and transfer id. This is a sync transfer request.
     *
     * @summary Standard Transfer Sync v1.2
     * @throws FetchError<403, types.RequestTransferV12Response403> Forbidden Error
     */
    SDK.prototype.requestTransfer_v12 = function (body, metadata) {
        return this.core.fetch('/payout/v1.2/requestTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
     * id, amount, and transfer id. This is an async transfer request.
     *
     * @summary Standard Transfer Async v1.2
     * @throws FetchError<403, types.RequestAsyncTransferV12Response403> Forbidden Error
     */
    SDK.prototype.requestAsyncTransfer_v12 = function (body, metadata) {
        return this.core.fetch('/payout/v1.2/requestAsyncTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to initiate amount transfers directly to the beneficiary account via a bank
     * transfer or UPI. You can add the beneficiary details in the same API request.
     *
     * @summary Direct Transfer V1.2
     * @throws FetchError<403, types.DirectTransferV12Response403> Forbidden Error
     */
    SDK.prototype.directTransfer_v12 = function (body, metadata) {
        return this.core.fetch('/payout/v1.2/directTransfer', 'post', body, metadata);
    };
    /**
     * Use these details to get details of a particular transfer. You can pass referenceId or
     * transferId to fetch the details.
     *
     * @summary Get Transfer Status V1.2
     * @throws FetchError<403, types.GetTransferStatusV12Response403> Forbidden Error
     * @throws FetchError<404, types.GetTransferStatusV12Response404> Resource Not Found
     */
    SDK.prototype.getTransferStatus_v12 = function (metadata) {
        return this.core.fetch('/payout/v1.2/getTransferStatus', 'get', metadata);
    };
    /**
     * Use this API to create transfers to multiple beneficiaries. This API accepts an array of
     * transfer objects under the batch field.
     *
     * @summary Batch Transfer V1.2
     * @throws FetchError<403, types.RequestBatchTransferV12Response403> Forbidden Error
     * @throws FetchError<409, types.RequestBatchTransferV12Response409> Resource Conflict Error
     * @throws FetchError<422, types.RequestBatchTransferV12Response422> Unprocessable Entity
     */
    SDK.prototype.requestBatchTransfer_v12 = function (body, metadata) {
        return this.core.fetch('/payout/v1.2/requestBatchTransfer', 'post', body, metadata);
    };
    /**
     * Use this API to get the status of the Batch Transfer.
     *
     * @summary Get Batch Transfer Status V1.2
     * @throws FetchError<403, types.GetBatchTransferStatusV12Response403> Forbidden Error
     * @throws FetchError<404, types.GetBatchTransferStatusV12Response404> Resource Not Found
     */
    SDK.prototype.getBatchTransferStatus_v12 = function (metadata) {
        return this.core.fetch('/payout/v1.2/getBatchTransferStatus', 'get', metadata);
    };
    /**
     * Use this API to get the list of incidents on banks (Resolved, Unresolved, All) for a
     * given time range.
     *
     * @summary Get Incidents
     * @throws FetchError<403, types.GetIncidentsResponse403> Forbidden Error
     * @throws FetchError<422, types.GetIncidentsResponse422> Unprocessable Entity
     */
    SDK.prototype.getIncidents = function (metadata) {
        return this.core.fetch('/payout/v1/incidents', 'get', metadata);
    };
    /**
     * Use this API to create a Cashgram.
     *
     * @summary Create Cashgram
     * @throws FetchError<409, types.CreateCashgramResponse409> Resource Conflict Error
     */
    SDK.prototype.createCashgram = function (body, metadata) {
        return this.core.fetch('/payout/v1/createCashgram', 'post', body, metadata);
    };
    /**
     * Use this API to get the status of the Cashgram created.
     *
     * @summary Get Cashgram Status
     * @throws FetchError<404, types.GetCashgramStatusResponse404> Resource Not Found
     */
    SDK.prototype.getCashgramStatus = function (metadata) {
        return this.core.fetch('/payout/v1/getCashgramStatus', 'get', metadata);
    };
    /**
     * Use this API to deactivate a Cashgram.
     *
     * @summary Deactivate Cashgram
     * @throws FetchError<404, types.DeactivateCashgramResponse404> Resource Not Found
     */
    SDK.prototype.deactivateCashgram = function (body, metadata) {
        return this.core.fetch('/payout/v1/deactivateCashgram', 'post', body, metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
