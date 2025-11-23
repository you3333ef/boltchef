#!/bin/bash

# سكريپت لاستعادة النسخة الأصلية من الواجهة
# Script to restore the original interface

echo "🔄 استعادة النسخة الأصلية من واجهة Bolt..."
echo "Restoring original Bolt interface..."
echo ""

# التحقق من وجود النسخة الاحتياطية
if [ ! -f "_index.tsx.backup" ]; then
    echo "❌ الخطأ: لم يتم العثور على النسخة الاحتياطية"
    echo "Error: Backup file not found"
    echo ""
    echo "تأكد من وجود الملف: _index.tsx.backup"
    echo "Make sure the file exists: _index.tsx.backup"
    exit 1
fi

# نسخ النسخة الاحتياطية
cp _index.tsx.backup app/routes/_index.tsx

echo "✅ تم الاستعادة بنجاح!"
echo "✅ Restoration completed successfully!"
echo ""
echo "يمكنك الآن تشغيل: npm run dev"
echo "You can now run: npm run dev"
echo ""

# سؤال عن تشغيل الخادم
read -p "هل تريد تشغيل خادم التطوير الآن؟ (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 تشغيل خادم التطوير..."
    npm run dev
fi
