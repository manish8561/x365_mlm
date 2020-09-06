import { addValidator } from "redux-form-validators";
import { validate } from "wallet-address-validator";
import { VALIDATE_WALLET_ADRESS } from "../_constants";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export var phoneNumber = addValidator({
  validator: function(options, value, allValues) {
    if (!value.match(/^(0|[1-9][0-9]{9})$/)) {
      return {
        defaultMessage: "Invalid phone number, must be 10 digits"
      };
    }
  }
});

export var zipcpde = addValidator({
  validator: function(options, value, allValues) {
    if (!allValues.zip.match(/^[\w\-\s]+$/)) {
      return {
        defaultMessage: "Invalid zip code"
      };
    }
  }
});

export var amountUsd = addValidator({
  validator: function(options, value, allValues) {
    var regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

    if (!value.match(regex)) {
      return {
        defaultMessage: "Invalid amount"
      };
    }
  }
});

export var amountValidator = addValidator({
  validator: function(options, value, allValues) {
    var regex = /^[0-9]+\.?[0-9]*$/;

    //
    if (!allValues[options].match(regex)) {
      return {
        defaultMessage: "Invalid amount"
      };
    }
  }
});

export const walletAddressValidator = addValidator({
  validator: function(options, value, allValues) {
    let valid = validate(value, "eth", VALIDATE_WALLET_ADRESS);
    if (!valid) {
      // return {
      //   defaultMessage: "Invalid Wallet Address"
      // };
    }
  }
});

export const checkBoxrequired = addValidator({
  validator: function(options, value, allValues) {
    if (!allValues[options]) {
      return {
        defaultMessage: "No Selected"
      };
    }
  }
});

export const validatePhoneNumber = addValidator({
  validator: function(options, value, allValues) {
    if (value.match(/^(?=.*[0-9])[- +()0-9]+$/)) {
      let phoneNumber = parsePhoneNumberFromString(value, options);
      if (phoneNumber) {
        if (!phoneNumber.isValid()) {
          return {
            defaultMessage: "Not Valid Phone Number"
          };
        }
      } else {
        if (value && value.length === 1) {
          return {
            defaultMessage: "Not Valid Phone Number"
          };
        }
      }
    } else {
      return {
        defaultMessage: "Not Valid Phone Number"
      };
    }
  }
});
//
export const amountCheckMinMax = addValidator({
  validator: function(options, value, allValues) {
    value = value.replace(/,/g, "");
    let amount = parseInt(value);
    if (amount >= options.min && amount <= options.max) {
    } else {
      return {
        defaultMessage: "not valid amount"
      };
    }
  }
});
