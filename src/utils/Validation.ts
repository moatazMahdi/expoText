const phoneNumberRegex = /^01[0125][0-9]{8}$/;

export function validate(value, validationFunction) {
  if (value === '') return true;
  return validationFunction(value);
}

export function phoneNumberValidation(phoneNumberValue) {
  return phoneNumberRegex.test(phoneNumberValue);
}

// export function fullNameValidation(fullNameValue) {
//   return (
//     fullNameValue.trim().split(' ').length >= 3
//     && fullNameValue.trim().split(' ').every((word) => word.length >= 2));
// }

export function fullNameValidation(fullNameValue) {
  const cleanedFullName = fullNameValue.trim().replace(/\s+/g, ' '); // Replace consecutive spaces with a single space
  const words = cleanedFullName.split(' ');

  return words.length >= 3 && words.every((word) => word.length >= 2);
}
