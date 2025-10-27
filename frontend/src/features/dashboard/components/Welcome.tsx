import "@styles/welcomePage.css";

const DentalManagementWelcome = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
      <header className="bg-blue-900 text-white w-full text-center py-6 text-3xl font-bold">
        مرحبًا بك في نظام إدارة العيادة
      </header>
      <main className="bg-white max-w-4xl w-full shadow-lg rounded-lg p-6 mt-6">
        <section className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            لماذا تحتاج هذا النظام؟
          </h2>
          <p className="mt-2 text-gray-700">
            تخلص من العمل الورقي اليدوي وابدأ في تنظيم بيانات العيادة رقميًا عبر
            الهواتف المحمولة بسهولة وكفاءة.
          </p>
        </section>
        <section className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            المزايا الرئيسية
          </h2>
          <ul className="mt-2 list-disc list-inside text-gray-700">
            <li>
              واجهة مستخدم مصممة خصيصًا للهواتف المحمولة والأجهزة اللوحية.
            </li>
            <li>
              رفع الملفات الطبية وسجلات المرضى إلكترونيًا مع دعم جميع الصيغ
              الشائعة.
            </li>
            <li>
              بحث سريع وسهل عن المرضى بالاسم، رقم الهاتف، أو تاريخ الزيارة.
            </li>
            <li>
              إحصائيات وتقارير متقدمة لتحسين إدارة العيادة واتخاذ قرارات مدروسة.
            </li>
            <li>إعدادات صلاحيات مخصصة للأطباء والمساعدين لزيادة الأمان.</li>
            <li>
              إمكانية الوصول إلى المعلومات بسرعة وكفاءة من أي جهاز داخل العيادة.
            </li>
          </ul>
        </section>
        <section className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            التقنيات المستخدمة
          </h2>
          <p className="mt-2 text-gray-700">
            تم بناء النظام باستخدام أحدث التقنيات لزيادة الأداء والأمان، وتشمل:
          </p>
          <ul className="mt-2 list-disc list-inside text-gray-700">
            <li>Spring Boot و Java لتوفير أداء عالي وقابلية توسع.</li>
            <li>ReactJS و TypeScript لواجهة مستخدم حديثة وسلسة.</li>
            <li>SQLite كقاعدة بيانات خفيفة وقوية لتخزين المعلومات.</li>
          </ul>
        </section>
        <section className="text-center mt-6">
          <h2 className="text-xl font-semibold text-blue-700">جاهز للبدء؟</h2>
          <p className="mt-2 text-gray-700">
            تواصل معنا الآن لتجربة النظام وتحسين إدارة العيادة بأفضل الحلول
            التقنية.
          </p>
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
            ابدأ الآن
          </button>
        </section>
      </main>
      <footer className="w-full bg-blue-900 text-white text-center py-4 mt-6">
        &copy; 2025 نظام إدارة العيادة - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default DentalManagementWelcome;
