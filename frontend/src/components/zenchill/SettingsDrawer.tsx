"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const { t } = useTranslation('common');
  // Prevent background scrolling when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-paper shadow-2xl z-[120] transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-paper relative">
          <div>
            <h2 className="text-2xl font-serif text-sandalwood">{t('settings.accountSettings')}</h2>
            <p className="text-xs text-stone-500 font-light mt-1">{t('settings.accountSettings')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-cinnabar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-sandalwood">{t('settings.accountInfo')}</h3>
            <div className="p-4 bg-white rounded-sm border border-stone-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-500">{t('settings.email')}</span>
                <span className="text-sm font-serif text-sandalwood">{userEmail}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-sandalwood">{t('settings.preferences')}</h3>
            <div className="p-4 bg-white rounded-sm border border-stone-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-500">{t('settings.pushNotifications')}</span>
                <div className="w-10 h-5 rounded-full bg-stone-200 relative">
                  <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-500">{t('settings.darkMode')}</span>
                <div className="w-10 h-5 rounded-full bg-stone-200 relative">
                  <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-sandalwood">{t('settings.security')}</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-4 bg-white rounded-sm border border-stone-100 shadow-sm hover:bg-stone-50 transition-colors">
                <span className="text-sm font-serif text-sandalwood">{t('settings.changePassword')}</span>
              </button>
              <button className="w-full text-left p-4 bg-white rounded-sm border border-stone-100 shadow-sm hover:bg-stone-50 transition-colors">
                <span className="text-sm font-serif text-sandalwood">{t('settings.bindPhone')}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default SettingsDrawer;
