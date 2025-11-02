# 📚 Components Documentation - Dactra Project

## دليل شامل لجميع الكومبوننتات المستخدمة في المشروع

---

## 📄 الصفحات (Pages)

### 1. `SignupPage.jsx`
**الموقع:** `src/Pages/Auth/SignupPage.jsx`

**الوظيفة:**
- صفحة التسجيل الرئيسية
- تدعم 4 أنواع مستخدمين: Patient, Doctor, Scan, Lap
- تحتوي على فورم ديناميكي يتغير حسب نوع المستخدم

**الاستخدام:**
- Route: `/auth/Signup`
- يستخدم في: `Routes.jsx` كصفحة التسجيل

**الكود بالتفصيل:**
```jsx
// السطر 22-24: تعريف الكومبوننت والدولة
export default function SignupPage() {
  const navigate = useNavigate(); // من react-router-dom للتنقل بين الصفحات
  const [userType, setUserType] = useState(DEFAULT_USER_TYPE); // حالة نوع المستخدم (patient, doctor, scan, lap)
```

```jsx
// السطر 27-71: دالة معالجة إرسال الفورم
const handleSubmit = async (values, { setSubmitting }) => {
  // values: القيم المدخلة في الفورم (fullName, email, password, etc.)
  // setSubmitting: دالة من Formik لتحديث حالة الإرسال
  
  try {
    // السطر 30-36: تجهيز البيانات للإرسال للباك اند
    const signupData = {
      userType,           // نوع المستخدم
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phone: values.phone,
    };
    
    // السطر 39-41: إضافة رقم الترخيص إذا لم يكن Patient
    if (userType !== "patient") {
      signupData.licenseNumber = values.licenseNumber;
    }
    
    // السطر 48-54: حفظ البيانات في localStorage (مؤقتاً)
    const existingData = JSON.parse(localStorage.getItem("signupData") || "[]");
    existingData.push({ ...signupData, timestamp: new Date().toISOString() });
    localStorage.setItem("signupData", JSON.stringify(existingData));
    
    // السطر 57: عرض رسالة نجاح
    toast.success("Signup successful! Please check your email to complete your Sign Up.");
  } catch (error) {
    // معالجة الأخطاء
  }
};
```

```jsx
// السطر 74-81: User Type Selector Bar
<div className="w-full max-w-[1000px] px-[20px]">
  <UserTypeSelector
    userType={userType}              // النوع المحدد حالياً
    onUserTypeChange={setUserType}  // دالة لتغيير النوع
  />
</div>
```

```jsx
// السطر 86-98: صورة ديناميكية تتغير حسب نوع المستخدم
<AnimatePresence mode="wait">  {/* من framer-motion للأنيميشن */}
  <motion.img
    key={userType}  // عند تغيير userType، يتم إعادة إنشاء الصورة
    src={USER_TYPE_IMAGES[userType]}  // الصورة من authConstants
    alt={`${userType} SignUp Image`}
    initial={{ opacity: 0, x: -20 }}   // الحالة الأولية (مختفي على اليسار)
    animate={{ opacity: 1, x: 0 }}     // الحالة النهائية (ظاهر في المركز)
    exit={{ opacity: 0, x: 20 }}       // عند الخروج (يختفي على اليمين)
    transition={{ duration: 0.3 }}     // مدة الأنيميشن
  />
</AnimatePresence>
```

```jsx
// السطر 105: Brand Logo Component
<BrandLogo />  // يعرض شعار Dactra واسم الموقع
```

```jsx
// السطر 109-114: Formik Form Wrapper
<Formik
  key={userType}  // عند تغيير userType، يتم إعادة تعيين الفورم
  initialValues={getSignupInitialValues(userType)}  // القيم الأولية حسب نوع المستخدم
  validationSchema={getSignupValidationSchema(userType)}  // قواعد التحقق
  onSubmit={handleSubmit}  // دالة المعالجة عند الإرسال
  enableReinitialize  // إعادة التهيئة عند تغيير userType
>
```

```jsx
// السطر 120-126: حقل Full Name
<FormInputField
  name="fullName"           // اسم الحقل في الفورم
  label="Full Name"         // التسمية
  type="text"               // نوع الحقل
  placeholder="Enter Your Full Name"
  icon={MdPerson}           // أيقونة من react-icons
/>
```

```jsx
// السطر 165-175: حقل License Number (يظهر فقط لغير Patient)
{userType !== "patient" && (
  <FormInputField
    name="licenseNumber"
    label="License Number"
    type="text"
    placeholder="Enter Your License Number"
    icon={FaIdCard}
  />
)}
```

