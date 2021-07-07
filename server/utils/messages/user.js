export const fieldAlreadyExist = (username, email, phone) => ({
    success: false,
    message: `${username} username is already exist with the ${email} and the phone number ${phone}`
});

export const successRegistrationUser = () => ({
    success: true,
    message: `the user is successfuly registred`
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

export const forbiddenSessionPremission = () => ({
    success: false,
    message: 'This function is forbidden for not current user',
});