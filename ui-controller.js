document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const morseInput = document.getElementById('morse-input');
    const uiLangSelect = document.getElementById('ui-language-select');
    const langSelect = document.getElementById('language-select');
    const toMorseBtn = document.getElementById('to-morse-btn');
    const toTextBtn = document.getElementById('to-text-btn');
    const playMorseBtn = document.getElementById('play-morse-btn');
    const translateTextBtn = document.getElementById('translate-text-btn');
    const translateMorseBtn = document.getElementById('translate-morse-btn');
    const translateTargetSelect = document.getElementById('translate-target-select');

    const startRecognitionBtn = document.getElementById('start-recognition-btn');
    const stopRecognitionBtn = document.getElementById('stop-recognition-btn');
    const freqSlider = document.getElementById('frequency-slider');
    const threshSlider = document.getElementById('threshold-slider');
    const noiseToggle = document.getElementById('noise-cancel-toggle');
    const freqValue = document.getElementById('freq-value');
    const threshValue = document.getElementById('thresh-value');
    const recognizedMorseEl = document.getElementById('recognized-morse');
    const recognizedTextEl = document.getElementById('recognized-text');

    const audioHandler = new AudioHandler();

    const UI_TEXTS = {
        'app_title': { 'ja': 'モールス信号チャット', 'en': 'Morse Code Chat', 'de': 'Morsecode-Chat', 'fr': 'Chat en Code Morse', 'es': 'Chat de Código Morse', 'pl': 'Czat z Kodem Morsego', 'tr': 'Mors Kodu Sohbeti', 'ru': 'Чат на азбуке Морзе' },
        'section_header_converter': { 'ja': 'テキスト ⇔ モールス信号', 'en': 'Text ⇔ Morse Code', 'de': 'Text ⇔ Morsecode', 'fr': 'Texte ⇔ Code Morse', 'es': 'Texto ⇔ Código Morse', 'pl': 'Tekst ⇔ Kod Morsego', 'tr': 'Metin ⇔ Mors Kodu', 'ru': 'Текст ⇔ Азбука Морзе' },
        'label_ui_language': { 'ja': 'UI言語:', 'en': 'UI Language:', 'de': 'UI-Sprache:', 'fr': 'Langue UI:', 'es': 'Idioma de UI:', 'pl': 'Język UI:', 'tr': 'Arayüz Dili:', 'ru': 'Язык интерфейса:' },
        'label_morse_language': { 'ja': 'モールス信号 言語:', 'en': 'Morse Code Language:', 'de': 'Morsecode-Sprache:', 'fr': 'Langue du Code Morse:', 'es': 'Idioma del Código Morse:', 'pl': 'Język Kodu Morsego:', 'tr': 'Mors Kodu Dili:', 'ru': 'Язык азбуки Морзе:' },
        'lang_ja': { 'ja': '日本語 (和文)', 'en': 'Japanese', 'de': 'Japanisch', 'fr': 'Japonais', 'es': 'Japonés', 'pl': 'Japoński', 'tr': 'Japonca', 'ru': 'Японский' },
        'lang_en': { 'ja': '英語', 'en': 'English', 'de': 'Englisch', 'fr': 'Anglais', 'es': 'Inglés', 'pl': 'Angielski', 'tr': 'İngilizce', 'ru': 'Английский' },
        'lang_de': { 'ja': 'ドイツ語', 'en': 'German', 'de': 'Deutsch', 'fr': 'Allemand', 'es': 'Alemán', 'pl': 'Niemiecki', 'tr': 'Almanca', 'ru': 'Немецкий' },
        'lang_fr': { 'ja': 'フランス語', 'en': 'French', 'de': 'Französisch', 'fr': 'Français', 'es': 'Francés', 'pl': 'Francuski', 'tr': 'Fransızca', 'ru': 'Французский' },
        'lang_es': { 'ja': 'スペイン語', 'en': 'Spanish', 'de': 'Spanisch', 'fr': 'Espagnol', 'es': 'Español', 'pl': 'Hiszpański', 'tr': 'İspanyolca', 'ru': 'Испанский' },
        'lang_pl': { 'ja': 'ポーランド語', 'en': 'Polish', 'de': 'Polnisch', 'fr': 'Polonais', 'es': 'Polaco', 'pl': 'Polski', 'tr': 'Lehçe', 'ru': 'Польский' },
        'lang_tr': { 'ja': 'トルコ語', 'en': 'Turkish', 'de': 'Türkisch', 'fr': 'Turc', 'es': 'Turco', 'pl': 'Turecki', 'tr': 'Türkçe', 'ru': 'Турецкий' },
        'lang_ru': { 'ja': 'ロシア語', 'en': 'Russian', 'de': 'Russisch', 'fr': 'Russe', 'es': 'Ruso', 'pl': 'Rosyjski', 'tr': 'Rusça', 'ru': 'Русский' },
        'text_input_placeholder': { 'ja': 'ここにテキストを入力...', 'en': 'Enter text here...', 'de': 'Text hier eingeben...', 'fr': 'Entrez le texte ici...', 'es': 'Introduzca texto aquí...', 'pl': 'Wpisz tekst tutaj...', 'tr': 'Metni buraya girin...', 'ru': 'Введите текст здесь...' },
        'to_morse_btn': { 'ja': '↓ モールス信号へ変換', 'en': '↓ To Morse', 'de': '↓ Zu Morsecode', 'fr': '↓ Vers Morse', 'es': '↓ A Morse', 'pl': '↓ Na Morse', 'tr': '↓ Mors\'a Çevir', 'ru': '↓ В код Морзе' },
        'to_text_btn': { 'ja': '↑ テキストへ変換', 'en': '↑ To Text', 'de': '↑ Zu Text', 'fr': '↑ Vers Texte', 'es': '↑ A Texto', 'pl': '↑ Na Tekst', 'tr': '↑ Metne Çevir', 'ru': '↑ В текст' },
        'translate_text_btn': { 'ja': 'テキストを翻訳', 'en': 'Translate Text', 'de': 'Text übersetzen', 'fr': 'Traduire le Texte', 'es': 'Traducir Texto', 'pl': 'Przetłumacz Tekst', 'tr': 'Metni Çevir', 'ru': 'Перевести текст' },
        'translate_morse_btn': { 'ja': 'モールス信号を翻訳', 'en': 'Translate Morse', 'de': 'Morsecode übersetzen', 'fr': 'Traduire le Morse', 'es': 'Traducir Morse', 'pl': 'Przetłumacz Kod Morsego', 'tr': 'Mors Kodunu Çevir', 'ru': 'Перевести код Морзе' },
        'label_translate_to': { 'ja': '翻訳先:', 'en': 'Translate to:', 'de': 'Übersetzen nach:', 'fr': 'Traduire en:', 'es': 'Traducir a:', 'pl': 'Przetłumacz na:', 'tr': 'Çeviri Dili:', 'ru': 'Перевести на:' },
        'morse_input_placeholder': { 'ja': 'ここにモールス信号を入力... (例: ・- / ・・・・)', 'en': 'Enter Morse code here... (e.g., ·- / ····)', 'de': 'Morsecode hier eingeben... (z.B. ·- / ····)', 'fr': 'Entrez le code Morse ici... (ex: ·- / ····)', 'es': 'Introduzca código Morse aquí... (ej: ·- / ····)', 'pl': 'Wpisz kod Morsego tutaj... (np. ·- / ····)', 'tr': 'Mors kodunu buraya girin... (örn: ·- / ····)', 'ru': 'Введите код Морзе здесь... (пример: ·- / ····)' },
        'play_morse_btn': { 'ja': 'モールス信号を再生', 'en': 'Play Morse Code', 'de': 'Morsecode abspielen', 'fr': 'Jouer le Code Morse', 'es': 'Reproducir Código Morse', 'pl': 'Odtwórz Kod Morsego', 'tr': 'Mors Kodunu Oynat', 'ru': 'Воспроизвести код' },
        'section_header_recognition': { 'ja': '音声認識', 'en': 'Audio Recognition', 'de': 'Audio-Erkennung', 'fr': 'Reconnaissance Audio', 'es': 'Reconocimiento de Audio', 'pl': 'Rozpoznawanie Audio', 'tr': 'Ses Tanıma', 'ru': 'Распознавание звука' },
        'label_frequency': { 'ja': '認識周波数 (Hz):', 'en': 'Recognition Frequency (Hz):', 'de': 'Erkennungsfrequenz (Hz):', 'fr': 'Fréquence de Reconnaissance (Hz):', 'es': 'Frecuencia de Reconocimiento (Hz):', 'pl': 'Częstotliwość Rozpoznawania (Hz):', 'tr': 'Tanıma Frekansı (Hz):', 'ru': 'Частота распознавания (Гц):' },
        'label_threshold': { 'ja': '音量閾値:', 'en': 'Volume Threshold:', 'de': 'Lautstärkeschwelle:', 'fr': 'Seuil de Volume:', 'es': 'Umbral de Volumen:', 'pl': 'Próg Głośności:', 'tr': 'Ses Seviyesi Eşiği:', 'ru': 'Порог громкости:' },
        'label_noise_cancel': { 'ja': 'ノイズキャンセル (簡易):', 'en': 'Noise Cancellation (Simple):', 'de': 'Rauschunterdrückung (Einfach):', 'fr': 'Annulation du Bruit (Simple):', 'es': 'Cancelación de Ruido (Simple):', 'pl': 'Redukcja Szumów (Prosta):', 'tr': 'Gürültü Engelleme (Basit):', 'ru': 'Шумоподавление (простое):' },
        'start_recognition_btn': { 'ja': '音声認識を開始', 'en': 'Start Recognition', 'de': 'Erkennung starten', 'fr': 'Démarrer la Reconnaissance', 'es': 'Iniciar Reconocimiento', 'pl': 'Rozpocznij Rozpoznawanie', 'tr': 'Tanımayı Başlat', 'ru': 'Начать распознавание' },
        'stop_recognition_btn': { 'ja': '停止', 'en': 'Stop', 'de': 'Stopp', 'fr': 'Arrêter', 'es': 'Detener', 'pl': 'Zatrzymaj', 'tr': 'Durdur', 'ru': 'Стоп' },
        'recognition_output_morse': { 'ja': '認識結果 (モールス信号):', 'en': 'Recognized (Morse):', 'de': 'Erkannt (Morsecode):', 'fr': 'Reconnu (Morse):', 'es': 'Reconocido (Morse):', 'pl': 'Rozpoznany (Morse):', 'tr': 'Tanınan (Mors):', 'ru': 'Распознано (Морзе):' },
        'recognition_output_text': { 'ja': '認識結果 (テキスト):', 'en': 'Recognized (Text):', 'de': 'Erkannt (Text):', 'fr': 'Reconnu (Texte):', 'es': 'Reconocido (Texto):', 'pl': 'Rozpoznany (Tekst):', 'tr': 'Tanınan (Metin):', 'ru': 'Распознано (Текст):' },
        'alert_empty_translate': { 'ja': '翻訳するテキストを入力してください。', 'en': 'Please enter text to translate.', 'de': 'Bitte geben Sie Text zum Übersetzen ein.', 'fr': 'Veuillez entrer du texte à traduire.', 'es': 'Por favor, introduzca texto para traducir.', 'pl': 'Proszę wprowadzić tekst do przetłumaczenia.', 'tr': 'Lütfen çevrilecek metni girin.', 'ru': 'Пожалуйста, введите текст для перевода.' },
        'alert_same_lang': { 'ja': '翻訳元と翻訳先の言語が同じです。別の言語を選択してください。', 'en': 'Source and target languages are the same. Please select a different language.', 'de': 'Quell- und Zielsprache sind identisch. Bitte wählen Sie eine andere Sprache.', 'fr': 'Les langues source et cible sont identiques. Veuillez sélectionner une autre langue.', 'es': 'Los idiomas de origen y destino son los mismos. Por favor, seleccione un idioma diferente.', 'pl': 'Języki źródłowy i docelowy są takie same. Proszę wybrać inny język.', 'tr': 'Kaynak ve hedef diller aynı. Lütfen farklı bir dil seçin.', 'ru': 'Исходный и целевой языки совпадают. Пожалуйста, выберите другой язык.' },
        'translating_text': { 'ja': '翻訳中...', 'en': 'Translating...', 'de': 'Übersetze...', 'fr': 'Traduction...', 'es': 'Traduciendo...', 'pl': 'Tłumaczenie...', 'tr': 'Çevriliyor...', 'ru': 'Перевод...' },
        'alert_translation_error': { 'ja': '翻訳中にエラーが発生しました:', 'en': 'An error occurred during translation:', 'de': 'Ein Fehler ist bei der Übersetzung aufgetreten:', 'fr': 'Une erreur est survenue lors de la traduction:', 'es': 'Ocurrió un error durante la traducción:', 'pl': 'Wystąpił błąd podczas tłumaczenia:', 'tr': 'Çeviri sırasında bir hata oluştu:', 'ru': 'Произошла ошибка во время перевода:' },
        'alert_translation_failed': { 'ja': '翻訳に失敗しました。', 'en': 'Translation failed.', 'de': 'Übersetzung fehlgeschlagen.', 'fr': 'La traduction a échoué.', 'es': 'La traducción falló.', 'pl': 'Tłumaczenie nie powiodło się.', 'tr': 'Çeviri başarısız oldu.', 'ru': 'Перевод не удался.' },
        'alert_mic_denied': { 'ja': 'マイクへのアクセスを許可してください。', 'en': 'Please allow access to the microphone.', 'de': 'Bitte erlauben Sie den Zugriff auf das Mikrofon.', 'fr': 'Veuillez autoriser l\'accès au microphone.', 'es': 'Por favor, permita el acceso al micrófono.', 'pl': 'Proszę zezwolić na dostęp do mikrofonu.', 'tr': 'Lütfen mikrofona erişim izni verin.', 'ru': 'Пожалуйста, разрешите доступ к микрофону.' },
        'alert_empty_morse_translate': { 'ja': '翻訳するモールス信号を入力してください。', 'en': 'Please enter Morse code to translate.', 'de': 'Bitte geben Sie Morsecode zum Übersetzen ein.', 'fr': 'Veuillez entrer le code Morse à traduire.', 'es': 'Por favor, introduzca el código Morse para traducir.', 'pl': 'Proszę wprowadzić kod Morsego do przetłumaczenia.', 'tr': 'Lütfen çevrilecek Mors kodunu girin.', 'ru': 'Пожалуйста, введите код Морзе для перевода.' }
    };

    function switchLanguage(lang) {
        document.documentElement.lang = lang;
        document.title = UI_TEXTS['app_title'][lang] || 'Morse Code Chat';
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            const prop = el.dataset.langProp || 'textContent'; // Default to textContent
            if (UI_TEXTS[key] && UI_TEXTS[key][lang]) {
                el[prop] = UI_TEXTS[key][lang];
            }
        });
    }

    // --- イベントリスナー設定 ---

    // テキスト -> モールス
    toMorseBtn.addEventListener('click', () => {
        const lang = langSelect.value;
        morseInput.value = textToMorse(textInput.value, lang);
    });

    // モールス -> テキスト
    toTextBtn.addEventListener('click', () => {
        const lang = langSelect.value;
        textInput.value = morseToText(morseInput.value, lang);
    });

    // 「テキストを翻訳」ボタンの処理
    translateTextBtn.addEventListener('click', async () => {
        const textToTranslate = textInput.value;
        const targetLang = translateTargetSelect.value;
        const uiLang = uiLangSelect.value;

        if (!textToTranslate.trim()) {
            alert(UI_TEXTS['alert_empty_translate'][uiLang]);
            return;
        }

        // デモのため、ソース言語を簡易的に決定します
        // ターゲットが日本語なら英語から、それ以外なら日本語から翻訳します
        const sourceLang = (targetLang === 'ja') ? 'en' : 'ja';

        if (sourceLang === targetLang) {
            alert(UI_TEXTS['alert_same_lang'][uiLang]);
            return;
        }

        const originalText = textInput.value;
        textInput.value = UI_TEXTS['translating_text'][uiLang];
        translateTextBtn.disabled = true;
        translateMorseBtn.disabled = true;

        try {
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${sourceLang}|${targetLang}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`翻訳サービスがエラーを返しました (ステータス: ${response.status})`);
            const data = await response.json();
            if (data.responseData && data.responseStatus === 200) {
                textInput.value = data.responseData.translatedText;
            } else {
                throw new Error(data.responseDetails || UI_TEXTS['alert_translation_failed'][uiLang]);
            }
        } catch (error) {
            console.error('翻訳エラー:', error);
            alert(`${UI_TEXTS['alert_translation_error'][uiLang]} ${error.message}`);
            textInput.value = originalText; // エラー時は元のテキストに戻す
        } finally {
            translateTextBtn.disabled = false;
            translateMorseBtn.disabled = false;
        }
    });

    // 「モールス信号を翻訳」ボタンの処理
    translateMorseBtn.addEventListener('click', async () => {
        const morseToTranslate = morseInput.value;
        const sourceLang = langSelect.value;
        const targetLang = translateTargetSelect.value;
        const uiLang = uiLangSelect.value;

        if (!morseToTranslate.trim()) {
            alert(UI_TEXTS['alert_empty_morse_translate'][uiLang]);
            return;
        }

        if (sourceLang === targetLang) {
            alert(UI_TEXTS['alert_same_lang'][uiLang]);
            return;
        }

        // 1. モールス信号をテキストに変換
        const intermediateText = morseToText(morseToTranslate, sourceLang);
        if (!intermediateText.trim()) {
            // 変換に失敗した場合、ユーザーに通知
            alert(UI_TEXTS['alert_empty_translate'][uiLang]); // 再利用
            return;
        }

        // 2. 変換したテキストを翻訳
        const originalText = textInput.value;
        textInput.value = UI_TEXTS['translating_text'][uiLang];
        translateTextBtn.disabled = true;
        translateMorseBtn.disabled = true;

        try {
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(intermediateText)}&langpair=${sourceLang}|${targetLang}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`翻訳サービスがエラーを返しました (ステータス: ${response.status})`);
            const data = await response.json();
            textInput.value = data.responseData.translatedText;
        } catch (error) {
            console.error('モールスからの翻訳エラー:', error);
            alert(`${UI_TEXTS['alert_translation_error'][uiLang]} ${error.message}`);
            textInput.value = originalText; // エラー時は元のテキストに戻す
        } finally {
            translateTextBtn.disabled = false;
            translateMorseBtn.disabled = false;
        }
    });

    // モールス信号再生
    playMorseBtn.addEventListener('click', () => {
        const frequency = parseInt(freqSlider.value, 10);
        audioHandler.playMorseCode(morseInput.value, frequency);
    });

    // 音声認識開始
    startRecognitionBtn.addEventListener('click', () => {
        const uiLang = uiLangSelect.value;
        const config = {
            frequency: parseInt(freqSlider.value, 10),
            threshold: parseInt(threshSlider.value, 10),
            noiseCancel: noiseToggle.checked,
            micErrorMsg: UI_TEXTS['alert_mic_denied'][uiLang],
            onRecognize: (morse) => {
                recognizedMorseEl.textContent = morse;
                const lang = langSelect.value;
                // 認識途中の不完全なコードは変換しないようにする
                const cleanedMorse = morse.replace(/(\/| )$/, '');
                recognizedTextEl.textContent = morseToText(cleanedMorse, lang);
            }
        };
        audioHandler.startAudioRecognition(config);
        
        // UIの状態更新
        startRecognitionBtn.disabled = true;
        stopRecognitionBtn.disabled = false;
        recognizedMorseEl.textContent = '';
        recognizedTextEl.textContent = '';
    });

    // 音声認識停止
    stopRecognitionBtn.addEventListener('click', () => {
        audioHandler.stopAudioRecognition();
        startRecognitionBtn.disabled = false;
        stopRecognitionBtn.disabled = true;
    });

    // 設定スライダーの値表示を更新
    freqSlider.addEventListener('input', () => {
        freqValue.textContent = freqSlider.value;
    });
    threshSlider.addEventListener('input', () => {
        threshValue.textContent = threshSlider.value;
    });

    // 翻訳先ドロップダウンを初期化
    function populateTranslateDropdown() {
        translateTargetSelect.innerHTML = '';
        for (const option of langSelect.options) {
            const newOption = option.cloneNode(true);
            translateTargetSelect.add(newOption);
        }
    }

    // UIの初期言語を設定
    const supportedLangs = Object.keys(UI_TEXTS['lang_ja']);
    let initialUiLang = navigator.language.split('-')[0];
    if (!supportedLangs.includes(initialUiLang)) {
        initialUiLang = 'ja'; // サポート外の言語の場合は日本語をデフォルトに
    }
    uiLangSelect.value = initialUiLang;
    populateTranslateDropdown();
    switchLanguage(initialUiLang);

    // UI言語が変更されたら、表示を切り替える
    uiLangSelect.addEventListener('change', (e) => {
        switchLanguage(e.target.value);
    });
});