```jsx
// السطر 180-184: زر Submit
<SubmitButton
  text="Complete Sign Up"      // النص العادي
  loadingText="Signing up..."  // النص أثناء التحميل
  isLoading={isSubmitting}     // حالة التحميل من Formik
/>
```

```jsx
// السطر 186-190: رابط التنقل
<AuthLink
  to="/auth/Login"           // الصفحة المستهدفة
  text="Do you have an account ?"  // النص
  linkText="log in"          // النص القابل للنقر
/>
```

---

## 🧩 الكومبوننتات المشتركة (Common Components)

### 1. `BrandLogo.jsx`
**الموقع:** `src/Components/Common/BrandLogo.jsx`

**الوظيفة:**
- يعرض شعار Dactra واسم الموقع
- كومبوننت قابل لإعادة الاستخدام

**الاستخدام:**
- يستخدم في: `SignupPage.jsx` (السطر 105)

**الكود بالتفصيل:**
```jsx
// السطر 1: استيراد صورة الشعار
import Icon from "../../assets/images/icons/dactraIcon.png";

// السطر 3: تعريف الكومبوننت مع props اختيارية
export default function BrandLogo({ 
  size = "size-[50px]",      // حجم الصورة (افتراضي 50px)
  textSize = "text-[30px]"   // حجم النص (افتراضي 30px)
}) {
  return (
    <div className="flex justify-center items-center gap-[10px]">
      {/* السطر 6: صورة الشعار */}
      <img src={Icon} alt="dactra Icon" className={size} />
      
      {/* السطر 7-9: اسم الموقع */}
      <p className={`font-english font-[800] ${textSize} text-[#003465]`}>
        Dactra
      </p>
    </div>
  );
}
```

**متى تستخدمه:**
- في أي صفحة تحتاج عرض شعار الموقع
- صفحات Auth (Login, Signup, etc.)
- Header للموقع

---

### 2. `FormInputField.jsx`
**الموقع:** `src/Components/Common/FormInputField.jsx`

**الوظيفة:**
- حقل إدخال قابل لإعادة الاستخدام
- يدعم التحقق من الصحة (validation) من خلال Formik
- يدعم إظهار/إخفاء الباسورد تلقائياً للحقول من نوع password
- يعرض رسائل الخطأ تلقائياً

**الاستخدام:**
- يستخدم في: `SignupPage.jsx` (6 مرات)
  - Full Name (السطر 120)
  - Email (السطر 129)
  - Password (السطر 138)
  - Confirm Password (السطر 147)
  - Phone (السطر 156)
  - License Number (السطر 167)

**الكود بالتفصيل:**
```jsx
// السطر 1-3: استيراد المكتبات
import { useState } from "react";  // لإدارة حالة إظهار/إخفاء الباسورد
import { Field, ErrorMessage } from "formik";  // من Formik للربط مع الفورم
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";  // أيقونات العين

