# Morse Code Chat

A multifunctional Morse code transmission, reception, and translation application that runs directly in your browser.

## ✨ Key Features

This web application offers versatile features for Morse code learners, enthusiasts, and anyone interested in languages.

- **Multilingual Morse Code Support**:
  - Supports bidirectional conversion between text and Morse code for the following languages:
    - Japanese (Wabun), English, German, French, Spanish, Polish, Turkish, Russian (Cyrillic).

- **Versatile Input and Conversion**:
  - **Text ⇔ Morse Code**: Convert input text to Morse code and vice versa.
  - **Voice Recognition**: Real-time conversion of vocalized sounds (like dots and dashes) into Morse code and text via microphone input.
    - **Customizable Recognition Settings**: Adjust frequency detection and volume thresholds freely using sliders.
    - **Simple Noise Cancellation**: Includes a feature to measure ambient noise levels to improve recognition accuracy.
  - **Audio Playback**: Play back the Morse code in the text area using beeps at a specified frequency.

- **Integrated Translation Functionality**:
  - **Text Translation**: Translate input text into other supported languages.
  - **Morse Code Translation**: Perform a two-step translation (Morse Code → Text → Target Language) with a single button click.
  - (Translation uses the external [MyMemory API](https://mymemory.translated.net/).)

- **Internationalized UI**:
  - The application's display language (UI language) and the target Morse code language can be set independently.
  - The UI supports multiple languages, including Japanese, English, and German.

## 🛠️ Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
  - **Web Audio API**: Used for Morse code audio playback, microphone input analysis, and voice recognition.
  - **Fetch API**: Used for asynchronous communication with external translation APIs.

## 📁 File Structure

The project is divided into the following files based on functionality:

```text
.
├── index.html          # The skeleton UI of the application
├── style.css           # Application stylesheet
├── morse-code.js       # Morse code conversion logic for each language
├── audio-handler.js    # Web Audio API handling (playback, recognition, etc.)
└── ui-controller.js    # UI event handling and module coordination





# モールス信号チャット (Morse Code Chat)

ブラウザ上で動作する、多機能なモールス信号の送受信・翻訳アプリケーションです。

## ✨ 主な機能

このウェブアプリケーションは、モールス信号の学習者、愛好家、そして言語に興味があるすべての人々のために、多彩な機能を提供します。

- **多言語モールス信号対応**:
  - 以下の言語のテキストとモールス信号の相互変換に対応しています。
    - 日本語（和文）、英語、ドイツ語、フランス語、スペイン語、ポーランド語、トルコ語、ロシア語（キリル文字）

- **多彩な入力と変換**:
  - **テキスト ⇔ モールス信号**: テキストを入力してモールス信号に変換したり、その逆を行ったりできます。
  - **音声認識**: マイクに向かって「トン」「ツー」という音を発することで、それをリアルタイムでモールス信号とテキストに変換します。
    - **カスタマイズ可能な認識設定**: 認識する音の周波数や音量の閾値をスライダーで自由に調整できます。
    - **簡易ノイズキャンセル**: 周囲の雑音レベルを測定し、認識精度を向上させる機能がついています。
  - **音声再生**: テキストエリアにあるモールス信号を、指定した周波数のビープ音で再生できます。

- **統合された翻訳機能**:
  - **テキスト翻訳**: 入力したテキストを、サポートされている別の言語に翻訳できます。
  - **モールス信号翻訳**: モールス信号を一度テキストに変換し、それをさらに別の言語へ翻訳する、という2ステップの翻訳がボタン一つで可能です。
  - (翻訳には外部の [MyMemory API](https://mymemory.translated.net/) を利用しています)

- **国際化されたUI**:
  - アプリケーションの表示言語（UI言語）と、実際に扱うモールス信号の言語を個別に設定できます。
  - UIは日本語、英語、ドイツ語など、複数の言語に対応しています。

## 🛠️ 使用技術

- HTML5
- CSS3
- JavaScript (ES6+)
  - **Web Audio API**: モールス信号の音声再生と、マイク入力の解析・音声認識に使用しています。
  - **Fetch API**: 外部の翻訳APIとの非同期通信に使用しています。

## 📁 ファイル構成

プロジェクトは、機能ごとに以下のファイルに分割されています。

```
.
├── index.html          # アプリケーションの骨格となるUI
├── style.css           # アプリケーションのスタイルシート
├── morse-code.js       # 各言語のモールス信号変換ロジック
├── audio-handler.js    # 音声の再生・認識といったWeb Audio API関連の処理
└── ui-controller.js    # UIのイベント処理と各モジュールの連携
```

## 🚀 実行方法

このアプリケーションはマイクへのアクセス (`navigator.mediaDevices.getUserMedia`) を必要とするため、ウェブサーバー経由で実行する必要があります。ローカル環境で試す場合は、以下のいずれかの方法が簡単です。

### 1. VS Code の "Live Server" 拡張機能を使用する
1.  Visual Studio Code でプロジェクトフォルダを開きます。
2.  Live Server 拡張機能をインストールします。
3.  `index.html` ファイルを右クリックし、「Open with Live Server」を選択します。

### 2. Python のローカルサーバーを使用する
1.  ターミナル（コマンドプロンプト）を開き、プロジェクトのルートディレクトリに移動します。
2.  以下のコマンドを実行します。（Python 3 がインストールされている必要があります）
    ```bash
    python -m http.server
    ```
3.  ブラウザで `http://localhost:8000` を開きます。

アプリケーションが開いたら、マイクの使用許可を求めるポップアップが表示されるので、「許可」してください。# Morse-Code
