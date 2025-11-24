import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent the default logging to console
});

// Global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('❌ Uncaught error:', event.error);
});

// Log environment info
console.log('🌍 Environment Info:', {
  NODE_ENV: typeof process !== 'undefined' ? process.env.NODE_ENV : 'unknown',
  browser: typeof window !== 'undefined',
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  url: typeof window !== 'undefined' ? window.location.href : 'unknown',
  timestamp: new Date().toISOString(),
});

// Log React info
console.log('⚛️ React Info:', {
  version: typeof React !== 'undefined' ? React.version : 'unknown',
  hydrateRoot: typeof hydrateRoot !== 'undefined',
});

// Log DOM info
console.log('📄 DOM Info:', {
  rootElement: document.getElementById('root'),
  rootElementExists: !!document.getElementById('root'),
  documentReady: document.readyState,
});

// Remove loading screen if it exists
function removeLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen && loadingScreen.parentElement) {
    console.log('✅ Removing loading screen...');
    loadingScreen.parentElement.removeChild(loadingScreen);
  }
}

// Enhanced hydration with comprehensive error handling
async function hydrateApp() {
  console.log('🚀 Starting React hydration...');

  try {
    // Wait for document to be ready
    if (document.readyState === 'loading') {
      console.log('⏳ Document is still loading, waiting...');
      await new Promise<void>((resolve) => {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('✅ DOMContentLoaded event fired');
          resolve();
        });
      });
    }

    // Check root element exists
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element with id="root" not found!');
    }
    console.log('✅ Root element found:', rootElement);

    // Start hydration
    console.log('💧 Starting React render/hydration...');
    const startTime = performance.now();

    await new Promise<void>((resolve, reject) => {
      startTransition(() => {
        try {
          const reactRoot = hydrateRoot(document.getElementById('root')!, <RemixBrowser />);
          console.log('✅ React hydration initiated successfully');

          // Remove loading screen after a brief delay
          setTimeout(() => {
            removeLoadingScreen();
            console.log('🎉 Loading screen removed');
          }, 100);

          resolve();
        } catch (error) {
          console.error('❌ Error during hydration:', error);
          reject(error);
        }
      });
    });

    const endTime = performance.now();
    console.log(`✅ Hydration completed in ${(endTime - startTime).toFixed(2)}ms`);

    // Log successful hydration
    console.log('🎉 App hydrated successfully!');
    console.log('✨ React application is now running');

    // Check for hydration warnings
    setTimeout(() => {
      const logs = [];

      // Check if there are any React warnings
      const reactWarnings = document.querySelectorAll('[data-reactroot]');
      if (reactWarnings.length === 0) {
        console.warn('⚠️ No React root marker found in DOM');
      }

      console.log('📊 Final hydration check:', {
        reactRootMarkers: reactWarnings.length,
        rootElementClasses: rootElement.className,
        rootElementChildren: rootElement.children.length,
        bodyClasses: document.body.className,
      });
    }, 1000);

  } catch (error) {
    console.error('💥 Fatal error during app initialization:', error);

    // Log detailed error info
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    // Store error for debugging
    try {
      const errorInfo = {
        error: error instanceof Error ? error.toString() : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        state: {
          readyState: document.readyState,
          rootExists: !!document.getElementById('root'),
        },
      };
      localStorage.setItem('__HYDRATION_ERROR__', JSON.stringify(errorInfo, null, 2));
    } catch (e) {
      console.warn('Could not save error to localStorage:', e);
    }

    // Show error UI
    showFatalErrorUI(error);
  }
}

// Show a fallback UI when hydration fails
function showFatalErrorUI(error: unknown) {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Cannot show error UI: root element not found');
    return;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);

  root.innerHTML = `
    <div style="
      min-height: 100vh;
      padding: 20px;
      background-color: #FFFFFF;
      color: #0A0A0A;
      font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
    ">
      <div style="
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
      ">
        <h1 style="
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #DC2626;
        ">
          ⚠️ Application Failed to Load
        </h1>

        <div style="
          background-color: #FEF2F2;
          border: 2px solid #FECACA;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        ">
          <h2 style="
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: #DC2626;
          ">
            Error Details:
          </h2>
          <pre style="
            font-size: 0.875rem;
            color: #7F1D1D;
            overflow: auto;
            white-space: pre-wrap;
          ">${errorMessage}</pre>
        </div>

        <button
          onclick="window.location.reload()"
          style="
            padding: 10px 20px;
            background-color: #8A5FFF;
            color: #FFFFFF;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
          "
          onmouseover="this.style.backgroundColor='#7645E8'"
          onmouseout="this.style.backgroundColor='#8A5FFF'"
        >
          🔄 Reload Page
        </button>

        <div style="
          margin-top: 30px;
          padding: 15px;
          background-color: #EFF6FF;
          border: 1px solid #93C5FD;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #1E40AF;
        ">
          <strong>Troubleshooting Tips:</strong>
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Check browser console for detailed error messages (F12)</li>
            <li>Clear browser cache and cookies</li>
            <li>Try using an incognito/private browsing window</li>
            <li>Disable browser extensions temporarily</li>
            <li>Check your network connection</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  removeLoadingScreen();
}

// Start the hydration process
console.log('⏳ Initializing application...');
hydrateApp();
