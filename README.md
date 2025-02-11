# ai-hackason-gemini
https://zenn.dev/hackathons/2024-google-cloud-japan-ai-hackathon

AI Agent Hackathon with Google Cloud参加レポジトリ。
## setup
OAuthの設定を事前に実施します。[こちら](./doc/setup-oauth.md)を参考にしてください。

### 環境変数
`.env`のVITE_API_URLにサーバーのURLを設定してください。
```sh
# localの場合
VITE_API_URL=http://localhost:8080/api/chat
# cloud runの場合
#VITE_API_URL=https://your-cloudrun.asia-northeast1.run.app/api/chat
```

### インストール
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
READMEを参考に、ローカルサーバーをたてるか、Cloud Runにデプロイします。

