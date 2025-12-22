# 2025年グランドツー忘年会 得点表示アプリ

忘年会でチームごとの得点をリアルタイムに表示・管理するWebアプリケーションです。

## 機能

- **管理画面**: チームごとに点数を加算・管理
- **タブレット表示**: 各チーム専用の得点表示画面
- **リアルタイム同期**: Firebaseを使用した自動同期

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. Realtime Database を有効化
   - 「ビルド」→「Realtime Database」→「データベースを作成」
   - テストモードで開始（本番環境では適切なルールを設定してください）

### 3. Firebase 設定

1. Firebase Console で「プロジェクトの設定」→「全般」タブを開く
2. 「マイアプリ」で Web アプリを追加
3. 表示された設定情報をコピー

### 4. 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成します:

```bash
cp .env.example .env
```

`.env` ファイルに Firebase の設定情報を入力:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

## 使い方

### 初回起動時

1. トップ画面で表示する画面を選択します:
   - **管理画面**: ゲームの進行と得点管理
   - **チームA/B/Cタブレット**: 各チーム用の表示画面

### 管理画面

1. 「追加ポイント」で加算する点数を選択（10/20/30/50）
2. チームボタンをクリックして得点を加算
3. 「リセット」ボタンで全チームの得点を0にリセット

### タブレット表示

- 自分のチームの得点を大きく表示
- ライバルチームの得点も確認可能
- リアルタイムで自動更新

## 本番環境へのデプロイ

### ビルド

```bash
npm run build
```

`dist` フォルダが生成されます。

### デプロイ先の例

- **Firebase Hosting**
- **Vercel**
- **Netlify**

## 技術スタック

- React 18
- TypeScript
- Vite
- Firebase Realtime Database

## ライセンス

MIT
