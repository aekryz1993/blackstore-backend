export const fieldAlreadyExist = (username, email, phone) => ({
  success: false,
  message: `${username} username is already exist with the ${email} and the phone number ${phone}`,
});

export const successRegistrationUser = (user, totalUsers) => ({
  success: true,
  user,
  totalUsers,
  totalPages: Math.ceil(totalUsers / 6),
  message: `تم إضافة العميل ${user.username} بنجاح`,
});

export const successUpdatedUser = (user) => ({
  success: true,
  updatedUser: user,
  message: `User has been successfully updated`,
});

export const userNotExist = (info) => ({
  message: info ? info.message : "Login failed",
});

export const invalidToken = (info) => ({
  message: "Invalid Token",
});

export const forbiddenAdminPremission = () => ({
  success: false,
  message: "This function is forbidden for not admin user",
});

export const forbiddenActivePremission = () => ({
  success: false,
  message: "This function is forbidden for not active user",
});

export const forbiddenPremission = () => ({
  success: false,
  message: "This function is forbidden for not current user",
});