// السطر 5-12: تعريف الكومبوننت مع Props
export default function FormInputField({
  name,         // اسم الحقل (مطلوب) - يربط مع Formik
  label,        // التسمية (مطلوب)
  type = "text", // نوع الحقل (افتراضي text)
  placeholder,  // النص التوضيحي
  icon: Icon,    // أيقونة من react-icons (اختياري)
  className = "", // كلاسات CSS إضافية
}) {
  // السطر 13-16: إدارة حالة إظهار/إخفاء الباسورد
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";  // هل الحقل باسورد؟
  const inputType = isPasswordField && showPassword ? "text" : type;  // نوع الحقل الفعلي
  const showPasswordToggle = isPasswordField;  // هل نعرض زر التبديل؟
  
  return (
    <div className="flex flex-col gap-[5px]">
      {/* السطر 20-25: التسمية */}
      <label htmlFor={name} className="text-[#003465] font-[500] font-english">
        {label}
      </label>
      
      <div className="relative">
        {/* السطر 27-29: أيقونة على اليسار (إن وجدت) */}
        {Icon && (
          <Icon className="absolute left-2 top-1/2 -translate-y-1/2 text-[#BCBEC0]" />
        )}
        
        {/* السطر 30-36: حقل الإدخال من Formik */}
        <Field
          type={inputType}  // نوع الحقل (text أو password بناءً على الحالة)
          id={name}
          name={name}       // يربط مع Formik
          placeholder={placeholder}
          className={`w-full h-[32px] border placeholder:text-[#BCBEC0] placeholder:text-[15px] 
                      border-[#BCBEC0] rounded-[5px] pl-8 
                      ${showPasswordToggle ? "pr-8" : ""}  // padding يمين إذا كان فيه toggle
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 
                      focus:bg-blue-50 transition-all duration-300 ${className}`}
        />
        
        {/* السطر 37-49: زر إظهار/إخفاء الباسورد */}
        {showPasswordToggle && (
          <button
            type="button"  // نوع button لمنع إرسال الفورم
            onClick={() => setShowPassword(!showPassword)}  // تبديل الحالة
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#BCBEC0] 
                       hover:text-[#3E69FE] transition-colors duration-300"
          >
            {showPassword ? (
              <RiEyeOffLine className="text-[18px]" />  // إذا كان ظاهر، إخفاء
            ) : (
              <RiEyeLine className="text-[18px]" />     // إذا كان مخفي، إظهار
            )}
          </button>
        )}
      </div>
      
      {/* السطر 51-55: رسالة الخطأ من Formik */}
      <ErrorMessage
        name={name}              // اسم الحقل
        component="div"          // العنصر المستخدم لعرض الخطأ
        className="text-red-500 text-[12px]"
      />
    </div>
  );
}
```

**متى تستخدمه:**
- في أي فورم تحتاج حقول إدخال
- صفحات Auth
- صفحات الإعدادات
- أي صفحة تحتوي على Formik form

**مميزات:**
- ✅ دعم كامل لـ Formik
- ✅ إظهار/إخفاء الباسورد تلقائياً
- ✅ رسائل خطأ تلقائية
- ✅ أيقونات اختيارية
- ✅ تصميم متجاوب

---

### 3. `UserTypeSelector.jsx`
**الموقع:** `src/Components/Common/UserTypeSelector.jsx`

**الوظيفة:**
- شريط أزرار لاختيار نوع المستخدم
- 4 أزرار: Patient, Doctor, Scan, Lap
- يبرز الزر المحدد حالياً

**الاستخدام:**
- يستخدم في: `SignupPage.jsx` (السطر 77-80)

**الكود بالتفصيل:**
```jsx
// السطر 1: تعريف الكومبوننت
export default function UserTypeSelector({ 
  userType,              // النوع المحدد حالياً (patient, doctor, scan, lap)
  onUserTypeChange       // دالة لتغيير النوع (setUserType من SignupPage)
}) {
  // السطر 2: قائمة أنواع المستخدمين
  const userTypes = ["patient", "doctor", "scan", "lap"];
  
  return (
    <div className="flex gap-[10px] md:gap-[20px] lg:gap-[25px] 
                    justify-center items-center flex-wrap">
      {/* السطر 6-19: رسم كل زر */}
      {userTypes.map((type) => (
        <button
          key={type}      // مفتاح فريد لكل زر
          type="button"   // نوع button لمنع إرسال الفورم
          onClick={() => onUserTypeChange(type)}  // استدعاء دالة التغيير
          className={`px-[15px] md:px-[25px] lg:px-[30px] 
                      py-[6px] md:py-[5px] 
                      rounded-[10px] 
                      font-english font-[500] 
                      text-[11px] md:text-[12px] lg:text-[13px] 
                      transition-all duration-300 
                      whitespace-nowrap 
                      ${userType === type
                        ? "bg-[#3E69FE] text-[#FFFFFF] shadow-md"  // إذا كان محدد: أزرق فاتح وخلفية بيضاء
                        : "bg-[#FFFFFF] text-[#003465] border border-[#3E69FE] hover:bg-[#F0F4FF]"  // إذا لم يكن محدد
                      }`}
        >
          {/* السطر 17: تحويل الحرف الأول لحرف كبير */}
          {type.charAt(0).toUpperCase() + type.slice(1)}
          {/* patient → Patient, doctor → Doctor, etc. */}
        </button>
      ))}
    </div>
  );
}
```

**السلوك:**
- عند النقر على زر، يتم استدعاء `onUserTypeChange` مع نوع المستخدم الجديد
- يتغير التصميم ليعكس الزر المحدد
- تصميم متجاوب مع أحجام الشاشات المختلفة

---

### 4. `SubmitButton.jsx`
**الموقع:** `src/Components/Common/SubmitButton.jsx`

**الوظيفة:**
- زر إرسال قابل لإعادة الاستخدام
- يدعم حالة التحميل (loading state)
- يغير النص أثناء التحميل

**الاستخدام:**
- يستخدم في: `SignupPage.jsx` (السطر 180-184)

**الكود بالتفصيل:**
```jsx
// السطر 1-8: تعريف الكومبوننت مع Props
export default function SubmitButton({
  text = "Submit",              // النص العادي (افتراضي "Submit")
  loadingText = "Loading...",   // النص أثناء التحميل (افتراضي "Loading...")
  isLoading = false,            // حالة التحميل (افتراضي false)
  disabled = false,             // هل الزر معطل؟ (افتراضي false)
  className = "",               // كلاسات CSS إضافية
  fullWidth = true,             // هل يأخذ العرض الكامل؟ (افتراضي true)
}) {
  return (
    <button
      type="submit"             // نوع button لإرسال الفورم
      disabled={disabled || isLoading}  // معطل إذا isLoading أو disabled
      className={`text-[#FFFFFF] text-[18px] cursor-pointer font-[600] 
                  font-english bg-[#3E69FE] 
                  ${fullWidth ? "w-full" : ""}  // عرض كامل إذا fullWidth
                  h-[40px] rounded-[5px] 
                  disabled:opacity-50 disabled:cursor-not-allowed  // عند التعطيل
                  hover:bg-[#2d54d4] transition-all duration-300 ${className}`}
    >
      {/* السطر 17: عرض النص بناءً على حالة التحميل */}
      {isLoading ? loadingText : text}
    </button>
  );
}
```

**السلوك:**
- عند `isLoading = true`: يعرض `loadingText` ويصبح معطلاً
- عند `isLoading = false`: يعرض `text` العادي
- يتغير اللون عند hover

---

### 5. `AuthLink.jsx`
**الموقع:** `src/Components/Common/AuthLink.jsx`

**الوظيفة:**
- رابط تنقل قابل لإعادة الاستخدام
- يستخدم في صفحات Auth للتنقل بين الصفحات

**الاستخدام:**
- يستخدم في: `SignupPage.jsx` (السطر 186-190)

**الكود بالتفصيل:**
```jsx
// السطر 1: استيراد Link من react-router-dom
import { Link } from "react-router-dom";

// السطر 3: تعريف الكومبوننت
export default function AuthLink({ 
  to,              // المسار المستهدف (مثل "/auth/Login")
  text,            // النص الأساسي (مثل "Do you have an account ?")
  linkText,        // النص القابل للنقر (مثل "log in")
  className = ""   // كلاسات CSS إضافية
}) {
  return (
    <Link
      to={to}
      className={`font-[300] text-[12px] text-[#003465] font-english ${className}`}
    >
      {text}{" "}  {/* النص الأساسي + مسافة */}
      <span className="font-[500] text-[#3E69FE]">{linkText}</span>  {/* النص القابل للنقر */}
    </Link>
  );
}
```

**مثال الاستخدام:**
```jsx
<AuthLink
  to="/auth/Login"
  text="Do you have an account ?"
  linkText="log in"
/>
// النتيجة: "Do you have an account ? log in"
// حيث "log in" باللون الأزرق وقابل للنقر
```

---

## 📦 الثوابت والمرافق (Constants & Utils)

### 1. `authConstants.js`
**الموقع:** `src/constants/authConstants.js`

**الوظيفة:**
- يحتوي على ثوابت متعلقة بالمصادقة
- صور أنواع المستخدمين
- أنواع المستخدمين المتاحة
- النوع الافتراضي

**الكود بالتفصيل:**
```jsx
// السطر 1-4: استيراد الصور
import PatientSignUpImage from "../assets/images/PatientSignUp.png";
import DoctorSignUpImage from "../assets/images/DoctorSignUp.png";
import ScanSignUpImage from "../assets/images/ScanSignUp.png";
import LapSignUpImage from "../assets/images/LapSignUP.png";

// السطر 7-12: مابينغ الصور لأنواع المستخدمين
export const USER_TYPE_IMAGES = {
  patient: PatientSignUpImage,
  doctor: DoctorSignUpImage,
  scan: ScanSignUpImage,
  lap: LapSignUpImage,
};

// السطر 15: قائمة أنواع المستخدمين
export const USER_TYPES = ["patient", "doctor", "scan", "lap"];

// السطر 18: النوع الافتراضي عند فتح صفحة التسجيل
export const DEFAULT_USER_TYPE = "patient";
```

**الاستخدام:**
- في `SignupPage.jsx` (السطر 18, 90, 24):
  - `USER_TYPE_IMAGES[userType]` للحصول على الصورة المناسبة
  - `DEFAULT_USER_TYPE` لتحديد النوع الافتراضي

---

### 2. `validationSchemas.js`
**الموقع:** `src/utils/validationSchemas.js`

**الوظيفة:**
- يحتوي على قواعد التحقق (validation rules) باستخدام Yup
- دالة ديناميكية تعيد schema بناءً على نوع المستخدم

**الكود بالتفصيل:**
```jsx
// السطر 1: استيراد Yup
import * as yup from "yup";

// السطر 4-40: دالة للحصول على schema التسجيل
export const getSignupValidationSchema = (userType) => {
  // السطر 5-30: القواعد الأساسية لجميع المستخدمين
  const baseSchema = {
    fullName: yup
      .string()
      .min(3, "Full name must be at least 3 characters")  // على الأقل 3 أحرف
      .required("Full name is required"),                  // مطلوب
    
    email: yup
      .string()
      .email("Invalid email address")                     // صيغة بريد صحيحة
      .required("Email is required"),
    
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")   // على الأقل 8 أحرف
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,                // regex: حرف صغير + حرف كبير + رقم
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")  // يجب أن يطابق password
      .required("Confirm password is required"),
    
    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")  // 10-15 رقم
      .required("Phone number is required"),
  };
  
  // السطر 32-37: إضافة حقل licenseNumber لغير Patient
  if (userType !== "patient") {
    baseSchema.licenseNumber = yup
      .string()
      .min(5, "License number must be at least 5 characters")
      .required("License number is required");
  }
  
  // السطر 39: إرجاع schema ككائن Yup
  return yup.object(baseSchema);
};

// السطر 43-49: schema تسجيل الدخول
export const loginValidationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "At least 8 chars")
    .required("Password is required"),
});
```

**الاستخدام:**
- في `SignupPage.jsx` (السطر 19, 112):
  ```jsx
  validationSchema={getSignupValidationSchema(userType)}
  ```
  - يمرر `userType` للحصول على schema المناسب

---

### 3. `formInitialValues.js`
**الموقع:** `src/utils/formInitialValues.js`

**الوظيفة:**
- يحتوي على القيم الأولية للفورم
- دالة ديناميكية تعيد القيم بناءً على نوع المستخدم

**الكود بالتفصيل:**
```jsx
// السطر 2-19: دالة للحصول على القيم الأولية للتسجيل
export const getSignupInitialValues = (userType) => {
  // السطر 3-9: القيم الأساسية لجميع المستخدمين
  const baseValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };
  
  // السطر 11-16: إضافة licenseNumber لغير Patient
  if (userType !== "patient") {
    return {
      ...baseValues,           // نسخ القيم الأساسية
      licenseNumber: "",      // إضافة حقل الرخصة
    };
  }
  
  // السطر 18: إرجاع القيم الأساسية فقط لـ Patient
  return baseValues;
};

