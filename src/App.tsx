import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import { FileText, Copy, RefreshCw, Clipboard } from 'lucide-react';

type Language = 'ar' | 'fr';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<Language>('fr');
  const outputRef = useRef<HTMLDivElement>(null);

  const translations = {
    ar: {
      title: 'محول النصوص من Markdown إلى Word',
      subtitle: 'حول النص إلى تنسيق مناسب للـ Word',
      placeholder: 'أدخل النص هنا...',
      convert: 'تحويل إلى تنسيق Word',
      clear: 'مسح الكل',
      output: 'النص المحول',
      copied: '!تم النسخ',
      copy: 'نسخ',
      paste: 'لصق'
    },
    fr: {
      title: 'Convertisseur Markdown vers Word',
      subtitle: 'Convertir votre texte Markdown au format Word',
      placeholder: 'Saisissez votre texte ici...',
      convert: 'Convertir au format Word',
      clear: 'Tout effacer',
      output: 'Texte converti',
      copied: 'Copié !',
      copy: 'Copier',
      paste: 'Coller'
    }
  };

  const convertToWord = () => {
    const cleanMarkdown = markdown.replace(/\[[^\]]*\](\([^)]+\))?/g, '');
    const htmlContent = marked(cleanMarkdown, { breaks: true });
    setConvertedText(htmlContent);
  };

  const copyToClipboard = async () => {
    try {
      if (outputRef.current) {
        const text = outputRef.current.innerText;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMarkdown(text);
    } catch (err) {
      console.error('Failed to paste text:', err);
    }
  };

  const clearAll = () => {
    setMarkdown('');
    setConvertedText('');
  };

  const isRTL = language === 'ar';
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-gray-600">{t.subtitle}</p>
          <div className="mt-6 flex justify-center" dir="ltr">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setLanguage('fr')}
                className={`relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-medium transition-colors
                  ${language === 'fr'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              >
                Français
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`relative -ml-px inline-flex items-center rounded-r-md px-4 py-2 text-sm font-medium transition-colors
                  ${language === 'ar'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              >
                العربية
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <textarea
              rows={8}
              dir={isRTL ? 'rtl' : 'ltr'}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white p-4 font-[system-ui] ${
                isRTL ? 'text-right pr-4' : 'text-left pl-4'
              }`}
              style={{
                textAlign: isRTL ? 'right' : 'left',
                paddingTop: '3rem' // Make room for the paste button
              }}
              placeholder={t.placeholder}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
            <button
              onClick={pasteFromClipboard}
              className={`absolute top-2 ${
                isRTL ? 'left-2' : 'right-2'
              } inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors`}
            >
              <Clipboard className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
              {t.paste}
            </button>
          </div>

          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={convertToWord}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.convert}
            </button>
            <button
              onClick={clearAll}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t.clear}
            </button>
          </div>

          {convertedText && (
            <div className="relative">
              <button
                onClick={copyToClipboard}
                className={`absolute top-2 ${
                  isRTL ? 'left-2' : 'right-2'
                } inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors z-10`}
              >
                <Copy className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                {copied ? t.copied : t.copy}
              </button>
              <div
                ref={outputRef}
                className="prose max-w-none p-4 pt-12 bg-white rounded-md shadow-sm border border-gray-200 font-[system-ui]"
                dangerouslySetInnerHTML={{ __html: convertedText }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;