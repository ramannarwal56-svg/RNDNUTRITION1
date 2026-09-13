const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');

// Add import
content = content.replace(
  "import { useStore } from '../context/StoreContext';",
  "import { useStore } from '../context/StoreContext';\nimport { googleSignInForGmail } from '../utils/gmailAuth';"
);

// Add state and function
content = content.replace(
  "const [loading, setLoading] = useState(false);",
  `const [loading, setLoading] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  
  const handleConnectGmail = async () => {
    try {
      showToast("Connecting to Gmail...", "info");
      const result = await googleSignInForGmail();
      if (result?.accessToken) {
        const res = await fetch('/api/admin/gmail-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: result.accessToken })
        });
        if (res.ok) {
          setGmailConnected(true);
          showToast("Gmail connected successfully! Order emails will now be sent automatically.", "success");
        } else {
          showToast("Failed to save Gmail token to server", "error");
        }
      }
    } catch (e: any) {
      console.error(e);
      showToast("Gmail connection failed: " + e.message, "error");
    }
  };`
);

// Add button to Settings tab or Overview tab
content = content.replace(
  /{activeTab === 'overview' && \(/,
  `{activeTab === 'overview' && (
          <div className="mb-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Automated Emails via Gmail</h3>
                <p className="text-sm text-neutral-400">Connect your ramannarwal56@gmail.com account to automatically send order confirmations to customers.</p>
              </div>
              <button
                onClick={handleConnectGmail}
                className={\`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors \${gmailConnected ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-white text-neutral-950 hover:bg-neutral-200'}\`}
              >
                {gmailConnected ? <CheckCircle2 className="w-5 h-5" /> : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {gmailConnected ? 'Gmail Connected' : 'Connect Gmail'}
              </button>
            </div>
          </div>
  `
);

fs.writeFileSync('src/pages/AdminPage.tsx', content);
