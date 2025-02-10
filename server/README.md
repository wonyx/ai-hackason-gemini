# gemini-server

## setup
```
npm install
```

- 環境変数
```sh
cp .env.local .env.local
# GEMINI_API_KEYを取得して設定してください
```
## development
```
npm run dev
``` 
## build
```
npm run build
```

docker image
```
docker build -t gemini-server .
```

## deploy
```
gcloud run deploy --source .
```
refer: https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service?hl=ja

### 環境変数
CloudRunの環境変数または、シークレットに設定してください。
| key | value |
| --- | --- |
| GEMINI_API_KEY | APIキー<br> refer: https://ai.google.dev/gemini-api/docs/api-key?hl=ja |
