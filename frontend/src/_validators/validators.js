import Validators from "redux-form-validators";

const configureValidators = () => {
  Object.assign(Validators.messages, {
    email: "Please enter valid email address",
    presence: "This field is required",
    tooShort: "The value is too short: {count, number} chars minimum"
  });
};

export default configureValidators;
