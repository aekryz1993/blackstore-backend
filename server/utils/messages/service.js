export const fieldAlreadyExist = (label) => ({
  success: false,
  message: `تم اضافتها مسبقا ${label}`,
});

export const successRegistration = (product) => ({
  success: true,
  product,
  message: `بنجاح ${product.label} تم اضافة خدمة`,
});

export const serviceNotExist = () => ({
  success: false,
  message: `this Service doen't exist`,
});
