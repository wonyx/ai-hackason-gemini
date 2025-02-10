# ai-hackason-gemini
https://zenn.dev/hackathons/2024-google-cloud-japan-ai-hackathon

AI Agent Hackathon with Google Cloud参加レポジトリ。
## setup
```
npm install
```
## development
```
npm run dev
```
## build
```
npm run build
```

## install
`build` ディレクトリに成果物ができます。下記を参考にChrome拡張をインストールします。

refer: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=ja#load-unpacked

## server
`server` ディレクトリにサーバーサイドのコードがあります。

## 注意事項
- `manifest.json` client_id は自分のものに変更してください。
  - Google CloudでOAuth2.0のクライアントIDを取得してください。
    - refer: https://developer.chrome.com/docs/extensions/how-to/integrate/oauth?hl=ja
- .envに記載している`VITE_API_URL`を書き換えてください。