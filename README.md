Steam Auth
-------------

# Install
    npm install @tbhmens/steam-auth --save
# Usage
```js
const SteamAuth = require("@tbhmens/steam-auth");
const auth = new SteamAuth(<verify_callback_url>, <realm>);
```
## OpenID Login:
### handle login request from user: 
```js
auth.getAuthUrl().then(url=>res.redirect(url));
```
### Handle steam callback request: 
```js
auth.verify(req).then(steamId => {
	console.log(steamId);
});
```

