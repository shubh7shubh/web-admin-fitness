'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle, Smartphone, Shield, Zap } from 'lucide-react';

export default function DownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const router = useRouter();

  // TODO: Replace with actual APK URL from EAS Build or GitHub Release
  const apkUrl = process.env.NEXT_PUBLIC_APK_URL || '#';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (redirectCountdown !== null && redirectCountdown > 0) {
      timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
    } else if (redirectCountdown === 0) {
      router.push('/');
    }
    return () => clearTimeout(timer);
  }, [redirectCountdown, router]);

  const handleDownload = () => {
    if (apkUrl === '#') {
      alert('APK URL not configured. Please set NEXT_PUBLIC_APK_URL in your environment variables.');
      return;
    }

    setIsDownloading(true);

    // Trigger download
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'ApexOne-Beta.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message and start countdown
    setTimeout(() => {
      setIsDownloading(false);
      setRedirectCountdown(5); // Redirect after 5 seconds
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">You're In! 🎉</h1>
          <p className="text-lg text-gray-600">
            Welcome to the ApexOne beta. Let's start your transformation!
          </p>
        </div>

        {/* Download Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* Success Message with Countdown */}
          {redirectCountdown !== null && (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Download Started! 🎉
              </h3>
              <p className="text-green-700 mb-3">
                Your APK is downloading. Check your notifications!
              </p>
              <p className="text-sm text-green-600">
                Redirecting to login in <span className="font-bold text-lg">{redirectCountdown}</span> seconds...
              </p>
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={isDownloading || redirectCountdown !== null}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Starting Download...
              </>
            ) : redirectCountdown !== null ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Download Complete!
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download APK (Beta)
              </>
            )}
          </button>

          {/* Installation Instructions */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-600" />
              Installation Steps
            </h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="pt-0.5">Tap "Download APK" button above</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="pt-0.5">Open downloaded file from notifications</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="pt-0.5">Allow "Install from unknown sources" if prompted</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span className="pt-0.5">Tap "Install" and open the app</span>
              </li>
            </ol>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Instant Access</h3>
              <p className="text-xs text-gray-600 mt-1">Start tracking today</p>
            </div>
            <div className="text-center p-4">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">100% Safe</h3>
              <p className="text-xs text-gray-600 mt-1">Secure & private</p>
            </div>
            <div className="text-center p-4">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Beta Exclusive</h3>
              <p className="text-xs text-gray-600 mt-1">Early access perks</p>
            </div>
          </div>

          {/* Beta Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>🔒 Beta Version:</strong> This is a pre-release version for testing.
              We'll notify you when the app launches on Google Play Store.
            </p>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
          <h3 className="font-bold mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-2">
            If you encounter issues installing the app:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Make sure you're using an Android device (iOS coming soon)</li>
            <li>Check that "Install from unknown sources" is enabled in Settings</li>
            <li>Contact us at <a href="mailto:support@apexone.fitness" className="text-blue-600 hover:underline">support@apexone.fitness</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
