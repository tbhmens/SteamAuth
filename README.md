Steam Auth
-------------

# Install
```sh
npm install @tbhmens/steam-auth --save
```
# Usage
Initialize SteamAuth:
```js
const SteamAuth = require("@tbhmens/steam-auth");
const auth = new SteamAuth(<verify_callback_url>, <realm>);
```
Handle login request from user: 
```js
auth.getAuthUrl().then(url=>res.redirect(url));
```
Handle steam callback request: 
```js
auth.verify(req).then(steamId => {
	console.log(steamId);
});
```

