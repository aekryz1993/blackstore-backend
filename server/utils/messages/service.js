export const fieldAlreadyExist = (label) => ({
    success: false,
    message: `تم اضافتها مسبقا ${label}`
});

export const successRegistration = (label) => ({
    success: true,
    message: `بنجاح ${label} تم اضافة خدمة`
})

export const serviceNotExist = (label) => ({
    success: false,
    message: `غير موجود ${label}`
})