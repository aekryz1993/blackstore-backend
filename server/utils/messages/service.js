export const fieldAlreadyExist = (label) => ({
    success: false,
    message: `${label} service is already exist`
});

export const successRegistration = (label) => ({
    success: true,
    message: `${label} has been successfuly added`
})