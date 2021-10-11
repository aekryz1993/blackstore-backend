export const fieldAlreadyExist = (username, email, phone) => ({
    success: false,
    message: `${username} username is already exist with the ${email} and the phone number ${phone}`
});

export const successRegistrationUser = (user) => ({
    success: true,
    message: `تم إضافة العميل ${user} بنجاح`
})

export const userNotExist = (info) => ({
    success: false,
    message: info ? info.message : 'Login failed',
    auth: false
});

export const forbiddenAdminPremission = () => ({
    success: false,
    message: 'This function is forbidden for not admin user',
});

export const forbiddenActivePremission = () => ({
    success: false,
    message: 'This function is forbidden for not active user',
});

export const forbiddenPremission = () => ({
    success: false,
    message: 'This function is forbidden for not current user',
});