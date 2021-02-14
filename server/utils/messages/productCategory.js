export const productCategoryAlreadyExistMsg = (label) => ({
    success: false,
    message: `تم اضافتها مسبقا ${label}`
});

export const productCategorySuccessRegistrationMsg = (label) => ({
    success: true,
    message: `بنجاح ${label} تم اضافة خدمة`
})

export const productCategoryNotExistMsg = (label) => ({
    success: false,
    message: `غير موجود ${label}`
})