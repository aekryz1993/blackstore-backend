export const fieldAlreadyExist = (label) => ({
    success: false,
    message: `تم اضافتها مسبقا ${label}`
});

export const successRegistration = (product) => ({
    success: true,
    product,
    message: `بنجاح ${product.label} تم اضافة خدمة`
})

export const serviceNotExist = (label) => ({
    success: false,
    message: `غير موجود ${label}`
})