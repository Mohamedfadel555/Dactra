# Pagination API Contract - Doctors List

## 📤 **إيه اللي محتاج تبعتيه للباك (Query Parameters)**

عندما تريد جلب صفحة معينة من الدكاترة، يجب إرسال هذه الـ **Query Parameters** في الـ URL:

### **المطلوب إرساله:**

```
GET /api/Doctor?pageNumber=1&pageSize=6
```

**الباراميترات:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | `integer` | ✅ نعم | `1` | رقم الصفحة المطلوبة (يبدأ من 1) |
| `pageSize` | `integer` | ✅ نعم | `6` | عدد العناصر في كل صفحة |

**مثال على الـ Request:**
```javascript
// الصفحة الأولى - 6 دكاترة
GET /api/Doctor?pageNumber=1&pageSize=6

// الصفحة الثانية - 6 دكاترة
GET /api/Doctor?pageNumber=2&pageSize=6

// الصفحة الثالثة - 10 دكاترة (لو غيرت الـ pageSize)
GET /api/Doctor?pageNumber=3&pageSize=10
```

---

## 📥 **إيه اللي محتاج تستقبله من الباك (Response Structure)**

الباك يجب أن يرجع **Response** بالشكل التالي:

### **الـ Response المطلوب:**

```json
{
  "items": [
    {
      "id": 21,
      "firstName": "Esraa",
      "lastName": "Karam",
      "gender": 1,
      "specializationId": 4,
      "age": 28,
      "yearsOfExperience": 6,
      "averageRating": 4.8,
      "totalReviews": 120,
      "pricePerSession": 350,
      "imageUrl": "https://example.com/doctor-image.jpg",
      "about": "Experienced dermatologist...",
      "address": "مدينة السلام..."
    },
    // ... باقي الدكاترة (حسب pageSize)
  ],
  "pageNumber": 1,
  "pageSize": 6,
  "totalCount": 42,
  "totalPages": 7
}
```

### **شرح الحقول:**

| Field | Type | Description |
|-------|------|-------------|
| `items` | `Array<Doctor>` | مصفوفة الدكاترة في الصفحة الحالية |
| `pageNumber` | `integer` | رقم الصفحة الحالية (اللي طلبتها) |
| `pageSize` | `integer` | عدد العناصر في الصفحة (اللي طلبتها) |
| `totalCount` | `integer` | **إجمالي عدد الدكاترة** في كل الصفحات (مهم جداً للباجينيشن) |
| `totalPages` | `integer` | **إجمالي عدد الصفحات** = `Math.ceil(totalCount / pageSize)` |

---

## 🔗 **كيفية الربط في الكود (Frontend Implementation)**

### **1. تعديل `useDoctors.jsx`:**

```javascript
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAxios } from "../hooks/useAxios";

export const useDoctors = (pageNumber = 1, pageSize = 6) => {
  const axiosInstance = useAxios();

  const fetchDoctors = async () => {
    const res = await axiosInstance.get("Doctor", {
      params: {
        pageNumber,
        pageSize,
      },
    });
    return res.data; // { items, pageNumber, pageSize, totalCount, totalPages }
  };

  return useQuery({
    queryKey: ["doctors", pageNumber, pageSize], // مهم: نضيف pageNumber و pageSize في الـ key
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: () => {
      toast.error("Failed loading doctors list, please try again later", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
```

### **2. تعديل `DoctorsListPage.jsx`:**

```javascript
// في بداية الـ Component
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 6;

// استدعاء الـ Hook مع الـ pagination
const { 
  data: doctorsResponse, 
  isLoading: doctorsLoading 
} = useDoctors(currentPage, pageSize);

// استخراج البيانات من الـ Response
const doctors = doctorsResponse?.items || [];
const totalPages = doctorsResponse?.totalPages || 1;
const totalCount = doctorsResponse?.totalCount || 0;

// إزالة الـ client-side pagination (الـ slice)
// لأن الباك دلوقتي بيرجع الصفحة المطلوبة مباشرة
// const paginatedDoctors = filteredDoctors.slice(...); ❌ مش محتاجينها

// استخدام doctors مباشرة
const displayDoctors = doctors; // ✅ الباك بيرجع الصفحة المطلوبة
```

### **3. تعديل أزرار الباجينيشن:**

```javascript
const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
    // الـ useQuery هيعمل refetch تلقائياً لأن الـ queryKey اتغير
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
  }
};

// في الـ JSX
<span className="text-sm text-gray-500">
  Page {currentPage} of {totalPages}
</span>
```

---

## 📋 **ملخص سريع:**

### **محتاج تبعت للباك:**
- ✅ `pageNumber` (رقم الصفحة)
- ✅ `pageSize` (عدد العناصر في الصفحة)

### **محتاج تستقبل من الباك:**
- ✅ `items` (مصفوفة الدكاترة)
- ✅ `pageNumber` (تأكيد رقم الصفحة)
- ✅ `pageSize` (تأكيد حجم الصفحة)
- ✅ `totalCount` (إجمالي عدد الدكاترة) ⭐ **مهم جداً**
- ✅ `totalPages` (إجمالي عدد الصفحات) ⭐ **مهم جداً**

---

## ⚠️ **ملاحظات مهمة:**

1. **الـ `totalCount` و `totalPages` مهمين جداً** لأنهم بيحددوا:
   - عدد الصفحات المتاحة
   - متى نعطل زر "Next Page"
   - متى نعطل زر "Previous Page"

2. **الـ `queryKey` في React Query:**
   - لازم يتغير لما `pageNumber` أو `pageSize` يتغير
   - عشان React Query يعمل refetch تلقائياً

3. **الفلترة والسيرش:**
   - لو الباك يدعم فلترة + باجينيشن معاً، ممكن تضيف:
     ```
     GET /api/Doctor?pageNumber=1&pageSize=6&search=ahmed&gender=0&specializationId=4
     ```

4. **الـ Default Values:**
   - `pageNumber = 1` (الصفحة الأولى)
   - `pageSize = 6` (6 دكاترة في الصفحة)

---

## 🎯 **مثال كامل على الـ Request/Response:**

### **Request:**
```
GET https://dactra.runasp.net/api/Doctor?pageNumber=2&pageSize=6
```

### **Response:**
```json
{
  "items": [
    { "id": 7, "firstName": "Ahmed", "lastName": "Ali", ... },
    { "id": 8, "firstName": "Sara", "lastName": "Mohamed", ... },
    { "id": 9, "firstName": "Khaled", "lastName": "Hassan", ... },
    { "id": 10, "firstName": "Noura", "lastName": "Mahmoud", ... },
    { "id": 11, "firstName": "Omar", "lastName": "Tarek", ... },
    { "id": 12, "firstName": "Laila", "lastName": "Salem", ... }
  ],
  "pageNumber": 2,
  "pageSize": 6,
  "totalCount": 42,
  "totalPages": 7
}
```

---

## ✅ **بعد ما الباك يجهز الـ Endpoint:**

1. عدل `useDoctors.jsx` عشان يبعت `pageNumber` و `pageSize`
2. عدل `DoctorsListPage.jsx` عشان يستخدم `items` و `totalPages` من الـ Response
3. شيل الـ client-side pagination (`slice`)
4. استخدم `totalPages` من الباك بدل `Math.ceil(filteredDoctors.length / pageSize)`

---

**ملف التوثيق ده موجود في: `PAGINATION_API_CONTRACT.md`**

