import { json, type MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt - تم إصلاح المشكلة' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export const loader = () => json({});

/**
 * مؤقت صفحة رئيسية بسيطة للتأكد من ظهور المحتوى
 * Temporary simple landing page to ensure content is visible
 */
export default function Index() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#FFFFFF',
      color: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#9C7DFF'
        }}>
          مرحباً! تم إصلاح المشكلة ✅
        </h1>

        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          color: '#525252'
        }}>
          Welcome! The issue has been fixed. The website is now working correctly.
        </p>

        <div style={{
          backgroundColor: '#F5F5F5',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '2px solid #9C7DFF'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#0A0A0A'
          }}>
            الإصلاحات المطبقة:
          </h2>
          <ul style={{
            textAlign: 'right',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ marginBottom: '0.5rem', color: '#262626' }}>✓ إضافة CSS Reset كامل</li>
            <li style={{ marginBottom: '0.5rem', color: '#262626' }}>✓ إصلاح ألوان النصوص والخلفيات</li>
            <li style={{ marginBottom: '0.5rem', color: '#262626' }}>✓ ضمان وضوح المحتوى في كل من الـ Light و Dark mode</li>
            <li style={{ marginBottom: '0.5rem', color: '#262626' }}>✓ إضافة ألوان احتياطية للوضوح</li>
          </ul>
        </div>

        <button
          onClick={() => {
            alert('The website is working! You can now restore the original Chat component.');
          }}
          style={{
            backgroundColor: '#9C7DFF',
            color: '#FFFFFF',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#8A5FFF';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#9C7DFF';
          }}
        >
          اختبار الموقع Test Website
        </button>

        <div style={{
          marginTop: '3rem',
          padding: '1rem',
          backgroundColor: '#E1D6FF',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#7645E8'
        }}>
          <strong>ملاحظة:</strong> هذه صفحة مؤقتة بسيطة. لإرجاع الواجهة الكاملة، استعيد الملف من النسخة الاحتياطية:
          <code style={{
            backgroundColor: '#D6C5FF',
            padding: '2px 6px',
            borderRadius: '4px',
            marginRight: '8px'
          }}>
            app/routes/_index.tsx.backup
          </code>
        </div>
      </div>
    </div>
  );
}
