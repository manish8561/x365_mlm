import React from "react";
// import { Select } from "components/Select/Select";
// import "./FormField.scss";
import {
  Button,
  Input,
  Form,
  Checkbox as Check,
  Label,
  GridColumn,
  Grid
} from "semantic-ui-react";

const TextField = props => {
  const { meta = {} } = props;

  const inputProps = {
    type: props.type || "text",
    className: "form__input",
    name: props.input.name,
    id: props.input.name,
    readOnly: props.readOnly,
    autoFocus: props.autoFocus,
    autoComplete: props.autoComplete,
    placeholder: props.placeholder,
    maxLength: props.maxLength,
    value: meta.uncontrolled ? undefined : props.input.value,
    defaultValue: meta.uncontrolled ? props.defaultValue : undefined,
    onChange: props.input.onChange,
    onKeyUp: props.onKeyUp,
    onBlur: props.input.onBlur,
    action: props.action,
    disabled: props.disabled,
    onPaste: props.onPaste
    // label: "as"
  };

  let errorClassName = meta.touched && meta.error ? "error-inputs" : "";
  return (
    <React.Fragment>
      <Input {...inputProps} className={errorClassName} />
      {/* {meta.touched && meta.error ? (
        <div className="form__field-error">{meta.error}</div>
      ) : null} */}
    </React.Fragment>
  );
};

const AmountFields = props => {
  const { meta = {} } = props;

  const inputProps = {
    type: "text",
    className: "form__input",
    name: props.input.name,
    id: props.input.name,
    readOnly: props.readOnly,
    autoFocus: props.autoFocus,
    autoComplete: props.autoComplete,
    placeholder: props.placeholder,
    maxLength: props.maxLength,
    value: meta.uncontrolled ? undefined : props.input.value,
    defaultValue: meta.uncontrolled ? props.defaultValue : undefined,
    onChange: props.input.onChange,
    onKeyUp: props.onKeyUp,
    onKeyDown: props.onKeyDown,
    onBlur: props.input.onBlur,
    action: props.action,
    disabled: props.disabled,
    onPaste: props.input.onPaste
    // label: "as"
  };

  let errorClassName = meta.touched && meta.error ? "error-input" : "";
  return (
    <React.Fragment>
      <Input {...inputProps} className={errorClassName} />
      {/* {meta.touched && meta.error ? (
        <div className="form__field-error">{meta.error}</div>
      ) : null} */}
    </React.Fragment>
  );
};

const CheckBox = props => {
  const { meta = {} } = props;

  const checboxProps = {
    type: "checkbox",
    className: "form__checkbox",
    name: props.input.name,
    id: props.input.name,
    value: props.input.value ? props.input.value : props.input.name,
    defaultChecked: meta.uncontrolled ? props.defaultChecked : undefined,
    onChange: props.input.onChange,
    checked: props.input.checked,
    label: props.input.label
  };

  return (
    <React.Fragment>
      <input {...checboxProps} />
      <label htmlFor={props.input.name}>{props.label}</label>
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </React.Fragment>
  );
};

const CheckBoxs = props => {
  const { meta = {} } = props;
  const checboxProps = {
    type: "checkbox",
    className: "form__checkbox",
    name: props.input.name,
    id: props.input.name,
    value: props.input.value ? props.input.value : props.input.name,
    // defaultChecked: true,
    onChange: props.input.onChange,
    checked: props.input.checked,
    label: props.input.label
  };
  //
  let errorClassName =
    meta.touched && meta.error ? "error-input errorChkbox" : "";

  return (
    <React.Fragment>
      <Check {...checboxProps} className={errorClassName} />
      <label htmlFor={props.input.name}>{props.label}</label>
      {/* {meta.touched && meta.error ? (
        <div className="form__field-error">{meta.error}</div>
      ) : null} */}
    </React.Fragment>
  );
};

const SelectField = ({ input, meta: { touched, error }, children, values }) => {
  input["value"] = values;
  return (
    <React.Fragment>
      <select {...input}>
        {children.map((x, y) => (
          <option key={y} value={x.value}>
            {x.name}
          </option>
        ))}
      </select>
      {touched && error && <div className="form__field-error">{error}</div>}
    </React.Fragment>
  );
};

const FormField = props => {
  switch (props.type) {
    case "checkbox":
      return <CheckBox {...props} />;
    case "checkboxs":
      return <CheckBoxs {...props} />;
    case "select":
      return <SelectField {...props} />;
    case "amount":
      return <AmountFields {...props} />;
    case "input":
    default:
      return <TextField {...props} />;
  }
};

export { TextField, CheckBox, FormField, CheckBoxs };
