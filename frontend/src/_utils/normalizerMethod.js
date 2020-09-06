export const amount = (value, previousValue, allValues) => {
  if (value.length === 1 && value[0] === ".") {
    value = "0.";
  }
  //   value.replace(/[^0-9\.]/g, "");
  value.replace(/\D/, "");
  if (!(value.indexOf(".") == -1)) {
    if ((value.toString().split(".")[1].length || 0) > 3) {
      return previousValue + ".00";
    } else {
      return value;
    }
  }
  return value.replace(/\D/, "");
};

// ^[0-9]+$

export const phoneeCheck = value => {
  if (value.match(/^(?=.*[0-9])[- +()0-9]+$/)) {
    return value;
  } else {
    return value.length > 0 ? value.substring(0, value.length - 1) : "";
  }
};

export const numericCheck = value => {
  if (value != undefined) {
    return value.replace(/\D/, "");
  }
};

export const formatAmount = value => {
  if (value) {
    value = value.toString();
    if (value.match(/[a-z]/i)) {
      return 0;
    } else {
      let formatter = new Intl.NumberFormat("en-US");
      let formatedValue = formatter.format(value.replace(/,/g, ""));
      return formatedValue;
    }
  }
};
