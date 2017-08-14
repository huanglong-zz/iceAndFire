### 配置服务器

https://www.ansible.com/how-ansible-works


### 安装 Node.js v8.1.2

nvm install v8.1.2
nvm use v8.1.2 && nvm alias default v8.1.2

### 安装 MongoDB

brew install mongodb

sudo mongod

### 安装 yarn

brew install yarn

### 安装依赖

yarn install

### 代理本地服务

#### Sunny-Ngrok 代理本地 80 端口


下载对应系统的[客户端](https://www.ngrok.cc/#down-client)

到 www.ngrok.cc 注册会员

- 选择免费服务器购买
- 隧道管理里选择开通隧道
- 选择 http 协议
- 填写前置域名，如 gotme
- 本地端口填写，如 http://127.0.0.1:3000，其他默认

创建后，会拿到隧道 ID，复制 ID，然后终端到下载后的客户端路径下，如

```
cd /Users/black/Downloads/darwin_amd64/
./sunny clientid 隧道id

```

启动多个隧道，用逗号隔开，如

```
./sunny clientid 隧道id,隧道id
```
访问 http://gotme.ngrok.cc


