export const fieldAlreadyExist = (username, email, phone) => ({
    success: false,
    message: `${username} username is already exist with the ${email} and the phone number ${phone}`
});

export const successRegistration = () => ({
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
    message: 'This function is forbidden for not admin users',
});

export const forbiddenActivePremission = () => ({
    success: false,
    message: 'This function is forbidden for not active users',
});