// السطر 22-25: القيم الأولية لتسجيل الدخول
export const loginInitialValues = {
  email: "",
  password: "",
};
```

**الاستخدام:**
- في `SignupPage.jsx` (السطر 20, 111):
  ```jsx
  initialValues={getSignupInitialValues(userType)}
  ```
  - يمرر `userType` للحصول على القيم الأولية المناسبة

---

## 🔄 سير العمل (Flow)

### تدفق صفحة التسجيل:

1. **تحميل الصفحة:**
   - يتم تحميل `SignupPage`
   - `userType` يبدأ بـ `DEFAULT_USER_TYPE` ("patient")
   - يتم تعيين `initialValues` و `validationSchema` بناءً على `userType`

2. **تغيير نوع المستخدم:**
   - المستخدم ينقر على زر في `UserTypeSelector`
   - يتم استدعاء `setUserType(newType)`
   - يتم إعادة تعيين الفورم (key={userType})
   - تتغير الصورة (AnimatePresence)

3. **ملء الفورم:**
   - المستخدم يملأ الحقول
   - يتم التحقق من الصحة في الوقت الفعلي (Formik)
   - رسائل الخطأ تظهر تلقائياً

4. **إرسال الفورم:**
   - المستخدم ينقر على "Complete Sign Up"
   - يتم استدعاء `handleSubmit`
   - يتم حفظ البيانات في localStorage
   - يتم عرض رسالة نجاح

---

## 📝 ملاحظات مهمة

1. **Formik Integration:**
   - جميع الحقول مربوطة مع Formik
   - التحقق من الصحة تلقائي
   - إدارة الحالة تلقائية

2. **Responsive Design:**
   - جميع الكومبوننتات متجاوبة
   - استخدام Tailwind CSS breakpoints (md:, lg:)

3. **Reusability:**
   - جميع الكومبوننتات المشتركة قابلة لإعادة الاستخدام
   - يمكن استخدامها في صفحات أخرى

4. **TODO Comments:**
   - هناك تعليقات TODO لربط الباك اند
   - يجب استبدال localStorage بالباك اند عند الجاهزية

---

## 🎯 الخلاصة

كل كومبوننت له وظيفة محددة ومستقل، ويمكن استخدامه في أماكن متعددة. الكود منظم وقابل للصيانة والتطوير.

